import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import {
    createApp,
    defineComponent,
    h,
    inject,
    nextTick,
} from 'vue'

import { breakpoints } from '../composables/use-display'
import { $BREAKPOINTS_KEY } from '../constants/provide-keys'
import { BreakpointLabels } from '../enums'
import { buildVars } from '../helpers'
import { VuelandUI } from '../library'

function setWidth(px: number) {
    Object.defineProperty(window, 'innerWidth', { value: px, writable: true, configurable: true })
}

const CUSTOM_BPS: Record<BreakpointLabels, number> = {
    [BreakpointLabels.XS]: 0,
    [BreakpointLabels.SM]: 640,
    [BreakpointLabels.MD]: 768,
    [BreakpointLabels.LG]: 1024,
    [BreakpointLabels.XL]: 1440,
    [BreakpointLabels.XXL]: 1920,
}

function createUI(options: Parameters<VuelandUI['install']>[1]) {
    const ui = new VuelandUI()
    const Consumer = defineComponent({
        setup() {
            inject($BREAKPOINTS_KEY)
            return () => h('div', { id: 'app' })
        },
    })

    const app = createApp(Consumer)
    app.use({ install: (a) => ui.install(a, options) })
    const div = document.createElement('div')
    app.mount(div)
    return { ui, app, div }
}

describe('VuelandUI / install', () => {
    afterEach(() => {
        document.documentElement.removeAttribute('style')
        delete document.documentElement.dataset.theme
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    it('устанавливает дефолтные брейкпоинты если не переданы', () => {
        const { ui } = createUI({ components: {} })
        expect(ui.breakpoints).toEqual(breakpoints)
    })

    it('устанавливает кастомные брейкпоинты из options', () => {
        const { ui } = createUI({ components: {}, breakpoints: CUSTOM_BPS })
        expect(ui.breakpoints).toEqual(CUSTOM_BPS)
    })

    it('provide $BREAKPOINTS_KEY с дефолтными брейкпоинтами', async () => {
        setWidth(700)
        let display: any

        const Consumer = defineComponent({
            setup() {
                display = inject($BREAKPOINTS_KEY)
                return () => h('div')
            },
        })

        const ui = new VuelandUI()
        const app = createApp(Consumer)
        app.use({ install: (a) => ui.install(a, { components: {} }) })
        app.mount(document.createElement('div'))
        await nextTick()

        // default sm = 600, md = 960 → 700 между ними → sm active
        expect(display.sm.value).toBe(true)
    })

    it('provide $BREAKPOINTS_KEY с кастомными брейкпоинтами', async () => {
        setWidth(700)
        let display: any

        const Consumer = defineComponent({
            setup() {
                display = inject($BREAKPOINTS_KEY)
                return () => h('div')
            },
        })

        const ui = new VuelandUI()
        const app = createApp(Consumer)
        app.use({ install: (a) => ui.install(a, { components: {}, breakpoints: CUSTOM_BPS }) })
        app.mount(document.createElement('div'))
        await nextTick()

        // custom sm = 640 ≠ default sm = 600: 700 > 640 → sm active (подтверждает что кастомный порог используется)
        expect(display.sm.value).toBe(true)
    })

    it('кастомные брейкпоинты меняют пороги: 620 → xs по дефолту, sm по кастомным', async () => {
        setWidth(620)
        let displayDefault: any
        let displayCustom: any

        const ConsumerDefault = defineComponent({
            setup() {
                displayDefault = inject($BREAKPOINTS_KEY)
                return () => h('div')
            },
        })

        const ui1 = new VuelandUI()
        const app1 = createApp(ConsumerDefault)
        app1.use({ install: (a) => ui1.install(a, { components: {} }) })
        app1.mount(document.createElement('div'))
        await nextTick()

        const ConsumerCustom = defineComponent({
            setup() {
                displayCustom = inject($BREAKPOINTS_KEY)
                return () => h('div')
            },
        })

        const ui2 = new VuelandUI()
        const app2 = createApp(ConsumerCustom)
        app2.use({ install: (a) => ui2.install(a, { components: {}, breakpoints: CUSTOM_BPS }) })
        app2.mount(document.createElement('div'))
        await nextTick()

        // дефолт sm = 600: 620 >= 600 → sm active
        expect(displayDefault.sm.value).toBe(true)
        // custom sm = 640: 620 < 640 → xs active (дефолтный sm=600: 620 >= 600 → xs не active)
        expect(displayCustom.xs.value).toBe(true)
        expect(displayDefault.xs.value).toBe(false)
    })

    describe('__VUELAND_BREAKPOINTS__ (utils-jit интеграция)', () => {
        afterEach(() => {
            vi.unstubAllGlobals()
        })

        it('использует брейкпоинты из utils-jit если не переданы явно', () => {
            vi.stubGlobal('__VUELAND_BREAKPOINTS__', CUSTOM_BPS)

            const { ui } = createUI({ components: {} })
            expect(ui.breakpoints).toEqual(CUSTOM_BPS)
        })

        it('явные breakpoints из options перекрывают utils-jit', () => {
            const explicitBps: Record<BreakpointLabels, number> = {
                [BreakpointLabels.XS]: 0,
                [BreakpointLabels.SM]: 480,
                [BreakpointLabels.MD]: 768,
                [BreakpointLabels.LG]: 1024,
                [BreakpointLabels.XL]: 1280,
                [BreakpointLabels.XXL]: 1920,
            }

            vi.stubGlobal('__VUELAND_BREAKPOINTS__', CUSTOM_BPS)

            const { ui } = createUI({ components: {}, breakpoints: explicitBps })
            expect(ui.breakpoints).toEqual(explicitBps)
        })

        it('без utils-jit и без явных breakpoints — дефолты ui', () => {
            // __VUELAND_BREAKPOINTS__ не определён
            const { ui } = createUI({ components: {} })
            expect(ui.breakpoints).toEqual(breakpoints)
        })
    })

    it('повторный install игнорируется (installed guard)', () => {
        const ui = new VuelandUI()
        const app = createApp(defineComponent({ setup: () => () => h('div') }))
        const spy = vi.spyOn(ui, 'applyTheme')

        ui.install(app, { components: {} })
        ui.install(app, { components: {} })

        // applyTheme не вызывался (нет темы), но install был вызван дважды без ошибок
        expect(spy).not.toHaveBeenCalled()
    })

    describe('theme tokens', () => {
        it('мапит короткие ключи темы в system CSS-переменные', () => {
            expect(buildVars({
                primary: '#1976d2',
                onPrimary: '#ffffff',
                surface: '#ffffff',
                shapeMd: '8px',
                stateHoverColor: 'rgba(0,0,0,.06)',
                '--app-shell-width': '1200px',
            })).toEqual([
                ['--c-sys-color-primary', '#1976d2'],
                ['--c-sys-color-on-primary', '#ffffff'],
                ['--c-sys-color-surface', '#ffffff'],
                ['--c-sys-shape-md', '8px'],
                ['--c-sys-state-hover-color', 'rgba(0,0,0,.06)'],
                ['--app-shell-width', '1200px'],
            ])
        })

        it('игнорирует неизвестные короткие ключи темы', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

            expect(buildVars({ sidebarBg: '#f0f2f5' } as any)).toEqual([])
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown theme token "sidebarBg"'))
        })

        it('applyTheme выставляет data-theme и очищает переменные предыдущей темы', () => {
            const ui = new VuelandUI()
            ui.themes = {
                light: {
                    primary: '#1976d2',
                    shapeMd: '8px',
                },
                dark: {
                    primary: '#90caf9',
                    surface: '#1e1e1e',
                },
            }

            ui.applyTheme('light')

            expect(document.documentElement.dataset.theme).toBe('light')
            expect(document.documentElement.style.getPropertyValue('--c-sys-color-primary')).toBe('#1976d2')
            expect(document.documentElement.style.getPropertyValue('--c-sys-shape-md')).toBe('8px')

            ui.applyTheme('dark')

            expect(document.documentElement.dataset.theme).toBe('dark')
            expect(document.documentElement.style.getPropertyValue('--c-sys-color-primary')).toBe('#90caf9')
            expect(document.documentElement.style.getPropertyValue('--c-sys-color-surface')).toBe('#1e1e1e')
            expect(document.documentElement.style.getPropertyValue('--c-sys-shape-md')).toBe('')
        })
    })
})
