import type { InjectionKey } from 'vue'

import type { ApplicationApi } from '../components/CApp'
import type { FormAPI } from '../components/CForm'
import type { ListAPI } from '../components/CList'
import type { AppBreakpoints, DialogsStackAPI } from '../composables'

export const $FORM_API_KEY: InjectionKey<FormAPI> = Symbol()
export const $LIST_API_KEY: InjectionKey<ListAPI> = Symbol()
export const $MENU_API_KEY: InjectionKey<any> = Symbol()
export const $APP_API_KEY: InjectionKey<ApplicationApi> = Symbol()
export const $SELECT_CONTROL_API_KEY: InjectionKey<any> = Symbol()
export const $BREAKPOINTS_KEY: InjectionKey<AppBreakpoints> = Symbol()
export const $VUELAND_UI_KEY: InjectionKey<any> = Symbol()
export const $DIALOGS_STACK_API_KEY: InjectionKey<DialogsStackAPI> = Symbol()
