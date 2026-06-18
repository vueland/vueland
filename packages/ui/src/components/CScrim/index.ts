import {
    type AllowedComponentProps,
    h,
    type SetupContext,
    type VNode,
    type VNodeProps,
} from 'vue'

import { isDef } from '../../helpers'

export type CScrimProps = AllowedComponentProps & VNodeProps & {
    blur?: boolean
    tag?: string
}

export const CScrim = (props: CScrimProps, ctx: SetupContext): VNode => {
    return h(
        props.tag ?? 'div',
        {
            ...ctx.attrs,
            class: ['c-scrim', { 'c-scrim--blurred': isDef(props.blur) }],
        },
        ctx.slots.default?.(),
    )
}
