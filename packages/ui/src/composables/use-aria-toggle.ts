import { computed } from 'vue'

import {
    ariaChecked,
    ariaDisabled,
    ariaPressed,
    ariaRequired,
} from '../utils'

export type AriaToggleMode = 'checkbox' | 'switch' | 'button'

export interface AriaToggleState {
    checked?: boolean | 'mixed'
    mode?: AriaToggleMode
    disabled?: boolean
    required?: boolean
}

export function useAriaToggle(state: () => AriaToggleState) {
    return computed(() => {
        const s = state()

        return {
            ...(s.mode === 'button'
                ? ariaPressed(s.checked as boolean | undefined)
                : ariaChecked(s.checked)),
            ...ariaDisabled(s.disabled),
            ...ariaRequired(s.required),
        }
    })
}
