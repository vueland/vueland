import { inject } from 'vue'

import type { ApplicationApi } from '../components'
import { $APP_API_KEY } from '../constants'

export function useApplication() {
    return inject($APP_API_KEY, {} as ApplicationApi)
}
