import type { VNode } from 'vue'

export type CTextFieldSlots = {
    prepend(): VNode
    append(): VNode
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
}
