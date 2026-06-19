import {
    computed,
    defineComponent,
    type PropType,
    unref,
} from 'vue'

import { makePresetProps, useButtonPresets } from '../../composables'
import { propsFactory } from '../../utils'

export const makeCBtnProps = propsFactory({
    variant: { type: String as PropType<'flat' | 'outlined'> },
    block: Boolean,
    disabled: Boolean,
    ...makePresetProps(),
})

export const CBtn = defineComponent({
    name: 'CBtn',
    props: makeCBtnProps({ variant: 'flat' }),
    emits: { click: (_e: MouseEvent) => !!_e },
    setup(props, { slots, emit }) {
        const preset = useButtonPresets({ props })

        const classes = computed(() => [
            {
                'c-btn--flat': !props.variant || props.variant === 'flat',
                'c-btn--outlined': props.variant === 'outlined',
                'c-btn--block': props.block,
                'c-btn--disabled': props.disabled,
            },
            ...unref(preset).root,
        ])

        return () => (
            <button
                class={['c-btn', ...unref(classes)]}
                disabled={props.disabled}
                onClick={(e) => emit('click', e)}
            >
                {slots.default?.()}
            </button>
        )
    },
})

export type CBtnProps = InstanceType<typeof CBtn>['$props']
