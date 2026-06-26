import type { CInputProps } from '@/components'

import CTextFieldImpl from './CTextField.vue'
import type {
    CTextFieldEmits,
    CTextFieldProps,
    CTextFieldSlots,
} from './types'

export type { CTextFieldProps, CTextFieldSlots }

type CTextFieldComponent = new <T = any>() => {
    $props: Omit<CInputProps, 'modelValue'> & CTextFieldProps<T>
    $slots: CTextFieldSlots
    $emits: CTextFieldEmits<T>
}

export const CTextField = CTextFieldImpl as unknown as CTextFieldComponent
