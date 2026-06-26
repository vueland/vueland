import type { CInputProps, CInputSlots } from '@/components/CInput'

// import CSelectImpl from './CSelect.vue'
import CSelectNew from './CNewSelect.vue'
import type { CSelectProps, CSelectSlots } from './types'

export * from './types'

type CSelectComponent = new <T>() => {
    $props: CSelectProps<T> & CInputProps<T>
    $slots: CSelectSlots<T> & CInputSlots
}

export const CSelect = CSelectNew as unknown as CSelectComponent
