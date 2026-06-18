import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

import {
    buildCssRule,
    DEFAULT_BREAKPOINTS,
    DEFAULT_EXCLUDE,
    DEFAULT_INCLUDE,
    DEFAULT_VARIANTS,
    parseToken,
    resolveRule,
    shouldProcess,
    tokenize,
} from './core'
import { defaultRules } from './rules'
import type {
 JitOptions, ParsedToken, Pattern, ResolvedJitOptions, UtilityRule
} from './types'

function resolveOptions(options: JitOptions = {}): ResolvedJitOptions {
    return {
        include: options.include ?? DEFAULT_INCLUDE,
        exclude: [
            ...DEFAULT_EXCLUDE,
            ...(options.exclude ?? []),
        ],
        outFile: options.outFile ?? 'src/.generated/utils-jit.css',
        breakpoints: {
            ...DEFAULT_BREAKPOINTS,
            ...(options.breakpoints ?? {}),
        },
        rules: options.rules ?? [],
        variants: {
            ...DEFAULT_VARIANTS,
            ...(options.variants ?? {}),
        },
        banner: options.banner ?? '/* @vueland/utils-jit: generated utilities */',
        emitEmptyFile: options.emitEmptyFile ?? true,
        debug: options.debug ?? false,
    }
}

function normalizePath(value: string): string {
    return value.replace(/\\/g, '/')
}

function isSameFile(a: string, b: string): boolean {
    return normalizePath(path.resolve(a)) === normalizePath(path.resolve(b))
}

function matchesPattern(value: string, pattern: Pattern): boolean {
    const normalized = normalizePath(value)

    if (typeof pattern === 'string') {
        return normalized.includes(normalizePath(pattern))
    }

    pattern.lastIndex = 0

    return pattern.test(normalized)
}

function isExcluded(file: string, exclude: Pattern[]): boolean {
    return exclude.some((pattern) => matchesPattern(file, pattern))
}

function collectProjectFiles(
    root: string,
    options: ResolvedJitOptions,
    outFile: string
): string[] {
    const files: string[] = []

    function walk(dir: string): void {
        if (isExcluded(dir, options.exclude)) {
            return
        }

        let entries: fs.Dirent[]

        try {
            entries = fs.readdirSync(dir, { withFileTypes: true })
        } catch {
            return
        }

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            if (entry.isDirectory()) {
                walk(fullPath)
                continue
            }

            if (!entry.isFile()) {
                continue
            }

            if (isSameFile(fullPath, outFile)) {
                continue
            }

            if (shouldProcess(fullPath, options.include, options.exclude)) {
                files.push(fullPath)
            }
        }
    }

    walk(root)

    return files
}

function readFileSafe(file: string): string | null {
    try {
        return fs.readFileSync(file, 'utf8')
    } catch {
        return null
    }
}

export function utilsJIT(options?: JitOptions): Plugin {
    const resolvedOptions = resolveOptions(options)

    let root = process.cwd()
    let outFile = ''
    let devServer: ViteDevServer | null = null
    let currentCss = ''

    const allRules: UtilityRule[] = [
        ...defaultRules,
        ...resolvedOptions.rules,
    ]

    const fileToTokens = new Map<string, Set<string>>()
    const tokenRefCount = new Map<string, number>()
    const tokenParseCache = new Map<string, ParsedToken | null>()
    const tokenCssCache = new Map<string, string | null>()
    const activeCssRules = new Map<string, string>()

    function debug(message: string): void {
        if (resolvedOptions.debug) {
            console.info(`[utils-jit] ${message}`)
        }
    }

    function notifyCssChanged(): void {
        if (!devServer || !outFile) {
            return
        }

        devServer.watcher.emit('change', outFile)
    }

    function getParsedToken(token: string): ParsedToken | null {
        if (tokenParseCache.has(token)) {
            return tokenParseCache.get(token) ?? null
        }

        const parsed = parseToken(token)

        tokenParseCache.set(token, parsed)

        return parsed
    }

    function getCssRuleForToken(token: string): string | null {
        if (tokenCssCache.has(token)) {
            return tokenCssCache.get(token) ?? null
        }

        const parsed = getParsedToken(token)

        if (!parsed) {
            tokenCssCache.set(token, null)
            return null
        }

        const cssBody = resolveRule(parsed.utility, allRules)

        if (!cssBody) {
            tokenCssCache.set(token, null)
            return null
        }

        const cssRule = buildCssRule(
            parsed,
            cssBody,
            resolvedOptions.breakpoints,
            resolvedOptions.variants
        )

        tokenCssCache.set(token, cssRule)

        return cssRule
    }

    function buildFinalCss(): string {
        if (!activeCssRules.size) {
            return resolvedOptions.emitEmptyFile
                ? '/* @vueland/utils-jit: no utilities found */\n'
                : ''
        }

        const sortedRules = Array.from(activeCssRules.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, cssRule]) => cssRule)

        return [
            resolvedOptions.banner,
            ...sortedRules,
            '',
        ].join('\n')
    }

    function writeCssFile(notify = false): void {
        if (!outFile) {
            return
        }

        const nextCss = buildFinalCss()

        if (nextCss === currentCss) {
            return
        }

        currentCss = nextCss

        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        fs.writeFileSync(outFile, currentCss, 'utf8')

        if (devServer) {
            devServer.watcher.add(outFile)
        }

        if (notify) {
            notifyCssChanged()
        }

        debug(`wrote ${normalizePath(path.relative(root, outFile))}`)
    }

    function activateToken(token: string): void {
        const prevCount = tokenRefCount.get(token) ?? 0
        const nextCount = prevCount + 1

        tokenRefCount.set(token, nextCount)

        if (prevCount === 0) {
            const cssRule = getCssRuleForToken(token)

            if (cssRule) {
                activeCssRules.set(token, cssRule)
            }
        }
    }

    function deactivateToken(token: string): void {
        const prevCount = tokenRefCount.get(token) ?? 0

        if (prevCount <= 0) {
            return
        }

        const nextCount = prevCount - 1

        if (nextCount === 0) {
            tokenRefCount.delete(token)
            activeCssRules.delete(token)
            return
        }

        tokenRefCount.set(token, nextCount)
    }

    function applyFileTokens(file: string, nextTokens: Set<string>): void {
        const normalizedFile = normalizePath(file)
        const prevTokens = fileToTokens.get(normalizedFile) ?? new Set<string>()

        for (const token of prevTokens) {
            if (!nextTokens.has(token)) {
                deactivateToken(token)
            }
        }

        for (const token of nextTokens) {
            if (!prevTokens.has(token)) {
                activateToken(token)
            }
        }

        if (nextTokens.size > 0) {
            fileToTokens.set(normalizedFile, nextTokens)
        } else {
            fileToTokens.delete(normalizedFile)
        }
    }

    function rebuildAll(notify = false): void {
        fileToTokens.clear()
        tokenRefCount.clear()
        activeCssRules.clear()

        const files = collectProjectFiles(root, resolvedOptions, outFile)

        for (const file of files) {
            const code = readFileSafe(file)

            if (code === null) {
                continue
            }

            const tokens = tokenize(code)

            if (tokens.size > 0) {
                fileToTokens.set(normalizePath(file), tokens)

                for (const token of tokens) {
                    const count = tokenRefCount.get(token) ?? 0

                    tokenRefCount.set(token, count + 1)
                }
            }
        }

        for (const [token, count] of tokenRefCount) {
            if (count <= 0) {
                continue
            }

            const cssRule = getCssRuleForToken(token)

            if (cssRule) {
                activeCssRules.set(token, cssRule)
            }
        }

        writeCssFile(notify)

        debug(`scanned ${files.length} files, found ${activeCssRules.size} utilities`)
    }

    function rebuildOne(file: string, code: string, notify = false): void {
        if (isSameFile(file, outFile)) {
            return
        }

        if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
            return
        }

        const nextTokens = tokenize(code)

        applyFileTokens(file, nextTokens)
        writeCssFile(notify)
    }

    function removeOne(file: string, notify = false): void {
        if (isSameFile(file, outFile)) {
            return
        }

        const normalizedFile = normalizePath(file)
        const prevTokens = fileToTokens.get(normalizedFile)

        if (!prevTokens) {
            return
        }

        for (const token of prevTokens) {
            deactivateToken(token)
        }

        fileToTokens.delete(normalizedFile)
        writeCssFile(notify)
    }

    return {
        name: 'utils-jit',
        enforce: 'pre',

        configResolved(config: any) {
            root = config.root
            outFile = path.resolve(root, resolvedOptions.outFile)
            rebuildAll(false)
        },

        configureServer(server: ViteDevServer) {
            devServer = server

            if (outFile) {
                server.watcher.add(outFile)
            }
        },

        buildStart() {
            rebuildAll(false)
        },

        transform(code: string, id: string) {
            const file = id.split('?')[0]

            if (!file || isSameFile(file, outFile)) {
                return null
            }

            rebuildOne(file, code, false)

            return null
        },

        async handleHotUpdate(ctx) {
            const { file } = ctx

            if (isSameFile(file, outFile)) {
                return
            }

            if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
                return
            }

            const code = await ctx.read()

            rebuildOne(file, code, true)
        },

        watchChange(id: string, change) {
            const file = id.split('?')[0]

            if (!file || isSameFile(file, outFile)) {
                return
            }

            if (change.event === 'delete') {
                removeOne(file, true)
                return
            }

            if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
                return
            }

            const code = readFileSafe(file)

            if (code !== null) {
                rebuildOne(file, code, true)
            }
        },
    }
}
