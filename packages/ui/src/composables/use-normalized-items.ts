import { computed } from 'vue'

export type Primitive =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined
    | Date

export type Path<T> = T extends Primitive
    ? never
    : T extends readonly unknown[]
        ? never
        : T extends object
            ? {
                [K in keyof T & string]: T[K] extends Primitive
                    ? K
                    : K | `${K}.${Path<T[K]>}`
            }[keyof T & string]
            : never

export type LoosePath<T> = Path<T> | (string & {})

export type IterableItemsProps<T> = {
    items: readonly T[]
    titleKey?: LoosePath<T>
    valueKey?: LoosePath<T>
}

export type NormalizedItem<T> = {
    raw: T
    title: unknown
    value: unknown
    key: string
}

function getByPath(item: unknown, path: string): unknown {
    if (!path) return item

    return path
        .split('.')
        .reduce<any>((acc, key) => acc?.[key], item)
}

export function useNormalizedItems<T>(props: IterableItemsProps<T>) {
    return computed<NormalizedItem<T>[]>(() => {
        return props.items.map((item, index) => {
            const title = props.titleKey
                ? getByPath(item, props.titleKey)
                : item

            const value = props.valueKey
                ? getByPath(item, props.valueKey)
                : item

            return {
                raw: item,
                title,
                value,
                key: `${title ?? index}`,
            }
        })
    })
}
