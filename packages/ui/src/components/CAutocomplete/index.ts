import CAutocompleteImpl from './CAutocomplete.vue'
import type { CAutocompletePublicProps, CAutocompleteSlots } from './types'

type CAutocompleteComponent = new <T>() => {
    $props: CAutocompletePublicProps<T>
    $slots: CAutocompleteSlots<T>
}

export const CAutocomplete = CAutocompleteImpl as unknown as CAutocompleteComponent
