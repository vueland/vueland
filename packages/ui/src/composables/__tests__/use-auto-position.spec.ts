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
    computed,
    defineComponent,
    h,
    nextTick,
    reactive,
    shallowRef,
} from 'vue'

import { $APP_API_KEY } from '../../constants'
import { useAutoPosition } from '../use-auto-position'

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

type HarnessProps = Record<string, any>

const sizes = new WeakMap<Element, Size>()
const resizeObservers: ResizeObserverMock[] = []

let scrollTop = 0
let scrollLeft = 0

class ResizeObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()

    constructor(public callback: ResizeObserverCallback) {
        resizeObservers.push(this)
    }

    trigger(entry: Partial<ResizeObserverEntry>) {
        this.callback([entry as ResizeObserverEntry], this as unknown as ResizeObserver)
    }
}

function setRect(el: Element, rect: Rect) {
    Object.defineProperty(el, 'getBoundingClientRect', {
        configurable: true,
        value: vi.fn(
            () =>
                ({
                    x: rect.left ?? 0,
                    y: rect.top ?? 0,
                    top: rect.top ?? 0,
                    left: rect.left ?? 0,
                    right: (rect.left ?? 0) + (rect.width ?? 0),
                    bottom: (rect.top ?? 0) + (rect.height ?? 0),
                    width: rect.width ?? 0,
                    height: rect.height ?? 0,
                    toJSON: () => ({}),
                }) as DOMRect,
        ),
    })
}

function setSize(el: Element, size: Size) {
    sizes.set(el, size)
}

function getContentRect(size: Size): DOMRectReadOnly {
    return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: size.width,
        bottom: size.height,
        width: size.width,
        height: size.height,
        toJSON: () => ({}),
    }
}

async function flushRaf() {
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await nextTick()
}

async function createHarness(initialProps: HarnessProps = {}) {
    const props = reactive({ ...initialProps })

    let api!: ReturnType<typeof useAutoPosition>

    const Harness = defineComponent({
        setup() {
            const activatorRef = shallowRef<HTMLElement>()

            api = useAutoPosition(
                props,
                computed(() => activatorRef.value),
            )

            return () =>
                h('div', [
                    h('button', {
                        ref: activatorRef,
                        'data-test': 'activator',
                    }),
                    h('div', {
                        ref: api.contentRef,
                        'data-test': 'content',
                    }),
                ])
        },
    })

    const wrapper = mount(Harness, {
        attachTo: document.body,
        global: {
            provide: {
                [$APP_API_KEY]: {
                    getScrollTop: () => scrollTop,
                    getScrollLeft: () => scrollLeft,
                },
            },
        },
    })

    await nextTick()

    const activator = wrapper.get('[data-test="activator"]').element
    const content = wrapper.get('[data-test="content"]').element

    setRect(activator, {
        top: 100,
        left: 200,
        width: 120,
        height: 40,
    })

    setSize(content, {
        width: 120,
        height: 60,
    })

    return {
        wrapper,
        props,
        api,
        activator,
        content,
        async update() {
            await api.update()
            await nextTick()
        },
    }
}

describe('useAutoPosition', () => {
    beforeEach(() => {
        vi.useFakeTimers()

        scrollTop = 0
        scrollLeft = 0
        resizeObservers.length = 0

        vi.stubGlobal('ResizeObserver', ResizeObserverMock)

        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            return setTimeout(() => cb(0), 0) as unknown as number
        })

        vi.stubGlobal('cancelAnimationFrame', (id: number) => {
            clearTimeout(id)
        })

        vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function(
            this: HTMLElement,
        ) {
            return sizes.get(this)?.width ?? 0
        })

        vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function(
            this: HTMLElement,
        ) {
            return sizes.get(this)?.height ?? 0
        })

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1200,
        })

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        })
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
        document.body.innerHTML = ''
    })

    it('возвращает публичный интерфейс', async () => {
        const { api } = await createHarness()

        expect(api.activator).toBeTruthy()
        expect(api.content).toBeTruthy()
        expect(api.contentRef).toBeTruthy()
        expect(api.update).toEqual(expect.any(Function))
    })

    it('измеряет activator и content при update()', async () => {
        const { api, update } = await createHarness()

        await update()

        expect(api.activator.value).toEqual({
            top: 100,
            left: 200,
            width: 120,
            height: 40,
        })

        expect(api.content.value.width).toBe(120)
        expect(api.content.value.height).toBe(60)
    })

    it('позиционирует content по activator по умолчанию', async () => {
        const { api, update } = await createHarness()

        await update()

        expect(api.content.value.top).toBe(100)
        expect(api.content.value.left).toBe(200)
    })

    it('позиционирует content под activator при bottom=true', async () => {
        const { api, update } = await createHarness({ bottom: true })

        await update()

        expect(api.content.value.top).toBe(140)
        expect(api.content.value.left).toBe(200)
    })

    it('позиционирует content над activator при top=true', async () => {
        const {
            api,
            content,
            update,
        } = await createHarness({ top: true })

        setSize(content, {
            width: 120,
            height: 80,
        })

        await update()

        expect(api.content.value.top).toBe(20)
        expect(api.content.value.left).toBe(200)
    })

    it('позиционирует content слева от activator при left=true', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({ left: true })

        setRect(activator, {
            top: 200,
            left: 400,
            width: 100,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.top).toBe(200)
        expect(api.content.value.left).toBe(280)
    })

    it('позиционирует content справа от activator при right=true', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({ right: true })

        setRect(activator, {
            top: 200,
            left: 400,
            width: 100,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.top).toBe(200)
        expect(api.content.value.left).toBe(500)
    })

    it('учитывает offsetX и offsetY', async () => {
        const { api, update } = await createHarness({
            bottom: true,
            offsetX: 16,
            offsetY: 12,
        })

        await update()

        expect(api.content.value.top).toBe(152)
        expect(api.content.value.left).toBe(216)
    })

    it('учитывает строковые offsetX и offsetY', async () => {
        const { api, update } = await createHarness({
            bottom: true,
            offsetX: '16',
            offsetY: '12',
        })

        await update()

        expect(api.content.value.top).toBe(152)
        expect(api.content.value.left).toBe(216)
    })

    it('использует positionX и positionY вместо activator position', async () => {
        const { api, update } = await createHarness({
            positionX: 300,
            positionY: 240,
        })

        await update()

        expect(api.content.value.left).toBe(300)
        expect(api.content.value.top).toBe(240)
    })

    it('считает positionX=0 и positionY=0 валидными координатами', async () => {
        const { api, update } = await createHarness({
            positionX: 0,
            positionY: 0,
        })

        await update()

        expect(api.content.value.left).toBe(10)
        expect(api.content.value.top).toBe(10)
    })

    it('добавляет offset к positionX и positionY', async () => {
        const { api, update } = await createHarness({
            positionX: 300,
            positionY: 240,
            offsetX: 10,
            offsetY: 20,
        })

        await update()

        expect(api.content.value.left).toBe(310)
        expect(api.content.value.top).toBe(260)
    })

    it('учитывает scrollTop и scrollLeft из application api', async () => {
        scrollTop = 50
        scrollLeft = 30

        const { api, update } = await createHarness()

        await update()

        expect(api.activator.value.top).toBe(150)
        expect(api.activator.value.left).toBe(230)
        expect(api.content.value.top).toBe(150)
        expect(api.content.value.left).toBe(230)
    })

    it('bounce ограничивает content по правому краю viewport', async () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 500,
        })

        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({ strategy: 'bounce' })

        setRect(activator, {
            top: 100,
            left: 430,
            width: 60,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.left).toBe(370)
    })

    it('bounce ограничивает content по левому краю viewport', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            left: true,
            strategy: 'bounce',
        })

        setRect(activator, {
            top: 100,
            left: 40,
            width: 60,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.left).toBe(10)
    })

    it('bounce ограничивает content по нижнему краю viewport', async () => {
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 320,
        })

        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            bottom: true,
            strategy: 'bounce',
        })

        setRect(activator, {
            top: 280,
            left: 200,
            width: 120,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 100,
        })

        await update()

        expect(api.content.value.top).toBe(210)
    })

    it('bounce ограничивает content по верхнему краю viewport', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            top: true,
            strategy: 'bounce',
        })

        setRect(activator, {
            top: 40,
            left: 200,
            width: 120,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 100,
        })

        await update()

        expect(api.content.value.top).toBe(10)
    })

    it('reverse открывает снизу, если сверху не хватает места', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            top: true,
            strategy: 'reverse',
        })

        setRect(activator, {
            top: 40,
            left: 200,
            width: 120,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 100,
        })

        await update()

        expect(api.content.value.top).toBe(80)
    })

    it('reverse открывает сверху, если снизу не хватает места', async () => {
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 320,
        })

        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            bottom: true,
            strategy: 'reverse',
        })

        setRect(activator, {
            top: 250,
            left: 200,
            width: 120,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 100,
        })

        await update()

        expect(api.content.value.top).toBe(150)
    })

    it('reverse открывает справа, если слева не хватает места', async () => {
        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            left: true,
            strategy: 'reverse',
        })

        setRect(activator, {
            top: 100,
            left: 40,
            width: 60,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.left).toBe(100)
    })

    it('reverse открывает слева, если справа не хватает места', async () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 500,
        })

        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            right: true,
            strategy: 'reverse',
        })

        setRect(activator, {
            top: 100,
            left: 430,
            width: 60,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.left).toBe(310)
    })

    it('реагирует на изменение positionX и positionY', async () => {
        const {
            api,
            props,
            update,
        } = await createHarness({
            positionX: 100,
            positionY: 100,
        })

        await update()

        expect(api.content.value.left).toBe(100)
        expect(api.content.value.top).toBe(100)

        props.positionX = 300
        props.positionY = 240

        await flushRaf()

        expect(api.content.value.left).toBe(300)
        expect(api.content.value.top).toBe(240)
    })

    it('реагирует на изменение offsetX и offsetY', async () => {
        const {
            api,
            props,
            update,
        } = await createHarness({
            bottom: true,
            offsetX: 0,
            offsetY: 0,
        })

        await update()

        expect(api.content.value.left).toBe(200)
        expect(api.content.value.top).toBe(140)

        props.offsetX = 16
        props.offsetY = 12

        await flushRaf()

        expect(api.content.value.left).toBe(216)
        expect(api.content.value.top).toBe(152)
    })

    it('реагирует на изменение направления позиционирования', async () => {
        const {
            api,
            props,
            update,
        } = await createHarness({ bottom: true })

        await update()

        expect(api.content.value.top).toBe(140)

        props.bottom = false
        props.top = true

        await flushRaf()

        expect(api.content.value.top).toBe(40)
    })

    it('ResizeObserver пересчитывает позицию при изменении размеров content', async () => {
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 320,
        })

        const {
            api,
            activator,
            content,
            update,
        } = await createHarness({
            bottom: true,
            strategy: 'bounce',
        })

        setRect(activator, {
            top: 200,
            left: 200,
            width: 120,
            height: 40,
        })

        setSize(content, {
            width: 120,
            height: 60,
        })

        await update()

        expect(api.content.value.top).toBe(240)

        setSize(content, {
            width: 120,
            height: 120,
        })

        const observer = resizeObservers.at(-1)

        expect(observer).toBeTruthy()

        observer!.trigger({
            target: content,
            contentRect: getContentRect({
                width: 120,
                height: 120,
            }),
            borderBoxSize: [
                {
                    inlineSize: 120,
                    blockSize: 120,
                },
            ] as ResizeObserverSize[],
        })

        await flushRaf()

        expect(api.content.value.top).toBe(190)
    })

    it('батчит несколько scheduled updates в один requestAnimationFrame', async () => {
        const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

        const { props, update } = await createHarness({
            positionX: 100,
            positionY: 100,
        })

        await update()

        rafSpy.mockClear()

        props.positionX = 110
        props.positionY = 120
        props.offsetX = 10
        props.offsetY = 10

        await nextTick()

        expect(rafSpy).toHaveBeenCalledTimes(1)

        await flushRaf()
    })

    it('не падает при update без activator', async () => {
        const props = reactive({
            positionX: 100,
            positionY: 100,
        })

        let api!: ReturnType<typeof useAutoPosition>

        const Harness = defineComponent({
            setup() {
                api = useAutoPosition(props)

                return () =>
                    h('div', {
                        ref: api.contentRef,
                        'data-test': 'content',
                    })
            },
        })

        const wrapper = mount(Harness, {
            attachTo: document.body,
            global: {
                provide: {
                    [$APP_API_KEY]: {
                        getScrollTop: () => scrollTop,
                        getScrollLeft: () => scrollLeft,
                    },
                },
            },
        })

        await nextTick()

        const content = wrapper.get('[data-test="content"]').element

        setSize(content, {
            width: 120,
            height: 60,
        })

        await api.update()

        expect(api.content.value.left).toBe(100)
        expect(api.content.value.top).toBe(100)
    })

    it('disconnect ResizeObserver при unmount', async () => {
        const { wrapper } = await createHarness()

        const observer = resizeObservers.at(-1)

        expect(observer).toBeTruthy()

        wrapper.unmount()

        expect(observer!.disconnect).toHaveBeenCalled()
    })

    it('отменяет запланированный requestAnimationFrame при unmount', async () => {
        const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')

        const {
            props,
            wrapper,
            update,
        } = await createHarness({
            positionX: 100,
            positionY: 100,
        })

        await update()

        props.positionX = 200

        await nextTick()

        wrapper.unmount()

        expect(cancelSpy).toHaveBeenCalled()
    })
})
