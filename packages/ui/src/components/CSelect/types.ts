import type { VNode } from 'vue'

import type { IterableItemsProps, NormalizedItem, SelectableProps } from '../../composables'
import type { CInputSlots } from '../CInput'

export type CSelectProps<T> = SelectableProps<T>
    & IterableItemsProps<T>
    & {
    options?: {
        extKey?: string
        noItemsMessage?: string
    },
}

export type CSelectSlots<T> = {
    menu(props: { items: NormalizedItem<T>[], onSelect(val: T): void }): void
    field: CInputSlots['field']
    prepend(): VNode
    append(): VNode
    selects(props: { items: T[] }): VNode[]
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
    ['no-items-message'](): string
}
