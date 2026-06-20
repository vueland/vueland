import { LOCALE } from './locales'
import { formatDate } from './utils'

export type {
    CDatePickerProps, DatePickerEnrichedDate, DatePickerEnrichedMonth, DatePickerEnrichedYear, DatePickerSlotApi, DatePickerWeekDay, 
} from './CDatePicker.vue'
export { default as CDatePicker } from './CDatePicker.vue'
export type { DateLocale } from './locales'
export type {
    DatePickerDate, DisabledDates, 
} from './types'

export function datePickerValueToString(value: Date | string | null | undefined, format: string, lang: string): string {
    if (!value) return ''
    try { return formatDate(new Date(value), format, LOCALE[lang] ?? LOCALE['en']) } catch { return '' }
}
