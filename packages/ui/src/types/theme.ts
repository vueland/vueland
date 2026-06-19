export type ThemeDefinition = {
    // ---- Brand ----
    primary?: string
    onPrimary?: string
    secondary?: string
    success?: string
    error?: string
    warning?: string
    info?: string
    accent?: string

    // ---- Surface & background ----
    background?: string
    surface?: string
    surfaceVariant?: string
    onSurface?: string

    // ---- Text ----
    text?: string
    textSecondary?: string
    placeholder?: string

    // ---- States: disabled ----
    disabled?: string
    disabledBg?: string
    disabledOpacity?: string

    // ---- States: readonly ----
    readonly?: string
    readonlyBg?: string

    // ---- States: focus ----
    focus?: string

    // ---- States: error ----
    errorBg?: string

    // ---- Interactive ----
    hover?: string
    overlay?: string
    shadow?: string

    // ---- Misc ----
    border?: string
    radius?: string

    // ---- User-defined ----
    [key: string]: string | undefined
}

export type ThemesOptions = Record<string, ThemeDefinition>
