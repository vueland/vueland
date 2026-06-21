import { inject } from 'vue'

import { $SELECT_CONTROL_API_KEY } from '@/constants'

export function useSelectControl() {
    return inject($SELECT_CONTROL_API_KEY, null)
}
