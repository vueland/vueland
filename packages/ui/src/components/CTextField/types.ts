import type { VNode } from 'vue'

import type { CInputProps } from '../CInput'

export type CTextFieldProps = Omit<CInputProps, 'modelValue' | 'kind'>

export type CTextFieldSlots = {
    prepend(): VNode
    append(): VNode
    details(props: {
        errorMessage?: string
        details?: string
        hasError: boolean
    }): VNode
}

export type CTextFieldEmits<T = any> = {
    (e: 'update:modelValue', val: T) :void
}
