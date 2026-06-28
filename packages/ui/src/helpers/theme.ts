import type { SystemThemeTokens, ThemeDefinition } from '@/types'

type SystemThemeKey = keyof SystemThemeTokens

const COLOR_THEME_KEYS = [
    'scheme',
    'primary',
    'primaryRgb',
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
] satisfies SystemThemeKey[]

const COLOR_THEME_KEY_SET = new Set<string>(COLOR_THEME_KEYS)
const SYSTEM_THEME_KEY_SET = new Set<string>(SYSTEM_THEME_KEYS)

function toKebabCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
}

function isCustomProperty(key: string): key is `--${string}` {
    return key.startsWith('--')
}

function parseHexColorChannels(value: string): string | undefined {
    const match = value.trim().match(/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i)

    if (!match) {
        return undefined
    }

    const hex = match[1]
    const rgbHex = hex.length <= 4
        ? hex.slice(0, 3).split('').map((part) => part + part).join('')
        : hex.slice(0, 6)

    return [0, 2, 4]
        .map((start) => parseInt(rgbHex.slice(start, start + 2), 16))
        .join(', ')
}

function parseRgbColorChannels(value: string): string | undefined {
    const match = value.trim().match(/^rgba?\((.+)\)$/i)

    if (!match) {
        return undefined
    }

    const channels = match[1].split('/')[0].includes(',')
        ? match[1].split('/')[0].split(',').slice(0, 3)
        : match[1].split('/')[0].trim().split(/\s+/).slice(0, 3)

    if (channels.length !== 3) {
        return undefined
    }

    const normalized = channels.map((channel) => channel.trim())

    return normalized.every((channel) => /^\d+(?:\.\d+)?%?$/.test(channel))
        ? normalized.join(', ')
        : undefined
}

function getRgbChannels(value: string): string | undefined {
    return parseHexColorChannels(value) ?? parseRgbColorChannels(value)
}

function resolveThemeVar(key: string): string {
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

    return `--c-${toKebabCase(key)}`
}

export function buildVars(theme: ThemeDefinition): [string, string][] {
    const shouldInferPrimaryRgb = theme.primaryRgb === undefined
        && theme['--c-sys-color-primary-rgb'] === undefined

    return Object.entries(theme).reduce<[string, string][]>((vars, [key, value]) => {
        if (value === undefined) {
            return vars
        }

        vars.push([resolveThemeVar(key), value])

        if (key === 'primary' && shouldInferPrimaryRgb) {
            const channels = getRgbChannels(value)

            if (channels) {
                vars.push(['--c-sys-color-primary-rgb', channels])
            }
        }

        return vars
    }, [])
}

export function renderThemeStyle(theme: ThemeDefinition): string {
    const vars = buildVars(theme).map(([prop, val]) => `${prop}:${val}`).join(';')
    return `:root{${vars}}`
}
