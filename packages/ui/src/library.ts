import {
 type App, type ComponentInstance, type Directive, type FunctionalComponent 
} from 'vue'

import { createDialogsStack, useDisplay } from './composables'
import { $BREAKPOINTS_KEY, $DIALOGS_STACK_API_KEY,$VUELAND_UI_KEY } from './constants'
import type { IconAliases } from './enums'
import { IN_BROWSER } from './utils'

export type IconsOptions = {
    dir?: string,
    aliases?: Partial<Record<IconAliases, any>>,
    sets?: Record<string, any>
}

export interface LibOptions {
    components: Record<string, ComponentInstance<any> | FunctionalComponent>,
    directives?: Record<string, Directive>,
    themes?: Record<string, any>,
    icons?: IconsOptions,
    presets?: Record<string, Record<string, any>>
    ssr?: boolean
}

export class VuelandUI {
    themes: LibOptions['themes'] = {}
    icons: IconsOptions = {}
    presets: Record<string, Record<string, any>> = {}
    private installed: boolean = false

    install(app: App, options: LibOptions): void {
        if (this.installed) return

        this.installed = true
        this.icons = options.icons ?? {}
        this.themes = options.themes ?? {}
        this.presets = options.presets ?? {}

        const { components, directives = {} } = options

        for (const key in components) {
            if (components[key]) {
                app.component(key, components[key] as ComponentInstance<any>)
            }
        }

        for (const key in directives) {
            if (directives[key]) {
                app.directive(key, directives[key])
            }
        }

        const { createDisplay } = useDisplay()

        const display = createDisplay(options.ssr)
        const dialogsStack = createDialogsStack()

        app.provide($VUELAND_UI_KEY, this)
        app.provide($BREAKPOINTS_KEY, display)
        app.provide($DIALOGS_STACK_API_KEY, dialogsStack)

        const unmount = app.unmount

        if (IN_BROWSER) {
            window.addEventListener('resize', display.update)
        }

        app.unmount = (...args) => {
            window.removeEventListener('resize', display.update)
            unmount(...args)
        }

        if (options.ssr && (app as any).$nuxt) {
            (app as any).$nuxt.hook('app:suspense:resolve', () => {
                if (IN_BROWSER) {
                    display.update()
                }
            })
        }
    }
}
