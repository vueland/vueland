import type { InjectionKey } from 'vue'

import type { ApplicationApi, FormAPI, ListAPI } from '../components'
import type { AppBreakpoints, DialogsStackApi } from '../composables'

export const $FORM_API_KEY: InjectionKey<FormAPI> = Symbol()
export const $LIST_API_KEY: InjectionKey<ListAPI> = Symbol()
export const $MENU_API_KEY: InjectionKey<any> = Symbol()
export const $APP_API_KEY: InjectionKey<ApplicationApi> = Symbol()
export const $SELECT_CONTROL_API_KEY: InjectionKey<any> = Symbol()
export const $BREAKPOINTS_KEY: InjectionKey<AppBreakpoints> = Symbol()
export const $VUELAND_UI_KEY: InjectionKey<any> = Symbol()
export const $DIALOGS_STACK_API_KEY: InjectionKey<DialogsStackApi> = Symbol()
