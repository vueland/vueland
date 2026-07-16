import type { VNodeChild } from 'vue'

import type { PresetProps } from '@/composables/use-presets'
import type { CDatePickerZone } from '@/types'

import type { DateLocale } from './locales'

export type DatePickerDate = {
    year: number
    month: number
    date: number
    day: number
    mls: number
    isHoliday?: boolean
    isHighlighted?: boolean
}

export type DisabledDates = {
    daysOfMonth?: number[]
    from?: Date | string
    to?: Date | string
    dates?: (Date | string)[]
    days?: number[]
    ranges?: { from: Date | string, to: Date | string }[]
    custom?: (date: DatePickerDate) => boolean
}

export type DatePickerView = 'dates' | 'months' | 'years'

export type DatePickerWeekDay = {
    day: number
    label: string | undefined
}

export type DatePickerEnrichedDate = {
    dateObj: DatePickerDate | null
    empty: boolean
    disabled: boolean
    highlighted: boolean
    isSelected: boolean
    isToday: boolean
    isFocused: boolean
}

export type DatePickerEnrichedMonth = {
    month: number
    label: string
    disabled: boolean
    isSelected: boolean
    isCurrent: boolean
    isFocused: boolean
    onSelect: () => void
}

export type DatePickerEnrichedYear = {
    year: number
    isSelected: boolean
    isCurrent: boolean
    isFocused: boolean
    onSelect: () => void
}

// Контракт, который каждая вьюха (dates/months/years) отдаёт через defineExpose.
// Клавиатура сюда не входит: вьюхи сами регистрируются в клавиатурном контуре.
export type DatePickerViewApi = {
    showNextPage: () => void
    showPreviousPage: () => void
}

export type DatePickerSlotApi = {
    view: DatePickerView
    value: string
    selected: DatePickerDate | null
    disablePrev: boolean
    disableNext: boolean
    // Те же зоны пресета, что применяет внутренний рендер, — для кастомных слотов
    preset: Record<CDatePickerZone, string[]>
    showNextPage: () => void
    showPreviousPage: () => void
    toggleView: () => void
    showToday: () => void
}

// CDatePickerHeader

export type DatePickerHeaderProps = {
    disablePrev: boolean
    disableNext: boolean
}

export type DatePickerHeaderEmits = {
    (e: 'next-page'): void
    (e: 'previous-page'): void
    (e: 'toggle-view'): void
}

export type DatePickerHeaderSlots = {
    default?(): VNodeChild
    actions?(): VNodeChild
}

// CDatePickerDates

export type DatePickerDatesProps = {
    locale?: string[]
    year: number
    month: number
    modelValue?: DatePickerDate | null
    mondayFirst?: boolean
    disabledDates?: DisabledDates
    highlightedDates?: (Date | string)[]
    minDate?: DatePickerDate | null
    maxDate?: DatePickerDate | null
}

export type DatePickerDatesEmits = {
    (e: 'update:modelValue', date: DatePickerDate): void
    (e: 'update:month', params: { month: number;
        year: number }): void
}

export type DatePickerDatesSlots = {
    week?(props: { days: DatePickerWeekDay[] }): VNodeChild
    dates?(props: {
        dates: DatePickerEnrichedDate[]
        onSelect: (date: DatePickerDate) => void
    }): VNodeChild
    date?(props: DatePickerDate & {
        isSelected: boolean
        isToday: boolean
    }): VNodeChild
}

// CDatePickerMonths

export type DatePickerMonthsProps = {
    month: number
    year: number
    value?: DatePickerDate | null
    locale?: string[]
    minDate?: DatePickerDate | null
    maxDate?: DatePickerDate | null
}

export type DatePickerMonthsEmits = {
    (e: 'update:month', month: number): void
    (e: 'update:year', year: number): void
}

export type DatePickerMonthsSlots = {
    months?(props: { months: DatePickerEnrichedMonth[] }): VNodeChild
    month?(props: DatePickerEnrichedMonth): VNodeChild
}

// CDatePickerYears

export type DatePickerYearsProps = {
    year: number
    value?: DatePickerDate | null
    minYear?: number
    maxYear?: number
}

export type DatePickerYearsEmits = {
    (e: 'update:year', year: number): void
}

export type DatePickerYearsSlots = {
    years?(props: { years: DatePickerEnrichedYear[] }): VNodeChild
    year?(props: DatePickerEnrichedYear): VNodeChild
}

// CDatePicker

export type CDatePickerProps = PresetProps & {
    modelValue?: Date | string | null
    // Языковой тег (BCP-47) либо точечное переопределение Intl-словаря (база — en)
    locale?: string | Partial<DateLocale>
    mondayFirst?: boolean
    disabledDates?: DisabledDates
    highlightedDates?: (Date | string)[]
    minDate?: Date | string
    maxDate?: Date | string
}

export type CDatePickerEmits = {
    (e: 'update:modelValue', value: Date | null): void
}

// Родительский пикер прокидывает слоты вьюх как есть — контракт общий
export type CDatePickerSlots = DatePickerDatesSlots & DatePickerMonthsSlots & DatePickerYearsSlots & {
    'before-header'?(props: DatePickerSlotApi): VNodeChild
    'before-body'?(props: DatePickerSlotApi): VNodeChild
    footer?(props: DatePickerSlotApi): VNodeChild
}
