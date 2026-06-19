import type { ThemeDefinition } from '../types'

const SEMANTIC_VAR_MAP: Record<string, string> = {
    primary: '--c-app-primary-color',
    onPrimary: '--c-app-on-primary-color',
    secondary: '--c-app-secondary-color',
    success: '--c-app-success-color',
    error: '--c-app-error-color',
    warning: '--c-app-warning-color',
    info: '--c-app-info-color',
    accent: '--c-app-accent-color',

    background: '--c-app-background-color',
    surface: '--c-app-surface-color',
    surfaceVariant: '--c-app-surface-variant-color',
    onSurface: '--c-app-on-surface-color',

    text: '--c-app-text-color',
    textSecondary: '--c-app-text-secondary-color',
    placeholder: '--c-app-placeholder-color',

    disabled: '--c-app-disabled-color',
    disabledBg: '--c-app-disabled-bg-color',
    disabledOpacity: '--c-app-disabled-opacity',

    readonly: '--c-app-readonly-color',
    readonlyBg: '--c-app-readonly-bg-color',

    focus: '--c-app-focus-color',

    errorBg: '--c-app-error-bg-color',

    hover: '--c-app-hover-color',
    overlay: '--c-app-overlay-color',
    shadow: '--c-app-shadow-color',

    border: '--c-app-border-color',
    radius: '--c-app-border-radius',
}

function toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

export function buildVars(theme: ThemeDefinition): [string, string][] {
    return Object.entries(theme)
        .filter((entry): entry is [string, string] => entry[1] !== undefined)
        .map(([key, value]) => {
            const cssVar = SEMANTIC_VAR_MAP[key] ?? `--c-app-${toKebabCase(key)}`
            return [cssVar, value]
        })
}

export function renderThemeStyle(theme: ThemeDefinition): string {
    const vars = buildVars(theme).map(([prop, val]) => `${prop}:${val}`).join(';')
    return `:root{${vars}}`
}
