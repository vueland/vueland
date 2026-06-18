import {
 computed, defineComponent, type PropType, unref 
} from 'vue'

import { type PresetProps, useButtonPresets } from '../../composables'
import { propsFactory } from '../../utils'

export type CBtnProps = PresetProps & {
    variant: 'flat' | 'outlined' | undefined
    block?: boolean
}

export const makeCBtnProps = propsFactory({
    variant: {type: String as PropType<CBtnProps['variant']>},
    block: Boolean,
    preset: String,
})

export const CBtn = defineComponent({
    name: 'CBtn',
    props: makeCBtnProps({ variant: 'flat' }),
    setup(props, { slots }) {
        const preset = useButtonPresets({ props })

        const classes = computed(() => [
            {
                'c-btn--flat': !props.variant || props.variant === 'flat',
                'c-btn--outlined': props.variant === 'outlined',
                'c-btn--block': props.block,
            },
            ...unref(preset).root
        ])
        return () => (
            <button class={['c-btn', ...unref(classes)]}>
                {slots.default?.()}
            </button>
        )
    }
})
