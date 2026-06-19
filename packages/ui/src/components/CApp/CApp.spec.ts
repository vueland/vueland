import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick } from 'vue'

import { $APP_API_KEY } from '../../constants'
import { CApp, CBtn } from '../index'

describe('CApp', () => {
    const scrollToMock = vi.fn()

    beforeEach(() => {
        // Мокаем window.scrollTo
        scrollToMock.mockReset()

        Object.defineProperty(window, 'scrollTo', {
            configurable: true,
            value: scrollToMock,
        })

        // Мокаем текущие значения скролла
        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            writable: true,
            value: 0,
        })

        Object.defineProperty(window, 'scrollX', {
            configurable: true,
            writable: true,
            value: 0,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('рендерит slot', () => {
        const wrapper = mount(CApp, {
            slots: {
                default: () => h(CBtn),
            },
        })

        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('пробрасывает API через provide', () => {
        let api: any

        const Consumer = defineComponent({
            setup() {
                // Получаем API через inject
                api = inject($APP_API_KEY)
                return () => h('div')
            },
        })

        mount(CApp, {
            slots: {
                default: () => h(Consumer),
            },
        })

        expect(api).toBeTruthy()
        expect(api.getScrollTop).toBeTypeOf('function')
        expect(api.getScrollLeft).toBeTypeOf('function')
        expect(api.blockScroll).toBeTypeOf('function')
        expect(api.unblockScroll).toBeTypeOf('function')
    })

    it('getScrollTop / getScrollLeft возвращают значения window', () => {
        let api: any

        const Consumer = defineComponent({
            setup() {
                api = inject($APP_API_KEY)
                return () => h('div')
            },
        })

        mount(CApp, {
            slots: {
                default: () => h(Consumer),
            },
        })

        // Меняем значения скролла
        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            writable: true,
            value: 120,
        })

        Object.defineProperty(window, 'scrollX', {
            configurable: true,
            writable: true,
            value: 35,
        })

        expect(api.getScrollTop()).toBe(120)
        expect(api.getScrollLeft()).toBe(35)
    })

    it('blockScroll сохраняет позицию и добавляет класс', async () => {
        let api: any

        const Consumer = defineComponent({
            setup() {
                api = inject($APP_API_KEY)
                return () => h('div')
            },
        })

        // Форсим requestAnimationFrame
        const rafSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((cb: FrameRequestCallback) => {
                cb(0)
                return 1
            })

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            writable: true,
            value: 240,
        })

        Object.defineProperty(window, 'scrollX', {
            configurable: true,
            writable: true,
            value: 15,
        })

        const wrapper = mount(CApp, {
            slots: {
                default: () => h(Consumer),
            },
        })

        api.blockScroll()
        await nextTick()

        expect(rafSpy).toHaveBeenCalled()
        expect(wrapper.classes()).toContain('c-app--block-scroll')

        // Проверяем что позиция записалась в CSS переменные
        expect(wrapper.element.style.getPropertyValue('--c-scroll-top')).toBe('-240px')
        expect(wrapper.element.style.getPropertyValue('--c-scroll-left')).toBe('-15px')
    })

    it('unblockScroll снимает блокировку и восстанавливает scroll', async () => {
        let api: any

        const Consumer = defineComponent({
            setup() {
                api = inject($APP_API_KEY)
                return () => h('div')
            },
        })

        // Форсим requestAnimationFrame
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
            cb(0)
            return 1
        })

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            writable: true,
            value: 200,
        })

        Object.defineProperty(window, 'scrollX', {
            configurable: true,
            writable: true,
            value: 25,
        })

        const wrapper = mount(CApp, {
            slots: {
                default: () => h(Consumer),
            },
        })

        // Блокируем скролл
        api.blockScroll()
        await nextTick()

        expect(wrapper.classes()).toContain('c-app--block-scroll')

        // Разблокируем
        api.unblockScroll()
        await nextTick()

        expect(wrapper.classes()).not.toContain('c-app--block-scroll')

        // CSS переменные должны быть очищены
        expect(wrapper.element.style.getPropertyValue('--c-scroll-top')).toBe('')
        expect(wrapper.element.style.getPropertyValue('--c-scroll-left')).toBe('')

        // Проверяем восстановление позиции
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 200,
            left: 25,
            behavior: 'auto',
        })
    })

    it('unblockScroll без blockScroll восстанавливает scroll в 0', async () => {
        let api: any

        const Consumer = defineComponent({
            setup() {
                api = inject($APP_API_KEY)
                return () => h('div')
            },
        })

        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
            cb(0)
            return 1
        })

        mount(CApp, {
            slots: {
                default: () => h(Consumer),
            },
        })

        api.unblockScroll()
        await nextTick()

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'auto',
        })
    })
})
