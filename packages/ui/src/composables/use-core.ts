import { inject } from 'vue'

import { $VUELAND_UI_KEY } from '@/constants'
import type { VuelandUI } from '@/library'

export function useCore(): VuelandUI {
    return inject($VUELAND_UI_KEY, null)
}
