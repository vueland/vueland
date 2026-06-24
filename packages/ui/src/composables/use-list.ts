import { inject } from 'vue'

import type { ListAPI } from '@/components/CList'
import { $LIST_API_KEY } from '@/constants'

export function useList<T>() {
    return inject<ListAPI<T> | null>($LIST_API_KEY, null)
}
