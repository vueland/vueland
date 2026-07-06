import {
    computed,
    getCurrentInstance,
    h,
    unref,
    useAttrs,
    useSlots,
} from 'vue'

import { CChip } from '@/components'
import { isDef, isNotEmpty } from '@/helpers'

import { getByPath, type IterableItemsProps } from './use-normalized-items'

export type SelectableProps<T> = {
    modelValue: T | T[] | undefined | null
    multiple?: boolean
    mandatory?: boolean
    chips?: boolean
}

export function useSelectedChips<T>(props: IterableItemsProps<T> & SelectableProps<T>) {
    const instance = getCurrentInstance()!
    const attrs = useAttrs()
    const slots = useSlots()

    const { titleKey = '', valueKey } = props ?? {}

    const hasValue = computed(() =>
        props.multiple
            ? ((props.modelValue as T[] | undefined) ?? []).length > 0
            : isNotEmpty(props.modelValue),
    )

    // Заголовок для чипа берём не из самого value (при valueKey там лежит value,
    // а не элемент), а находим исходный элемент по value и достаём из него title.
    const chips = computed(() => {
        const values = props.multiple
            ? ((props.modelValue as T[] | undefined) ?? [])
            : (isDef(props.modelValue) ? [props.modelValue as T] : [])

        return values.map((value: T) => {
            const item = props.items.find(it => (valueKey ? getByPath(it, valueKey) : it) === value)

            return item === undefined ? value : getByPath(item, titleKey)
        })
    })

    const textValue = computed(() => unref(chips).join(', '))

    // Как и дефолтный CList: повторный выбор снимает значение (toggle).
    function select(value: T) {
        if (!props.multiple) {
            return instance?.emit('update:modelValue', value)
        }

        const selected = (props.modelValue as T[] | undefined) ?? []

        instance?.emit(
            'update:modelValue',
            selected.includes(value)
                ? selected.filter(it => it !== value)
                : [...selected, value],
        )
    }

    function unselect(index: number) {
        if (!props.multiple) {
            return instance?.emit(
                'update:modelValue',
                undefined,
            )
        }

        instance?.emit(
            'update:modelValue',
            (props.modelValue as T[]).filter((_, i) => i !== index),
        )
    }

    const genChips = () => slots.chips?.({ items: unref(chips) }) ?? (unref(chips).map((it, i, arr) => h(props.chips ? CChip : 'div', props.chips ? {
        onClose: () => unselect(i),
        closable: isDef(attrs.clearable),
    } : {}, {
        default: () => it + (props.chips || i === arr.length - 1 ? '' : ','),
    })))

    return {
        hasValue,
        chips,
        textValue,
        select,
        unselect,
        genChips,
    }
}
