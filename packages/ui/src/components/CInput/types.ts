import type { VNode } from 'vue'

import type { PresetProps, ValidateProps, ValidateState } from '../../composables'

export interface InputState {
    focused: boolean
    isDirty: boolean
}

export type CInputKind = 'checkbox' | 'radio' | 'input' | 'area' | 'listbox'

export type CInputProps<T = any> = ValidateProps &
    PresetProps & {
        id?: string
        modelValue: T | T[] | undefined | null
        label?: string
        details?: string
        noDetails?: boolean
        clearable?: boolean
        disabled?: boolean
        focused?: boolean
        readonly?: boolean
        kind?: CInputKind
    }

export type CInputEmits<T = any> = {
    focus: [boolean]
    blur: [boolean]
    input: [T]
}

export type CInputDetailsSlotProps = {
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    validating: ValidateState['validating']
    uid: string
    details?: string
}

export type CInputFieldSlotProps<T = any> = {
    input(val: T): void
    focus(): void
    blur(): void
    reset(): void
    label?: string
    focused: boolean
    clearable?: boolean
    readonly?: boolean
    disabled?: boolean
    preset?: string
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    validating: ValidateState['validating']
    attrs: Record<string, any>
    uid: string
    validate(): boolean | Promise<boolean>
}

export type CInputSlots<T = any> = {
    details?(props: CInputDetailsSlotProps): VNode | string
    field?(props: CInputFieldSlotProps<T>): VNode
}
