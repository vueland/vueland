import { isDef } from '../helpers'
import { propsFactory } from '../utils'

export type DelayProps = {
    openDelay?: number | string
    closeDelay?: number | string
}

export const makeDelayProps = propsFactory({
    openDelay: [Number, String],
    closeDelay: [Number, String],
})

export function useDelayedActions (props: Partial<DelayProps> & Record<string, any>) {
    const openDelay = (fn: (...args: any) => any) => {
        setTimeout(fn, isDef(props.openDelay) ? +props.openDelay! : 0)
    }

    const closeDelay = (fn: (...args: any) => any) => {
        setTimeout(fn, isDef(props.closeDelay) ? +props.closeDelay! : 0)
    }

    return {
        openDelay,
        closeDelay
    }
}
