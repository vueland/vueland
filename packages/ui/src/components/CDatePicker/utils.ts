export { type DateLocale,LOCALE } from './locales'

export function getMonth(date: Date) { return date.getMonth() }
export function getFullYear(date: Date) { return date.getFullYear() }
export function getDate(date: Date) { return date.getDate() }
export function getDay(date: Date) { return date.getDay() }

export function formatDate(date: Date, format: string, locale: DateLocale): string {
    const year = getFullYear(date)
    const month = getMonth(date) + 1
    const day = getDate(date)

    return format
        .replace(/dd/, ('0' + day).slice(-2))
        .replace(/d/, `${day}`)
        .replace(/yyyy/, `${year}`)
        .replace(/yy/, String(year).slice(2))
        .replace(/MMMM/, locale.months[getMonth(date)])
        .replace(/MMM/, locale.monthsAbbr[getMonth(date)])
        .replace(/MM/, ('0' + month).slice(-2))
        .replace(/M(?!a|ä|e)/, `${month}`)
        .replace(/D(?!e|é|i)/, locale.week[getDay(date)])
}
