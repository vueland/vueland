import type { CInputProps } from '@/components/CInput'

import CDateInputImpl from './CDateInput.vue'
import type { CDateInputProps, CDateInputSlots } from './types'

export * from './types'

type CDateInputComponent = new () => {
    $props: CDateInputProps & CInputProps<Date>
    $slots: CDateInputSlots
}

export const CDateInput = CDateInputImpl as unknown as CDateInputComponent
