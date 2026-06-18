import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, reactive, type Reactive } from 'vue'

import type { CFieldProps } from '../../components/CField/CField'
import type { CFieldSlots } from '../../components/CField/CField'
import { $VUELAND_UI_KEY } from '../../constants'
import { useFieldPresets } from '../use-field-presets'

type TestFieldProps = CFieldProps

function mountUseFieldPresets({
    props: initialProps,
    slots: initialSlots,
    attrs: initialAttrs,
    presets = {},
}: {
    props?: Partial<TestFieldProps>
    slots?: Partial<CFieldSlots>
    attrs?: Record<string, any>
    presets?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useFieldPresets>

    const props = reactive({
        preset: undefined,
        filled: false,
        focused: false,
        error: false,
        ...initialProps,
    }) as Reactive<TestFieldProps>

    const attrs = reactive({
        ...initialAttrs,
    }) as Record<string, any>

    const slots = {
        ...initialSlots,
    } as CFieldSlots

    const wrapper = mount(defineComponent({
        setup() {
            result = useFieldPresets({
                props,
                slots,
                attrs,
            })

            return () => h('div')
        },
    }), {
        global: {
            provide: {
                [$VUELAND_UI_KEY as symbol]: {
                    presets,
                },
            },
        },
    })

    return {
        wrapper,
        props,
        slots,
        attrs,
        result,
    }
}

describe('useFieldPresets', () => {
    it('возвращает пустые значения, если preset не передан', () => {
        const { result } = mountUseFieldPresets({
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: [],
            input: [],
            label: [],
            prepend: [],
            append: [],
        })
    })

    it('возвращает базовые классы FieldPreset', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root'],
            input: ['input'],
            label: ['label'],
            prepend: ['prepend'],
            append: ['append'],
        })
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'fields.text.primary',
            },
            presets: {
                fields: {
                    text: {
                        primary: {
                            root: ['primary-root'],
                            input: ['primary-input'],
                            label: ['primary-label'],
                            prepend: ['primary-prepend'],
                            append: ['primary-append'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['primary-root'],
            input: ['primary-input'],
            label: ['primary-label'],
            prepend: ['primary-prepend'],
            append: ['primary-append'],
        })
    })

    it('сохраняет base-зоны и добавляет filled-зоны', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                filled: true,
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],
                        filled: {
                            root: ['filled-root'],
                            input: ['filled-input'],
                            label: ['filled-label'],
                            prepend: ['filled-prepend'],
                            append: ['filled-append'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'filled-root'],
            input: ['input', 'filled-input'],
            label: ['label', 'filled-label'],
            prepend: ['prepend', 'filled-prepend'],
            append: ['append', 'filled-append'],
        })
    })

    it('сохраняет base-зоны и добавляет prepended-зоны, если есть prepend slot', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            slots: {
                prepend: () => h('div'),
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],
                        prepended: {
                            root: ['prepended-root'],
                            input: ['prepended-input'],
                            label: ['prepended-label'],
                            prepend: ['prepended-prepend'],
                            append: ['prepended-append'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'prepended-root'],
            input: ['input', 'prepended-input'],
            label: ['label', 'prepended-label'],
            prepend: ['prepend', 'prepended-prepend'],
            append: ['append', 'prepended-append'],
        })
    })

    it('сохраняет base-зоны и добавляет appended-зоны, если есть append slot', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            slots: {
                append: () => h('div'),
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],
                        appended: {
                            root: ['appended-root'],
                            input: ['appended-input'],
                            label: ['appended-label'],
                            prepend: ['appended-prepend'],
                            append: ['appended-append'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'appended-root'],
            input: ['input', 'appended-input'],
            label: ['label', 'appended-label'],
            prepend: ['prepend', 'appended-prepend'],
            append: ['append', 'appended-append'],
        })
    })

    it('добавляет focused-зоны после filled/prepended/appended', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                filled: true,
                focused: true,
            },
            slots: {
                prepend: () => h('div'),
                append: () => h('div'),
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        prepend: ['prepend'],
                        append: ['append'],

                        filled: {
                            root: ['filled-root'],
                            input: ['filled-input'],
                            label: ['filled-label'],
                            prepend: ['filled-prepend'],
                            append: ['filled-append'],
                        },

                        prepended: {
                            root: ['prepended-root'],
                            input: ['prepended-input'],
                            label: ['prepended-label'],
                            prepend: ['prepended-prepend'],
                            append: ['prepended-append'],
                        },

                        appended: {
                            root: ['appended-root'],
                            input: ['appended-input'],
                            label: ['appended-label'],
                            prepend: ['appended-prepend'],
                            append: ['appended-append'],
                        },

                        focused: {
                            root: ['focused-root'],
                            input: ['focused-input'],
                            label: ['focused-label'],
                            prepend: ['focused-prepend'],
                            append: ['focused-append'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'filled-root', 'prepended-root', 'appended-root', 'focused-root'],
            input: ['input', 'filled-input', 'prepended-input', 'appended-input', 'focused-input'],
            label: ['label', 'filled-label', 'prepended-label', 'appended-label', 'focused-label'],
            prepend: ['prepend', 'filled-prepend', 'prepended-prepend', 'appended-prepend', 'focused-prepend'],
            append: ['append', 'filled-append', 'prepended-append', 'appended-append', 'focused-append'],
        })
    })

    it('добавляет readonly-зоны, если attrs.readonly передан', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            attrs: {
                readonly: true,
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        readonly: {
                            root: ['readonly-root'],
                            input: ['readonly-input'],
                            label: ['readonly-label'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['root', 'readonly-root'])
        expect(result.value.input).toEqual(['input', 'readonly-input'])
        expect(result.value.label).toEqual(['label', 'readonly-label'])
    })

    it('добавляет disabled-зоны, если attrs.disabled передан', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            attrs: {
                disabled: true,
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],
                        disabled: {
                            root: ['disabled-root'],
                            input: ['disabled-input'],
                            label: ['disabled-label'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['root', 'disabled-root'])
        expect(result.value.input).toEqual(['input', 'disabled-input'])
        expect(result.value.label).toEqual(['label', 'disabled-label'])
    })

    it('добавляет error-зоны после focused/readonly/disabled', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                focused: true,
                error: true,
            },
            attrs: {
                readonly: true,
                disabled: true,
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],

                        focused: {
                            root: ['focused-root'],
                            input: ['focused-input'],
                            label: ['focused-label'],
                        },

                        readonly: {
                            root: ['readonly-root'],
                            input: ['readonly-input'],
                            label: ['readonly-label'],
                        },

                        disabled: {
                            root: ['disabled-root'],
                            input: ['disabled-input'],
                            label: ['disabled-label'],
                        },

                        error: {
                            root: ['error-root'],
                            input: ['error-input'],
                            label: ['error-label'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual([
            'root',
            'focused-root',
            'readonly-root',
            'disabled-root',
            'error-root',
        ])

        expect(result.value.input).toEqual([
            'input',
            'focused-input',
            'readonly-input',
            'disabled-input',
            'error-input',
        ])

        expect(result.value.label).toEqual([
            'label',
            'focused-label',
            'readonly-label',
            'disabled-label',
            'error-label',
        ])
    })

    it('соблюдает полный порядок: base → filled → prepended → appended → focused → readonly → disabled → error', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                filled: true,
                focused: true,
                error: true,
            },
            slots: {
                prepend: () => h('div'),
                append: () => h('div'),
            },
            attrs: {
                readonly: true,
                disabled: true,
            },
            presets: {
                field: {
                    base: {
                        label: ['base-label'],

                        filled: {
                            label: ['filled-label'],
                        },

                        prepended: {
                            label: ['prepended-label'],
                        },

                        appended: {
                            label: ['appended-label'],
                        },

                        focused: {
                            label: ['focused-label'],
                        },

                        readonly: {
                            label: ['readonly-label'],
                        },

                        disabled: {
                            label: ['disabled-label'],
                        },

                        error: {
                            label: ['error-label'],
                        },
                    },
                },
            },
        })

        expect(result.value.label).toEqual([
            'base-label',
            'filled-label',
            'prepended-label',
            'appended-label',
            'focused-label',
            'readonly-label',
            'disabled-label',
            'error-label',
        ])
    })

    it('не добавляет состояние, если оно не активно', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        input: ['input'],
                        label: ['label'],

                        filled: {
                            root: ['filled-root'],
                            input: ['filled-input'],
                            label: ['filled-label'],
                        },

                        focused: {
                            root: ['focused-root'],
                            input: ['focused-input'],
                            label: ['focused-label'],
                        },

                        error: {
                            root: ['error-root'],
                            input: ['error-input'],
                            label: ['error-label'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root'],
            input: ['input'],
            label: ['label'],
            prepend: [],
            append: [],
        })
    })

    it('реактивно обновляет результат при изменении props и attrs', () => {
        const { result, props, attrs } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
            },
            attrs: {},
            presets: {
                field: {
                    base: {
                        root: ['root'],
                        label: ['label'],

                        filled: {
                            root: ['filled-root'],
                            label: ['filled-label'],
                        },

                        focused: {
                            root: ['focused-root'],
                            label: ['focused-label'],
                        },

                        disabled: {
                            root: ['disabled-root'],
                            label: ['disabled-label'],
                        },

                        error: {
                            root: ['error-root'],
                            label: ['error-label'],
                        },
                    },
                },
            },
        })

        expect(result.value.root).toEqual(['root'])
        expect(result.value.label).toEqual(['label'])

        props.filled = true

        expect(result.value.root).toEqual(['root', 'filled-root'])
        expect(result.value.label).toEqual(['label', 'filled-label'])

        props.focused = true

        expect(result.value.root).toEqual(['root', 'filled-root', 'focused-root'])
        expect(result.value.label).toEqual(['label', 'filled-label', 'focused-label'])

        attrs.disabled = true

        expect(result.value.root).toEqual(['root', 'filled-root', 'focused-root', 'disabled-root'])
        expect(result.value.label).toEqual(['label', 'filled-label', 'focused-label', 'disabled-label'])

        props.error = true

        expect(result.value.root).toEqual([
            'root',
            'filled-root',
            'focused-root',
            'disabled-root',
            'error-root',
        ])

        expect(result.value.label).toEqual([
            'label',
            'filled-label',
            'focused-label',
            'disabled-label',
            'error-label',
        ])
    })

    it('возвращает пустые массивы для зон, которые не описаны', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                filled: true,
                focused: true,
            },
            presets: {
                field: {
                    base: {
                        filled: {
                            label: ['filled-label'],
                        },
                        focused: {
                            root: ['focused-root'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['focused-root'],
            input: [],
            label: ['filled-label'],
            prepend: [],
            append: [],
        })
    })
})
