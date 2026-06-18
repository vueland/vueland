import type { DatePickerDate } from './types'
import {
    getDate,
    getDay,
    getFullYear,
    getMonth,
} from './utils'

export function toDateString(date: DatePickerDate): Date {
    return new Date(date.year, date.month, date.date as number)
}

export function parseDate(selectedDate: Date | string): DatePickerDate {
    const date = new Date(selectedDate)
    return {
        year: getFullYear(date),
        month: getMonth(date),
        date: getDate(date),
        mls: date.getTime(),
        day: getDay(date),
    }
}
