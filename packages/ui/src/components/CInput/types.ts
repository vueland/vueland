import type { VNodeChild } from 'vue'

import type {
    PresetProps,
    ValidateProps,
    ValidateState,
} from '../../composables'

export interface InputState {
    focused: boolean
    isDirty: boolean
}

export type CInputKind =
    | 'checkbox'
    | 'radio'
    | 'input'
    | 'area'
    | 'listbox'

export type CInputProps<T = any> =
    ValidateProps &
    PresetProps & {
    id?: string
    modelValue?: T
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

export type CInputLabelSlotProps = {
    uid: string
}

export type CInputDetailsSlotProps = {
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    uid: string
    details?: string
}

export type CInputFieldSlotProps<T = any> = {
    input(val: T): void
    focus(): void
    blur(): void
    reset(): void
    label?: string
    readonly?: boolean
    focused: boolean
    disabled?: boolean
    clearable?: boolean
    preset?: string
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    attrs: Record<string, any>
    uid: string
    validate(): boolean
}

export type CInputSlots<T = any> = {
    label?(props: CInputLabelSlotProps): VNodeChild

    details?(props: CInputDetailsSlotProps): VNodeChild

    field: CInputFieldSlotProps<T>
}
