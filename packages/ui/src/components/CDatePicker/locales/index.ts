import en from './en.json'
import ru from './ru.json'

export type DateLocale = {
    months: string[]
    monthsAbbr: string[]
    week: string[]
}

export const LOCALE: Record<string, DateLocale> = {
    en,
    ru, 
}
