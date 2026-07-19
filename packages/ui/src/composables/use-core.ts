import { inject } from 'vue'

import { $VUELAND_UI_KEY } from '@/constants'
import type { VuelandUI } from '@/library'
import type { Maybe } from '@/types'

export function useCore(): Maybe<VuelandUI> {
    return inject($VUELAND_UI_KEY, undefined)
}
