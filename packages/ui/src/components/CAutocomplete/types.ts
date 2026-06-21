import type { VNode } from 'vue'

import type { CInputProps, CInputSlots } from '@/components/CInput'
import type {
    IterableItemsProps,
    NormalizedItem,
    SelectableProps,
} from '@/composables'

export type CAutocompleteProps<T> =
    IterableItemsProps<T>
    & SelectableProps<T>
    & {
    options?: {
        noItemsMessage?: string
        menuPreset?: string
    },
}

export type CAutocompleteSlots<T> = {
    menu(props: { items: NormalizedItem<T>[], onSelect(val: T): void }): void
    field: CInputSlots['field']
    prepend(): VNode
    append(): VNode
    chips(props: { items: T[] }): VNode[]
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
    ['no-items-message'](): string
}

export type CAutocompletePublicProps<T> = CInputProps<T> & CAutocompleteProps<T>
