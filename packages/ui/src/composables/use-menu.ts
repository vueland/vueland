import { inject } from 'vue'

import { $MENU_API_KEY } from '../constants'

export function useMenu() {
    return inject($MENU_API_KEY, null)
}
