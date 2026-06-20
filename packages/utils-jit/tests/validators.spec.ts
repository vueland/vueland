import {
    describe,
    expect,
    it,
} from 'vitest'

import {
    isColorValue,
    isCssGlobalValue,
    isFunctionalCssValue,
    isLengthLikeValue,
    isMarginValue,
    isNumberValue,
    isOpacityValue,
    isPaddingValue,
    isPositionValue,
    isRadiusValue,
    isSizeValue,
    isZIndexValue,
} from '../src'

describe('validators / isNumberValue', () => {
    it('разрешает целые и дробные числа', () => {
        expect(isNumberValue('0')).toBe(true)
        expect(isNumberValue('10')).toBe(true)
        expect(isNumberValue('-10')).toBe(true)
        expect(isNumberValue('0.5')).toBe(true)
        expect(isNumberValue('.5')).toBe(true)
    })

    it('запрещает нечисловые значения', () => {
        expect(isNumberValue('10px')).toBe(false)
        expect(isNumberValue('auto')).toBe(false)
    })
})

describe('validators / isCssGlobalValue', () => {
    it('разрешает css global values', () => {
        expect(isCssGlobalValue('inherit')).toBe(true)
        expect(isCssGlobalValue('initial')).toBe(true)
        expect(isCssGlobalValue('unset')).toBe(true)
        expect(isCssGlobalValue('revert')).toBe(true)
        expect(isCssGlobalValue('revert-layer')).toBe(true)
    })

    it('запрещает обычные значения', () => {
        expect(isCssGlobalValue('10px')).toBe(false)
    })
})

describe('validators / isFunctionalCssValue', () => {
    it('разрешает css functions', () => {
        expect(isFunctionalCssValue('calc(100%-16px)')).toBe(true)
        expect(isFunctionalCssValue('min(10px,20px)')).toBe(true)
        expect(isFunctionalCssValue('max(10px,20px)')).toBe(true)
        expect(isFunctionalCssValue('clamp(10px,20px,30px)')).toBe(true)
        expect(isFunctionalCssValue('var(--size)')).toBe(true)
    })

    it('запрещает обычные значения', () => {
        expect(isFunctionalCssValue('10px')).toBe(false)
    })
})

describe('validators / isLengthLikeValue', () => {
    it('разрешает length-like values', () => {
        expect(isLengthLikeValue('0')).toBe(true)
        expect(isLengthLikeValue('10px')).toBe(true)
        expect(isLengthLikeValue('1rem')).toBe(true)
        expect(isLengthLikeValue('100%')).toBe(true)
        expect(isLengthLikeValue('100vh')).toBe(true)
        expect(isLengthLikeValue('100dvh')).toBe(true)
        expect(isLengthLikeValue('calc(100%-16px)')).toBe(true)
        expect(isLengthLikeValue('var(--size)')).toBe(true)
    })

    it('запрещает invalid length-like values', () => {
        expect(isLengthLikeValue('auto')).toBe(false)
        expect(isLengthLikeValue('red')).toBe(false)
    })
})

describe('validators / isSizeValue', () => {
    it('разрешает size values', () => {
        expect(isSizeValue('auto')).toBe(true)
        expect(isSizeValue('0')).toBe(true)
        expect(isSizeValue('10px')).toBe(true)
        expect(isSizeValue('100%')).toBe(true)
        expect(isSizeValue('inherit')).toBe(true)
        expect(isSizeValue('var(--size)')).toBe(true)
    })

    it('запрещает invalid size values', () => {
        expect(isSizeValue('red')).toBe(false)
        expect(isSizeValue('10px 20px')).toBe(false)
    })
})

describe('validators / isMarginValue', () => {
    it('разрешает margin values', () => {
        expect(isMarginValue('auto')).toBe(true)
        expect(isMarginValue('10px')).toBe(true)
        expect(isMarginValue('10px auto')).toBe(true)
        expect(isMarginValue('10px 20px 30px 40px')).toBe(true)
        expect(isMarginValue('inherit')).toBe(true)
    })

    it('запрещает invalid margin values', () => {
        expect(isMarginValue('red')).toBe(false)
        expect(isMarginValue('10px 20px 30px 40px 50px')).toBe(false)
    })
})

describe('validators / isPaddingValue', () => {
    it('разрешает padding values', () => {
        expect(isPaddingValue('0')).toBe(true)
        expect(isPaddingValue('10px')).toBe(true)
        expect(isPaddingValue('10px 20px')).toBe(true)
        expect(isPaddingValue('10px 20px 30px 40px')).toBe(true)
        expect(isPaddingValue('inherit')).toBe(true)
    })

    it('запрещает invalid padding values', () => {
        expect(isPaddingValue('auto')).toBe(false)
        expect(isPaddingValue('red')).toBe(false)
        expect(isPaddingValue('10px 20px 30px 40px 50px')).toBe(false)
    })
})

describe('validators / isRadiusValue', () => {
    it('разрешает radius values', () => {
        expect(isRadiusValue('0')).toBe(true)
        expect(isRadiusValue('8px')).toBe(true)
        expect(isRadiusValue('8px 12px')).toBe(true)
        expect(isRadiusValue('inherit')).toBe(true)
    })

    it('запрещает invalid radius values', () => {
        expect(isRadiusValue('auto')).toBe(false)
        expect(isRadiusValue('red')).toBe(false)
    })
})

describe('validators / isPositionValue', () => {
    it('разрешает position offset values', () => {
        expect(isPositionValue('auto')).toBe(true)
        expect(isPositionValue('0')).toBe(true)
        expect(isPositionValue('-10px')).toBe(true)
        expect(isPositionValue('50%')).toBe(true)
        expect(isPositionValue('inherit')).toBe(true)
    })

    it('запрещает invalid position values', () => {
        expect(isPositionValue('red')).toBe(false)
        expect(isPositionValue('10px 20px')).toBe(false)
    })
})

describe('validators / isZIndexValue', () => {
    it('разрешает z-index values', () => {
        expect(isZIndexValue('auto')).toBe(true)
        expect(isZIndexValue('0')).toBe(true)
        expect(isZIndexValue('10')).toBe(true)
        expect(isZIndexValue('-1')).toBe(true)
        expect(isZIndexValue('var(--z)')).toBe(true)
        expect(isZIndexValue('inherit')).toBe(true)
    })

    it('запрещает invalid z-index values', () => {
        expect(isZIndexValue('10px')).toBe(false)
        expect(isZIndexValue('red')).toBe(false)
    })
})

describe('validators / isOpacityValue', () => {
    it('разрешает opacity values от 0 до 1', () => {
        expect(isOpacityValue('0')).toBe(true)
        expect(isOpacityValue('0.5')).toBe(true)
        expect(isOpacityValue('1')).toBe(true)
        expect(isOpacityValue('var(--opacity)')).toBe(true)
        expect(isOpacityValue('inherit')).toBe(true)
    })

    it('запрещает opacity values вне диапазона', () => {
        expect(isOpacityValue('-1')).toBe(false)
        expect(isOpacityValue('2')).toBe(false)
        expect(isOpacityValue('red')).toBe(false)
    })
})

describe('validators / isColorValue', () => {
    it('разрешает color values', () => {
        expect(isColorValue('#fff')).toBe(true)
        expect(isColorValue('#ffffff')).toBe(true)
        expect(isColorValue('#ffffffff')).toBe(true)
        expect(isColorValue('transparent')).toBe(true)
        expect(isColorValue('currentColor')).toBe(true)
        expect(isColorValue('rgb(255,0,0)')).toBe(true)
        expect(isColorValue('rgba(255,0,0,0.5)')).toBe(true)
        expect(isColorValue('hsl(0,100%,50%)')).toBe(true)
        expect(isColorValue('oklch(60% 0.2 20)')).toBe(true)
        expect(isColorValue('var(--color)')).toBe(true)
        expect(isColorValue('inherit')).toBe(true)
    })

    it('запрещает invalid color values', () => {
        expect(isColorValue('10px')).toBe(false)
        expect(isColorValue('not-a-color')).toBe(false)
    })
})
