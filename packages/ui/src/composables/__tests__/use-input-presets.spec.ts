import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, type Reactive,reactive } from 'vue'

import type { CInputProps, InputState } from '../../components'
import { $VUELAND_UI_KEY } from '../../constants'
import { useInputPresets } from '../use-input-presets'
import type { ValidateState } from '../use-validate'

type TestInputProps = CInputProps & {
    modelValue?: any
}

function mountUseInputPresets({
    props: initialProps,
    state: initialState,
    errors: initialErrors,
    presets = {},
}: {
    props?: Partial<TestInputProps>
    state?: Partial<InputState>
    errors?: Partial<ValidateState>
    presets?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useInputPresets>

    const props = reactive({
        modelValue: '',
        ...initialProps,
    }) as Reactive<TestInputProps>

    const state = reactive({
        focused: false,
        isDirty: false,
        ...initialState,
    }) as Reactive<InputState>

    const errors = reactive({
        hasError: false,
        errorMessage: undefined,
        ...initialErrors,
    }) as Reactive<ValidateState>

    const corePresets = reactive(presets)

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useInputPresets({
                    props,
                    state,
                    errors,
                })

                return () => h('div')
            },
        }),
        {
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: corePresets,
                    },
                },
            },
        },
    )

    return {
        wrapper,
        props,
        state,
        errors,
        result,
        corePresets,
    }
}

describe('useInputPresets', () => {
    it('возвращает пустые значения, если preset не передан', () => {
        const { result } = mountUseInputPresets({
            presets: {
                input: {
                    base: {
                        root: ['root'],
                        label: ['label'],
                        details: ['details'],
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: [],
            field: undefined,
            details: [],
        })
    })

    it('возвращает root и details, field — сгенерированный ключ', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        root: ['root'],
                        label: ['label'],
                        details: ['details'],
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['root'])
        expect(result.value.details).toEqual(['details'])
        expect(result.value.field).toBe('__field.input.base')
    })

    it('регистрирует сгенерированный CFieldPreset в core.presets', () => {
        const { corePresets } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        root: ['root'],
                        label: ['label'],
                        input: ['input'],
                        focused: { label: ['focused-label'] },
                        filled: { label: ['filled-label'] },
                        error: { root: ['text-red'] },
                    },
                },
            },
        })

        const fieldPreset = corePresets.__field?.input?.base
        expect(fieldPreset).toBeDefined()
        expect(fieldPreset.label).toEqual(['label'])
        expect(fieldPreset.input).toEqual(['input'])
        expect(fieldPreset.focused?.label).toEqual(['focused-label'])
        expect(fieldPreset.filled?.label).toEqual(['filled-label'])
        expect(fieldPreset.error?.input).toBeUndefined()
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'forms.text.primary' },
            presets: {
                forms: {
                    text: {
                        primary: {
                            root: ['primary-root'],
                            label: ['primary-label'],
                            details: ['primary-details'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['primary-root'])
        expect(result.value.details).toEqual(['primary-details'])
        expect(result.value.field).toBe('__field.forms.text.primary')
    })

    it('заменяет root активным focused состоянием', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            state: { focused: true },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['focused-root'])
    })

    it('не применяет focused, если поле disabled', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base', disabled: true },
            state: { focused: true },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        disabled: { root: ['disabled-root'] },
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['disabled-root'])
    })

    it('не применяет focused, если поле readonly', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base', readonly: true },
            state: { focused: true },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        readonly: { root: ['readonly-root'] },
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['readonly-root'])
    })

    it('возвращает error root и details при ошибке с сообщением', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            errors: { hasError: true, errorMessage: 'Required' },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        details: ['base-details'],
                        error: {
                            root: ['error-root'],
                            details: ['error-details'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.details).toEqual(['error-details'])
    })

    it('для details применяет error.details только если есть errorMessage', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            errors: { hasError: true, errorMessage: undefined },
            presets: {
                input: {
                    base: {
                        details: ['base-details'],
                        error: { details: ['error-details'] },
                    },
                },
            },
        })

        expect(result.value.details).toEqual(['base-details'])
    })

    it('соблюдает приоритет: disabled > readonly > error > focused', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base', disabled: true, readonly: true },
            state: { focused: true },
            errors: { hasError: true, errorMessage: 'Required' },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        disabled: { root: ['disabled-root'] },
                        readonly: { root: ['readonly-root'] },
                        error: { root: ['error-root'] },
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['disabled-root'])
    })

    it('соблюдает приоритет: error важнее focused', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            state: { focused: true },
            errors: { hasError: true, errorMessage: 'Required' },
            presets: {
                input: {
                    base: {
                        error: { root: ['error-root'] },
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['error-root'])
    })

    it('реактивно обновляет preset при изменении состояния', () => {
        const { result, state, errors, props } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        details: ['base-details'],
                        focused: { root: ['focused-root'] },
                        error: { root: ['error-root'], details: ['error-details'] },
                        disabled: { root: ['disabled-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['base-root'])
        expect(result.value.details).toEqual(['base-details'])

        state.focused = true
        expect(result.value.root).toEqual(['focused-root'])

        errors.hasError = true
        errors.errorMessage = 'Required'
        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.details).toEqual(['error-details'])

        props.disabled = true
        expect(result.value.root).toEqual(['disabled-root'])
    })

    it('сгенерированный field preset включает все состояния для CField', () => {
        const { corePresets } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        label: ['base-label'],
                        input: ['base-input'],
                        focused: { label: ['focused-label'], input: ['focused-input'] },
                        filled: { label: ['filled-label'] },
                        error: { label: ['error-label'] },
                        disabled: { input: ['disabled-input'] },
                        readonly: { label: ['readonly-label'] },
                        prepended: { label: ['prepended-label'] },
                        appended: { label: ['appended-label'] },
                    },
                },
            },
        })

        const fp = corePresets.__field?.input?.base
        expect(fp.label).toEqual(['base-label'])
        expect(fp.input).toEqual(['base-input'])
        expect(fp.focused?.label).toEqual(['focused-label'])
        expect(fp.focused?.input).toEqual(['focused-input'])
        expect(fp.filled?.label).toEqual(['filled-label'])
        expect(fp.error?.label).toEqual(['error-label'])
        expect(fp.disabled?.input).toEqual(['disabled-input'])
        expect(fp.readonly?.label).toEqual(['readonly-label'])
        expect(fp.prepended?.label).toEqual(['prepended-label'])
        expect(fp.appended?.label).toEqual(['appended-label'])
    })

    it('применяет error.focused.root при error + focused', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'input.base' },
            state: { focused: true },
            errors: { hasError: true, errorMessage: 'Required' },
            presets: {
                input: {
                    base: {
                        error: {
                            root: ['error-root'],
                            focused: {
                                root: ['error-focused-root'],
                            },
                        },
                        focused: { root: ['focused-root'] },
                    },
                },
            },
        })

        expect(result.value.root).toContain('error-root')
        expect(result.value.root).toContain('error-focused-root')
        expect(result.value.root).not.toContain('focused-root')
    })

    it('сохраняет compound sub-состояния в сгенерированном CFieldPreset', () => {
        const { corePresets } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        error: {
                            label: ['error-label'],
                            focused: { label: ['error-focused-label'] },
                            filled: { label: ['error-filled-label'] },
                        },
                        disabled: {
                            input: ['disabled-input'],
                            focused: { input: ['disabled-focused-input'] },
                        },
                    },
                },
            },
        })

        const fp = corePresets.__field?.input?.base
        expect(fp.error?.label).toEqual(['error-label'])
        expect(fp.error?.focused?.label).toEqual(['error-focused-label'])
        expect(fp.error?.filled?.label).toEqual(['error-filled-label'])
        expect(fp.disabled?.input).toEqual(['disabled-input'])
        expect(fp.disabled?.focused?.input).toEqual(['disabled-focused-input'])
    })

    it('не включает root из CInputPreset в сгенерированный CFieldPreset', () => {
        const { corePresets } = mountUseInputPresets({
            props: { preset: 'input.base' },
            presets: {
                input: {
                    base: {
                        root: ['text-blue'],
                        error: { root: ['text-red'] },
                    },
                },
            },
        })

        const fp = corePresets.__field?.input?.base
        expect(fp.root).toBeUndefined()
        expect(fp.error?.root).toBeUndefined()
    })
})
