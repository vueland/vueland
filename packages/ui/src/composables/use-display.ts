import {
    type Ref,
    type ShallowReactive,
    shallowReactive,
    shallowRef,
    toRefs,
    unref,
    watchEffect,
} from 'vue'

import { BreakpointLabels } from '@/enums'
import { IN_BROWSER } from '@/utils'

export const breakpoints = {
    [BreakpointLabels.XS]: 0,
    [BreakpointLabels.SM]: 600,
    [BreakpointLabels.MD]: 960,
    [BreakpointLabels.LG]: 1280,
    [BreakpointLabels.XL]: 1920,
    [BreakpointLabels.XXL]: 2560,
} as const

export interface Breakpoints {
    xxl: boolean
    xl: boolean
    lg: boolean
    md: boolean
    sm: boolean
    xs: boolean
    xlAndLess: boolean
    lgAndLess: boolean
    mdAndLess: boolean
    smAndLess: boolean
    xlAndUp: boolean
    lgAndUp: boolean
    mdAndUp: boolean
    smAndUp: boolean
}

export type Display = {
    [k in keyof Breakpoints]: Ref<boolean>
}

export function useDisplay(): {
    state: ShallowReactive<Breakpoints>,
    createDisplay(points?: Record<BreakpointLabels, number>): Display
    update(): void
    } {
    const state = shallowReactive<Breakpoints>({
        xxl: false,
        xl: false,
        lg: false,
        md: false,
        sm: false,
        xs: false,
        xlAndLess: false,
        lgAndLess: false,
        mdAndLess: false,
        smAndLess: false,
        xlAndUp: false,
        lgAndUp: false,
        mdAndUp: false,
        smAndUp: false,
    })

    const width = shallowRef(0)
    const height = shallowRef(0)

    const getClientWidth = () => {
        return IN_BROWSER ? window.innerWidth : 0
    }

    const getClientHeight = () => {
        return IN_BROWSER ? window.innerHeight : 0
    }

    const update = () => {
        width.value = getClientWidth()
        height.value = getClientHeight()
    }

    const createDisplay = (points: Record<BreakpointLabels, number> = breakpoints) => {
        width.value = getClientWidth()
        height.value = getClientHeight()

        watchEffect(() => {
            const {
                xxl,
                xl,
                lg,
                md,
                sm,
                xs,
            } = points

            const screen = unref(width)

            state.xs = screen < sm
            state.sm = screen < md && screen > xs
            state.md = screen < lg && screen > sm
            state.lg = screen < xl && screen > md
            state.xl = screen < xxl && screen > lg
            state.xxl = screen >= xxl
            state.xlAndUp = !(state.xs || state.sm || state.md || state.lg)
            state.lgAndUp = !(state.xs || state.sm || state.md)
            state.mdAndUp = !(state.xs || state.sm)
            state.smAndUp = !state.xs
            state.xlAndLess = screen <= xl && screen > lg
            state.lgAndLess = screen <= lg && screen > md
            state.mdAndLess = screen <= md && screen > sm
            state.smAndLess = screen <= sm && screen > xs
        })

        return {
            ...toRefs(state),
        }
    }

    return {
        state,
        update,
        createDisplay,
    }
}
