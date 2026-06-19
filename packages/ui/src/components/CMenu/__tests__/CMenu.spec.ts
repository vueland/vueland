import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { $APP_API_KEY } from '../../../constants'
import { CMenu } from '../index'

type Rect = {
    top?: number
    left?: number
    width?: number
    height?: number
}

type Size = {
    width: number
    height: number
}

const elementSizes = new WeakMap<Element, Size>()
const wrappers: ReturnType<typeof mount>[] = []
const containers: HTMLElement[] = []

function getObservedSize(el: Element): Size {
    return elementSizes.get(el) ?? {
        width: 0,
        height: 0,
    }
}

function createResizeEntry(el: Element): ResizeObserverEntry {
    const size = getObservedSize(el)

    return {
        target: el,
        contentRect: {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: size.width,
            bottom: size.height,
            width: size.width,
            height: size.height,
            toJSON: () => ({}),
        } as DOMRectReadOnly,
        borderBoxSize: [{
            inlineSize: size.width,
            blockSize: size.height,
        }] as ResizeObserverSize[],
        contentBoxSize: [{
            inlineSize: size.width,
            blockSize: size.height,
        }] as ResizeObserverSize[],
        devicePixelContentBoxSize: [{
            inlineSize: size.width,
            blockSize: size.height,
        }] as ResizeObserverSize[],
    }
}

class ResizeObserverMock {
    observed = new Set<Element>()
    timers = new Map<Element, ReturnType<typeof setTimeout>>()

    observe = vi.fn((el: Element) => {
        this.observed.add(el)

        const timer = setTimeout(() => {
            this.timers.delete(el)

            if (!this.observed.has(el)) {
                return
            }

            if (!el.isConnected) {
                return
            }

            this.callback([createResizeEntry(el)], this as unknown as ResizeObserver)
        }, 0)

        this.timers.set(el, timer)
    })

    unobserve = vi.fn((el: Element) => {
        this.observed.delete(el)

        const timer = this.timers.get(el)

        if (timer) {
            clearTimeout(timer)
            this.timers.delete(el)
        }
    })

    disconnect = vi.fn(() => {
        this.observed.clear()

        for (const timer of this.timers.values()) {
            clearTimeout(timer)
        }

        this.timers.clear()
    })

    constructor(public callback: ResizeObserverCallback) {}
}

function toVueListeners(listeners: Record<string, any> = {}) {
    return Object.fromEntries(
        Object.entries(listeners).map(([name, handler]) => [
            `on${name.charAt(0).toUpperCase()}${name.slice(1)}`,
            handler,
        ]),
    )
}

function setRect(el: Element, rect: Rect) {
    vi.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({
        x: rect.left ?? 0,
        y: rect.top ?? 0,
        top: rect.top ?? 0,
        left: rect.left ?? 0,
        right: (rect.left ?? 0) + (rect.width ?? 0),
        bottom: (rect.top ?? 0) + (rect.height ?? 0),
        width: rect.width ?? 0,
        height: rect.height ?? 0,
        toJSON: () => ({}),
    } as DOMRect))
}

function mockMenuSize(width = 120, height = 60) {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('c-menu') ? width : 0
    })

    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('c-menu') ? height : 0
    })

    const menu = document.body.querySelector('.c-menu')

    if (menu) {
        elementSizes.set(menu, {
            width,
            height,
        })
    }
}

async function flush() {
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await nextTick()
}

function getMenu() {
    return document.body.querySelector('.c-menu') as HTMLElement | null
}

function getMenuOrFail() {
    const menu = getMenu()

    if (!menu) {
        throw new Error('Menu was not found')
    }

    return menu
}

function isMenuVisible() {
    const menu = getMenu()

    return !!menu
        && menu.style.display !== 'none'
        && menu.classList.contains('c-menu--visible')
        && !menu.className.includes('leave')
}

function expectMenuOpened() {
    expect(getMenu()).toBeTruthy()
    expect(isMenuVisible()).toBe(true)
}

function expectMenuClosed() {
    expect(isMenuVisible()).toBe(false)
}

async function createWrapper(props: Record<string, any> = {}) {
    const model = ref(props.modelValue ?? false)
    const menuRef = ref()

    const Host = defineComponent({
        setup() {
            return () => h(
                CMenu as any,
                {
                    ...props,
                    ref: menuRef,
                    modelValue: model.value,
                    'onUpdate:modelValue': (value: boolean) => {
                        model.value = value
                    },
                },
                {
                    activator: ({ on, activator }: any) => h(
                        'button',
                        {
                            ...activator,
                            ...toVueListeners(on),
                            type: 'button',
                            'data-test': 'activator',
                        },
                        'Open',
                    ),
                    default: () => h(
                        'div',
                        {
                            'data-test': 'content',
                        },
                        'Menu content',
                    ),
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
                    getScrollTop: () => window.pageYOffset || window.scrollY || 0,
                    getScrollLeft: () => window.pageXOffset || window.scrollX || 0,
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

    const activator = wrapper.get('[data-test="activator"]').element

    setRect(activator, {
        top: 100,
        left: 200,
        width: 120,
        height: 40,
    })

    elementSizes.set(activator, {
        width: 120,
        height: 40,
    })

    mockMenuSize()

    const prepareMenuSize = (width = 120, height = 60) => {
        mockMenuSize(width, height)

        const menu = getMenu()

        if (menu) {
            elementSizes.set(menu, {
                width,
                height,
            })
        }
    }

    const syncMenuSize = (width = 120, height = 60) => {
        const menu = getMenu()

        if (menu) {
            elementSizes.set(menu, {
                width,
                height,
            })
        }
    }

    const open = async () => {
        menuRef.value.open()
        await flush()

        syncMenuSize()
        await flush()
    }

    const close = async () => {
        menuRef.value.close()
        await flush()
    }

    const toggle = async () => {
        menuRef.value.toggle()
        await flush()

        syncMenuSize()
        await flush()
    }

    return {
        wrapper,
        menuRef,
        activator,
        open,
        close,
        toggle,
        prepareMenuSize,
        syncMenuSize,
    }
}

describe('CMenu', () => {
    beforeEach(() => {
        vi.useFakeTimers()

        vi.stubGlobal('ResizeObserver', ResizeObserverMock)

        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            return setTimeout(() => cb(0), 0) as unknown as number
        })

        vi.stubGlobal('cancelAnimationFrame', (id: number) => {
            clearTimeout(id)
        })

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1200,
        })

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        })

        Object.defineProperty(window, 'scrollX', {
            configurable: true,
            value: 0,
        })

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 0,
        })

        Object.defineProperty(window, 'pageXOffset', {
            configurable: true,
            value: 0,
        })

        Object.defineProperty(window, 'pageYOffset', {
            configurable: true,
            value: 0,
        })
    })

    afterEach(async () => {
        for (const wrapper of wrappers.splice(0)) {
            wrapper.unmount()
        }

        await nextTick()
        await vi.runOnlyPendingTimersAsync()
        await nextTick()

        for (const container of containers.splice(0)) {
            container.remove()
        }

        vi.useRealTimers()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    it('рендерит activator slot', async () => {
        const { wrapper } = await createWrapper()

        expect(wrapper.get('[data-test="activator"]').text()).toBe('Open')
    })

    it('не рендерит menu content, пока закрыт', async () => {
        await createWrapper()

        expect(getMenu()).toBeFalsy()
        expect(document.body.textContent).not.toContain('Menu content')
    })

    it('открывается через exposed open()', async () => {
        const { open } = await createWrapper()

        await open()

        expectMenuOpened()
        expect(document.body.textContent).toContain('Menu content')
    })

    it('закрывается через exposed close()', async () => {
        const { open, close } = await createWrapper()

        await open()
        await close()

        expectMenuClosed()
    })

    it('переключается через exposed toggle()', async () => {
        const { toggle } = await createWrapper()

        await toggle()

        expectMenuOpened()

        await toggle()

        expectMenuClosed()
    })

    it('эмитит update:modelValue и open при открытии', async () => {
        const { wrapper, open } = await createWrapper()

        await open()

        const menu = wrapper.findComponent(CMenu as any)

        expect(menu.emitted('update:modelValue')?.at(-1)).toEqual([true])
        expect(menu.emitted('open')).toBeTruthy()
    })

    it('эмитит update:modelValue и close при закрытии', async () => {
        const { wrapper, open, close } = await createWrapper()

        await open()
        await close()

        const menu = wrapper.findComponent(CMenu as any)

        expect(menu.emitted('update:modelValue')?.at(-1)).toEqual([false])
        expect(menu.emitted('close')).toBeTruthy()
    })

    it('открывается по click на activator при openOnClick=true', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            openOnClick: true,
        })

        await wrapper.get('[data-test="activator"]').trigger('click')
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()
    })

    it('переключается по click на activator при closeOnClick=true', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            closeOnClick: true,
        })

        await wrapper.get('[data-test="activator"]').trigger('click')
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()

        await wrapper.get('[data-test="activator"]').trigger('click')
        await flush()

        expectMenuClosed()
    })

    it('открывается по hover при openOnHover=true', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            openOnHover: true,
        })

        await wrapper.get('[data-test="activator"]').trigger('mouseenter')
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()
    })

    it('закрывается по mouseleave при closeOnLeave=true', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            openOnHover: true,
            closeOnLeave: true,
        })

        await wrapper.get('[data-test="activator"]').trigger('mouseenter')
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()

        await wrapper.get('[data-test="activator"]').trigger('mouseleave')
        await flush()

        expectMenuClosed()
    })

    it('открывается по focus при openOnFocus=true', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            openOnFocus: true,
        })

        await wrapper.get('[data-test="activator"]').trigger('focus')
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()
    })

    it('закрывается по Escape', async () => {
        const { open } = await createWrapper()

        await open()

        window.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
        }))

        await nextTick()
        await vi.runOnlyPendingTimersAsync()
        await nextTick()
        await vi.runOnlyPendingTimersAsync()
        await nextTick()

        expectMenuClosed()
    })

    it('закрывается по click на content при closeOnContentClick=true', async () => {
        const { wrapper, open } = await createWrapper({
            closeOnContentClick: true,
        })

        await open()

        getMenuOrFail().click()
        await flush()

        const menu = wrapper.findComponent(CMenu as any)

        expectMenuClosed()
        expect(menu.emitted('click')).toBeTruthy()
        expect(menu.emitted('close')).toBeTruthy()
    })

    it('не закрывается по click на content по умолчанию', async () => {
        const { wrapper, open } = await createWrapper()

        await open()

        getMenuOrFail().click()
        await flush()

        const menu = wrapper.findComponent(CMenu as any)

        expectMenuOpened()
        expect(menu.emitted('click')).toBeFalsy()
    })

    it('открывается при modelValue=true', async () => {
        const { syncMenuSize } = await createWrapper({
            modelValue: true,
        })

        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()
        expect(document.body.textContent).toContain('Menu content')
    })

    it('применяет attrs на root menu', async () => {
        const { open } = await createWrapper({
            id: 'test-menu',
            role: 'menu',
            'aria-label': 'Actions',
            'data-test-root': 'menu',
        })

        await open()

        const menu = getMenuOrFail()

        expect(menu.id).toBe('test-menu')
        expect(menu.getAttribute('role')).toBe('menu')
        expect(menu.getAttribute('aria-label')).toBe('Actions')
        expect(menu.getAttribute('data-test-root')).toBe('menu')
    })

    it('использует width activator по умолчанию', async () => {
        const { open } = await createWrapper()

        await open()

        expect(getMenuOrFail().style.width).toBe('120px')
    })

    it('применяет width из props', async () => {
        const { open } = await createWrapper({
            width: 280,
        })

        await open()

        const menu = getMenuOrFail()

        expect(menu.style.width).toBe('280px')
        expect(menu.style.maxWidth).toBe('280px')
    })

    it('применяет height из props', async () => {
        const { open } = await createWrapper({
            height: 240,
        })

        await open()

        expect(getMenuOrFail().style.height).toBe('240px')
    })

    it('применяет min/max размеры', async () => {
        const { open } = await createWrapper({
            minWidth: 160,
            maxWidth: 320,
            minHeight: 80,
            maxHeight: 240,
        })

        await open()

        const menu = getMenuOrFail()

        expect(menu.style.minWidth).toBe('160px')
        expect(menu.style.maxWidth).toBe('320px')
        expect(menu.style.minHeight).toBe('80px')
        expect(menu.style.maxHeight).toBe('240px')
    })

    it('позиционируется по activator по умолчанию', async () => {
        const { open } = await createWrapper()

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.top)).toBe(100)
        expect(parseFloat(menu.style.left)).toBe(200)
    })

    it('позиционируется под activator при bottom=true', async () => {
        const { open } = await createWrapper({
            bottom: true,
        })

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.top)).toBe(140)
        expect(parseFloat(menu.style.left)).toBe(200)
    })

    it('позиционируется над activator при top=true', async () => {
        const { prepareMenuSize, open } = await createWrapper({
            top: true,
        })

        prepareMenuSize(120, 80)

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.top)).toBe(20)
        expect(parseFloat(menu.style.left)).toBe(200)
    })

    it('учитывает offsetX и offsetY', async () => {
        const { open } = await createWrapper({
            bottom: true,
            offsetX: 16,
            offsetY: 12,
        })

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.top)).toBe(152)
        expect(parseFloat(menu.style.left)).toBe(216)
    })

    it('поддерживает positionX и positionY', async () => {
        const { open } = await createWrapper({
            positionX: 300,
            positionY: 240,
        })

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.left)).toBe(300)
        expect(parseFloat(menu.style.top)).toBe(240)
    })

    it('поддерживает positionX=0 и positionY=0', async () => {
        const { open } = await createWrapper({
            positionX: 0,
            positionY: 0,
        })

        await open()

        const menu = getMenuOrFail()

        expect(parseFloat(menu.style.left)).toBe(20)
        expect(parseFloat(menu.style.top)).toBe(20)
    })

    it('не вылезает за правый край viewport при strategy=bounce', async () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 500,
        })

        const { activator, open } = await createWrapper({
            strategy: 'bounce',
        })

        setRect(activator, {
            top: 100,
            left: 430,
            width: 60,
            height: 40,
        })

        elementSizes.set(activator, {
            width: 60,
            height: 40,
        })

        await open()

        expect(parseFloat(getMenuOrFail().style.left)).toBe(360)
    })

    it('strategy=reverse открывает сверху, если снизу не хватает места', async () => {
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 320,
        })

        const { activator, prepareMenuSize, open } = await createWrapper({
            bottom: true,
            strategy: 'reverse',
        })

        setRect(activator, {
            top: 250,
            left: 200,
            width: 120,
            height: 40,
        })

        elementSizes.set(activator, {
            width: 120,
            height: 40,
        })

        prepareMenuSize(120, 100)

        await open()

        expect(parseFloat(getMenuOrFail().style.top)).toBe(150)
    })

    it('учитывает openDelay', async () => {
        const { wrapper, syncMenuSize } = await createWrapper({
            openOnClick: true,
            openDelay: 100,
        })

        await wrapper.get('[data-test="activator"]').trigger('click')
        await nextTick()

        expect(getMenu()?.style.display).toBe('none')

        await vi.advanceTimersByTimeAsync(99)
        await nextTick()

        expect(getMenu()?.style.display).toBe('none')

        await vi.advanceTimersByTimeAsync(1)
        await flush()

        syncMenuSize()
        await flush()

        expectMenuOpened()
    })

    it('учитывает closeDelay', async () => {
        const { open, menuRef } = await createWrapper({
            closeDelay: 100,
        })

        await open()

        menuRef.value.close()
        await nextTick()

        expectMenuOpened()

        await vi.advanceTimersByTimeAsync(99)
        await nextTick()

        expectMenuOpened()

        await vi.advanceTimersByTimeAsync(1)
        await flush()

        expectMenuClosed()
    })

    it('пересчитывает позицию при resize', async () => {
        const { activator, open } = await createWrapper()

        await open()

        const firstTop = getMenuOrFail().style.top
        const firstLeft = getMenuOrFail().style.left

        setRect(activator, {
            top: 180,
            left: 320,
            width: 120,
            height: 40,
        })

        elementSizes.set(activator, {
            width: 120,
            height: 40,
        })

        window.dispatchEvent(new Event('resize'))
        await flush()

        expect(getMenuOrFail().style.top).not.toBe(firstTop)
        expect(getMenuOrFail().style.left).not.toBe(firstLeft)
    })

    it('пересчитывает позицию при scroll', async () => {
        const { activator, open } = await createWrapper()

        await open()

        const firstTop = getMenuOrFail().style.top

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 150,
        })

        Object.defineProperty(window, 'pageYOffset', {
            configurable: true,
            value: 150,
        })

        setRect(activator, {
            top: 100,
            left: 200,
            width: 120,
            height: 40,
        })

        elementSizes.set(activator, {
            width: 120,
            height: 40,
        })

        window.dispatchEvent(new Event('scroll'))
        await flush()

        expect(getMenuOrFail().style.top).not.toBe(firstTop)
    })
})
