import type { VNode } from 'vue'

import type { LoosePath } from '@/composables'
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
    itemKey?: LoosePath<T> | ((item: T) => unknown)
}

// Слот отдаёт тот же контракт, что провайдится потомкам (ListAPI)
export type CListSlots<T> = {
    default?(props: ListAPI<T>): VNode | VNode[]
}

export type ListItem = {
    focus(): void
    blur(): void
    click(): void
    getText(): string
    isDisabled(): boolean
}

export type ListAPI<T = unknown> = {
    role: CListRole
    registerItem(controller: ListItem): void
    unregisterItem(controller: ListItem): void
    select(value: T): void
    unselect(value: T): void
    toggle(value: T): void
    isActive(value: T): boolean
}
