import type {
    CssBody,
    DeclarationMap,
    DeclarationValue,
    ParsedToken,
    Pattern,
    RuleMatch,
    RuleOptions,
    UtilityRule,
    VariantDefinition,
    VariantMap,
} from './types'

export const DEFAULT_INCLUDE: Pattern[] = [/\.(vue|js|ts|jsx|tsx|html|svelte|astro)$/]

export const DEFAULT_EXCLUDE: Pattern[] = [
    /(^|[/\\])node_modules([/\\]|$)/,
    /(^|[/\\])\.git([/\\]|$)/,
    /(^|[/\\])dist([/\\]|$)/,
    /(^|[/\\])build([/\\]|$)/,
    /(^|[/\\])coverage([/\\]|$)/,
    /(^|[/\\])\.output([/\\]|$)/,
    /(^|[/\\])\.nuxt([/\\]|$)/,
    /(^|[/\\])\.turbo([/\\]|$)/,
    /(^|[/\\])\.generated([/\\]|$)/,
    /(^|[/\\])storybook-static([/\\]|$)/,
    /(^|[/\\])playwright-report([/\\]|$)/,
    /(^|[/\\])vite\.config\.[cm]?[jt]s$/,
]

// Совпадают с $grid-breakpoints (maps/grids.scss) и use-display, чтобы без явного
// конфига arbitrary-утилиты были на тех же порогах, что статические утилиты и JS.
export const DEFAULT_BREAKPOINTS: Record<string, number> = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
}

export const DEFAULT_VARIANTS: VariantMap = {
    hover: {
        kind: 'pseudo',
        value: 'hover',
    },
    focus: {
        kind: 'pseudo',
        value: 'focus',
    },
    'focus-visible': {
        kind: 'pseudo',
        value: 'focus-visible',
    },
    'focus-within': {
        kind: 'pseudo',
        value: 'focus-within',
    },
    active: {
        kind: 'pseudo',
        value: 'active',
    },
    disabled: {
        kind: 'pseudo',
        value: 'disabled',
    },
    checked: {
        kind: 'pseudo',
        value: 'checked',
    },
    visited: {
        kind: 'pseudo',
        value: 'visited',
    },
    first: {
        kind: 'pseudo',
        value: 'first-child',
    },
    last: {
        kind: 'pseudo',
        value: 'last-child',
    },
    odd: {
        kind: 'pseudo',
        value: 'nth-child(odd)',
    },
    even: {
        kind: 'pseudo',
        value: 'nth-child(even)',
    },
}

const MIN_TOKEN_LENGTH = 5
const MAX_TOKEN_LENGTH = 180
const MAX_VALUE_LENGTH = 160
const STATIC_TOKEN_MIN_LENGTH = 2

export function normalizePath(value: string): string {
    return value.replace(/\\/g, '/')
}

export function matchesPattern(value: string, pattern: Pattern): boolean {
    const normalized = normalizePath(value)

    if (typeof pattern === 'string') {
        return normalized.includes(normalizePath(pattern))
    }

    pattern.lastIndex = 0

    return pattern.test(normalized)
}

export function shouldProcess(
    id: string,
    include: Pattern[] = DEFAULT_INCLUDE,
    exclude: Pattern[] = [],
): boolean {
    const cleanId = id.split('?')[0]

    if (!cleanId) {
        return false
    }

    if (exclude.some((pattern) => matchesPattern(cleanId, pattern))) {
        return false
    }

    return include.some((pattern) => matchesPattern(cleanId, pattern))
}

export function escapeCssSelector(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
}

export function normalizeValue(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

export function isSafeCssValue(value: string): boolean {
    const normalized = normalizeValue(value)

    if (!normalized) {
        return false
    }

    if (normalized.length > MAX_VALUE_LENGTH) {
        return false
    }

    if (/[;{}<>]/.test(normalized)) {
        return false
    }

    if (/\/\*/.test(normalized) || /\*\//.test(normalized)) {
        return false
    }

    if (!/[a-zA-Z0-9]/.test(normalized)) {
        return false
    }

    return /^[-a-zA-Z0-9.%_(),+/*\s[\]#]+$/.test(normalized)
}

function stripEdgeGarbage(token: string): string {
    return token.replace(/^['"`{(]+|['"`})>,;]+$/g, '')
}

function looksLikeArbitraryUtility(token: string): boolean {
    if (!token) {
        return false
    }

    if (token.length < MIN_TOKEN_LENGTH || token.length > MAX_TOKEN_LENGTH) {
        return false
    }

    if (!token.includes('-[') || !token.endsWith(']')) {
        return false
    }

    if (token.startsWith('<') || token.startsWith('>')) {
        return false
    }

    const arbitraryIndex = token.indexOf('-[')

    return arbitraryIndex > 0 && token.slice(arbitraryIndex + 2, -1).trim().length > 0
}

function looksLikeStaticUtility(token: string): boolean {
    if (!token) {
        return false
    }

    if (token.length < STATIC_TOKEN_MIN_LENGTH || token.length > MAX_TOKEN_LENGTH) {
        return false
    }

    if (token.includes('[') || token.includes(']')) {
        return false
    }

    if (token.startsWith('<') || token.startsWith('>') || token.endsWith('-') || token.endsWith(':')) {
        return false
    }

    return /^!?-?(?:[a-zA-Z0-9_-]+:)*[a-zA-Z_][a-zA-Z0-9_/-]*$/.test(token)
}

function looksLikeUtilityToken(token: string): boolean {
    return looksLikeArbitraryUtility(token) || looksLikeStaticUtility(token)
}

export function stripComments(code: string): string {
    return code
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/(^|[^:])\/\/.*$/gm, '$1 ')
}

export function extractClassCandidates(code: string): string[] {
    const candidates: string[] = []

    const patterns = [
        /(?:^|[\s<]):class\s*=\s*"([^"]*)"/g,
        /(?:^|[\s<]):class\s*=\s*'([^']*)'/g,
        /(?:^|[\s<])class\s*=\s*"([^"]*)"/g,
        /(?:^|[\s<])class\s*=\s*'([^']*)'/g,
    ]

    for (const pattern of patterns) {
        for (const match of code.matchAll(pattern)) {
            const value = match[1]

            if (value) {
                candidates.push(value)
            }
        }
    }

    return candidates
}

function extractStringCandidates(code: string): string[] {
    const candidates: string[] = []
    const pattern = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g

    for (const match of code.matchAll(pattern)) {
        const value = match[2]

        if (value) {
            candidates.push(value)
        }
    }

    return candidates
}

// Сырое CSS-значение цвета (не палитровый токен) — то, что компоненты
// @vueland/ui оборачивают в arbitrary-класс: bg-[#fa5a5a] / color-[#fa5a5a]
const RAW_COLOR_VALUE_RE =
    /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(.+\)|var\(.+\))$/

function extractColorAttrCandidates(code: string, attributes: string[]): string[] {
    const candidates: string[] = []

    for (const attribute of attributes) {
        // color="#fa5a5a" и :color="'#fa5a5a'" — динамические выражения
        // (:color="someVar") статическому скану недоступны, как и в class
        const pattern = new RegExp(
            `(?:^|[\\s<]):?${attribute}\\s*=\\s*(["'])(.*?)\\1`,
            'g',
        )

        for (const match of code.matchAll(pattern)) {
            // Пробелы внутри rgb(...) убираются так же, как в рантайм-хелпере
            // @vueland/ui, иначе кандидат не совпадёт с классом из DOM
            const value = match[2]
                .trim()
                .replace(/^['"`]|['"`]$/g, '')
                .replace(/\s+/g, '')

            if (RAW_COLOR_VALUE_RE.test(value)) {
                candidates.push(`bg-[${value}]`, `color-[${value}]`)
            }
        }
    }

    return candidates
}

function tokenizeChunk(code: string): Set<string> {
    const result = new Set<string>()

    const arbitraryPattern = /(?:[a-zA-Z0-9_-]+:)*[a-zA-Z][a-zA-Z0-9_-]*-\[[^\]\s]+(?:\s+[^\]\s]+)*\]/g

    for (const match of code.matchAll(arbitraryPattern)) {
        const raw = match[0]
        const token = stripEdgeGarbage(raw)

        if (looksLikeArbitraryUtility(token)) {
            result.add(token)
        }
    }

    const staticSource = code.replace(arbitraryPattern, ' ')
    const staticPattern = /!?-?(?:[a-zA-Z0-9_-]+:)*[a-zA-Z_][a-zA-Z0-9_/-]*/g

    for (const match of staticSource.matchAll(staticPattern)) {
        const raw = match[0]
        const token = stripEdgeGarbage(raw)

        if (looksLikeStaticUtility(token)) {
            result.add(token)
        }
    }

    return result
}

export function tokenize(code: string, colorAttributes: string[] = []): Set<string> {
    const cleanCode = stripComments(code)
    const classCandidates = extractClassCandidates(cleanCode)
    const result = new Set<string>()

    for (const candidate of extractColorAttrCandidates(cleanCode, colorAttributes)) {
        result.add(candidate)
    }

    if (classCandidates.length > 0) {
        for (const candidate of classCandidates) {
            for (const token of tokenizeChunk(candidate)) {
                result.add(token)
            }
        }
    }

    const stringCandidates = extractStringCandidates(cleanCode)

    for (const candidate of stringCandidates) {
        for (const token of tokenizeChunk(candidate)) {
            result.add(token)
        }
    }

    for (const token of tokenizeChunk(cleanCode)) {
        if (looksLikeArbitraryUtility(token)) {
            result.add(token)
        }
    }

    return result
}

export function parseToken(token: string): ParsedToken | null {
    const parts = token.split(':').filter(Boolean)

    if (!parts.length) {
        return null
    }

    const utility = parts[parts.length - 1]
    const variants = parts.slice(0, -1)

    if (!looksLikeUtilityToken(token) || !looksLikeUtilityToken(utility)) {
        return null
    }

    return {
        raw: token,
        variants,
        utility,
    }
}

export function camelToKebab(value: string): string {
    if (value.startsWith('--')) {
        return value
    }

    return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

function withImportant(value: DeclarationValue, important: boolean): string {
    const normalized = String(value)

    if (!important) {
        return normalized
    }

    if (/\s!important\s*$/i.test(normalized)) {
        return normalized
    }

    return `${normalized} !important`
}

function objectToDeclarations(declaration: DeclarationMap, important: boolean): string[] {
    return Object.entries(declaration).map(([prop, value]) => {
        return `${camelToKebab(prop)}: ${withImportant(value, important)};`
    })
}

function normalizeDeclarations(
    declaration: DeclarationMap | string[],
    important: boolean,
): string[] {
    if (Array.isArray(declaration)) {
        return declaration
    }

    return objectToDeclarations(declaration, important)
}

export function defineRule(options: RuleOptions): UtilityRule {
    const important = options.important ?? true

    return {
        name: options.name,

        match(utility: string): RuleMatch | null {
            options.matcher.lastIndex = 0

            const match = utility.match(options.matcher)

            if (!match) {
                return null
            }

            const rawValue = match[1] ?? utility

            if (!rawValue) {
                return null
            }

            const value = normalizeValue(rawValue)

            if (!value || !isSafeCssValue(value)) {
                return null
            }

            if (options.validate && !options.validate(value, match)) {
                return null
            }

            return { declarations: normalizeDeclarations(options.declaration(value, match), important) }
        },
    }
}

export const createArbitraryRule = defineRule

export function resolveRule(utility: string, rules: UtilityRule[]): CssBody | null {
    for (const rule of rules) {
        const match = rule.match(utility)

        if (match) {
            return { declarations: match.declarations }
        }
    }

    return null
}

function formatMathFunctions(value: string): string {
    return value.replace(
        /\b(calc|min|max|clamp)\(([^()]+)\)/g,
        (_match, fn: string, expr: string) => {
            const formatted = expr
                .replace(/\s*([+\-*/])\s*/g, ' $1 ')
                .replace(/\s+/g, ' ')
                .trim()

            return `${fn}(${formatted})`
        },
    )
}

function applySelectorVariant(selector: string, variant: VariantDefinition): string | null {
    if (variant.kind === 'pseudo') {
        return `${selector}:${variant.value}`
    }

    if (variant.kind === 'selector') {
        const template = String(variant.value)

        return template.includes('&') ? template.replace(/&/g, selector) : `${template} ${selector}`
    }

    if (variant.kind === 'attribute') {
        return `${selector}${variant.value}`
    }

    return null
}

export function buildCssRule(
    parsed: ParsedToken,
    cssBody: CssBody,
    breakpoints: Record<string, number> = DEFAULT_BREAKPOINTS,
    variants: VariantMap = DEFAULT_VARIANTS,
): string | null {
    let selector = `.${escapeCssSelector(parsed.raw)}`
    const mediaVariants: string[] = []

    for (const variantName of parsed.variants) {
        if (variantName in breakpoints) {
            mediaVariants.push(variantName)
            continue
        }

        const variant = variants[variantName]

        if (!variant) {
            return null
        }

        if (variant.kind === 'media') {
            mediaVariants.push(variantName)
            continue
        }

        const nextSelector = applySelectorVariant(selector, variant)

        if (!nextSelector) {
            return null
        }

        selector = nextSelector
    }

    const body = cssBody.declarations
        .map((decl) => {
            return decl.replace(/:\s*([^;]+)(;?)$/, (_match, value: string, semicolon: string) => {
                return `: ${formatMathFunctions(value.trim())}${semicolon}`
            })
        })
        .join('')

    let result = `${selector}{${body}}`

    for (const variantName of mediaVariants.reverse()) {
        const customVariant = variants[variantName]
        const minWidth =
            typeof customVariant?.value === 'number'
                ? customVariant.value
                : breakpoints[variantName]

        if (typeof minWidth !== 'number') {
            return null
        }

        // Брейкпоинт 0 (xs) — базовый, без медиа-обёртки (как `@if != 0` в SCSS).
        if (minWidth === 0) {
            continue
        }

        result = `@media (min-width: ${minWidth}px) { ${result} }`
    }

    return result
}
