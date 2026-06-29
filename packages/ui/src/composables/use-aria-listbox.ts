import { computed } from 'vue'

import {
    ariaDisabled,
    ariaMultiselectable,
    ariaSelected,
} from '@/utils'

export type AriaListRole = 'listbox' | 'menu' | undefined
export type AriaListVariant = 'listbox' | 'menu'

export interface AriaListboxProps {
    variant?: AriaListVariant
    disabled?: boolean
    multiple?: boolean
}

export interface AriaListboxItemState {
    role?: AriaListRole
    id?: string
    selected?: boolean
    disabled?: boolean
}

export function useAriaListbox(props: AriaListboxProps) {
    return computed(() => {
        if (!props.variant) {
            return {}
        }

        return {
            role: props.variant,
            ...ariaDisabled(props.disabled),
            ...(props.variant === 'listbox' ? ariaMultiselectable(props.multiple) : {}),
        }
    })
}

export function useAriaListboxItem(state: () => AriaListboxItemState) {
    return computed(() => {
        const s = state()

        if (!s.role) {
            return {}
        }

        return {
            ...(s.id ? { id: s.id } : {}),
            role: s.role === 'menu' ? 'menuitem' : 'option',
            ...ariaDisabled(s.disabled),
            ...(s.role === 'listbox' ? ariaSelected(s.selected) : {}),
        }
    })
}
