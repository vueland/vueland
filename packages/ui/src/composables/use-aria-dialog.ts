import { computed } from 'vue'

import {
    ariaDescribedBy,
    ariaLabelledBy,
    ariaModal,
} from '@/utils'

export interface AriaDialogState {
    labelledBy?: string
    describedBy?: string
    modal?: boolean
}

export function useAriaDialog(state: () => AriaDialogState = () => ({})) {
    return computed(() => {
        const s = state()

        return {
            ...ariaModal(s.modal ?? true),
            ...ariaLabelledBy(s.labelledBy),
            ...ariaDescribedBy(s.describedBy),
        }
    })
}
