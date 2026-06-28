import { computed, getCurrentInstance } from 'vue'

import { isNotEmpty } from '@/helpers'

import type { IterableItemsProps } from './use-normalized-items'

export type SelectableProps<T> = {
    modelValue: T | T[]
    multiple?: boolean
    mandatory?: boolean
}

export function useSelectedChips<T>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const instance = getCurrentInstance()!

    const { titleKey = '' } = props ?? {}

    const hasValue = computed(() =>
        props.multiple
            ? ((props.modelValue as T[] | undefined) ?? []).length > 0
            : isNotEmpty(props.modelValue),
    )

    const chips = computed(() => {
        if (props.multiple) {
            return ((props.modelValue as T[] | undefined) ?? []).map(
                (it: T) => (it as T)?.[titleKey] ?? it,
            )
        }

        const value = props.modelValue as T | undefined

        return [value ? `${(value as T)?.[titleKey] ?? value}` : '']
    })

    function select(value: T) {
        instance?.emit(
            'update:modelValue',
            props.multiple ? [...((props.modelValue as T[] | undefined) ?? []), value] : value,
        )
    }

    return {
        hasValue,
        chips,
        select,
    }
}
