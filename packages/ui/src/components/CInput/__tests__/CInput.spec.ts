import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import { $FORM_API_KEY, $VUELAND_UI_KEY } from '../../../constants'
import CInput from '../CInput.vue'

const basePresets = {
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

            readonly: {
                root: ['readonly-root'],
            },
        },
    },
}

function createWrapper({
    props = {},
    attrs = {},
    slots = {},
    presets = basePresets,
    formApi,
}: {
    props?: Record<string, any>
    attrs?: Record<string, any>
    slots?: Record<string, any>
    presets?: Record<string, any>
    formApi?: {
        add: ReturnType<typeof vi.fn>
        remove: ReturnType<typeof vi.fn>
    }
} = {}) {
    const normalizedSlots: Record<string, any> = {
        field: ({
            uid,
            attrs,
            focused,
            disabled,
            readonly,
            clearable,
            preset,
            hasError,
            errorMessage,
            focus,
            blur,
            input,
        }: any) => h('input', {
            ...attrs,
            id: uid,
            class: 'test-field',
            'data-focused': `${focused}`,
            'data-disabled': `${!!disabled}`,
            'data-readonly': `${!!readonly}`,
            'data-clearable': `${!!clearable}`,
            'data-preset': preset,
            'data-has-error': `${hasError}`,
            'data-error-message': errorMessage ?? '',
            onFocus: focus,
            onBlur: blur,
            onInput: (e: InputEvent) => {
                input((e.target as HTMLInputElement).value)
            },
        }),
        ...slots,
    }

    if (
        !slots.details &&
        (
            props.details !== undefined ||
            props.rules !== undefined
        )
    ) {
        normalizedSlots.details = ({ errorMessage, details }: any) => h('span', {
            class: 'test-details',
            key: errorMessage || details,
        }, errorMessage || details)
    }

    return mount(CInput as any, {
        props: {
            modelValue: '',
            ...props,
        },
        attrs,
        slots: normalizedSlots,
        global: {
            provide: {
                [$VUELAND_UI_KEY as symbol]: {
                    presets,
                },
                ...(
                    formApi
                        ? {
                            [$FORM_API_KEY as symbol]: formApi,
                        }
                        : {}
                ),
            },
        },
    })
}

function field(wrapper: any) {
    return wrapper.get('.test-field')
}

describe('CInput', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('render', () => {
        it('рендерит root, field wrapper и field slot', () => {
            const wrapper = createWrapper()

            expect(wrapper.classes()).toContain('c-input')
            expect(wrapper.find('.c-input__field').exists()).toBe(true)
            expect(field(wrapper).exists()).toBe(true)
        })

        it('не рендерит details без details, slot и ошибки', () => {
            const wrapper = createWrapper()

            expect(wrapper.find('.c-input__details').exists()).toBe(false)
        })

        it('рендерит details из props.details', () => {
            const wrapper = createWrapper({
                props: {
                    details: 'Подсказка',
                },
            })

            expect(wrapper.find('.c-input__details').exists()).toBe(true)
            expect(wrapper.find('.test-details').text()).toBe('Подсказка')
        })

        it('рендерит details slot', () => {
            const wrapper = createWrapper({
                slots: {
                    details: ({ details }: any) => h('div', {
                        class: 'custom-details',
                    }, details),
                },
                props: {
                    details: 'Текст',
                },
            })

            expect(wrapper.get('.custom-details').text()).toBe('Текст')
        })

        it('не рендерит details при noDetails=true', () => {
            const wrapper = createWrapper({
                props: {
                    noDetails: true,
                    details: 'Подсказка',
                },
            })

            expect(wrapper.find('.c-input__details').exists()).toBe(false)
        })
    })

    describe('id / uid', () => {
        it('использует props.id как uid без дополнительного префикса', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                    kind: 'input'
                },
            })

            expect(field(wrapper).attributes('id')).toBe('email')
        })

        it('генерирует uid с префиксом input-, если id не передан', () => {
            const wrapper = createWrapper({
                props: { kind: 'input' }
            })

            expect(field(wrapper).attributes('id')).toMatch(/^input-/)
        })
    })

    describe('attrs forwarding', () => {
        it('передаёт разрешённые field attrs, aria-* и data-* в field slot', () => {
            const wrapper = createWrapper({
                attrs: {
                    name: 'email',
                    placeholder: 'Email',
                    autocomplete: 'email',
                    required: true,
                    'aria-label': 'Email field',
                    'data-test': 'field',
                    unknown: 'ignored',
                },
            })

            const input = field(wrapper)

            expect(input.attributes('name')).toBe('email')
            expect(input.attributes('placeholder')).toBe('Email')
            expect(input.attributes('autocomplete')).toBe('email')
            expect(input.attributes('required')).toBeDefined()
            expect(input.attributes('aria-label')).toBe('Email field')
            expect(input.attributes('data-test')).toBe('field')
            expect(input.attributes('unknown')).toBeUndefined()
        })

        it('не передаёт class в field attrs, а применяет его на root', () => {
            const wrapper = createWrapper({
                attrs: {
                    class: 'external-root',
                },
            })

            expect(wrapper.classes()).toContain('external-root')
            expect(field(wrapper).classes()).not.toContain('external-root')
        })

        it('не даёт attrs.id переопределить uid', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'from-props',
                },
                attrs: {
                    id: 'from-attrs',
                },
            })

            expect(field(wrapper).attributes('id')).toBe('from-props')
        })
    })

    describe('aria', () => {
        it('добавляет aria-labelledby при label', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                    label: 'Email',
                },
            })

            expect(field(wrapper).attributes('aria-labelledby')).toBe('email-label')
        })

        it('не добавляет aria-labelledby без label', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                },
            })

            expect(field(wrapper).attributes('aria-labelledby')).toBeUndefined()
        })

        it('добавляет aria-describedby при details', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                    details: 'Введите email',
                },
            })

            expect(field(wrapper).attributes('aria-describedby')).toBe('email-details')
        })

        it('не добавляет aria-describedby при noDetails=true', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                    noDetails: true,
                    details: 'Введите email',
                },
            })

            expect(field(wrapper).attributes('aria-describedby')).toBeUndefined()
        })

        it('добавляет aria-invalid и aria-errormessage при ошибке валидации', async () => {
            const wrapper = createWrapper({
                props: {
                    id: 'email',
                    modelValue: '',
                    rules: [
                        () => ({
                            valid: false,
                            message: 'Ошибка',
                        }),
                    ],
                },
            })

            expect((wrapper.vm as any).validate()).toBe(false)
            await nextTick()

            expect(field(wrapper).attributes('aria-invalid')).toBe('true')
            expect(field(wrapper).attributes('aria-describedby')).toBe('email-details')
            expect(field(wrapper).attributes('aria-errormessage')).toBe('email-details')
            expect(wrapper.get('.test-details').text()).toBe('Ошибка')
        })

        it('не добавляет aria-errormessage при noDetails=true', async () => {
            const wrapper = createWrapper({
                    props: {
                        id: 'email',
                        noDetails: true,
                        modelValue: '',
                        rules: [
                            () => ({
                                valid: false,
                                message: 'Ошибка',
                            }),
                        ],
                    },
                })

            ;(wrapper.vm as any).validate()
            await nextTick()

            expect(field(wrapper).attributes('aria-invalid')).toBe('true')
            expect(field(wrapper).attributes('aria-describedby')).toBeUndefined()
            expect(field(wrapper).attributes('aria-errormessage')).toBeUndefined()
        })

        it('добавляет aria-readonly и aria-disabled', () => {
            const wrapper = createWrapper({
                props: {
                    readonly: true,
                    disabled: true,
                },
            })

            expect(field(wrapper).attributes('aria-readonly')).toBe('true')
            expect(field(wrapper).attributes('aria-disabled')).toBe('true')
        })

        it('добавляет listbox aria-атрибуты при kind=listbox', async () => {
            const wrapper = createWrapper({
                props: {
                    id: 'select',
                    kind: 'listbox',
                },
            })

            expect(field(wrapper).attributes('aria-haspopup')).toBe('listbox')
            expect(field(wrapper).attributes('aria-controls')).toBe('select-menu')
            expect(field(wrapper).attributes('aria-expanded')).toBe('false')

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(field(wrapper).attributes('aria-expanded')).toBe('true')
        })

        it('не добавляет listbox aria-атрибуты для kind=field', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'input',
                    kind: 'field',
                },
            })

            expect(field(wrapper).attributes('aria-haspopup')).toBeUndefined()
            expect(field(wrapper).attributes('aria-controls')).toBeUndefined()
            expect(field(wrapper).attributes('aria-expanded')).toBeUndefined()
        })

        it('позволяет attrs переопределить listbox aria-атрибуты', () => {
            const wrapper = createWrapper({
                props: {
                    id: 'select',
                    kind: 'listbox',
                },
                attrs: {
                    'aria-controls': 'custom-menu',
                    'aria-expanded': 'mixed',
                },
            })

            expect(field(wrapper).attributes('aria-controls')).toBe('custom-menu')
            expect(field(wrapper).attributes('aria-expanded')).toBe('mixed')
        })

        it('позволяет attrs переопределить aria-label', () => {
            const wrapper = createWrapper({
                attrs: {
                    'aria-label': 'Custom label',
                },
            })

            expect(field(wrapper).attributes('aria-label')).toBe('Custom label')
        })
    })

    describe('presets', () => {
        it('применяет root preset на root', () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                },
            })

            expect(wrapper.classes()).toContain('base-root')
        })

        it('применяет details preset на details', () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                    details: 'Подсказка',
                },
            })

            expect(wrapper.get('.c-input__details').classes()).toContain('base-details')
        })

        it('передаёт field preset в field slot и не применяет его как class на .c-input__field', () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                },
            })

            expect(field(wrapper).attributes('data-preset')).toBe('field.base')
            expect(wrapper.get('.c-input__field').classes()).not.toContain('field.base')
        })

        it('заменяет root focused-состоянием, но сохраняет базовый field preset', async () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                },
            })

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(wrapper.classes()).toContain('focused-root')
            expect(wrapper.classes()).not.toContain('base-root')
            expect(field(wrapper).attributes('data-preset')).toBe('field.base')
        })

        it('переопределяет field preset активным error-состоянием', async () => {
            const wrapper = createWrapper({
                    props: {
                        preset: 'input.base',
                        modelValue: '',
                        rules: [
                            () => ({
                                valid: false,
                                message: 'Ошибка',
                            }),
                        ],
                    },
                })

            ;(wrapper.vm as any).validate()
            await nextTick()

            expect(wrapper.classes()).toContain('error-root')
            expect(wrapper.classes()).not.toContain('base-root')
            expect(field(wrapper).attributes('data-preset')).toBe('field.error')
            expect(wrapper.get('.c-input__details').classes()).toContain('error-details')
        })

        it('заменяет root disabled-состоянием и сохраняет базовый field, если disabled.field не задан', () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                    disabled: true,
                },
            })

            expect(wrapper.classes()).toContain('disabled-root')
            expect(wrapper.classes()).not.toContain('base-root')
            expect(field(wrapper).attributes('data-preset')).toBe('field.base')
        })

        it('заменяет root readonly-состоянием и сохраняет базовый field, если readonly.field не задан', () => {
            const wrapper = createWrapper({
                props: {
                    preset: 'input.base',
                    readonly: true,
                },
            })

            expect(wrapper.classes()).toContain('readonly-root')
            expect(wrapper.classes()).not.toContain('base-root')
            expect(field(wrapper).attributes('data-preset')).toBe('field.base')
        })
    })

    describe('state classes', () => {
        it('добавляет default class без ошибки', () => {
            const wrapper = createWrapper()

            expect(wrapper.classes()).toContain('c-input--default')
            expect(wrapper.classes()).not.toContain('c-input--has-error')
        })

        it('добавляет error class при ошибке', async () => {
            const wrapper = createWrapper({
                    props: {
                        modelValue: '',
                        rules: [
                            () => ({
                                valid: false,
                                message: 'Ошибка',
                            }),
                        ],
                    },
                })

            ;(wrapper.vm as any).validate()
            await nextTick()

            expect(wrapper.classes()).toContain('c-input--has-error')
            expect(wrapper.classes()).not.toContain('c-input--default')
        })

        it('добавляет focused class после focus', async () => {
            const wrapper = createWrapper()

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(wrapper.classes()).toContain('c-input--focused')
            expect(field(wrapper).attributes('data-focused')).toBe('true')
        })

        it('добавляет disabled, readonly и clearable classes', () => {
            const wrapper = createWrapper({
                props: {
                    disabled: true,
                    readonly: true,
                    clearable: true,
                },
            })

            expect(wrapper.classes()).toContain('c-input--disabled')
            expect(wrapper.classes()).toContain('c-input--readonly')
            expect(wrapper.classes()).toContain('c-input--clearable')
        })
    })

    describe('events and exposed methods', () => {
        it('focus выставляет focused=true и эмитит focus', async () => {
            const wrapper = createWrapper()

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(wrapper.emitted('focus')).toEqual([[true]])
            expect(field(wrapper).attributes('data-focused')).toBe('true')
        })

        it('blur выставляет focused=false и эмитит blur', async () => {
            const wrapper = createWrapper()

            await field(wrapper).trigger('focus')
            await nextTick()
            await field(wrapper).trigger('blur')
            await nextTick()

            expect(wrapper.emitted('blur')).toEqual([[false]])
            expect(field(wrapper).attributes('data-focused')).toBe('false')
        })

        it('focus не срабатывает при disabled', async () => {
            const wrapper = createWrapper({
                props: {
                    disabled: true,
                },
            })

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(wrapper.emitted('focus')).toBeUndefined()
            expect(field(wrapper).attributes('data-focused')).toBe('false')
        })

        it('focus не срабатывает при readonly', async () => {
            const wrapper = createWrapper({
                props: {
                    readonly: true,
                },
            })

            await field(wrapper).trigger('focus')
            await nextTick()

            expect(wrapper.emitted('focus')).toBeUndefined()
            expect(field(wrapper).attributes('data-focused')).toBe('false')
        })

        it('input эмитит input со значением', async () => {
            const wrapper = createWrapper()

            await field(wrapper).setValue('hello')

            expect(wrapper.emitted('input')).toEqual([['hello']])
        })

        it('expose.validate возвращает false при невалидном значении', async () => {
            const wrapper = createWrapper({
                props: {
                    modelValue: '',
                    rules: [
                        () => ({
                            valid: false,
                            message: 'Ошибка',
                        }),
                    ],
                },
            })

            expect((wrapper.vm as any).validate()).toBe(false)
            await nextTick()

            expect(field(wrapper).attributes('aria-invalid')).toBe('true')
        })

        it('expose.reset сбрасывает ошибку валидации', async () => {
            const wrapper = createWrapper({
                    props: {
                        modelValue: '',
                        rules: [
                            () => ({
                                valid: false,
                                message: 'Ошибка',
                            }),
                        ],
                    },
                })

            ;(wrapper.vm as any).validate()
            await nextTick()

            expect(field(wrapper).attributes('aria-invalid')).toBe('true')

            ;(wrapper.vm as any).reset()
            await nextTick()

            expect(field(wrapper).attributes('aria-invalid')).toBeUndefined()
            expect(field(wrapper).attributes('data-has-error')).toBe('false')
        })
    })

    describe('validation', () => {
        it('показывает ошибку после ручной validate', async () => {
            const wrapper = createWrapper({
                    props: {
                        id: 'name',
                        modelValue: '',
                        rules: [
                            () => ({
                                valid: false,
                                message: 'Обязательное поле',
                            }),
                        ],
                    },
                })

            ;(wrapper.vm as any).validate()
            await nextTick()

            expect(wrapper.get('.test-details').text()).toBe('Обязательное поле')
            expect(field(wrapper).attributes('aria-invalid')).toBe('true')
        })

        it('валидирует на blur при validateOn=blur', async () => {
            const wrapper = createWrapper({
                props: {
                    id: 'name',
                    modelValue: '',
                    validateOn: 'blur',
                    rules: [
                        () => ({
                            valid: false,
                            message: 'Ошибка blur',
                        }),
                    ],
                },
            })

            await nextTick()

            expect(wrapper.find('.c-input__details').exists()).toBe(true)
            expect(field(wrapper).attributes('aria-invalid')).toBe(undefined)
            expect(field(wrapper).attributes('aria-errormessage')).toBe(undefined)

            await field(wrapper).trigger('focus')
            await nextTick()

            await field(wrapper).trigger('blur')
            await nextTick()

            expect(wrapper.find('.c-input__details').exists()).toBe(true)
            expect(field(wrapper).attributes('aria-invalid')).toBe('true')
            expect(field(wrapper).attributes('aria-errormessage')).toBe('name-details')
        })
    })

    describe('form integration', () => {
        it('регистрирует validate в форме при mount и удаляет при unmount', () => {
            const formApi = {
                add: vi.fn(),
                remove: vi.fn(),
            }

            const wrapper = createWrapper({
                formApi,
            })

            expect(formApi.add).toHaveBeenCalledTimes(1)
            expect(formApi.add).toHaveBeenCalledWith(expect.any(Function))

            const validate = formApi.add.mock.calls[0][0]

            wrapper.unmount()

            expect(formApi.remove).toHaveBeenCalledTimes(1)
            expect(formApi.remove).toHaveBeenCalledWith(validate)
        })
    })
})
