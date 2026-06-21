import { computed } from 'vue'

import type { AriaHaspopup } from '@/constants'
import { ariaExpandable } from '@/utils'

export interface AriaActivatorState {
    expanded: boolean
    haspopup?: AriaHaspopup | boolean
    controls?: string
}

export function useAriaActivator(state: () => AriaActivatorState) {
    return computed(() => {
        const s = state()

        return ariaExpandable(s.expanded, {
            haspopup: s.haspopup ?? true,
            controls: s.controls,
        })
    })
}
