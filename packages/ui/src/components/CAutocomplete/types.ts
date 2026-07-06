import type { VNode } from 'vue'

import type { CInputProps } from '@/components/CInput'
import type { IterableItemsProps, NormalizedItem } from '@/composables/use-normalized-items'
import type { SelectableProps } from '@/composables/use-selected-chips'

type CAutocompleteBaseProps<T> = IterableItemsProps<T> & SelectableProps<T>

export type CAutocompleteProps<T> = CAutocompleteBaseProps<T> & {
    options?: {
        noItemsMessage?: string
    },
}

export type CAutocompleteSlots<T> = {
    menu(props: {
        items: NormalizedItem<T>[]
        onSelect(val: T): void
    }): VNode
    prepend(): VNode
    append(): VNode
    chips(props: { items: unknown[] }): VNode[]
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
    ['no-items-message'](): string
}

export type CAutocompletePublicProps<T> = Omit<CInputProps<T>, 'modelValue' | 'role'> & CAutocompleteProps<T>

export type CAutocompleteEmits<T> = {
    (e: 'update:modelValue', val: T): void,
    (e: 'update:search', val: string): void,
}

export type CAutocompleteComponent = new <T>() => {
    $props: CAutocompletePublicProps<T>
    $slots: CAutocompleteSlots<T>
    $emit: CAutocompleteEmits<T>
}
