import type { VNode } from 'vue'

export type CFieldProps = {
    tag?: 'input' | 'textarea'
    label?: string
    preset?: string
    focused?: boolean
    clearable?: boolean
    error?: boolean
    disabled?: boolean
    dirty?: boolean
    readonly?: boolean
    modelValue?: string | number | undefined | null
}

export type CFieldSlots = {
    prepend?(): VNode
    append?(): VNode
    before?(): VNode | VNode[]
    after?(): VNode | VNode[]
    clear?(): VNode
}
