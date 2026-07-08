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

import { type CFieldProps } from '@/components'
import { $PRESET_KEY, $VUELAND_UI_KEY } from '@/constants'

import { useFieldPresets } from '../use-field-presets'

function mountUseFieldPresets({
    props: initialProps,
    presets = {},
    injected,
}: {
    props?: Partial<CFieldProps>
    presets?: Record<string, any>
    injected?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useFieldPresets>

    const props = reactive({
        preset: undefined,
        dirty: false,
        focused: false,
        error: false,
        disabled: false,
        readonly: false,
        ...initialProps,
    }) as Reactive<CFieldProps>

    const provide: Record<symbol, unknown> = {
        [$VUELAND_UI_KEY as symbol]: { presets },
    }

    if (injected !== undefined) {
        provide[$PRESET_KEY as symbol] = computed(() => injected)
    }

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useFieldPresets({ props })

                return () => h('div')
            },
        }),
        { global: { provide } },
    )

    return {
        wrapper,
        props,
        result,
    }
}

// Набор CField: свои зоны и состояния. Один и тот же формат работает и через
// собственный проп, и вложенным в пресет инпута (поле `field`).
const fieldSet = {
    base: {
        root: ['base-root'],
        input: ['base-input'],
        label: ['base-label'],
        prepend: ['base-prepend'],
        append: ['base-append'],
    },
    focused: { input: ['focused-input'] },
    error: { input: ['error-input'] },
}

// Набор инпута (CInputPreset): вложенный пресет поля подставлен по значению.
// root верхнего уровня — зона .c-input, поле её брать не должно.
const inputSet = {
    base: {
        root: ['input-root'],
        details: ['input-details'],
        field: fieldSet,
    },
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
            root: ['base-root'],
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
                fields: { text: { primary: { base: { root: ['primary'] } } } },
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

    it('из контекста читает вложенный пресет поля с его состояниями', () => {
        const { result, props } = mountUseFieldPresets({
            injected: inputSet,
        })

        expect(result.value.root).toEqual(['base-root'])
        expect(result.value.input).toEqual(['base-input'])

        props.focused = true

        expect(result.value.input).toEqual(['focused-input'])
    })

    it('собственный preset-prop перекрывает контекст', () => {
        const { result } = mountUseFieldPresets({
            props: { preset: 'myField' },
            injected: inputSet,
            presets: {
                myField: { base: { root: ['local-root'] } },
            },
        })

        expect(result.value.root).toEqual(['local-root'])
    })
})
