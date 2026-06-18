import { computed, shallowRef, unref } from 'vue'

import { type IterableItemsProps, useNormalizedItems } from './use-normalized-items'
import { type SelectableProps, useSelects } from './use-selects'

export function useAutocomplete<T = any>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const normalizedItems = useNormalizedItems<T>(props as IterableItemsProps<T>)

    const {
        selectedItems,
        hasValue,
        select,
    } = useSelects(props)


    const inputValue = shallowRef()

    const normalizedInput = computed(() => unref(inputValue)?.trim().toLowerCase() ?? '')
    const isEqual = computed(() => unref(selectedItems).includes(unref(normalizedInput)))

    const searchItems = computed(() => {
        if (unref(isEqual) || !unref(normalizedInput)) {
            return unref(normalizedItems)
        }

        return unref(normalizedItems).filter((it) => {
            return `${it.title}`.toLowerCase().startsWith(unref(normalizedInput))
        })
    })

    return {
        normalizedItems,
        selectedItems,
        searchItems,
        hasValue,
        inputValue,
        select,
    }
}
