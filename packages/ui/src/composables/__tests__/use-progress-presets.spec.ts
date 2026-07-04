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

import type { CProgressCircularProps, CProgressLinearProps } from '@/components'
import { useProgressCircularPresets, useProgressLinearPresets } from '@/composables'
import { $VUELAND_UI_KEY } from '@/constants'

function mountUsePresets<Result>(
    setup: () => Result,
    presets: Record<string, any> = {},
): Result {
    let result!: Result

    mount(
        defineComponent({
            setup() {
                result = setup()

                return () => h('div')
            },
        }),
        { global: { provide: { [$VUELAND_UI_KEY as symbol]: { presets: reactive(presets) } } } },
    )

    return result
}

// Набор: base + состояния. Состояние — плоский пресет, целиком подменяющий
// зоны base; неописанная зона остаётся из base.
const circularSet = {
    base: {
        root: ['base-root'],
        underlay: ['base-underlay'],
        overlay: ['base-overlay'],
        info: ['base-info'],
    },
    indeterminate: { root: ['spin-root'] },
    complete: {
        root: ['done-root'],
        overlay: ['done-overlay'],
        info: ['done-info'],
    },
}

const linearSet = {
    base: {
        root: ['base-root'],
        background: ['base-background'],
        buffer: ['base-buffer'],
        bar: ['base-bar'],
    },
    indeterminate: { bar: ['spin-bar'] },
    complete: { bar: ['done-bar'] },
}

describe('useProgressCircularPresets', () => {
    it('возвращает пустые зоны, если preset не передан', () => {
        const props = reactive({}) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        expect(result.value).toEqual({
            root: [],
            underlay: [],
            overlay: [],
            info: [],
        })
    })

    it('резолвит зоны base, когда нет активного состояния', () => {
        const props = reactive({
            preset: 'spinner',
            value: 50,
        }) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        expect(result.value.root).toEqual(['base-root'])
        expect(result.value.underlay).toEqual(['base-underlay'])
        expect(result.value.overlay).toEqual(['base-overlay'])
        expect(result.value.info).toEqual(['base-info'])
    })

    it('применяет complete при value >= 100, в том числе строковом', () => {
        const props = reactive({
            preset: 'spinner',
            value: '100',
        }) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        expect(result.value.root).toEqual(['done-root'])
        expect(result.value.overlay).toEqual(['done-overlay'])
        expect(result.value.info).toEqual(['done-info'])
        // complete не описывает underlay → остаётся base
        expect(result.value.underlay).toEqual(['base-underlay'])
    })

    it('indeterminate приоритетнее complete', () => {
        const props = reactive({
            preset: 'spinner',
            indeterminate: true,
            value: 100,
        }) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        expect(result.value.root).toEqual(['spin-root'])
    })

    it('зона без описания в состоянии берётся из base', () => {
        const props = reactive({
            preset: 'spinner',
            indeterminate: true,
        }) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        // indeterminate не описывает info → остаётся base
        expect(result.value.info).toEqual(['base-info'])
    })

    it('реагирует на смену value без пересоздания', () => {
        const props = reactive({
            preset: 'spinner',
            value: 10,
        }) as Reactive<CProgressCircularProps>

        const result = mountUsePresets(
            () => useProgressCircularPresets({ props }),
            { spinner: circularSet },
        )

        expect(result.value.root).toEqual(['base-root'])

        props.value = 100

        expect(result.value.root).toEqual(['done-root'])
    })
})

describe('useProgressLinearPresets', () => {
    it('резолвит все четыре зоны из base', () => {
        const props = reactive({
            preset: 'loader',
            value: 30,
        }) as Reactive<CProgressLinearProps>

        const result = mountUsePresets(
            () => useProgressLinearPresets({ props }),
            { loader: linearSet },
        )

        expect(result.value).toEqual({
            root: ['base-root'],
            background: ['base-background'],
            buffer: ['base-buffer'],
            bar: ['base-bar'],
        })
    })

    it('состояние complete подменяет только описанную зону bar', () => {
        const props = reactive({
            preset: 'loader',
            value: 100,
        }) as Reactive<CProgressLinearProps>

        const result = mountUsePresets(
            () => useProgressLinearPresets({ props }),
            { loader: linearSet },
        )

        expect(result.value.bar).toEqual(['done-bar'])
        expect(result.value.root).toEqual(['base-root'])
    })

    it('поддерживает вложенный путь preset через точку', () => {
        const props = reactive({
            preset: 'progress.linear.upload',
        }) as Reactive<CProgressLinearProps>

        const result = mountUsePresets(
            () => useProgressLinearPresets({ props }),
            { progress: { linear: { upload: { base: { bar: ['upload-bar'] } } } } },
        )

        expect(result.value.bar).toEqual(['upload-bar'])
    })
})
