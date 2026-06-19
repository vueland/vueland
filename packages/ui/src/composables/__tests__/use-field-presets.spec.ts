import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, reactive, type Reactive } from 'vue'

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

    const attrs = reactive({
        disabled: false,
        readonly: false,
        ...initialAttrs,
    }) as Record<string, any>

    const props = reactive({
        preset: undefined,
        filled: false,
        focused: false,
        error: false,
        ...initialProps,
    }) as Reactive<TestFieldProps>

    // forward attrs.disabled/readonly into props so useFieldPresets can read them
    Object.defineProperty(props, 'disabled', {
        get: () => attrs.disabled,
        set: (v) => { attrs.disabled = v },
        enumerable: true,
        configurable: true,
    })
    Object.defineProperty(props, 'readonly', {
        get: () => attrs.readonly,
        set: (v) => { attrs.readonly = v },
        enumerable: true,
        configurable: true,
    })

    const slots = {
        ...initialSlots,
    } as CFieldSlots

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useFieldPresets({
                    props,
                    slots,
                    hasValue: computed(() => !!props.filled),
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
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: [],
            input: [],
            label: [],
        })
    })

    it('возвращает базовые классы CFieldPreset', () => {
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
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root'],
            input: ['input'],
            label: ['label'],
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
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['primary-root'],
            input: ['primary-input'],
            label: ['primary-label'],
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
                        filled: {
                            root: ['filled-root'],
                            input: ['filled-input'],
                            label: ['filled-label'],
                        },
                    },
                },
            },
        })

        // filled wins interaction → filled zone replaces base
        expect(result.value).toEqual({
            root: ['filled-root'],
            input: ['filled-input'],
            label: ['filled-label'],
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
                        prepended: {
                            root: ['prepended-root'],
                            input: ['prepended-input'],
                            label: ['prepended-label'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'prepended-root'],
            input: ['input', 'prepended-input'],
            label: ['label', 'prepended-label'],
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
                        appended: {
                            root: ['appended-root'],
                            input: ['appended-input'],
                            label: ['appended-label'],
                        },
                    },
                },
            },
        })

        expect(result.value).toEqual({
            root: ['root', 'appended-root'],
            input: ['input', 'appended-input'],
            label: ['label', 'appended-label'],
        })
    })

    it('применяет focused-состояние + структурные модификаторы (filled, prepend, append)', () => {
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

                        filled: {
                            root: ['filled-root'],
                            input: ['filled-input'],
                            label: ['filled-label'],
                        },

                        prepended: {
                            root: ['prepended-root'],
                            input: ['prepended-input'],
                            label: ['prepended-label'],
                        },

                        appended: {
                            root: ['appended-root'],
                            input: ['appended-input'],
                            label: ['appended-label'],
                        },

                        focused: {
                            root: ['focused-root'],
                            input: ['focused-input'],
                            label: ['focused-label'],
                        },
                    },
                },
            },
        })

        // interaction: focused wins over filled → focused zone (filled swallowed)
        // structural: prepend, append — аддитивны
        expect(result.value).toEqual({
            root: ['focused-root', 'prepended-root', 'appended-root'],
            input: ['focused-input', 'prepended-input', 'appended-input'],
            label: ['focused-label', 'prepended-label', 'appended-label'],
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

        // readonly wins over base: state zone replaces base zone
        expect(result.value.root).toEqual(['readonly-root'])
        expect(result.value.input).toEqual(['readonly-input'])
        expect(result.value.label).toEqual(['readonly-label'])
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

        // disabled wins over base: state zone replaces base zone
        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.input).toEqual(['disabled-input'])
        expect(result.value.label).toEqual(['disabled-label'])
    })

    it('приоритет: disabled побеждает readonly, error, focused', () => {
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
                        focused: { root: ['focused-root'] },
                        readonly: { root: ['readonly-root'] },
                        disabled: { root: ['disabled-root'] },
                        error: { root: ['error-root'] },
                    },
                },
            },
        })

        // disabled wins — only disabled zone applies (no base fallback since disabled zone is defined)
        expect(result.value.root).toEqual(['disabled-root'])
    })

    it('при всех активных — disabled побеждает среди interaction, структурные аддитивны', () => {
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
                        filled: { label: ['filled-label'] },
                        prepended: { label: ['prepended-label'] },
                        appended: { label: ['appended-label'] },
                        focused: { label: ['focused-label'] },
                        readonly: { label: ['readonly-label'] },
                        disabled: { label: ['disabled-label'] },
                        error: { label: ['error-label'] },
                    },
                },
            },
        })

        // interaction: disabled wins → disabled-label (filled, focused, readonly, error all swallowed)
        // structural: only prepend, append additive
        expect(result.value.label).toEqual([
            'disabled-label',
            'prepended-label',
            'appended-label',
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

        // no state → base
        expect(result.value.root).toEqual(['root'])
        expect(result.value.label).toEqual(['label'])

        // filled wins (lowest priority but only active) → replaces base
        props.filled = true
        expect(result.value.root).toEqual(['filled-root'])
        expect(result.value.label).toEqual(['filled-label'])

        // focused wins over filled → focused replaces filled
        props.focused = true
        expect(result.value.root).toEqual(['focused-root'])
        expect(result.value.label).toEqual(['focused-label'])

        // disabled wins over focused → disabled replaces
        attrs.disabled = true
        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.label).toEqual(['disabled-label'])

        // error does NOT win — disabled has higher priority
        props.error = true
        expect(result.value.root).toEqual(['disabled-root'])
        expect(result.value.label).toEqual(['disabled-label'])
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

        // focused wins over filled: focused-root; filled swallowed (no filled-label)
        // focused has no label/input defined → fallback to base (undefined → [])
        expect(result.value).toEqual({
            root: ['focused-root'],
            input: [],
            label: [],
        })
    })

    it('применяет error.focused.label при error + focused', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                error: true,
                focused: true,
            },
            presets: {
                field: {
                    base: {
                        label: ['base-label'],
                        error: {
                            label: ['error-label'],
                            focused: {
                                label: ['error-focused-label'],
                            },
                        },
                        focused: {
                            label: ['focused-label'],
                        },
                    },
                },
            },
        })

        // error wins interaction + focused compound → error.focused.label (replaces error.label and focused.label)
        expect(result.value.label).toEqual(['error-focused-label'])
    })

    it('применяет error.filled.label при error + filled', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                error: true,
                filled: true,
            },
            presets: {
                field: {
                    base: {
                        label: ['base-label'],
                        error: {
                            label: ['error-label'],
                            filled: {
                                label: ['error-filled-label'],
                            },
                        },
                        filled: {
                            label: ['filled-label'],
                        },
                    },
                },
            },
        })

        // error wins + filled compound → error.filled.label (replaces both error.label and filled.label)
        expect(result.value.label).toEqual(['error-filled-label'])
    })

    it('применяет disabled.focused.root при disabled + focused (focused от пропсов)', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                focused: true,
            },
            attrs: { disabled: true },
            presets: {
                field: {
                    base: {
                        root: ['base-root'],
                        disabled: {
                            root: ['disabled-root'],
                            focused: {
                                root: ['disabled-focused-root'],
                            },
                        },
                        focused: {
                            root: ['focused-root'],
                        },
                    },
                },
            },
        })

        // disabled + focused → compound wins: disabled-focused-root (not disabled-root, not focused-root)
        expect(result.value.root).toEqual(['disabled-focused-root'])
    })

    it('не применяет compound состояние, если основное состояние не активно', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'field.base',
                focused: true,
            },
            presets: {
                field: {
                    base: {
                        label: ['base-label'],
                        error: {
                            focused: {
                                label: ['error-focused-label'],
                            },
                        },
                    },
                },
            },
        })

        expect(result.value.label).not.toContain('error-focused-label')
    })
})
