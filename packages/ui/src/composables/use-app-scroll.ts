import {
    computed,
    shallowReactive,
    shallowRef,
    unref,
} from 'vue'

import { convertToUnit, IN_BROWSER } from '../utils'

export function useAppScroll() {
    const state = shallowReactive({ blockScroll: false })

    const appRef = shallowRef<HTMLElement>()

    let savedScrollTop = 0
    let savedScrollLeft = 0

    const classes = computed(() => ({ 'c-app--block-scroll': state.blockScroll }))

    function getScrollTop() {
        if (!IN_BROWSER) return 0
        return window.scrollY
    }

    function getScrollLeft() {
        if (!IN_BROWSER) return 0
        return window.scrollX
    }

    function blockScroll() {
        savedScrollTop = getScrollTop()
        savedScrollLeft = getScrollLeft()

        unref(appRef)!.style.setProperty('--c-scroll-top', convertToUnit(-savedScrollTop))
        unref(appRef)!.style.setProperty('--c-scroll-left', convertToUnit(-savedScrollLeft))

        requestAnimationFrame(() => {
            state.blockScroll = true
        })
    }

    function unblockScroll() {
        state.blockScroll = false

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
        blockScroll,
        unblockScroll,
    }
}
