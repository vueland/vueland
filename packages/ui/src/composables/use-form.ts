import { inject } from 'vue'

import { $FORM_API_KEY } from '@/constants'

export function useForm() {
    return inject($FORM_API_KEY, null)
}
