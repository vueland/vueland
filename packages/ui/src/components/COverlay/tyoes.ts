import type { VNode } from 'vue'

export type COverlayProps = {
    modelValue: boolean,
    to?: string
}

export type COverlaySlots = {
    default?(props: { zIndex: number }): VNode
}
