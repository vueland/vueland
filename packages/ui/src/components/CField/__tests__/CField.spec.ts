import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { CField } from '../../index'

describe('CField', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('по умолчанию рендерит input', () => {
        const wrapper = mount(CField)

        expect(wrapper.find('input').exists()).toBe(true)
        expect(wrapper.find('textarea').exists()).toBe(false)
        expect(wrapper.classes()).toContain('c-field')
    })

    it('рендерит textarea если передан tag="textarea"', () => {
        const wrapper = mount(CField, {
            props: {
                tag: 'textarea',
            },
        })

        expect(wrapper.find('textarea').exists()).toBe(true)
        expect(wrapper.find('input').exists()).toBe(false)
        expect(wrapper.classes()).toContain('c-field')
    })

    it('передает значение в input через value', async () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: 'hello',
            },
        })

        const input = wrapper.find('input')
        expect((input.element as HTMLInputElement).value).toBe('hello')

        await wrapper.setProps({ modelValue: 'updated' })
        expect((input.element as HTMLInputElement).value).toBe('updated')
    })

    it('передает числовое значение в input через value', () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: 123,
            },
        })

        const input = wrapper.find('input')
        expect((input.element as HTMLInputElement).value).toBe('123')
    })

    it('добавляет класс focused когда focused=true', () => {
        const wrapper = mount(CField, {
            props: {
                focused: true,
            },
        })

        expect(wrapper.classes()).toContain('c-field--focused')
    })

    it('не добавляет класс focused когда focused=false', () => {
        const wrapper = mount(CField, {
            props: {
                focused: false,
            },
        })

        expect(wrapper.classes()).not.toContain('c-field--focused')
    })

    it('добавляет класс filled когда есть value и focused=true', () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: 'text',
                focused: true,
            },
        })

        expect(wrapper.classes()).toContain('c-field--filled')
    })

    it('не добавляет класс filled когда value пустое', () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: '',
                focused: true,
            },
        })

        expect(wrapper.classes()).not.toContain('c-field--filled')
    })

    it('добавляет класс filled когда focused=false, если value есть', () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: 'text',
                focused: false,
            },
        })

        expect(wrapper.classes()).toContain('c-field--filled')
    })

    it('эмитит update:modelValue при вводе в input', async () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: '',
            },
        })

        const input = wrapper.find('input')
        await input.setValue('new value')

        expect(wrapper.emitted('update:modelValue')).toEqual([['new value']])
    })

    it('эмитит update:modelValue при вводе в textarea', async () => {
        const wrapper = mount(CField, {
            props: {
                tag: 'textarea',
                modelValue: '',
            },
        })

        const textarea = wrapper.find('textarea')
        await textarea.setValue('textarea value')

        expect(wrapper.emitted('update:modelValue')).toEqual([['textarea value']])
    })

    it('работает с v-model через родительский компонент', async () => {
        const TestComponent = defineComponent({
            components: { CField },
            setup() {
                const value = ref<string | number | undefined>('start')

                return {
                    value,
                }
            },
            template: `
                <CField v-model="value"/>
            `,
        })

        const wrapper = mount(TestComponent)
        const input = wrapper.find('input')

        expect((input.element as HTMLInputElement).value).toBe('start')

        await input.setValue('changed')

        expect((wrapper.vm as any).value).toBe('changed')
    })

    it('вызывает focus на mounted если focused=true', async () => {
        const focusSpy = vi.spyOn(HTMLInputElement.prototype, 'focus')

        mount(CField, {
            props: {
                focused: true,
            },
        })

        await nextTick()

        expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    it('не вызывает focus на mounted если focused=false', async () => {
        const focusSpy = vi.spyOn(HTMLInputElement.prototype, 'focus')

        mount(CField, {
            props: {
                focused: false,
            },
        })

        await nextTick()

        expect(focusSpy).not.toHaveBeenCalled()
    })

    it('вызывает focus для textarea если focused=true и tag="textarea"', async () => {
        const focusSpy = vi.spyOn(HTMLTextAreaElement.prototype, 'focus')

        mount(CField, {
            props: {
                tag: 'textarea',
                focused: true,
            },
        })

        await nextTick()

        expect(focusSpy).toHaveBeenCalledTimes(1)
    })

    it('обновляет классы при изменении props', async () => {
        const wrapper = mount(CField, {
            props: {
                modelValue: '',
                focused: false,
            },
        })

        expect(wrapper.classes()).not.toContain('c-field--focused')
        expect(wrapper.classes()).not.toContain('c-field--filled')

        await wrapper.setProps({
            modelValue: 'value',
            focused: true,
        })

        expect(wrapper.classes()).toContain('c-field--focused')
        expect(wrapper.classes()).toContain('c-field--filled')
    })
})
