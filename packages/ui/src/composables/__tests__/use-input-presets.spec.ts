import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, reactive, type Reactive } from 'vue'

import { $VUELAND_UI_KEY } from '../../constants'
import type { CInputProps, InputState } from '../../components'
import type { ValidateState } from '../use-validate'
import { useInputPresets } from '../use-input-presets'

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
                        presets,
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
    }
}

describe('useInputPresets', () => {
    it('возвращает пустые значения, если preset не передан', () => {
        const { result } = mountUseInputPresets({
            presets: {
                input: {
                    base: {
                        root: ['root'],
                        field: 'field.base',
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

    it('возвращает базовые значения root, field и details', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            presets: {
                input: {
                    base: {
                        root: ['root'],
                        field: 'field.base',
                        details: ['details'],
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root'],
            field: 'field.base',
            details: ['details'],
        })
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'forms.text.primary',
            },
            presets: {
                forms: {
                    text: {
                        primary: {
                            root: ['primary-root'],
                            field: 'field.primary',
                            details: ['primary-details'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['primary-root'],
            field: 'field.primary',
            details: ['primary-details'],
        })
    })

    it('заменяет root активным focused состоянием', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        focused: {
                            root: ['focused-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['focused-root'])
        expect(result.value.root).not.toContain('base-root')
    })

    it('оставляет базовый field, если focused не задаёт свой field', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        focused: {
                            root: ['focused-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.field).toBe('field.base')
    })

    it('переопределяет field, если focused задаёт свой field', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        field: 'field.base',
                        focused: {
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.field).toBe('field.focused')
    })

    it('не применяет focused, если поле disabled', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                disabled: true,
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        disabled: {
                            root: ['disabled-root'],
                            field: 'field.disabled',
                        },
                        focused: {
                            root: ['focused-root'],
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.field).toBe('field.disabled')
    })

    it('для disabled field fallback-ится на base, если disabled.field не задан', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                disabled: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        disabled: {
                            root: ['disabled-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.field).toBe('field.base')
    })

    it('не применяет focused, если поле readonly', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                readonly: true,
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        readonly: {
                            root: ['readonly-root'],
                            field: 'field.readonly',
                        },
                        focused: {
                            root: ['focused-root'],
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['readonly-root'])
        expect(result.value.field).toBe('field.readonly')
    })

    it('для readonly field fallback-ится на base, если readonly.field не задан', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                readonly: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        readonly: {
                            root: ['readonly-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['readonly-root'])
        expect(result.value.field).toBe('field.base')
    })

    it('возвращает error root, field и details при ошибке с сообщением', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            errors: {
                hasError: true,
                errorMessage: 'Required field',
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        details: ['base-details'],
                        error: {
                            root: ['error-root'],
                            field: 'field.error',
                            details: ['error-details'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.field).toBe('field.error')
        expect(result.value.details).toEqual(['error-details'])
    })

    it('для error field fallback-ится на base, если error.field не задан', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            errors: {
                hasError: true,
                errorMessage: 'Required field',
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        error: {
                            root: ['error-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.field).toBe('field.base')
    })

    it('для details применяет error.details только если есть errorMessage', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            errors: {
                hasError: true,
                errorMessage: undefined,
            },
            presets: {
                input: {
                    base: {
                        details: ['base-details'],
                        error: {
                            details: ['error-details'],
                        },
                    },
                },
            },
        })

        expect(result.value.details).toEqual(['base-details'])
    })

    it('соблюдает приоритет: disabled важнее readonly, error и focused', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                disabled: true,
                readonly: true,
            },
            state: {
                focused: true,
            },
            errors: {
                hasError: true,
                errorMessage: 'Required field',
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        disabled: {
                            root: ['disabled-root'],
                            field: 'field.disabled',
                        },
                        readonly: {
                            root: ['readonly-root'],
                            field: 'field.readonly',
                        },
                        error: {
                            root: ['error-root'],
                            field: 'field.error',
                        },
                        focused: {
                            root: ['focused-root'],
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.field).toBe('field.disabled')
    })

    it('соблюдает приоритет: readonly важнее error и focused', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
                readonly: true,
            },
            state: {
                focused: true,
            },
            errors: {
                hasError: true,
                errorMessage: 'Required field',
            },
            presets: {
                input: {
                    base: {
                        field: 'field.base',
                        readonly: {
                            root: ['readonly-root'],
                            field: 'field.readonly',
                        },
                        error: {
                            root: ['error-root'],
                            field: 'field.error',
                        },
                        focused: {
                            root: ['focused-root'],
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['readonly-root'])
        expect(result.value.field).toBe('field.readonly')
    })

    it('соблюдает приоритет: error важнее focused', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            state: {
                focused: true,
            },
            errors: {
                hasError: true,
                errorMessage: 'Required field',
            },
            presets: {
                input: {
                    base: {
                        field: 'field.base',
                        error: {
                            root: ['error-root'],
                            field: 'field.error',
                        },
                        focused: {
                            root: ['focused-root'],
                            field: 'field.focused',
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.field).toBe('field.error')
    })

    it('реактивно обновляет preset при изменении состояния', () => {
        const { result, state, errors, props } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        field: 'field.base',
                        details: ['base-details'],
                        focused: {
                            root: ['focused-root'],
                        },
                        error: {
                            root: ['error-root'],
                            field: 'field.error',
                            details: ['error-details'],
                        },
                        disabled: {
                            root: ['disabled-root'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['base-root'],
            field: 'field.base',
            details: ['base-details'],
        })

        state.focused = true

        expect(result.value).toEqual({
            root: ['focused-root'],
            field: 'field.base',
            details: ['base-details'],
        })

        errors.hasError = true
        errors.errorMessage = 'Required field'

        expect(result.value).toEqual({
            root: ['error-root'],
            field: 'field.error',
            details: ['error-details'],
        })

        props.disabled = true

        expect(result.value).toEqual({
            root: ['disabled-root'],
            field: 'field.base',
            details: ['error-details'],
        })
    })

    it('возвращает undefined для field, если field не задан ни в base, ни в state', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'input.base',
            },
            state: {
                focused: true,
            },
            presets: {
                input: {
                    base: {
                        root: ['base-root'],
                        focused: {
                            root: ['focused-root'],
                        },
                    },
                },
            },
        })

        expect(result.value.field).toBeUndefined()
    })
})
