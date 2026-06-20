import type { VNode } from 'vue'

export interface CSelectControlProps<T = any> {
    modelValue: T | T[] | boolean
    value?: T
    multiple?: boolean
    focused?: boolean
    disabled?: boolean
    readonly?: boolean
    name?: string
}

export interface CSelectControlSlots {
    default(props: {
        checked: boolean
        disabled: boolean
        readonly: boolean
        toggle: () => void
    }): VNode
}
