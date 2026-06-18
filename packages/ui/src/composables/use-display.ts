import {
 type MaybeRef, reactive, shallowRef, toRefs, unref, watchEffect 
} from 'vue'

import { IN_BROWSER } from '../utils'

export const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
}

export interface AppBreakpoints {
    xxl: MaybeRef<boolean>
    xl: MaybeRef<boolean>
    lg: MaybeRef<boolean>
    md: MaybeRef<boolean>
    sm: MaybeRef<boolean>
    xs: MaybeRef<boolean>
    xlAndLess: MaybeRef<boolean>
    lgAndLess: MaybeRef<boolean>
    mdAndLess: MaybeRef<boolean>
    smAndLess: MaybeRef<boolean>
    xlAndUp: MaybeRef<boolean>
    lgAndUp: MaybeRef<boolean>
    mdAndUp: MaybeRef<boolean>
    smAndUp: MaybeRef<boolean>
}

export function useDisplay() {
    const state = reactive<AppBreakpoints>({
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
        smAndUp: false
    })

    const width = shallowRef(0)
    const height = shallowRef(0)

    const getClientWidth = (isSSR = false) => {
        return IN_BROWSER && !isSSR ? window.innerWidth : 0
    }

    const getClientHeight = (isSSR = false) => {
        return IN_BROWSER && !isSSR ? window.innerHeight : 0
    }

    const update = () => {
        width.value = getClientWidth()
        height.value = getClientHeight()
    }

    const createDisplay = (ssr: boolean = false) => {
        width.value = getClientWidth(ssr)
        height.value = getClientHeight(ssr)

        watchEffect(() => {
            const {
 xxl, xl, lg, md, sm, xs 
} = breakpoints
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
            update,
        }
    }

    return {
        state,
        createDisplay
    }
}
