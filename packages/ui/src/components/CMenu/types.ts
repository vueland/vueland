import type { VNode } from 'vue'

import type { COverlayProps } from '@/components/COverlay'
import type { ActivatorListeners, ActivatorProps } from '@/composables/use-activator'
import type { AutoPositionProps } from '@/composables/use-auto-position'
import type { DelayProps } from '@/composables/use-delay-actions'
import type { DimensionsProps } from '@/types'

export type CMenuProps =
    ActivatorProps &
    DimensionsProps &
    AutoPositionProps &
    DelayProps &
    Partial<COverlayProps> & {
    closeOnClickOutside?: boolean
    closeOnContentClick?: boolean
    ssr?: boolean
    transition?: string
}

export type CMenuSlots = {
    activator?(props: { on: ActivatorListeners, activator: Record<string, any> }): VNode
    default(): VNode
}

export type CMenuEvents = {
    (e: 'outside-click'): void
    (e: 'click'): void
    (e: 'open'): void
    (e: 'close'): void
    (e: 'update:modelValue', val: boolean): void
}
