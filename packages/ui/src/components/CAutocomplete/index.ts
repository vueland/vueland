import CAutocompleteImpl from './CAutocomplete.vue'
import type { CAutocompletePublicProps, CAutocompleteSlots } from './types'

export type CAutocompleteEmits<T> = {
    (e: 'update:modelValur', val: T): void,
    (e: 'update:search', val: string): void,
}

type CAutocompleteComponent = new <T>() => {
    $props: CAutocompletePublicProps<T>
    $slots: CAutocompleteSlots<T>
    $emit: CAutocompleteEmits<T>
}

export const CAutocomplete = CAutocompleteImpl as unknown as CAutocompleteComponent
