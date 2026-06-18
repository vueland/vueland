const CSS_NUMBER_RE = /^-?(?:\d+|\d*\.\d+)$/

const CSS_LENGTH_UNIT_RE =
    /(?:px|r?em|%|vw|vh|svw|svh|lvw|lvh|dvw|dvh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)/

const CSS_LENGTH_RE = new RegExp(`^-?(?:\\d+|\\d*\\.\\d+)${CSS_LENGTH_UNIT_RE.source}$`)

const CSS_COLOR_KEYWORDS = new Set([
    'transparent',
    'currentColor',
    'inherit',
    'initial',
    'unset',
    'revert',
])

const CSS_GLOBAL_VALUES = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer'])

export function isNumberValue(value: string): boolean {
    return CSS_NUMBER_RE.test(value)
}

export function isZeroValue(value: string): boolean {
    return value === '0' || value === '-0'
}

export function isCssGlobalValue(value: string): boolean {
    return CSS_GLOBAL_VALUES.has(value)
}

export function isFunctionalCssValue(value: string): boolean {
    return /^(?:calc|min|max|clamp|var)\(.+\)$/.test(value)
}

export function isLengthLikeValue(value: string): boolean {
    return isZeroValue(value) || CSS_LENGTH_RE.test(value) || isFunctionalCssValue(value)
}

export function isLengthListValue(value: string, maxItems = 4): boolean {
    const items = value.trim().split(/\s+/)

    if (items.length === 0 || items.length > maxItems) {
        return false
    }

    return items.every((item) => isLengthLikeValue(item))
}

export function isSizeValue(value: string): boolean {
    return isCssGlobalValue(value) || value === 'auto' || isLengthLikeValue(value)
}

export function isPaddingValue(value: string): boolean {
    return isCssGlobalValue(value) || isLengthListValue(value, 4)
}

export function isMarginValue(value: string): boolean {
    if (isCssGlobalValue(value)) {
        return true
    }

    const items = value.trim().split(/\s+/)

    if (items.length === 0 || items.length > 4) {
        return false
    }

    return items.every((item) => item === 'auto' || isLengthLikeValue(item))
}

export function isRadiusValue(value: string): boolean {
    return isCssGlobalValue(value) || isLengthListValue(value, 4)
}

export function isPositionValue(value: string): boolean {
    return isCssGlobalValue(value) || value === 'auto' || isLengthLikeValue(value)
}

export function isZIndexValue(value: string): boolean {
    return (
        isCssGlobalValue(value) ||
        value === 'auto' ||
        CSS_NUMBER_RE.test(value) ||
        /^var\(.+\)$/.test(value)
    )
}

export function isOpacityValue(value: string): boolean {
    if (isCssGlobalValue(value)) {
        return true
    }

    if (!CSS_NUMBER_RE.test(value)) {
        return /^var\(.+\)$/.test(value)
    }

    const numeric = Number(value)

    return numeric >= 0 && numeric <= 1
}

export function isColorValue(value: string): boolean {
    return (
        isCssGlobalValue(value) ||
        CSS_COLOR_KEYWORDS.has(value) ||
        /^#[0-9a-fA-F]{3,8}$/.test(value) ||
        /^(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(.+\)$/.test(value) ||
        /^var\(.+\)$/.test(value)
    )
}
