import {
    computed,
    shallowRef,
    unref,
} from 'vue'

import { type IterableItemsProps, useNormalizedItems } from './use-normalized-items'
import { type SelectableProps, useSelectedChips } from './use-selected-chips'


export function useAutocomplete<T = any>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const normalizedItems = useNormalizedItems<T>(props as IterableItemsProps<T>)
    const {
        chips,
        hasValue,
        select,
    } = useSelectedChips(props)

    const inputValue = shallowRef()

    const normalizedInput = computed(() => unref(inputValue)?.trim().toLowerCase() ?? '')
    const isEqual = computed(() => unref(chips).includes(unref(normalizedInput)))

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
        chips,
        searchItems,
        hasValue,
        inputValue,
        select,
    }
}
