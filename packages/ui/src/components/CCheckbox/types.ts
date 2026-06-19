import type { VNode } from 'vue'

import type { CInputProps } from '../CInput'
import type { CSelectControlProps } from '../CSelectControl'

export type CCheckboxModel<T> = T | T[] | boolean

export type CCheckboxProps<T> = {
    modelValue: CCheckboxModel<T>
    value?: T
    size?: number
}

export type CCheckboxSlots = {
    icon(props: { checked: boolean }): VNode
    default(): VNode
}

export type CCheckboxEvents<T> = {
    (e: 'update:modelValue', value: T): void
}

export type CCheckboxPublicProps<T> =
    CCheckboxProps<T>
    & CSelectControlProps<T>
    & CInputProps<CCheckboxModel<T>>
