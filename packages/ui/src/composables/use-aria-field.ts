import { computed } from 'vue'

import {
    ariaDescribedBy,
    ariaDisabled,
    ariaErrorMessage,
    ariaInvalid,
    ariaLabelledBy,
    ariaReadonly,
} from '../utils'

export interface AriaFieldState {
    fieldId: string
    label?: string | boolean
    hasDetails?: boolean
    hasError?: boolean
    errorMessage?: string
    readonly?: boolean
    disabled?: boolean
}

export function useAriaField(state: () => AriaFieldState) {
    return computed(() => {
        const s = state()

        return {
            ...ariaLabelledBy(s.label ? `${s.fieldId}-label` : undefined),
            ...ariaDescribedBy(s.hasDetails ? `${s.fieldId}-details` : undefined),
            ...ariaInvalid(s.hasError),
            ...ariaErrorMessage(s.errorMessage && s.hasDetails ? `${s.fieldId}-details` : undefined),
            ...ariaReadonly(s.readonly),
            ...ariaDisabled(s.disabled),
        }
    })
}
