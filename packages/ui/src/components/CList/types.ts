import type { ComputedRef, VNode } from 'vue'

export type CListRole = 'listbox' | 'menu' | undefined

export type CListProps<T> = {
    modelValue?: T | T[] | null
    multiple?: boolean
    mandatory?: boolean
    readonly?: boolean
    selectable?: boolean
    role?: CListRole
}

export type CListSlots<T> = {
    default?(props: {
        select(item: T): void
        unselect(item: T): void
        isActive(item: T): boolean
    }): VNode | VNode[]
}

export type ListItemControls = {
    focus(): void
    blur(): void
}

export type ListAPI<T = any> = {
    role: ComputedRef<CListRole>
    listId: string
    register(controls: ListItemControls): number
    unregister(controls: ListItemControls): void
    select(value: T): void
    unselect(value: T): void
    isActive(value: T): boolean
    setDescendant(id: string | undefined): void
}
