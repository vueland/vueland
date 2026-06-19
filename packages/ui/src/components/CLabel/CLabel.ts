import { type FunctionalComponent, h, type VNode } from 'vue'

import { type CLabelProps } from './types'

export const CLabel: FunctionalComponent<CLabelProps> = (props, ctx): VNode => {
    return h(props.tag ?? 'span',
        {
            ...ctx.attrs,
            class: ['c-label'],
        },
        ctx.slots.default?.(),
    )
}
