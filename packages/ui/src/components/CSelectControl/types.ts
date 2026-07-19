import type { ComputedRef, VNode } from 'vue'

export interface CSelectControlProps<T = any> {
    modelValue: T | T[] | boolean
    value?: T
    multiple?: boolean
    focused?: boolean
    disabled?: boolean
    readonly?: boolean
    name?: string
}

export interface SelectControlAPI {
    checked: ComputedRef<boolean>
    toggle(): void
    checkOn(): void
    checkOff(): void
}

export interface CSelectControlSlots {
    default(props: {
        checked: boolean
        disabled: boolean
        readonly: boolean
        toggle: () => void
    }): VNode
}
