import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest'
import { nextTick } from 'vue'

import { BreakpointLabels } from '../../enums'
import { breakpoints, useDisplay } from '../use-display'

const DEFAULT_BPS = breakpoints

const CUSTOM_BPS: Record<BreakpointLabels, number> = {
    [BreakpointLabels.XS]: 0,
    [BreakpointLabels.SM]: 480,
    [BreakpointLabels.MD]: 768,
    [BreakpointLabels.LG]: 1024,
    [BreakpointLabels.XL]: 1440,
    [BreakpointLabels.XXL]: 1920,
}

function setWidth(w: number) {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w })
}

beforeEach(() => {
    setWidth(0)
})

describe('breakpoints / default export', () => {
    it('содержит все 6 ключей', () => {
        expect(Object.keys(DEFAULT_BPS)).toEqual(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'])
    })

    it('xs равен 0', () => {
        expect(DEFAULT_BPS.xs).toBe(0)
    })
})

describe('useDisplay / createDisplay с дефолтными брейкпоинтами', () => {
    it('state.xs = true при ширине меньше sm', async () => {
        setWidth(400)
        const { createDisplay } = useDisplay()
        createDisplay()
        await nextTick()
        const { createDisplay: cd2 } = useDisplay()
        setWidth(400)
        const display = cd2()
        await nextTick()
        expect(display.xs.value).toBe(true)
    })

    it('state.sm = true при ширине между xs и md', async () => {
        setWidth(700)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.sm.value).toBe(true)
    })

    it('state.md = true при ширине между sm и lg', async () => {
        setWidth(1000)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.md.value).toBe(true)
    })

    it('state.lg = true при ширине между md и xl', async () => {
        setWidth(1500)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.lg.value).toBe(true)
    })

    it('state.xxl = true при ширине >= xxl', async () => {
        setWidth(3000)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.xxl.value).toBe(true)
    })
})

describe('useDisplay / createDisplay с кастомными брейкпоинтами', () => {
    it('xs = true при ширине < custom sm (480)', async () => {
        setWidth(300)
        const { createDisplay } = useDisplay()
        const display = createDisplay(CUSTOM_BPS)
        await nextTick()
        expect(display.xs.value).toBe(true)
    })

    it('sm = true при ширине между 480 и 768', async () => {
        setWidth(600)
        const { createDisplay } = useDisplay()
        const display = createDisplay(CUSTOM_BPS)
        await nextTick()
        expect(display.sm.value).toBe(true)
    })

    it('xxl = true при ширине >= 1920', async () => {
        setWidth(1920)
        const { createDisplay } = useDisplay()
        const display = createDisplay(CUSTOM_BPS)
        await nextTick()
        expect(display.xxl.value).toBe(true)
    })
})

describe('useDisplay / AndUp / AndLess флаги', () => {
    it('smAndUp = true когда экран не xs', async () => {
        setWidth(700)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.smAndUp.value).toBe(true)
        expect(display.xs.value).toBe(false)
    })

    it('smAndUp = false когда xs', async () => {
        setWidth(100)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.smAndUp.value).toBe(false)
    })

    it('mdAndUp = true когда md или выше', async () => {
        setWidth(1000)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.mdAndUp.value).toBe(true)
    })

    it('xlAndLess = true при ширине в диапазоне lg..xl', async () => {
        setWidth(1500)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.xlAndLess.value).toBe(true)
    })

    it('lgAndLess = true при ширине в диапазоне md..lg', async () => {
        setWidth(1100)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.lgAndLess.value).toBe(true)
    })
})

describe('useDisplay / update', () => {
    it('update обновляет ширину и пересчитывает состояние', async () => {
        setWidth(100)
        const { createDisplay } = useDisplay()
        const display = createDisplay()
        await nextTick()
        expect(display.xs.value).toBe(true)

        setWidth(1000)
        display.update()
        await nextTick()
        expect(display.xs.value).toBe(false)
        expect(display.md.value).toBe(true)
    })
})
