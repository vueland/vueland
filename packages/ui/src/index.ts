import { type App, type Plugin } from 'vue'

import { type LibOptions, VuelandUI } from './library'

import './styles/styles.scss'

export * from './types'

export function createVuelandUI(options: LibOptions): Plugin {
    return {
        install(app: App, args?: Partial<LibOptions>) {
            const library = new VuelandUI()

            library.install(app, {
                ...options,
                ...args,
            })
        },
    }
}
