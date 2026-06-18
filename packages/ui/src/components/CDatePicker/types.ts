export type DatePickerDate = {
    year: number
    month: number
    date: number | null
    day: number
    mls?: number
    isHoliday?: boolean
}

export type DisabledDates = {
    daysOfMonth?: number[]
    from?: Date | string
    to?: Date | string
    dates?: (Date | string)[]
    days?: number[]
    ranges?: Array<{ from: Date | string;
        to: Date | string }>
    custom?: (date: DatePickerDate) => boolean
}
