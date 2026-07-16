export type DateLocale = {
    months: string[]
    monthsAbbr: string[]
    week: string[]
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i)
const DAYS = Array.from({ length: 7 }, (_, i) => i)

const cache = new Map<string, DateLocale>()

// Неподдерживаемый или битый тег не роняет пикер и не зависит от системной локали
function normalizeLang(lang: string): string {
    try {
        return Intl.DateTimeFormat.supportedLocalesOf(lang)[0] ?? 'en'
    } catch {
        return 'en'
    }
}

/**
 * Единый резолв словаря: строка — языковой тег для Intl,
 * объект — точечное переопределение поверх en
 */
export function mergeLocale(locale?: string | Partial<DateLocale>): DateLocale {
    if (typeof locale === 'string') {
        return resolveLocale(locale)
    }

    return {
        ...resolveLocale('en'),
        ...locale,
    }
}

/**
 * Словарь строится из Intl — без локалей в бандле, работает любой BCP-47 тег.
 * 2023-01-01 — воскресенье: неделя собирается с него, индексы совпадают с Date#getDay.
 */
export function resolveLocale(lang: string): DateLocale {
    const tag = normalizeLang(lang)

    let locale = cache.get(tag)

    if (!locale) {
        const month = new Intl.DateTimeFormat(tag, { month: 'long' })
        const monthAbbr = new Intl.DateTimeFormat(tag, { month: 'short' })
        const weekday = new Intl.DateTimeFormat(tag, { weekday: 'short' })

        locale = {
            months: MONTHS.map((m) => month.format(new Date(2023, m, 1))),
            monthsAbbr: MONTHS.map((m) => monthAbbr.format(new Date(2023, m, 1))),
            week: DAYS.map((d) => weekday.format(new Date(2023, 0, 1 + d))),
        }

        cache.set(tag, locale)
    }

    return locale
}
