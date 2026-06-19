import type { VNode } from 'vue'

export type CFieldProps = {
    tag?: 'input' | 'textarea'
    label?: string
    filled?: boolean
    preset?: string
    focused?: boolean
    clearable?: boolean
    error?: boolean
    disabled?: boolean
    readonly?: boolean
    noInput?: boolean
    modelValue?: string | number | undefined | null
}

export type CFieldSlots = {
    prepend?(): VNode
    append?(): VNode
    before?(): VNode | VNode[]
    after?(): VNode | VNode[]
    clear?(): VNode
}
