import {
    computed,
    shallowRef,
    unref,
} from 'vue'

import { type IterableItemsProps, useNormalizedItems } from './use-normalized-items'
import { type SelectableProps } from './use-selected-chips'

export function useAutocomplete<T = any>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const normalizedItems = useNormalizedItems<T>(props as IterableItemsProps<T>)

    const inputValue = shallowRef()

    const normalizedInput = computed(() => unref(inputValue)?.trim().toLowerCase() ?? '')

    const searchItems = computed(() => {
        if (!unref(normalizedInput)) {
            return unref(normalizedItems)
        }

        return unref(normalizedItems).filter((it) => {
            return `${it.title}`.toLowerCase().startsWith(unref(normalizedInput))
        })
    })

    return {
        normalizedItems,
        searchItems,
        inputValue,
    }
}
