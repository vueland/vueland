import type { ComputedRef, InjectionKey } from 'vue'

import type { ApplicationApi } from '@/components/CApp/types'
import type { FormAPI } from '@/components/CForm/types'
import type { KeyboardAPI } from '@/components/CKeyboardProvider/types'
import type { ListAPI } from '@/components/CList/types'
import type { MenuAPI } from '@/components/CMenu/types'
import type { SelectControlAPI } from '@/components/CSelectControl/types'
import type { DialogsStackAPI } from '@/composables/use-dialogs-stack'
import type { Display } from '@/composables/use-display'
import type { VuelandUI } from '@/library'
import type {
    CDatePickerZone,
    Maybe,
    StatePresets,
} from '@/types'

export const $FORM_API_KEY: InjectionKey<FormAPI> = Symbol()
export const $KEYBOARD_API_KEY: InjectionKey<KeyboardAPI> = Symbol()
export const $LIST_API_KEY: InjectionKey<ListAPI> = Symbol()
export const $MENU_API_KEY: InjectionKey<MenuAPI> = Symbol()
export const $APP_API_KEY: InjectionKey<ApplicationApi> = Symbol()
export const $SELECT_CONTROL_API_KEY: InjectionKey<SelectControlAPI> = Symbol()
export const $BREAKPOINTS_KEY: InjectionKey<Display> = Symbol()
export const $VUELAND_UI_KEY: InjectionKey<VuelandUI> = Symbol()
export const $DIALOGS_STACK_API_KEY: InjectionKey<DialogsStackAPI> = Symbol()
export const $PRESET_KEY: InjectionKey<ComputedRef<Maybe<StatePresets<string, string>>>> = Symbol()
export const $DATE_PICKER_PRESET_KEY: InjectionKey<ComputedRef<Record<CDatePickerZone, string[]>>> = Symbol()
