import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import {
    computed,
    defineComponent,
    h,
    type Reactive,
    reactive,
} from 'vue'

import { type CFieldProps, type CFieldSlots } from '@/components'
import { $PRESET_KEY, $VUELAND_UI_KEY } from '@/constants'

import { useFieldPresets } from '../use-field-presets'

type TestFieldProps = CFieldProps

function mountUseFieldPresets({
    props: initialProps,
    slots: initialSlots,
    presets = {},
    injected,
}: {
    props?: Partial<TestFieldProps>
    slots?: Partial<CFieldSlots>
    presets?: Record<string, any>
    injected?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useFieldPresets>

    const props = reactive({
        preset: undefined,
        filled: false,
        focused: false,
        error: false,
        disabled: false,
        readonly: false,
        ...initialProps,
    }) as Reactive<TestFieldProps>

    const slots = { ...initialSlots } as CFieldSlots

    const provide: Record<symbol, unknown> = {
        [$VUELAND_UI_KEY as symbol]: { presets },
    }

    if (injected !== undefined) {
        provide[$PRESET_KEY as symbol] = computed(() => injected)
    }

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useFieldPresets({ props, slots })

                return () => h('div')
            },
        }),
        { global: { provide } },
    )

    return {
        wrapper,
        props,
        slots,
        result,
    }
}

// Набор пресета. CField читает зоны field/input/label/prepend/append.
const fieldSet = {
    base: {
        field: ['base-field'],
        input: ['base-input'],
        label: ['base-label'],
        prepend: ['base-prepend'],
        append: ['base-append'],
    },
    focused: { input: ['focused-input'] },
    error: { input: ['error-input'] },
}

describe('useFieldPresets', () => {
    it('возвращает пустые значения, если preset не передан и контекста нет', () => {
        const { result } = mountUseFieldPresets()

        expect(result.value).toEqual({
            root: [],
            input: [],
            label: [],
            prepend: [],
            append: [],
        })
    })

    it('резолвит зоны base из собственного preset', () => {
        const { result } = mountUseFieldPresets({
            props: { preset: 'myField' },
            presets: { myField: fieldSet },
        })

        expect(result.value).toEqual({
            root: ['base-field'],
            input: ['base-input'],
            label: ['base-label'],
            prepend: ['base-prepend'],
            append: ['base-append'],
        })
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const { result } = mountUseFieldPresets({
            props: { preset: 'fields.text.primary' },
            presets: {
                fields: { text: { primary: { base: { field: ['primary'] } } } },
            },
        })

        expect(result.value.root).toEqual(['primary'])
    })

    it('состояние focused целиком подменяет зону input', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'myField',
                focused: true,
            },
            presets: { myField: fieldSet },
        })

        expect(result.value.input).toEqual(['focused-input'])
        // label focused не описывает → остаётся из base
        expect(result.value.label).toEqual(['base-label'])
    })

    it('error приоритетнее focused', () => {
        const { result } = mountUseFieldPresets({
            props: {
                preset: 'myField',
                focused: true,
                error: true,
            },
            presets: { myField: fieldSet },
        })

        expect(result.value.input).toEqual(['error-input'])
    })

    it('берёт набор из контекста (inject), когда своего нет', () => {
        const { result } = mountUseFieldPresets({
            injected: {
                base: {
                    field: ['injected-field'],
                    input: ['injected-input'],
                },
            },
        })

        expect(result.value.root).toEqual(['injected-field'])
        expect(result.value.input).toEqual(['injected-input'])
    })

    it('собственный preset-prop перекрывает контекст', () => {
        const { result } = mountUseFieldPresets({
            props: { preset: 'myField' },
            injected: { base: { field: ['injected-field'] } },
            presets: {
                myField: { base: { field: ['local-field'] } },
            },
        })

        expect(result.value.root).toEqual(['local-field'])
    })
})
