import { isDef } from '../helpers'

export type DelayProps = {
    openDelay?: number | string
    closeDelay?: number | string
}

export function useDelayedActions(props: Partial<DelayProps> & Record<string, any>) {
    const openDelay = (fn: (...args: any) => any) => {
        setTimeout(fn, isDef(props.openDelay) ? +props.openDelay! : 0)
    }

    const closeDelay = (fn: (...args: any) => any) => {
        setTimeout(fn, isDef(props.closeDelay) ? +props.closeDelay! : 0)
    }

    return {
        openDelay,
        closeDelay,
    }
}
