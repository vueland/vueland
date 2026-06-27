export type SystemThemeTokens = {
    // Color roles
    scheme?: string
    primary?: string
    onPrimary?: string
    primaryContainer?: string
    onPrimaryContainer?: string
    secondary?: string
    onSecondary?: string
    secondaryContainer?: string
    onSecondaryContainer?: string
    tertiary?: string
    onTertiary?: string
    tertiaryContainer?: string
    onTertiaryContainer?: string
    success?: string
    onSuccess?: string
    successContainer?: string
    onSuccessContainer?: string
    error?: string
    onError?: string
    errorContainer?: string
    onErrorContainer?: string
    warning?: string
    onWarning?: string
    warningContainer?: string
    onWarningContainer?: string
    info?: string
    onInfo?: string
    infoContainer?: string
    onInfoContainer?: string
    background?: string
    onBackground?: string
    surface?: string
    surfaceDim?: string
    surfaceBright?: string
    surfaceContainerLowest?: string
    surfaceContainerLow?: string
    surfaceContainer?: string
    surfaceContainerHigh?: string
    surfaceContainerHighest?: string
    surfaceVariant?: string
    onSurface?: string
    onSurfaceVariant?: string
    inverseSurface?: string
    inverseOnSurface?: string
    outline?: string
    outlineVariant?: string
    placeholder?: string
    disabled?: string
    disabledContainer?: string
    readonly?: string
    readonlyContainer?: string
    focusRing?: string
    scrim?: string
    shadow?: string

    // State layers
    stateHoverColor?: string
    stateFocusColor?: string
    statePressedColor?: string
    stateSelectedColor?: string
    stateHoverOpacity?: string
    stateFocusOpacity?: string
    statePressedOpacity?: string
    stateDraggedOpacity?: string
    stateDisabledOpacity?: string
    stateDisabledContainerOpacity?: string

    // Typography
    typographyFontFamilyBase?: string
    typographyFontFamilyMono?: string
    typographyBodySize?: string
    typographyBodyLineHeight?: string
    typographyLabelSize?: string
    typographyLabelLineHeight?: string
    typographyLabelWeight?: string
    typographyTitleSize?: string
    typographyTitleLineHeight?: string
    typographyTitleWeight?: string

    // Spacing and density
    space0?: string
    space1?: string
    space2?: string
    space3?: string
    space4?: string
    space5?: string
    space6?: string
    space8?: string
    space10?: string
    densityScale?: string
    controlHeightSm?: string
    controlHeightMd?: string
    controlHeightLg?: string
    controlPaddingInline?: string
    controlIconSize?: string

    // Shape
    shapeNone?: string
    shapeXs?: string
    shapeSm?: string
    shapeMd?: string
    shapeLg?: string
    shapeXl?: string
    shapePill?: string

    // Border
    borderWidthThin?: string
    borderWidthMedium?: string
    borderWidthThick?: string

    // Elevation
    elevation0?: string
    elevation1?: string
    elevation2?: string
    elevation3?: string
    elevation4?: string
    elevation5?: string

    // Motion
    motionDurationInstant?: string
    motionDurationFast?: string
    motionDurationMedium?: string
    motionDurationSlow?: string
    motionEasingLinear?: string
    motionEasingStandard?: string
    motionEasingEmphasized?: string

    // Stacking
    zIndexBase?: string
    zIndexSticky?: string
    zIndexDropdown?: string
    zIndexOverlay?: string
    zIndexModal?: string
    zIndexToast?: string
    zIndexTooltip?: string
}

export type ThemeCustomProperties = {
    [key: `--${string}`]: string | undefined
}

export type ThemeDefinition = Partial<SystemThemeTokens> & ThemeCustomProperties

export type ThemesOptions = Record<string, ThemeDefinition>
