import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import {$VUELAND_UI_KEY} from '../../../constants'

import { CTextField } from '../index'

function createWrapper(
    props: any = {},
    slots: any = {},
) {
    return mount(CTextField, {
        props: {
            modelValue: '',
            ...props,
        },
        slots,
    })
}

function createVModelHost({
    initialValue = '',
    props = {},
    slots = {},
    global = {},
}: {
    initialValue?: string | number | null | undefined
    props?: Record<string, any>
    slots?: Record<string, any>
    global?: Record<string, any>
} = {}) {
    return mount(defineComponent({
        setup() {
            const value = ref(initialValue)

            return () => h(
                CTextField as any,
                {
                    modelValue: value.value,
                    'onUpdate:modelValue': (nextValue: string | number | null | undefined) => {
                        value.value = nextValue as string
                    },
                    ...props,
                },
                slots,
            )
        },
    }), {
        global,
    })
}

describe('CTextField', () => {
    it('рендерит root, field и input', () => {
        const wrapper = createWrapper({
            id: 'email',
            label: 'Email',
        })

        expect(wrapper.classes()).toContain('c-input')
        expect(wrapper.find('.c-text-field').exists()).toBe(true)
        expect(wrapper.find('.c-field').exists()).toBe(true)
        expect(wrapper.find('input.c-field-input').exists()).toBe(true)
    })

    it('использует пользовательский id для реального input', () => {
        const wrapper = createWrapper({
            id: 'email',
        })

        expect(wrapper.get('input.c-field-input').attributes('id')).toBe('email')
    })

    it('генерирует id, если id не передан', () => {
        const wrapper = createWrapper()

        expect(wrapper.get('input.c-field-input').attributes('id')).toMatch(/^input-.+/)
    })

    it('прокидывает modelValue в реальный input', () => {
        const wrapper = createWrapper({
            modelValue: 'John',
        })

        expect((wrapper.get('input.c-field-input').element as HTMLInputElement).value).toBe('John')
    })

    it('обновляет внешний v-model при вводе', async () => {
        const wrapper = createVModelHost({
            initialValue: '',
        })

        const input = wrapper.get('input.c-field-input')

        await input.setValue('John')

        expect((input.element as HTMLInputElement).value).toBe('John')
        expect(wrapper.getComponent(CTextField).props('modelValue')).toBe('John')
    })

    it('эмитит update:modelValue при вводе', async () => {
        const wrapper = createWrapper({
            modelValue: '',
        })

        await wrapper.get('input.c-field-input').setValue('John')

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['John'])
    })

    it('прокидывает разрешенные attrs до реального input', () => {
        const wrapper = mount(CTextField, {
            props: {
                modelValue: '',
                id: 'email',
            },
            attrs: {
                type: 'email',
                name: 'email',
                placeholder: 'Введите email',
                autocomplete: 'email',
                required: true,
                'aria-label': 'Email field',
                'data-test-id': 'email-input',
                title: 'не должен попасть в input',
            },
        })

        const input = wrapper.get('input.c-field-input')

        expect(input.attributes('type')).toBe('email')
        expect(input.attributes('name')).toBe('email')
        expect(input.attributes('placeholder')).toBe('Введите email')
        expect(input.attributes('autocomplete')).toBe('email')
        expect(input.attributes('required')).toBeDefined()
        expect(input.attributes('aria-label')).toBe('Email field')
        expect(input.attributes('data-test-id')).toBe('email-input')
        expect(input.attributes('title')).toBeUndefined()
    })

    it('рендерит label и связывает input через aria-labelledby', () => {
        const wrapper = createWrapper({
            id: 'username',
            label: 'Username',
        })

        expect(wrapper.get('.c-field-label').attributes('id')).toBe('username-label')
        expect(wrapper.get('.c-field-label').text()).toBe('Username')
        expect(wrapper.get('input.c-field-input').attributes('aria-labelledby')).toBe('username-label')
    })

    it('рендерит details по умолчанию', () => {
        const wrapper = createWrapper({
            id: 'password',
            details: 'Минимум 8 символов',
        })

        expect(wrapper.get('.c-input__details').attributes('id')).toBe('password-details')
        expect(wrapper.get('.c-text-field__details').text()).toBe('Минимум 8 символов')
        expect(wrapper.get('input.c-field-input').attributes('aria-describedby')).toBe('password-details')
    })

    it('не рендерит details, если noDetails=true', () => {
        const wrapper = createWrapper({
            details: 'Описание',
            noDetails: true,
        })

        expect(wrapper.find('.c-input__details').exists()).toBe(false)
        expect(wrapper.get('input.c-field-input').attributes('aria-describedby')).toBeUndefined()
    })

    it('позволяет переопределить details slot', () => {
        const wrapper = createWrapper(
            {
                details: 'Описание',
            },
            {
                details: ({ details }: { details?: string }) => h(
                    'div',
                    {
                        class: 'test-details',
                    },
                    `custom: ${details}`,
                ),
            },
        )

        expect(wrapper.get('.test-details').text()).toBe('custom: Описание')
        expect(wrapper.find('.c-text-field__details').exists()).toBe(false)
    })

    it('рендерит prepend slot', () => {
        const wrapper = createWrapper({}, {
            prepend: () => h('span', { class: 'test-prepend' }, 'prepend'),
        })

        expect(wrapper.get('.c-field__prepend .test-prepend').text()).toBe('prepend')
    })

    it('рендерит append slot', () => {
        const wrapper = createWrapper({}, {
            append: () => h('span', { class: 'test-append' }, 'append'),
        })

        expect(wrapper.get('.c-field__append .test-append').text()).toBe('append')
    })

    it('ставит disabled-состояние и не фокусирует поле через CInput API', async () => {
        const wrapper = createWrapper({
            disabled: true,
        })

        await wrapper.get('input.c-field-input').trigger('focus')

        expect(wrapper.classes()).toContain('c-input--disabled')
        expect(wrapper.classes()).not.toContain('c-input--focused')
        expect(wrapper.get('input.c-field-input').attributes('aria-disabled')).toBe('true')
    })

    it('ставит readonly-состояние и не фокусирует поле через CInput API', async () => {
        const wrapper = createWrapper({
            readonly: true,
        })

        await wrapper.get('input.c-field-input').trigger('focus')

        expect(wrapper.classes()).toContain('c-input--readonly')
        expect(wrapper.classes()).not.toContain('c-input--focused')
        expect(wrapper.get('input.c-field-input').attributes('aria-readonly')).toBe('true')
    })

    it('clear очищает внешний v-model в undefined', async () => {
        const wrapper = createVModelHost({
            initialValue: 'John',
            props: {
                clearable: true,
            },
        })

        await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
        await nextTick()

        expect(wrapper.getComponent(CTextField).props('modelValue')).toBeUndefined()
    })

    it('показывает ошибку валидации и aria-атрибуты при validateOn=input', async () => {
        const wrapper = createVModelHost({
            initialValue: 'John',
            props: {
                id: 'first-name',
                validateOn: 'input',
                rules: [
                    (value: string) => ({
                        valid: !!value,
                        message: 'Required field',
                    }),
                ],
            },
        })

        const input = wrapper.get('input.c-field-input')

        expect(input.attributes('aria-invalid')).toBeUndefined()

        await input.setValue('')
        await nextTick()

        expect(wrapper.getComponent(CTextField).classes()).toContain('c-input--has-error')
        expect(input.attributes('aria-invalid')).toBe('true')
        expect(input.attributes('aria-describedby')).toBe('first-name-details')
        expect(input.attributes('aria-errormessage')).toBe('first-name-details')
        expect(wrapper.get('.c-text-field__details').text()).toBe('Required field')
    })

    it('убирает ошибку после валидного значения при validateOn=input', async () => {
        const wrapper = createVModelHost({
            initialValue: '',
            props: {
                id: 'nickname',
                validateOn: 'input',
                rules: [
                    (value: string) => ({
                        valid: value.length >= 3,
                        message: 'Минимум 3 символа',
                    }),
                ],
            },
        })

        const input = wrapper.get('input.c-field-input')

        await input.setValue('ab')
        await nextTick()

        expect(wrapper.getComponent(CTextField).classes()).toContain('c-input--has-error')
        expect(wrapper.get('.c-text-field__details').text()).toBe('Минимум 3 символа')

        await input.setValue('abc')
        await nextTick()

        expect(wrapper.getComponent(CTextField).classes()).not.toContain('c-input--has-error')
        expect(wrapper.find('.c-text-field__details').text()).toBe('')
    })

    it('применяет preset-классы к root и details и передает field preset в CField', () => {
        const wrapper = mount(CTextField, {
            props: {
                modelValue: '',
                id: 'email',
                label: 'Email',
                details: 'Описание',
                preset: 'textField',
            },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            textField: {
                                root: ['preset-root'],
                                field: 'preset-field',
                                details: ['preset-details'],
                            },
                        },
                    },
                },
            },
        })

        const field = wrapper.getComponent({ name: 'CField' })

        expect(wrapper.classes()).toContain('preset-root')
        expect(field.props('preset')).toBe('preset-field')
        expect(wrapper.get('.c-input__details').classes()).toContain('preset-details')
    })

    it('применяет error preset при ошибке валидации', async () => {
        const wrapper = createVModelHost({
            initialValue: 'John',
            props: {
                id: 'first-name',
                preset: 'textField',
                validateOn: 'input',
                rules: [
                    (value: string) => ({
                        valid: !!value,
                        message: 'Required field',
                    }),
                ],
            },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            textField: {
                                root: ['preset-root'],
                                field: 'preset-field',
                                details: ['preset-details'],
                                error: {
                                    root: ['preset-error-root'],
                                    field: 'preset-error-field',
                                    details: ['preset-error-details'],
                                },
                            },
                        },
                    },
                },
            },
        })

        await wrapper.get('input.c-field-input').setValue('')
        await nextTick()

        const field = wrapper.getComponent({ name: 'CField' })

        expect(wrapper.getComponent(CTextField).classes()).toContain('preset-error-root')
        expect(field.props('preset')).toBe('preset-error-field')
        expect(wrapper.get('.c-input__details').classes()).toContain('preset-error-details')
    })
})
