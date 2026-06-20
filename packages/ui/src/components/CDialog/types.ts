import type { VNode } from 'vue'

import type { COverlayProps } from '../COverlay'

export type CDialogProps = COverlayProps & {
    closeOnClickOutside?: boolean
}

export type CDialogSlots = {
    default(): VNode
}
