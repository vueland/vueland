import { computed } from 'vue'

import { ariaActiveDescendant, ariaMultiselectable } from '../utils'

export interface AriaListboxState {
    multiple?: boolean
    activeDescendant?: string
}

export function useAriaListbox(state: () => AriaListboxState) {
    return computed(() => {
        const s = state()

        return {
            ...ariaMultiselectable(s.multiple),
            ...ariaActiveDescendant(s.activeDescendant),
        }
    })
}
