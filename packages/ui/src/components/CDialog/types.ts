import type { VNode } from 'vue'

import type { COverlayProps } from '@/components/COverlay'

export type CDialogProps = COverlayProps & {
    closeOnClickOutside?: boolean
}

export type CDialogSlots = {
    default(): VNode
}
