import { inject } from 'vue'

import type { ListAPI } from '../components'
import { $LIST_API_KEY } from '../constants'

export function useList<T>() {
    return inject($LIST_API_KEY, null) as ListAPI<T>
}
