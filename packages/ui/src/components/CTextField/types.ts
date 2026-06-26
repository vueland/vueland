import type { VNode } from 'vue'

export type CTextFieldProps<T> = {
    modelValue?: T
    noInput?: boolean
    filled?: boolean
}

export type CTextFieldSlots = {
    prepend?(): VNode
    append?(): VNode
    details(props: {
        errorMessage?: string
        details?: string
        hasError: boolean
        validating?: boolean
    }): VNode
    before?(): VNode
    menu?(props: { id: string }): VNode
}

export type CTextFieldEmits<T = any> = {
    (e: 'update:modelValue', val: T) :void
}
