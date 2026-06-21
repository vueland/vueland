import { mount } from '@vue/test-utils'
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import {
    defineComponent,
    h,
    nextTick,
} from 'vue'

import { CTooltip } from '@/components/index'

import { $APP_API_KEY } from '../../../constants'

const wrappers: ReturnType<typeof mount>[] = []
const containers: HTMLElement[] = []

class ResizeObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor(public callback: ResizeObserverCallback) {}
}

async function flush() {
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await nextTick()
}

function getTooltip() {
    return document.body.querySelector('.c-tooltip') as HTMLElement | null
}

function isTooltipVisible() {
    const el = getTooltip()
    return !!el
        && el.style.display !== 'none'
        && el.classList.contains('c-menu--visible')
}

async function createWrapper(props: Record<string, any> = {}, content = 'Tooltip text') {
    const Host = defineComponent({
        setup() {
            return () => h(
                CTooltip as any,
                props,
                {
                    activator: ({ on, activator }: any) => h(
                        'button',
                        {
                            ...activator,
                            onMouseenter: on.mouseenter,
                            onMouseleave: on.mouseleave,
                            onFocus: on.focus,
                            'data-test': 'activator',
                        },
                        'Hover me',
                    ),
                    default: () => content,
                },
            )
        },
    })

    const container = document.createElement('div')
    document.body.appendChild(container)
    containers.push(container)

    const wrapper = mount(Host, {
        attachTo: container,
        global: {
            provide: {
                [$APP_API_KEY]: {
                    getScrollTop: () => 0,
                    getScrollLeft: () => 0,
                },
            },
            stubs: {
                teleport: false,
                transition: false,
            },
        },
    })

    wrappers.push(wrapper)
    await nextTick()

    const open = async () => {
        await wrapper.get('[data-test="activator"]').trigger('mouseenter')
        await flush()
    }

    const close = async () => {
        await wrapper.get('[data-test="activator"]').trigger('mouseleave')
        await flush()
    }

    return { wrapper, open, close }
}

describe('CTooltip', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.stubGlobal('ResizeObserver', ResizeObserverMock)
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number)
        vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
    })

    afterEach(async () => {
        for (const wrapper of wrappers.splice(0)) wrapper.unmount()
        await nextTick()
        await vi.runOnlyPendingTimersAsync()
        await nextTick()
        for (const container of containers.splice(0)) container.remove()
        vi.useRealTimers()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    it('рендерит activator slot', async () => {
        const { wrapper } = await createWrapper()
        expect(wrapper.get('[data-test="activator"]').text()).toBe('Hover me')
    })

    it('не показывает tooltip по умолчанию', async () => {
        await createWrapper()
        expect(getTooltip()).toBeFalsy()
    })

    it('показывает tooltip при mouseenter', async () => {
        const { open } = await createWrapper({ openOnHover: true })
        await open()
        expect(isTooltipVisible()).toBe(true)
    })

    it('скрывает tooltip при mouseleave', async () => {
        const { open, close } = await createWrapper({ openOnHover: true, closeOnLeave: true })
        await open()
        await close()
        expect(isTooltipVisible()).toBe(false)
    })

    it('показывает контент слота', async () => {
        const { open } = await createWrapper({ openOnHover: true }, 'Hello tooltip')
        await open()
        expect(document.body.textContent).toContain('Hello tooltip')
    })

    it('имеет role="tooltip" на контейнере', async () => {
        const { open } = await createWrapper({ openOnHover: true })
        await open()
        expect(getTooltip()?.getAttribute('role')).toBe('tooltip')
    })

    it('имеет уникальный id на контейнере', async () => {
        const { open } = await createWrapper({ openOnHover: true })
        await open()
        const id = getTooltip()?.id
        expect(id).toBeTruthy()
        expect(id).toMatch(/^c-tooltip-/)
    })

    it('activator имеет aria-describedby указывающий на tooltip', async () => {
        const { wrapper, open } = await createWrapper({ openOnHover: true })
        await open()
        const tooltipId = getTooltip()?.id
        const describedBy = wrapper.get('[data-test="activator"]').attributes('aria-describedby')
        expect(describedBy).toBe(tooltipId)
    })

    it('имеет класс c-tooltip', async () => {
        const { open } = await createWrapper({ openOnHover: true })
        await open()
        expect(getTooltip()?.classList.contains('c-tooltip')).toBe(true)
    })

    it('применяет width="auto" по умолчанию', async () => {
        const { open } = await createWrapper({ openOnHover: true })
        await open()
        expect(getTooltip()?.style.width).toBe('auto')
    })

    it('применяет кастомный width', async () => {
        const { open } = await createWrapper({ openOnHover: true, width: 200 })
        await open()
        expect(getTooltip()?.style.width).toBe('200px')
    })

    it('показывается при openOnFocus', async () => {
        const { wrapper } = await createWrapper({ openOnFocus: true })
        await wrapper.get('[data-test="activator"]').trigger('focus')
        await flush()
        expect(isTooltipVisible()).toBe(true)
    })
})
