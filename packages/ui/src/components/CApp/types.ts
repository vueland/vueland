import type { VNode } from 'vue'

export type ApplicationApi = {
    lockScroll(): void
    unlockScroll(): void
    getScrollTop(): number
    getScrollLeft(): number
}

export type CAppSlots = {
    default(): VNode | VNode[]
}
