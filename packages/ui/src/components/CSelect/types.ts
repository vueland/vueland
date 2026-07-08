import type { VNode } from 'vue'

import type { KeyboardAPI } from '@/components/CKeyboardProvider/types'
import type { IterableItemsProps, NormalizedItem } from '@/composables/use-normalized-items'
import type { SelectableProps } from '@/composables/use-selected-chips'

type CSelectBaseProps<T> = SelectableProps<T> & IterableItemsProps<T>

export type CSelectProps<T> = CSelectBaseProps<T> & {
    options?: {
        noItemsMessage?: string
    },
}

export type CSelectSlots<T> = {
    menu(props: {
        items: NormalizedItem<T>[]
        onSelect(val: T): void
    } & KeyboardAPI): VNode
    prepend?(): VNode
    append?(): VNode
    chips(props: {
        items: unknown[]
    }): VNode[]
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
    ['no-items-message'](): string
}
