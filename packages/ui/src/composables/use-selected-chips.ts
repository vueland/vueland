import {
    computed,
    getCurrentInstance,
    useAttrs,
} from 'vue'

import { isDef, isNotEmpty } from '@/helpers'

import { getByPath, type IterableItemsProps } from './use-normalized-items'

export type SelectableProps<T> = {
    modelValue: T | T[]
    multiple?: boolean
    mandatory?: boolean
}

export function useSelectedChips<T>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const instance = getCurrentInstance()!
    const attrs = useAttrs()

    const { titleKey = '', valueKey } = props ?? {}

    const hasValue = computed(() =>
        props.multiple
            ? ((props.modelValue as T[] | undefined) ?? []).length > 0
            : isNotEmpty(props.modelValue),
    )

    const closable = computed(() => isDef(attrs.clearable))

    // Заголовок для чипа берём не из самого value (при valueKey там лежит value,
    // а не элемент), а находим исходный элемент по value и достаём из него title.
    const chips = computed(() => {
        const values = props.multiple
            ? props.modelValue as T[]
            : (isDef(props.modelValue) ? [props.modelValue as T] : [])

        return values.map((value: T) => {
            const item = props.items.find(it => (valueKey ? getByPath(it, valueKey) : it) === value)

            return item === undefined ? value : getByPath(item, titleKey)
        })
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
        closable,
        select,
    }
}
