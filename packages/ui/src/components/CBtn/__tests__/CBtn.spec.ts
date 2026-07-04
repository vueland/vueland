import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'

import { CBtn } from '@/components'
import { $VUELAND_UI_KEY } from '@/constants'

// Набор с состояниями взаимодействия: у каждого — свой класс root
const buttonSet = {
    base: {
        root: ['base-root'],
        label: ['base-label'],
        loader: ['base-loader'],
    },
    focused: { root: ['focused-root'] },
    active: { root: ['active-root'] },
    loading: { root: ['loading-root'] },
    disabled: { root: ['disabled-root'] },
}

function mountWithPreset(props: Record<string, any> = {}) {
    return mount(CBtn, {
        props: {
            preset: 'action',
            ...props,
        },
        global: { provide: { [$VUELAND_UI_KEY as symbol]: { presets: { action: buttonSet } } } },
    })
}

describe('CBtn', () => {
    it('маунтит дефолтный компонент', () => {
        const wrapper = mount(CBtn, { slots: { default: 'Hello' } })

        expect(wrapper.text()).toContain('Hello')
        expect(wrapper.classes()).toContain('c-btn--flat')
    })

    it('устанавливает props.variant = "outlined"', () => {
        const wrapper = mount(CBtn, {
            props: { variant: 'outlined' },
            slots: { default: 'Hello' },
        })

        expect(wrapper.text()).toContain('Hello')
        expect(wrapper.classes()).toContain('c-btn--outlined')
    })

    it('устанавливает props.block', () => {
        const wrapper = mount(CBtn, { props: { block: true } })

        expect(wrapper.classes()).toContain('c-btn--block')
    })

    it('по умолчанию type="button", атрибут переопределяется снаружи', () => {
        const plain = mount(CBtn)
        const submit = mount(CBtn, { attrs: { type: 'submit' } })

        expect(plain.attributes('type')).toBe('button')
        expect(submit.attributes('type')).toBe('submit')
    })

    // ─── color ────────────────────────────────────────────────────────────────

    it('color у flat вешает bg-утилиту: палитра и сырой цвет', () => {
        const palette = mount(CBtn, { props: { color: 'red-lighten-2' } })
        const arbitrary = mount(CBtn, { props: { color: '#fa5a5a' } })

        expect(palette.classes()).toContain('bg-red-lighten-2')
        expect(arbitrary.classes()).toContain('bg-[#fa5a5a]')
    })

    it('color у outlined вешает text-утилиту: палитра и сырой цвет', () => {
        const palette = mount(CBtn, {
            props: {
                variant: 'outlined',
                color: 'red-lighten-2',
            },
        })
        const arbitrary = mount(CBtn, {
            props: {
                variant: 'outlined',
                color: '#fa5a5a',
            },
        })

        expect(palette.classes()).toContain('text-red-lighten-2')
        expect(arbitrary.classes()).toContain('color-[#fa5a5a]')
    })

    it('без color цветовых утилит нет', () => {
        const wrapper = mount(CBtn)

        expect(wrapper.classes().some((cls) => cls.startsWith('bg-') || cls.startsWith('text-'))).toBe(false)
    })

    it('устанавливает атрибут disabled', () => {
        const wrapper = mount(CBtn, { props: { disabled: true } })

        expect(wrapper.element.attributes.disabled).toBeTruthy()
    })

    // ─── loading ──────────────────────────────────────────────────────────────

    it('loading: показывает лоадер, прячет лейбл и ставит aria-busy', () => {
        const wrapper = mount(CBtn, {
            props: { loading: true },
            slots: { default: 'Hello' },
        })

        expect(wrapper.find('.c-btn__loader').exists()).toBe(true)
        expect(wrapper.find('.c-btn-progress').exists()).toBe(true)
        expect(wrapper.find('.c-btn__label').classes()).toContain('c-btn__label--hidden')
        expect(wrapper.classes()).toContain('c-btn--loading')
        expect(wrapper.attributes('aria-busy')).toBe('true')
    })

    it('loading: не эмитит click', async () => {
        const wrapper = mount(CBtn, { props: { loading: true } })

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('без loading: эмитит click и не рендерит лоадер', async () => {
        const wrapper = mount(CBtn)

        await wrapper.trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
        expect(wrapper.find('.c-btn__loader').exists()).toBe(false)
    })

    it('loading: слот loader заменяет дефолтный спиннер', () => {
        const wrapper = mount(CBtn, {
            props: { loading: true },
            slots: { loader: '<span class="my-loader">...</span>' },
        })

        expect(wrapper.find('.my-loader').exists()).toBe(true)
        expect(wrapper.find('.c-btn__spinner').exists()).toBe(false)
    })

    // ─── состояния пресета ────────────────────────────────────────────────────

    it('пресет: base-зоны в спокойном состоянии', () => {
        const wrapper = mountWithPreset()

        expect(wrapper.classes()).toContain('base-root')
        expect(wrapper.find('.c-btn__label').classes()).toContain('base-label')
    })

    it('пресет: focus/blur переключают состояние focused', async () => {
        const wrapper = mountWithPreset()

        await wrapper.trigger('focus')

        expect(wrapper.classes()).toContain('focused-root')

        await wrapper.trigger('blur')

        expect(wrapper.classes()).toContain('base-root')
    })

    it('пресет: pointerdown включает active, active приоритетнее focused', async () => {
        const wrapper = mountWithPreset()

        await wrapper.trigger('focus')
        await wrapper.trigger('pointerdown')

        expect(wrapper.classes()).toContain('active-root')

        await wrapper.trigger('pointerup')

        expect(wrapper.classes()).toContain('focused-root')
    })

    it('пресет: Enter/пробел включают active с клавиатуры', async () => {
        const wrapper = mountWithPreset()

        await wrapper.trigger('keydown', { key: 'Enter' })

        expect(wrapper.classes()).toContain('active-root')

        await wrapper.trigger('keyup', { key: 'Enter' })

        expect(wrapper.classes()).toContain('base-root')
    })

    it('пресет: loading перекрывает focused и active', async () => {
        const wrapper = mountWithPreset({ loading: true })

        await wrapper.trigger('focus')
        await wrapper.trigger('pointerdown')

        expect(wrapper.classes()).toContain('loading-root')
        expect(wrapper.find('.c-btn__loader').classes()).toContain('base-loader')
    })

    it('пресет: disabled приоритетнее loading', () => {
        const wrapper = mountWithPreset({
            disabled: true,
            loading: true,
        })

        expect(wrapper.classes()).toContain('disabled-root')
    })
})
