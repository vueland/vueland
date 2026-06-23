import { computed } from 'vue'

import {
    ariaActiveDescendant,
    ariaMultiselectable,
    ariaSelected,
} from '@/utils'

export type AriaListRole = 'listbox' | 'menu' | undefined

export interface AriaListboxState {
    role?: AriaListRole
    multiple?: boolean
    descendant?: string
}

export interface AriaListboxItemState {
    role?: AriaListRole
    id?: string
    selected?: boolean
}

export function isAriaListRole(role: AriaListRole): role is Exclude<AriaListRole, undefined> {
    return role === 'listbox' || role === 'menu'
}

export function useAriaListbox(state: () => AriaListboxState) {
    return computed(() => {
        const s = state()

        if (!isAriaListRole(s.role)) {
            return {}
        }

        return {
            role: s.role,
            ...(s.role === 'listbox' ? ariaMultiselectable(s.multiple) : {}),
            ...ariaActiveDescendant(s.descendant),
        }
    })
}

export function useAriaListboxItem(state: () => AriaListboxItemState) {
    return computed(() => {
        const s = state()

        if (!isAriaListRole(s.role)) {
            return {}
        }

        return {
            ...(s.id ? { id: s.id } : {}),
            role: s.role === 'menu' ? 'menuitem' : 'option',
            ...(s.role === 'listbox' ? ariaSelected(s.selected) : {}),
        }
    })
}
