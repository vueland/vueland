import {
    effectScope,
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
    state: ShallowReactive<Breakpoints>
    createDisplay(points?: Record<BreakpointLabels, number>): Display
    update(): void
    dispose(): void
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

    // Detached-scope: useDisplay вызывается из install() вне компонентного setup,
    // поэтому эффекту нужен владелец, которого остановит app.unmount (см. library.ts).
    const scope = effectScope(true)

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

    const createDisplay = (
        points: Record<BreakpointLabels, number> = breakpoints,
    ) => {
        width.value = getClientWidth()
        height.value = getClientHeight()

        scope.run(() => {
            watchEffect(() => {
                const {
                    xxl,
                    xl,
                    lg,
                    md,
                    sm,
                } = points

                const screen = unref(width)

                const xs = screen < sm
                const smActive = screen < md && !xs
                const mdActive = screen < lg && !(smActive || xs)
                const lgActive = screen < xl && !(mdActive || smActive || xs)
                const xlActive = screen < xxl && !(lgActive || mdActive || smActive || xs)
                const xxlActive = screen >= xxl

                state.xs = xs
                state.sm = smActive
                state.md = mdActive
                state.lg = lgActive
                state.xl = xlActive
                state.xxl = xxlActive

                state.smAndUp = !xs
                state.mdAndUp = !(xs || smActive)
                state.lgAndUp = !(xs || smActive || mdActive)
                state.xlAndUp = !(xs || smActive || mdActive || lgActive)

                state.smAndLess = !(mdActive || lgActive || xlActive || xxlActive)
                state.mdAndLess = !(lgActive || xlActive || xxlActive)
                state.lgAndLess = !(xlActive || xxlActive)
                state.xlAndLess = !xxlActive
            })
        })

        return {
            ...toRefs(state),
        }
    }

    return {
        state,
        update,
        createDisplay,
        dispose: () => scope.stop(),
    }
}
