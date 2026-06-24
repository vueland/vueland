import {
    computed,
    shallowReactive,
    shallowRef,
    unref,
} from 'vue'

import { convertToUnit, IN_BROWSER } from '@/utils'

export function useApplicationScroll() {
    const state = shallowReactive({ lock: false })
    const appRef = shallowRef<HTMLElement>()

    let savedScrollTop = 0
    let savedScrollLeft = 0

    const classes = computed(() => ({ 'c-app--block-scroll': state.lock }))

    function getScrollTop() {
        if (!IN_BROWSER) return 0
        return window.scrollY
    }

    function getScrollLeft() {
        if (!IN_BROWSER) return 0
        return window.scrollX
    }

    function lockScroll() {
        savedScrollTop = getScrollTop()
        savedScrollLeft = getScrollLeft()

        unref(appRef)!.style.setProperty('--c-scroll-top', convertToUnit(-savedScrollTop))
        unref(appRef)!.style.setProperty('--c-scroll-left', convertToUnit(-savedScrollLeft))

        requestAnimationFrame(() => {
            state.lock = true
        })
    }

    function unlockScroll() {
        state.lock = false

        requestAnimationFrame(() => {
            unref(appRef)?.style.removeProperty('--c-scroll-top')
            unref(appRef)?.style.removeProperty('--c-scroll-left')

            window.scrollTo({
                top: savedScrollTop,
                left: savedScrollLeft,
                behavior: 'auto',
            })
        })
    }

    return {
        appRef,
        classes,
        getScrollTop,
        getScrollLeft,
        lockScroll,
        unlockScroll,
    }
}
