type ThemeTokensInput = Record<string, string> | string[]

type PropertyMap = Record<string, string>

interface CompileThemeCssOptions {
    includeVars?: boolean
    includeUtils?: boolean
    minify?: boolean
    propertyMap?: PropertyMap
    colorKinds?: string[]
    generateStates?: {
        hover?: boolean
        active?: boolean
    }
}

interface TokenEntry {
    token: string
    value: string
}

interface TokenMeta {
    token: string
    cleanName: string
    parts: string[]
    kind: string
    property: string
}

interface CompileContext {
    entries: TokenEntry[]
    options: Required<CompileThemeCssOptions>
    propertyMap: PropertyMap
}

interface CssProcessor {
    name: string
    enabled: (ctx: CompileContext) => boolean
    compile: (ctx: CompileContext) => string
}

interface GradientPair {
    start?: string
    end?: string
}

const DEFAULT_PROPERTY_MAP: PropertyMap = {
    bg: 'background-color',
    clr: 'color',
    sep: 'border-color',
}

const DEFAULT_OPTIONS: Required<CompileThemeCssOptions> = {
    includeVars: false,
    includeUtils: true,
    minify: true,
    propertyMap: DEFAULT_PROPERTY_MAP,
    colorKinds: ['bg', 'clr', 'sep'],
    generateStates: {
        hover: true,
        active: true,
    },
}

function parseThemeLines(lines: string[]): Record<string, string> {
    const tokens: Record<string, string> = {}

    for (const line of lines) {
        const raw = line.trim()
        if (!raw) continue

        const normalized = raw.endsWith(';') ? raw.slice(0, -1) : raw

        const separatorIndex = normalized.indexOf(':')
        if (separatorIndex === -1) continue

        const key = normalized.slice(0, separatorIndex).trim()
        const value = normalized.slice(separatorIndex + 1).trim()

        if (!key || !value) continue

        tokens[key] = value
    }

    return tokens
}

function normalizeTokens(input: ThemeTokensInput): Record<string, string> {
    if (Array.isArray(input)) {
        return parseThemeLines(input)
    }

    if (input && typeof input === 'object') {
        return input
    }

    return {}
}

function normalizeValue(value: string): string {
    return value.trim().replace(/;+$/, '')
}

function isCssColorLike(value: string): boolean {
    return (
        value.startsWith('#') ||
        value.startsWith('rgb(') ||
        value.startsWith('rgba(') ||
        value.startsWith('hsl(') ||
        value.startsWith('hsla(') ||
        value.startsWith('var(') ||
        value === 'transparent' ||
        value === 'currentColor' ||
        value === 'inherit'
    )
}

function wrapColor(value: string): string {
    const normalized = normalizeValue(value)

    if (isCssColorLike(normalized)) {
        return normalized
    }

    return `hsl(${normalized})`
}

function resolveCssValue(rawValue: string, kind: string, colorKinds: string[]): string {
    const normalized = normalizeValue(rawValue)

    if (colorKinds.includes(kind)) {
        return wrapColor(normalized)
    }

    return normalized
}

function escapeClassName(value: string): string {
    return value.replace(/([^a-zA-Z0-9_-])/g, '\\$1')
}

function getMergedPropertyMap(propertyMap?: PropertyMap): PropertyMap {
    return {
        ...DEFAULT_PROPERTY_MAP,
        ...(propertyMap ?? {}),
    }
}

function getEntries(input: ThemeTokensInput): TokenEntry[] {
    return Object.entries(normalizeTokens(input))
        .filter(([token, value]) => !!token && value != null && String(value).trim() !== '')
        .map(([token, value]) => ({
            token,
            value: String(value),
        }))
        .sort((a, b) => a.token.localeCompare(b.token))
}

function parseTokenMeta(token: string, propertyMap: PropertyMap): TokenMeta | null {
    const cleanName = token.startsWith('--') ? token.slice(2) : token
    const parts = cleanName.split('-').filter(Boolean)

    const kindIndex = parts.findIndex((part) => part in propertyMap)
    if (kindIndex === -1) return null

    const kind = parts[kindIndex]

    return {
        token,
        cleanName,
        parts,
        kind,
        property: propertyMap[kind],
    }
}

function formatRule(selector: string, declarations: string[], minify: boolean): string {
    if (minify) {
        return `${selector}{${declarations.join('')}}`
    }

    const body = declarations.map((d) => `  ${d}`).join('\n')
    return `${selector} {\n${body}\n}`
}

function createDecl(property: string, value: string, important = true): string {
    return `${property}: ${value}${important ? ' !important' : ''};`
}

function createTransitionDecl(property: string, duration = '.1s', easing = 'linear'): string {
    return `transition: ${property} ${duration} ${easing};`
}

function isGradientToken(meta: TokenMeta): boolean {
    return meta.cleanName.includes('gradient')
}

function isGradientStart(meta: TokenMeta): boolean {
    return meta.cleanName.endsWith('-start')
}

function isGradientEnd(meta: TokenMeta): boolean {
    return meta.cleanName.endsWith('-end')
}

function isHoverGradient(meta: TokenMeta): boolean {
    return meta.cleanName.includes('-hover-')
}

function normalizeGradientClassName(meta: TokenMeta): string {
    return meta.cleanName
        .replace(/-hover-/g, '-')
        .replace(/-start$/, '')
        .replace(/-end$/, '')
}

function buildContext(
    input: ThemeTokensInput,
    options: CompileThemeCssOptions = {},
): CompileContext {
    const mergedOptions: Required<CompileThemeCssOptions> = {
        ...DEFAULT_OPTIONS,
        ...options,
        propertyMap: getMergedPropertyMap(options.propertyMap),
        generateStates: {
            ...DEFAULT_OPTIONS.generateStates,
            ...(options.generateStates ?? {}),
        },
        colorKinds: options.colorKinds ?? DEFAULT_OPTIONS.colorKinds,
    }

    return {
        entries: getEntries(input),
        options: mergedOptions,
        propertyMap: mergedOptions.propertyMap,
    }
}

const varsProcessor: CssProcessor = {
    name: 'vars',
    enabled: (ctx) => ctx.options.includeVars,
    compile: (ctx) => {
        if (!ctx.entries.length) return ''

        const body = ctx.entries
            .map(({ token, value }) => {
                const normalized = normalizeValue(value)
                return ctx.options.minify ? `${token}:${normalized};` : `  ${token}: ${normalized};`
            })
            .join(ctx.options.minify ? '' : '\n')

        return ctx.options.minify ? `:root{${body}}` : `:root {\n${body}\n}`
    },
}

const plainColorUtilsProcessor: CssProcessor = {
    name: 'plain-utils',
    enabled: (ctx) => ctx.options.includeUtils,
    compile: (ctx) => {
        const chunks: string[] = []

        for (const entry of ctx.entries) {
            const meta = parseTokenMeta(entry.token, ctx.propertyMap)
            if (!meta) continue
            if (isGradientToken(meta)) continue

            const className = escapeClassName(meta.cleanName)
            const value = resolveCssValue(entry.value, meta.kind, ctx.options.colorKinds)

            chunks.push(
                formatRule(`.${className}`, [createDecl(meta.property, value)], ctx.options.minify),
            )

            if (ctx.options.generateStates.hover && (meta.kind === 'bg' || meta.kind === 'clr')) {
                chunks.push(
                    formatRule(
                        `.hover\\:${className}:hover`,
                        [createDecl(meta.property, value), createTransitionDecl(meta.property)],
                        ctx.options.minify,
                    ),
                )
            }

            if (ctx.options.generateStates.active && (meta.kind === 'bg' || meta.kind === 'clr')) {
                chunks.push(
                    formatRule(
                        `.active\\:${className}:active`,
                        [createDecl(meta.property, value), createTransitionDecl(meta.property)],
                        ctx.options.minify,
                    ),
                )
            }
        }

        return ctx.options.minify ? chunks.join('') : chunks.join('\n\n')
    },
}

const gradientUtilsProcessor: CssProcessor = {
    name: 'gradients',
    enabled: (ctx) => ctx.options.includeUtils,
    compile: (ctx) => {
        const baseGradients = new Map<string, GradientPair>()
        const hoverGradients = new Map<string, GradientPair>()

        for (const entry of ctx.entries) {
            const meta = parseTokenMeta(entry.token, ctx.propertyMap)
            if (!meta) continue
            if (!isGradientToken(meta)) continue
            if (!isGradientStart(meta) && !isGradientEnd(meta)) continue

            const className = normalizeGradientClassName(meta)
            const value = resolveCssValue(entry.value, meta.kind, ctx.options.colorKinds)
            const targetMap = isHoverGradient(meta) ? hoverGradients : baseGradients
            const pair = targetMap.get(className) ?? {}

            if (isGradientStart(meta)) pair.start = value
            if (isGradientEnd(meta)) pair.end = value

            targetMap.set(className, pair)
        }

        const chunks: string[] = []

        for (const [className, pair] of baseGradients) {
            if (!pair.start || !pair.end) continue

            const escaped = escapeClassName(className)

            chunks.push(
                formatRule(
                    `.${escaped}`,
                    [createDecl('background', `linear-gradient(${pair.start}, ${pair.end})`)],
                    ctx.options.minify,
                ),
            )

            if (ctx.options.generateStates.hover) {
                chunks.push(
                    formatRule(
                        `.hover\\:${escaped}:hover`,
                        [
                            createDecl('background', `linear-gradient(${pair.start}, ${pair.end})`),
                            createTransitionDecl('background'),
                        ],
                        ctx.options.minify,
                    ),
                )
            }
        }

        for (const [className, pair] of hoverGradients) {
            if (!pair.start || !pair.end) continue
            if (!ctx.options.generateStates.hover) continue

            const escaped = escapeClassName(className)

            chunks.push(
                formatRule(
                    `.hover\\:${escaped}:hover`,
                    [
                        createDecl('background', `linear-gradient(${pair.start}, ${pair.end})`),
                        createTransitionDecl('background'),
                    ],
                    ctx.options.minify,
                ),
            )
        }

        return ctx.options.minify ? chunks.join('') : chunks.join('\n\n')
    },
}

const DEFAULT_PROCESSORS: CssProcessor[] = [
    varsProcessor,
    plainColorUtilsProcessor,
    gradientUtilsProcessor,
]

export function compileCssClasses(
    input: ThemeTokensInput,
    options: CompileThemeCssOptions = {},
): string {
    const ctx = buildContext(input, options)

    const chunks = DEFAULT_PROCESSORS.filter((processor) => processor.enabled(ctx))
        .map((processor) => processor.compile(ctx))
        .filter(Boolean)

    return ctx.options.minify ? chunks.join('') : chunks.join('\n\n')
}
