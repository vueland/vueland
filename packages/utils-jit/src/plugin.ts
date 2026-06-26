import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

import {
    DEFAULT_BREAKPOINTS,
    DEFAULT_EXCLUDE,
    DEFAULT_INCLUDE,
    DEFAULT_VARIANTS,
    shouldProcess,
    tokenize,
} from './core'
import {
    collectProjectFiles,
    isSameFile,
    readFileSafe,
} from './project-scan'
import { defaultRules } from './rules'
import { createScssBreakpointInjector } from './scss-injection'
import { TokenRegistry } from './token-registry'
import type {
    JitOptions,
    ResolvedJitOptions,
    UtilityRule,
} from './types'

function resolveOptions(options: JitOptions = {}): ResolvedJitOptions {
    return {
        include: options.include ?? DEFAULT_INCLUDE,
        exclude: [...DEFAULT_EXCLUDE, ...(options.exclude ?? [])],
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


export function utilsJIT(options?: JitOptions): Plugin {
    const resolvedOptions = resolveOptions(options)
    const allRules: UtilityRule[] = [...defaultRules, ...resolvedOptions.rules]
    const registry = new TokenRegistry(resolvedOptions, allRules)

    // Гейт по СЫРОМУ флагу: брейкпоинты инжектим в SCSS/JS только если их явно
    // задали. А значение берём из resolvedOptions (мерж с дефолтами) — Sass
    // `@use with (...)` полностью замещает карту, поэтому partial сломал бы
    // стандартные брейкпоинты. SCSS, JS и JIT должны видеть одну и ту же карту.
    const shouldInjectBreakpoints = options?.breakpoints !== undefined

    let root = process.cwd()
    let outFile = ''
    let devServer: ViteDevServer | null = null
    let currentCss = ''

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

    // Пишет файл только если registry.dirty (иначе ранний выход — без
    // сортировки/конкатенации) и только если итоговый CSS реально изменился.
    function writeCssFile(notify = false): void {
        if (!outFile || !registry.consumeDirty()) {
            return
        }

        const nextCss = registry.buildCss()

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

        debug(`wrote ${path.relative(root, outFile).replace(/\\/g, '/')}`)
    }

    function rebuildAll(notify = false): void {
        const filePaths = collectProjectFiles(
            root,
            resolvedOptions.include,
            resolvedOptions.exclude,
            outFile,
        )

        const files = filePaths.flatMap((filePath) => {
            const code = readFileSafe(filePath)

            return code !== null ? [{ path: filePath, tokens: tokenize(code) }] : []
        })

        registry.rebuildAll(files)
        writeCssFile(notify)

        debug(`scanned ${filePaths.length} files, found ${registry.activeCount} utilities`)
    }

    function rebuildOne(file: string, code: string, notify = false): void {
        if (isSameFile(file, outFile)) {
            return
        }

        if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
            return
        }

        registry.syncFile(file, tokenize(code))
        writeCssFile(notify)
    }

    function removeOne(file: string, notify = false): void {
        if (isSameFile(file, outFile)) {
            return
        }

        registry.removeFile(file)
        writeCssFile(notify)
    }

    return {
        name: 'utils-jit',
        enforce: 'pre',

        config() {
            // Брейкпоинты не заданы → ничего не инжектим и не определяем:
            // SCSS возьмёт дефолты из maps/grids, JS — дефолты use-display.
            if (!shouldInjectBreakpoints) return

            return {
                define: {
                    __VUELAND_BREAKPOINTS__: JSON.stringify(resolvedOptions.breakpoints),
                },
                css: {
                    preprocessorOptions: {
                        scss: {
                            additionalData: createScssBreakpointInjector(resolvedOptions.breakpoints),
                        },
                    },
                },
            }
        },

        configResolved(config: any) {
            root = config.root
            outFile = path.resolve(root, resolvedOptions.outFile)

            // Полный обход проекта — ровно один раз. configResolved срабатывает
            // до transform/импортов и в dev, и в build, поэтому файл готов
            // заранее; инкрементальные изменения дальше идут через transform/
            // handleHotUpdate/watchChange.
            rebuildAll(false)
        },

        configureServer(server: ViteDevServer) {
            devServer = server

            if (outFile) {
                server.watcher.add(outFile)
            }
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
