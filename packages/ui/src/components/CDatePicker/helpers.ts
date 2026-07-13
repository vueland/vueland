import { type DateLocale, mergeLocale } from './locales'
import type { DatePickerDate, DisabledDates } from './types'

// Режет плоский список ячеек на строки сетки
export function chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = []

    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size))
    }

    return result
}

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function isDateOnlyString(value: string): boolean {
    return DATE_ONLY_PATTERN.test(value)
}

function parseDateOnlyString(value: string): Date | null {
    const match = DATE_ONLY_PATTERN.exec(value)

    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(year, month - 1, day)

    const exists = date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day

    return exists ? date : null
}

function toDate(value: Date | string): Date {
    if (typeof value === 'string') {
        if (!isDateOnlyString(value)) {
            return new Date(value)
        }

        return parseDateOnlyString(value) ?? new Date(Number.NaN)
    }

    return value
}

export function parseDate(value: Date | string): DatePickerDate {
    const date = toDate(value)

    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        day: date.getDay(),
        mls: date.getTime(),
    }
}

export function isValidDateValue(value: Date | string | null | undefined): value is Date | string {
    if (!value) {
        return false
    }

    return Number.isFinite(toDate(value).getTime())
}

// Один проход по строке формата: подставленные названия не перечитываются,
// поэтому токены не срабатывают внутри имён месяцев и дней
export function formatDate(date: Date, format: string, locale: DateLocale): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const tokens: Record<string, string> = {
        yyyy: `${year}`,
        yy: `${year}`.slice(2),
        MMMM: locale.months[date.getMonth()],
        MMM: locale.monthsAbbr[date.getMonth()],
        MM: `${month}`.padStart(2, '0'),
        M: `${month}`,
        dd: `${day}`.padStart(2, '0'),
        d: `${day}`,
        D: locale.week[date.getDay()],
    }

    return format.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|D/g, (token) => tokens[token])
}

const DATE_PATTERNS: Record<string, string> = {
    yyyy: '(\\d{4})',
    yy: '(\\d{2})',
    MM: '(\\d{2})',
    M: '(\\d{1,2})',
    dd: '(\\d{2})',
    d: '(\\d{1,2})',
}

/**
 * Строгий разбор по маске числового формата — обратный к formatDate.
 * Дата возвращается только когда строка совпала с маской целиком и существует
 * в календаре; частичный или чужой ввод — null.
 */
export function parseDateString(value: string, format: string): Date | null {
    const tokens: string[] = []

    const pattern = format
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/yyyy|yy|MM|M|dd|d/g, (token) => {
            tokens.push(token)
            return DATE_PATTERNS[token]
        })

    const match = new RegExp(`^${pattern}$`).exec(value.trim())

    if (!match) {
        return null
    }

    const parts: Partial<Record<'y' | 'M' | 'd', number>> = {}

    tokens.forEach((token, i) => {
        parts[token[0] as 'y' | 'M' | 'd'] = Number(match[i + 1])
    })

    if (parts.y === undefined || parts.M === undefined || parts.d === undefined) {
        return null
    }

    const year = parts.y < 100 ? 2000 + parts.y : parts.y
    const date = new Date(year, parts.M - 1, parts.d)

    const exists = date.getFullYear() === year
        && date.getMonth() === parts.M - 1
        && date.getDate() === parts.d

    return exists ? date : null
}

export function isEqualDates(a: DatePickerDate, b?: DatePickerDate | null): boolean {
    if (!b) return false

    return a.date === b.date
        && a.month === b.month
        && a.year === b.year
}

// from/to — открытый с одной стороны диапазон: заданы обе границы, только from или только to
function isInDisabledSpan(mls: number, disabledDates?: DisabledDates): boolean {
    const from = isValidDateValue(disabledDates?.from) ? parseDate(disabledDates.from).mls : 0
    const to = isValidDateValue(disabledDates?.to) ? parseDate(disabledDates.to).mls : 0

    if (from && to) return mls >= from && mls <= to
    if (from) return mls >= from
    if (to) return mls <= to

    return false
}

type DisabledBounds = {
    disabledDates?: DisabledDates
    minDate?: DatePickerDate | null
    maxDate?: DatePickerDate | null
}

// Единственный источник истины «дата запрещена» — для сетки и для ручного ввода
export function isDateDisabled(date: DatePickerDate, bounds: DisabledBounds): boolean {
    const {
        disabledDates,
        minDate,
        maxDate,
    } = bounds
    const { mls } = date

    if (minDate && mls < minDate.mls) return true
    if (maxDate && mls > maxDate.mls) return true
    if (disabledDates?.daysOfMonth?.includes(date.date)) return true
    if (disabledDates?.days?.includes(date.day)) return true
    if (disabledDates?.dates?.some((d) => isValidDateValue(d) && isEqualDates(date, parseDate(d)))) return true
    if (isInDisabledSpan(mls, disabledDates)) return true
    if (disabledDates?.ranges?.some((r) => {
        if (!isValidDateValue(r.from) || !isValidDateValue(r.to)) {
            return false
        }

        const from = parseDate(r.from)
        const to = parseDate(r.to)

        return mls >= from.mls && mls <= to.mls
    })) return true

    return !!disabledDates?.custom?.(date)
}

export function dateToFormatString(
    value: Date | string | null | undefined,
    format: string,
    locale?: string | Partial<DateLocale>,
): string {
    if (!value) {
        return ''
    }

    try {
        if (!isValidDateValue(value)) {
            return ''
        }

        return formatDate(toDate(value), format, mergeLocale(locale))
    } catch {
        return ''
    }
}
