import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick,type Reactive, reactive } from 'vue'

import type { InputState } from '../../components'
import { useValidate, type ValidateFn, type ValidateProps, type ValidateResult } from '../use-validate'

type TestProps = ValidateProps & {
    modelValue: any
    readonly?: boolean
    disabled?: boolean
}

function createRule(valid: boolean, message = 'Error'): ValidateFn {
    return () => ({ valid, message })
}

function createAsyncRule(valid: boolean, message = 'Error', delay = 10): ValidateFn {
    return () => new Promise((resolve) => setTimeout(() => resolve({ valid, message }), delay))
}

function mountUseValidate(
    initialProps: TestProps,
    initialState: InputState = { focused: false, isDirty: false },
) {
    let api!: ReturnType<typeof useValidate>

    const props = reactive({ ...initialProps }) as Reactive<TestProps>
    const state = reactive({ ...initialState }) as Reactive<InputState>

    const wrapper = mount(
        defineComponent({
            setup() {
                api = useValidate(props, state)

                return () => h('div')
            },
        }),
    )

    return { wrapper, props, state, api }
}

describe('useValidate', () => {
    it('считает поле валидным, если rules не переданы', async () => {
        const { api } = mountUseValidate({ modelValue: '' })

        expect(api.hasRules.value).toBe(false)
        expect(await api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('возвращает true, если все rules валидны', async () => {
        const { api } = mountUseValidate({
            modelValue: 'John',
            rules: [createRule(true), createRule(true)],
        })

        expect(api.hasRules.value).toBe(true)
        expect(await api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('возвращает false и сохраняет сообщение, если rule невалиден', async () => {
        const { api } = mountUseValidate({
            modelValue: '',
            rules: [createRule(false, 'Required field')],
        })

        expect(await api.validate()).toBe(false)
        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')
    })

    it('останавливается на первой ошибке', async () => {
        const firstRule = vi.fn(() => ({ valid: false, message: 'First error' }))
        const secondRule = vi.fn(() => ({ valid: false, message: 'Second error' }))

        const { api } = mountUseValidate({
            modelValue: '',
            rules: [firstRule, secondRule],
        })

        expect(await api.validate()).toBe(false)
        expect(firstRule).toHaveBeenCalledTimes(1)
        expect(secondRule).not.toHaveBeenCalled()
        expect(api.errors.errorMessage).toBe('First error')
    })

    it('передает в rule актуальное modelValue', async () => {
        const rule = vi.fn((value: string) => ({
            valid: value === 'valid',
            message: 'Invalid value',
        }))

        const { api, props } = mountUseValidate({ modelValue: 'invalid', rules: [rule] })

        expect(await api.validate()).toBe(false)
        expect(rule).toHaveBeenLastCalledWith('invalid')

        props.modelValue = 'valid'

        expect(await api.validate()).toBe(true)
        expect(rule).toHaveBeenLastCalledWith('valid')
        expect(api.errors.hasError).toBe(false)
    })

    it('сбрасывает ошибку через resetValidate', async () => {
        const { api } = mountUseValidate({
            modelValue: '',
            rules: [createRule(false, 'Required field')],
        })

        await api.validate()

        expect(api.errors.hasError).toBe(true)

        api.resetValidate()

        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('очищает ошибку после успешной повторной валидации', async () => {
        const { api, props } = mountUseValidate({
            modelValue: '',
            rules: [(value: string) => ({ valid: !!value, message: 'Required field' })],
        })

        expect(await api.validate()).toBe(false)
        expect(api.errors.hasError).toBe(true)

        props.modelValue = 'John'

        expect(await api.validate()).toBe(true)
        expect(api.errors.hasError).toBe(false)
        expect(api.errors.errorMessage).toBeUndefined()
    })

    it('валидирует при изменении modelValue, если validateOn=input', async () => {
        const { api, props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'input',
            rules: [(value: string) => ({ valid: value.length >= 3, message: 'Минимум 3 символа' })],
        })

        expect(api.errors.hasError).toBe(false)

        props.modelValue = 'ab'
        await nextTick()
        await nextTick()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Минимум 3 символа')

        props.modelValue = 'abcd'
        await nextTick()
        await nextTick()

        expect(api.errors.hasError).toBe(false)
    })

    it('по умолчанию валидирует при изменении modelValue как validateOn=input', async () => {
        const { props } = mountUseValidate({
            modelValue: 'hello',
            rules: [(value: string) => ({ valid: value.length >= 3, message: 'Минимум 3 символа' })],
        })

        props.modelValue = 'hi'
        await nextTick()
        await nextTick()

        expect(props.modelValue).toBe('hi')
    })

    it('валидирует при blur, если focused меняется на false', async () => {
        const { api, state } = mountUseValidate(
            {
                modelValue: '',
                validateOn: 'blur',
                rules: [createRule(false, 'Required field')],
            },
            { focused: true, isDirty: false },
        )

        expect(api.errors.hasError).toBe(false)

        state.focused = false
        await nextTick()
        await nextTick()

        expect(api.errors.hasError).toBe(true)
        expect(api.errors.errorMessage).toBe('Required field')
    })

    it('при validateOn=blur не валидирует truthy modelValue на input-change', async () => {
        const rule = vi.fn((value: string) => ({ valid: value.length >= 3, message: 'Минимум 3 символа' }))

        const { props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'blur',
            rules: [rule],
        })

        props.modelValue = 'ab'
        await nextTick()

        expect(rule).not.toHaveBeenCalled()
    })

    it('при validateOn=blur валидирует empty modelValue на input-change', async () => {
        const rule = vi.fn((value: string) => ({ valid: !!value, message: 'Required field' }))

        const { api, props } = mountUseValidate({
            modelValue: 'abc',
            validateOn: 'blur',
            rules: [rule],
        })

        props.modelValue = ''
        await nextTick()
        await nextTick()

        expect(rule).toHaveBeenCalledTimes(1)
        expect(api.errors.hasError).toBe(true)
    })

    describe('readonly / disabled', () => {
        it('возвращает true и не запускает rules если readonly=true', async () => {
            const rule = vi.fn(() => ({ valid: false, message: 'Error' }))

            const { api, props } = mountUseValidate({
                modelValue: '',
                rules: [rule],
            })

            props.readonly = true

            expect(await api.validate()).toBe(true)
            expect(rule).not.toHaveBeenCalled()
            expect(api.errors.hasError).toBe(false)
        })

        it('возвращает true и не запускает rules если disabled=true', async () => {
            const rule = vi.fn(() => ({ valid: false, message: 'Error' }))

            const { api, props } = mountUseValidate({
                modelValue: '',
                rules: [rule],
            })

            props.disabled = true

            expect(await api.validate()).toBe(true)
            expect(rule).not.toHaveBeenCalled()
            expect(api.errors.hasError).toBe(false)
        })

        it('не запускает watcher при изменении modelValue если readonly=true', async () => {
            const rule = vi.fn((v: string) => ({ valid: !!v, message: 'Required' }))

            const { props } = mountUseValidate({
                modelValue: 'abc',
                readonly: true,
                rules: [rule],
            })

            props.modelValue = ''
            await nextTick()
            await nextTick()

            expect(rule).not.toHaveBeenCalled()
        })
    })

    describe('validating flag', () => {
        it('resetValidate сбрасывает флаг validating', async () => {
            const { api } = mountUseValidate({
                modelValue: '',
                rules: [createAsyncRule(false, 'Error')],
            })

            const p = api.validate()
            expect(api.errors.validating).toBe(true)
            api.resetValidate()
            expect(api.errors.validating).toBe(false)
            await p
        })

        it('validating сбрасывается в false даже если rule бросает исключение', async () => {
            const throwingRule = vi.fn((): ValidateResult => { throw new Error('unexpected') })

            const { api } = mountUseValidate({
                modelValue: '',
                rules: [throwingRule],
            })

            await expect(api.validate()).rejects.toThrow('unexpected')
            expect(api.errors.validating).toBe(false)
        })
    })

    describe('blur watcher', () => {
        it('валидирует при blur независимо от validateOn', async () => {
            const rule = vi.fn(() => ({ valid: false, message: 'Required' }))

            const { state } = mountUseValidate(
                { modelValue: '', rules: [rule] },
                { focused: true, isDirty: false },
            )

            state.focused = false
            await nextTick()
            await nextTick()

            expect(rule).toHaveBeenCalledTimes(1)
        })

        it('не валидирует при переходе focused: false → true', async () => {
            const rule = vi.fn(() => ({ valid: true, message: '' }))

            const { state } = mountUseValidate(
                { modelValue: '', validateOn: 'blur', rules: [rule] },
                { focused: false, isDirty: false },
            )

            state.focused = true
            await nextTick()

            expect(rule).not.toHaveBeenCalled()
        })
    })

    describe('async rules', () => {
        it('поддерживает async rule и возвращает правильный результат', async () => {
            const { api } = mountUseValidate({
                modelValue: '',
                rules: [createAsyncRule(false, 'Async error')],
            })

            expect(api.errors.validating).toBe(false)

            const promise = api.validate()

            expect(api.errors.validating).toBe(true)

            const result = await promise

            expect(result).toBe(false)
            expect(api.errors.validating).toBe(false)
            expect(api.errors.hasError).toBe(true)
            expect(api.errors.errorMessage).toBe('Async error')
        })

        it('async rule — validating=false после успешной валидации', async () => {
            const { api } = mountUseValidate({
                modelValue: 'ok',
                rules: [createAsyncRule(true)],
            })

            expect(await api.validate()).toBe(true)
            expect(api.errors.validating).toBe(false)
            expect(api.errors.hasError).toBe(false)
        })

        it('смешанные sync и async rules — все вызываются последовательно', async () => {
            const calls: string[] = []

            const { api } = mountUseValidate({
                modelValue: 'val',
                rules: [
                    () => { calls.push('sync'); return { valid: true, message: '' } },
                    createAsyncRule(true, '', 5),
                    () => { calls.push('sync2'); return { valid: true, message: '' } },
                ],
            })

            await api.validate()

            expect(calls).toContain('sync')
            expect(calls).toContain('sync2')
        })
    })
})
