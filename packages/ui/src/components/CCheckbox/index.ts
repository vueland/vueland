import type {
    CCheckboxEmits,
    CCheckboxPublicProps,
    CCheckboxSlots,
} from '@/components'

import CCheckboxImpl from './CCheckbox.vue'

export * from './types'

type CCheckboxComponent = new <T>() => {
    $props: CCheckboxPublicProps<T>
    $emit: CCheckboxEmits<T>
    $slots: CCheckboxSlots
}

export const CCheckbox = CCheckboxImpl as unknown as CCheckboxComponent
