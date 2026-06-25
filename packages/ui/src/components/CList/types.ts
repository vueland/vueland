import type { ComputedRef, VNode } from 'vue'

import type { AriaListRole, AriaListVariant } from '@/composables/use-aria-listbox'

export type CListRole = AriaListRole
export type CListVariant = AriaListVariant

export type CListProps<T> = {
    modelValue?: T | T[] | null
    multiple?: boolean
    mandatory?: boolean
    readonly?: boolean
    disabled?: boolean
    variant?: CListVariant
    itemKey?: string | ((item: T) => unknown)
}

export type CListSlots<T> = {
    default?(props: {
        select(item: T): void
        unselect(item: T): void
        isActive(item: T): boolean
    }): VNode | VNode[]
}

export type ListItemController<T = any> = {
    id: string
    focus(): void
    blur(): void
    activate(): void
    getText(): string
    getValue(): T | undefined
    isDisabled(): boolean
}

export type ListAPI<T = any> = {
    role: ComputedRef<CListRole>
    managed: ComputedRef<boolean>
    disabled: ComputedRef<boolean>
    registerItem(controller: ListItemController<T>): void
    unregisterItem(controller: ListItemController<T>): void
    setCurrentItem(controller: ListItemController<T>): void
    unsetCurrentItem(controller: ListItemController<T>): void
    select(value: T): void
    unselect(value: T): void
    isActive(value: T): boolean
}
