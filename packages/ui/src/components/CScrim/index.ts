import { h, type VNode } from 'vue'

import { isDef } from '../../helpers'

export type CScrimProps = {
    blur?: boolean
    tag?: string
}

export const CScrim = (props: CScrimProps, ctx): VNode => {
    return h(props.tag ?? 'div',
        {
            ...ctx.attrs,
            class: ['c-scrim', { 'c-scrim--blurred': isDef(props.blur) }],
        },
        ctx.slots.default?.(),
    )
}
