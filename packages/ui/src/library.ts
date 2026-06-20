import {
    type App,
    type ComponentInstance,
    type Directive,
    type FunctionalComponent,
} from 'vue'

import {
    breakpoints,
    createDialogsStack,
    useDisplay,
} from './composables'
import {
    $BREAKPOINTS_KEY,
    $DIALOGS_STACK_API_KEY,
    $VUELAND_UI_KEY,
} from './constants'
import { BreakpointLabels, type IconAliases } from './enums'
import { buildVars } from './helpers'
import { type ThemesOptions } from './types'
import { IN_BROWSER } from './utils'

declare const __VUELAND_BREAKPOINTS__: Record<string, number> | undefined

export type IconsOptions = {
    dir?: string
    aliases?: Partial<Record<IconAliases, any>>
    sets?: Record<string, any>
}

export interface LibOptions {
    components: Record<string, ComponentInstance<any> | FunctionalComponent>
    directives?: Record<string, Directive>
    themes?: ThemesOptions
    breakpoints?: Record<BreakpointLabels, number>
    icons?: IconsOptions
    presets?: Record<string, Record<string, any>>
    theme?: string
    ssr?: boolean
}

export class VuelandUI {
    themes: ThemesOptions = {}
    icons: IconsOptions = {}
    presets: Record<string, Record<string, any>> = {}
    breakpoints: Record<BreakpointLabels, number> = breakpoints
    theme?: string
    private installed: boolean = false

    applyTheme(name: string): void {
        const theme = this.themes[name]

        if (!theme) {
            console.warn(`[VuelandUI] Theme "${name}" not found.`)
            return
        }

        if (IN_BROWSER) {
            const root = document.documentElement

            buildVars(theme).forEach(([prop, val]) => root.style.setProperty(prop, val))

            this.theme = name
        }
    }

    install(app: App, options: LibOptions): void {
        if (this.installed) return

        this.installed = true
        this.icons = options.icons ?? {}
        this.themes = options.themes ?? {}
        this.presets = options.presets ?? {}

        const injectedBreakpoints =
            typeof __VUELAND_BREAKPOINTS__ !== 'undefined'
                ? (__VUELAND_BREAKPOINTS__ as Record<BreakpointLabels, number>)
                : undefined

        const resolvedBreakpoints = options.breakpoints ?? injectedBreakpoints ?? breakpoints

        this.breakpoints = resolvedBreakpoints

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

        const display = createDisplay(resolvedBreakpoints)
        const dialogsStack = createDialogsStack()

        app.provide($VUELAND_UI_KEY, this)
        app.provide($BREAKPOINTS_KEY, display)
        app.provide($DIALOGS_STACK_API_KEY, dialogsStack)

        if (IN_BROWSER) {
            const initialTheme = options.theme ?? Object.keys(this.themes)[0]

            if (initialTheme) {
                this.applyTheme(initialTheme)
            }

            window.addEventListener('resize', display.update)
        }

        const unmount = app.unmount

        app.unmount = (...args) => {
            window.removeEventListener('resize', display.update)
            unmount(...args)
        }

        if (options.ssr && (app as any).$nuxt) {
            ;(app as any).$nuxt.hook('app:suspense:resolve', () => {
                if (IN_BROWSER) {
                    display.update()
                }
            })
        }
    }
}
