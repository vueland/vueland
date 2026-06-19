import type { VNode } from 'vue'

export type ApplicationApi = {
    blockScroll(): void
    unblockScroll(): void
    getScrollTop(): number
    getScrollLeft(): number
}

export type CAppSlots = {
    default(): VNode | VNode[]
}
