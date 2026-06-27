import type { SystemThemeTokens, ThemeDefinition } from '@/types'

type SystemThemeKey = keyof SystemThemeTokens

const COLOR_THEME_KEYS = [
    'scheme',
    'primary',
    'onPrimary',
    'primaryContainer',
    'onPrimaryContainer',
    'secondary',
    'onSecondary',
    'secondaryContainer',
    'onSecondaryContainer',
    'tertiary',
    'onTertiary',
    'tertiaryContainer',
    'onTertiaryContainer',
    'success',
    'onSuccess',
    'successContainer',
    'onSuccessContainer',
    'error',
    'onError',
    'errorContainer',
    'onErrorContainer',
    'warning',
    'onWarning',
    'warningContainer',
    'onWarningContainer',
    'info',
    'onInfo',
    'infoContainer',
    'onInfoContainer',
    'background',
    'onBackground',
    'surface',
    'surfaceDim',
    'surfaceBright',
    'surfaceContainerLowest',
    'surfaceContainerLow',
    'surfaceContainer',
    'surfaceContainerHigh',
    'surfaceContainerHighest',
    'surfaceVariant',
    'onSurface',
    'onSurfaceVariant',
    'inverseSurface',
    'inverseOnSurface',
    'outline',
    'outlineVariant',
    'placeholder',
    'disabled',
    'disabledContainer',
    'readonly',
    'readonlyContainer',
    'focusRing',
    'scrim',
    'shadow',
] satisfies SystemThemeKey[]

const SYSTEM_THEME_KEYS = [
    'stateHoverColor',
    'stateFocusColor',
    'statePressedColor',
    'stateSelectedColor',
    'stateHoverOpacity',
    'stateFocusOpacity',
    'statePressedOpacity',
    'stateDraggedOpacity',
    'stateDisabledOpacity',
    'stateDisabledContainerOpacity',
    'typographyFontFamilyBase',
    'typographyFontFamilyMono',
    'typographyBodySize',
    'typographyBodyLineHeight',
    'typographyLabelSize',
    'typographyLabelLineHeight',
    'typographyLabelWeight',
    'typographyTitleSize',
    'typographyTitleLineHeight',
    'typographyTitleWeight',
    'space0',
    'space1',
    'space2',
    'space3',
    'space4',
    'space5',
    'space6',
    'space8',
    'space10',
    'densityScale',
    'controlHeightSm',
    'controlHeightMd',
    'controlHeightLg',
    'controlPaddingInline',
    'controlIconSize',
    'shapeNone',
    'shapeXs',
    'shapeSm',
    'shapeMd',
    'shapeLg',
    'shapeXl',
    'shapePill',
    'borderWidthThin',
    'borderWidthMedium',
    'borderWidthThick',
    'elevation0',
    'elevation1',
    'elevation2',
    'elevation3',
    'elevation4',
    'elevation5',
    'motionDurationInstant',
    'motionDurationFast',
    'motionDurationMedium',
    'motionDurationSlow',
    'motionEasingLinear',
    'motionEasingStandard',
    'motionEasingEmphasized',
    'zIndexBase',
    'zIndexSticky',
    'zIndexDropdown',
    'zIndexOverlay',
    'zIndexModal',
    'zIndexToast',
    'zIndexTooltip',
] satisfies SystemThemeKey[]

const COLOR_THEME_KEY_SET = new Set<string>(COLOR_THEME_KEYS)
const SYSTEM_THEME_KEY_SET = new Set<string>(SYSTEM_THEME_KEYS)

function toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

function isCustomProperty(key: string): key is `--${string}` {
    return key.startsWith('--')
}

function resolveThemeVar(key: string): string | undefined {
    if (isCustomProperty(key)) {
        return key
    }

    if (COLOR_THEME_KEY_SET.has(key)) {
        return key === 'scheme'
            ? '--c-sys-color-scheme'
            : `--c-sys-color-${toKebabCase(key)}`
    }

    if (SYSTEM_THEME_KEY_SET.has(key)) {
        return `--c-sys-${toKebabCase(key)}`
    }

    console.warn(`[VuelandUI] Unknown theme token "${key}". Use a system key or an explicit CSS custom property.`)
    return undefined
}

export function buildVars(theme: ThemeDefinition): [string, string][] {
    return Object.entries(theme).reduce<[string, string][]>((vars, [key, value]) => {
        if (value === undefined) {
            return vars
        }

        const cssVar = resolveThemeVar(key)

        if (cssVar) {
            vars.push([cssVar, value])
        }

        return vars
    }, [])
}

export function renderThemeStyle(theme: ThemeDefinition): string {
    const vars = buildVars(theme).map(([prop, val]) => `${prop}:${val}`).join(';')
    return `:root{${vars}}`
}
