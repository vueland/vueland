import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import {
    defineComponent,
    h,
    type Reactive,
    reactive,
} from 'vue'

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
        // null → по умолчанию поле не «filled» (isDef(null) === false)
        modelValue: null,
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
        { global: { provide: { [$VUELAND_UI_KEY as symbol]: { presets: corePresets } } } },
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

// Набор: base + состояния. Каждое состояние — плоский пресет, целиком
// подменяющий зоны base (зона, которую состояние не описывает — из base).
const inputSet = {
    base: {
        root: ['base-root'],
        details: ['base-details'],
        field: ['base-field'],
    },
    focused: { root: ['focused-root'] },
    error: {
        root: ['error-root'],
        details: ['error-details'],
    },
    disabled: { root: ['disabled-root'] },
    readonly: { root: ['readonly-root'] },
    filled: { root: ['filled-root'] },
}

describe('useInputPresets', () => {
    it('возвращает пустые значения, если preset не передан', () => {
        const { result } = mountUseInputPresets({
            presets: { myInput: inputSet },
        })

        expect(result.value).toEqual({
            root: [],
            details: [],
            field: undefined,
        })
    })

    it('резолвит зоны base, когда нет активного состояния', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            presets: { myInput: inputSet },
        })

        expect(result.value.root).toEqual(['base-root'])
        expect(result.value.details).toEqual(['base-details'])
    })

    it('отдаёт в field весь набор (для inject в CField)', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            presets: { myInput: inputSet },
        })

        expect(result.value.field).toEqual(inputSet)
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'forms.text.primary' },
            presets: {
                forms: { text: { primary: { base: { root: ['primary-root'] } } } },
            },
        })

        expect(result.value.root).toEqual(['primary-root'])
    })

    it('состояние focused целиком подменяет зону root', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            state: { focused: true },
            presets: { myInput: inputSet },
        })

        expect(result.value.root).toEqual(['focused-root'])
    })

    it('зона без описания в состоянии берётся из base', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            state: { focused: true },
            presets: { myInput: inputSet },
        })

        // focused не описывает details → остаётся base
        expect(result.value.details).toEqual(['base-details'])
    })

    it('не применяет focused, если поле disabled (disabled приоритетнее)', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'myInput',
                disabled: true,
            },
            state: { focused: true },
            presets: { myInput: inputSet },
        })

        expect(result.value.root).toEqual(['disabled-root'])
    })

    it('применяет filled, когда modelValue задан', () => {
        const { result } = mountUseInputPresets({
            props: {
                preset: 'myInput',
                modelValue: 'hello',
            },
            presets: { myInput: inputSet },
        })

        expect(result.value.root).toEqual(['filled-root'])
    })

    it('error приоритетнее focused при одновременной активности', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            state: { focused: true },
            errors: { hasError: true },
            presets: { myInput: inputSet },
        })

        expect(result.value.root).toEqual(['error-root'])
        expect(result.value.details).toEqual(['error-details'])
    })

    it('откатывается на base, если для состояния нет пресета', () => {
        const { result } = mountUseInputPresets({
            props: { preset: 'myInput' },
            errors: { hasError: true },
            presets: {
                myInput: { base: { root: ['base-root'] } }, // error не описан
            },
        })

        expect(result.value.root).toEqual(['base-root'])
    })
})
