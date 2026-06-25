import { computed } from 'vue'

import {
    ariaDisabled,
    ariaMultiselectable,
    ariaSelected,
} from '@/utils'

export type AriaListRole = 'listbox' | 'menu' | undefined
export type AriaListVariant = 'list' | 'listbox' | 'menu'

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

export function isAriaListRole(role: AriaListRole): role is Exclude<AriaListRole, undefined> {
    return role === 'listbox' || role === 'menu'
}

export function useAriaListbox(props: AriaListboxProps) {
    const role = computed(() => {
        if (!props.variant || props.variant === 'list') {
            return undefined
        }

        return props.variant
    })

    const managed = computed(() => isAriaListRole(role.value))

    const aria = computed(() => {
        const resolvedRole = role.value

        if (!isAriaListRole(resolvedRole)) {
            return {}
        }

        return {
            role: resolvedRole,
            ...ariaDisabled(props.disabled),
            ...(resolvedRole === 'listbox' ? ariaMultiselectable(props.multiple) : {}),
        }
    })

    return {
        aria,
        managed,
        role,
    }
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
            ...ariaDisabled(s.disabled),
            ...(s.role === 'listbox' ? ariaSelected(s.selected) : {}),
        }
    })
}
