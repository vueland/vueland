import type { ComputedRef, VNodeChild } from 'vue'

import type {
    LoosePath,
    NormalizedItem,
} from '../../composables'
import type {
    ComponentPublicProps,
} from '../../utils'
import type {
    CInputFieldSlotProps,
    CInputProps,
} from '../CInput'

export type CAutocompleteOptions = {
    noItemsMessage?: string
    menuPreset?: string
}

export type CAutocompleteProps<T> = {
    items: T[]
    modelValue?: T | T[]
    titleKey?: LoosePath<T>
    valueKey?: LoosePath<T>
    multiple?: boolean
    mandatory?: boolean
    options?: CAutocompleteOptions
}

export type CAutocompletePublicProps<T> =
    CInputProps<T>
    & CAutocompleteProps<T>
    & {
    'onUpdate:modelValue'?: (value: T | T[] | undefined) => void
    'onUpdate:search'?: (value: string) => void
}

export type CAutocompleteSlots<T = unknown> = {
    menu: {
        items: NormalizedItem<T>[]
        onSelect(value: T): void
    }
    field: CInputFieldSlotProps
    prepend: never
    append: never
    selects: {
        selectedItems: ComputedRef<unknown[]>
    }
    details: {
        errorMessage?: string
        details?: string
    }
    'no-items-message': never
}

export type CAutocompleteEvents = {
    'update:search': [string]
}

export type CAutocompleteComponent = <T>(
    props: ComponentPublicProps<
        CAutocompletePublicProps<T>,
        CAutocompleteSlots<T>
    >,
) => VNodeChild
