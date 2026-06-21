import { inject } from 'vue'

import { $BREAKPOINTS_KEY } from '../constants'

export function useBreakpoints() {
    return inject($BREAKPOINTS_KEY)
}
