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
    reactive,
} from 'vue'

import type { PresetProps } from '@/composables/use-presets'
import { $PRESET_KEY, $VUELAND_UI_KEY } from '@/constants'

import { useListPresets } from '../use-list-presets'

type TestProps = PresetProps & { disabled?: boolean, readonly?: boolean }

function mountUseListPresets({
    props: initialProps,
    presets = {},
    injected,
}: {
    props?: Partial<TestProps>
    presets?: Record<string, any>
    injected?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useListPresets>

    const props = reactive({
        preset: undefined,
        disabled: false,
        readonly: false,
        ...initialProps,
    }) as TestProps

    const provide: Record<symbol, unknown> = {
        [$VUELAND_UI_KEY as symbol]: { presets },
    }

    if (injected !== undefined) {
        provide[$PRESET_KEY as symbol] = computed(() => injected)
    }

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useListPresets({ props })

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

// Набор CList: зоны root/option, состояния disabled/readonly. Один и тот же
// формат работает и через собственный проп, и вложенным в пресет комбобокса.
const listSet = {
    base: {
        root: ['base-root'],
        option: ['base-option'],
    },
    disabled: { option: ['disabled-option'] },
    readonly: { option: ['readonly-option'] },
}

// Набор комбобокса (CInputPreset): вложенный пресет листа подставлен по значению.
const inputSet = {
    base: {
        root: ['input-root'],
        field: ['base-field'],
        list: listSet,
    },
}

describe('useListPresets', () => {
    it('возвращает пустые зоны, если preset не передан и контекста нет', () => {
        const { result } = mountUseListPresets()

        expect(result.value).toEqual({
            root: [],
            option: [],
        })
    })

    it('резолвит зоны root и option из собственного preset', () => {
        const { result } = mountUseListPresets({
            props: { preset: 'myList' },
            presets: { myList: listSet },
        })

        expect(result.value).toEqual({
            root: ['base-root'],
            option: ['base-option'],
        })
    })

    it('состояние disabled подменяет зону option, root остаётся из base', () => {
        const { result, props } = mountUseListPresets({
            props: { preset: 'myList' },
            presets: { myList: listSet },
        })

        props.disabled = true

        expect(result.value).toEqual({
            root: ['base-root'],
            option: ['disabled-option'],
        })
    })

    it('disabled приоритетнее readonly', () => {
        const { result } = mountUseListPresets({
            props: {
                preset: 'myList',
                disabled: true,
                readonly: true,
            },
            presets: { myList: listSet },
        })

        expect(result.value.option).toEqual(['disabled-option'])
    })

    it('из контекста комбобокса читает вложенный пресет листа', () => {
        const { result } = mountUseListPresets({
            injected: inputSet,
        })

        expect(result.value).toEqual({
            root: ['base-root'],
            option: ['base-option'],
        })
    })

    it('собственный preset перекрывает контекст', () => {
        const { result } = mountUseListPresets({
            props: { preset: 'myList' },
            presets: { myList: { base: { root: ['own-root'] } } },
            injected: inputSet,
        })

        expect(result.value.root).toEqual(['own-root'])
    })
})
