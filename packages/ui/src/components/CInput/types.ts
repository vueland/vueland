import type { VNode } from 'vue'

import type { PresetProps } from '@/composables/use-presets'
import type { ValidateProps, ValidateState } from '@/composables/use-validate'
import type { CInputPreset } from '@/types'

export interface InputState {
    focused: boolean
    isDirty: boolean
}

export type CInputRole = 'combobox' | 'checkbox' | 'radio' | 'listbox'

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
        role?: CInputRole
    }

export type CInputEmits<T = any> = {
    (e: 'update:modelValue', value: T): void
    (e: 'update:focused', value: boolean): void
}

export type CInputDetailsSlotProps = {
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    validating: ValidateState['validating']
    uid: string
    details?: string
}

export type CInputFieldSlotProps = {
    focus(): void
    blur(): void
    reset(): void
    label?: string
    focused: boolean
    clearable?: boolean
    readonly?: boolean
    disabled?: boolean
    preset?: CInputPreset
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    validating: ValidateState['validating']
    attrs: Record<string, unknown>
    uid: string
    validate(): boolean | Promise<boolean>
}

export type CInputSlots = {
    details?(props: CInputDetailsSlotProps): VNode | string
    field?(props: CInputFieldSlotProps): VNode
}
