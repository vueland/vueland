import type { VNode } from 'vue'

import type { CInputSlots } from '@/components/CInput'
import type { IterableItemsProps, NormalizedItem } from '@/composables/use-normalized-items'
import type { SelectableProps } from '@/composables/use-selected-chips'

type CSelectBaseProps<T> = SelectableProps<T> & IterableItemsProps<T>

export type CSelectProps<T> = CSelectBaseProps<T> & {
    chips?: boolean
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
