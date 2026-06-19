import CTextFieldImpl from './CTextField.vue'
import type {
    CTextFieldEmits,
    CTextFieldProps,
    CTextFieldSlots,
} from './types'

export type { CTextFieldProps, CTextFieldSlots }

type CTextFieldComponent = new <T = any>() => {
    $props: CTextFieldProps & { modelValue?: T }
    $slots: CTextFieldSlots
    $emits: CTextFieldEmits<T>
}

export const CTextField = CTextFieldImpl as unknown as CTextFieldComponent
