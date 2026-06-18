import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, reactive, type Reactive, nextTick } from 'vue'

import { useValidate, type ValidateFn, type ValidateProps } from '../use-validate'
import type { InputState } from '../../components'

type TestProps = ValidateProps & {
    modelValue: any
}

function createRule(valid: boolean, message = 'Error'): ValidateFn {
    return () => ({
        valid,
        message,
    })
}

function mountUseValidate(
    initialProps: TestProps,
    initialState: InputState = {
        focused: false,
        isDirty: false,
    },
) {
    let api!: ReturnType<typeof useValidate>

    const props = reactive({
        ...initialProps,
    }) as Reactive<TestProps>

    const state = reactive({
        ...initialState,
    }) as Reactive<InputState>

    const wrapper = mount(
        defineComponent({
            setup() {
                api = useValidate(props, state)

                return () => h('div')
            },
        }),
    )

    return {
        wrapper,
        props,
        state,
        api,
    }
}

describe('useValidate', () => {
    it('считает поле валидным, если rules не переданы', () => {
        const { api } = mountUseValidate({
            modelValue: '',
        })

        expect(api.hasRules.value).toBe(false)
        expect(api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('возвращает true, если все rules валидны', () => {
        const { api } = mountUseValidate({
            modelValue: 'John',
            rules: [createRule(true), createRule(true)],
        })

        expect(api.hasRules.value).toBe(true)
        expect(api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('возвращает false и сохраняет сообщение, если rule невалиден', () => {
        const { api } = mountUseValidate({
            modelValue: '',
            rules: [createRule(false, 'Required field')],
        })

        expect(api.validate()).toBe(false)
        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')
    })

    it('останавливается на первой ошибке', () => {
        const firstRule = vi.fn(() => ({
            valid: false,
            message: 'First error',
        }))

        const secondRule = vi.fn(() => ({
            valid: false,
            message: 'Second error',
        }))

        const { api } = mountUseValidate({
            modelValue: '',
            rules: [firstRule, secondRule],
        })

        expect(api.validate()).toBe(false)
        expect(firstRule).toHaveBeenCalledTimes(1)
        expect(secondRule).not.toHaveBeenCalled()
        expect(api.errors.errorMessage).toBe('First error')
    })

    it('передает в rule актуальное modelValue', () => {
        const rule = vi.fn((value: string) => ({
            valid: value === 'valid',
            message: 'Invalid value',
        }))

        const { api, props } = mountUseValidate({
            modelValue: 'invalid',
            rules: [rule],
        })

        expect(api.validate()).toBe(false)
        expect(rule).toHaveBeenLastCalledWith('invalid')

        props.modelValue = 'valid'

        expect(api.validate()).toBe(true)
        expect(rule).toHaveBeenLastCalledWith('valid')
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('сбрасывает ошибку через resetValidate', () => {
        const { api } = mountUseValidate({
            modelValue: '',
            rules: [createRule(false, 'Required field')],
        })

        api.validate()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')

        api.resetValidate()

        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBe('')
    })

    it('валидирует при изменении modelValue, если validateOn=input', async () => {
        const { api, props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'input',
            rules: [
                (value: string) => ({
                    valid: value.length >= 3,
                    message: 'Минимум 3 символа',
                }),
            ],
        })

        expect(api.errors.hasError).toBe(false)

        props.modelValue = 'ab'
        await nextTick()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Минимум 3 символа')

        props.modelValue = 'abcd'
        await nextTick()

        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('по умолчанию валидирует при изменении modelValue как validateOn=input', async () => {
        const { api, props } = mountUseValidate({
            modelValue: 'hello',
            rules: [
                (value: string) => ({
                    valid: value.length >= 3,
                    message: 'Минимум 3 символа',
                }),
            ],
        })

        props.modelValue = 'hi'
        await nextTick()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Минимум 3 символа')
    })

    it('валидирует при blur, если focused меняется на false', async () => {
        const { api, state } = mountUseValidate(
            {
                modelValue: '',
                validateOn: 'blur',
                rules: [createRule(false, 'Required field')],
            },
            {
                focused: true,
                isDirty: false,
            },
        )

        expect(api.errors.hasError).toBe(false)

        state.focused = false
        await nextTick()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')
    })

    it('при validateOn=blur не валидирует truthy modelValue на input-change', async () => {
        const rule = vi.fn((value: string) => ({
            valid: value.length >= 3,
            message: 'Минимум 3 символа',
        }))

        const { api, props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'blur',
            rules: [rule],
        })

        props.modelValue = 'ab'
        await nextTick()

        expect(rule).not.toHaveBeenCalled()
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('при validateOn=blur валидирует empty modelValue на input-change', async () => {
        const rule = vi.fn((value: string) => ({
            valid: !!value,
            message: 'Required field',
        }))

        const { api, props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'blur',
            rules: [rule],
        })

        props.modelValue = ''
        await nextTick()

        expect(rule).toHaveBeenCalledTimes(1)
        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')
    })

    it('очищает ошибку после успешной повторной валидации', () => {
        const { api, props } = mountUseValidate({
            modelValue: '',
            rules: [
                (value: string) => ({
                    valid: !!value,
                    message: 'Required field',
                }),
            ],
        })

        expect(api.validate()).toBe(false)
        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')

        props.modelValue = 'John'

        expect(api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })
})
