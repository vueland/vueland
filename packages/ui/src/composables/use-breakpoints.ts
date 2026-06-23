import { inject } from 'vue'

import { $BREAKPOINTS_KEY } from '@/constants'

import type { Display } from './use-display'

export function useBreakpoints(): Display {
    const display = inject($BREAKPOINTS_KEY)

    if (!display) {
        throw new Error('[VuelandUI] useBreakpoints() must be used after createVuelandUI() is installed.')
    }

    return display
}
