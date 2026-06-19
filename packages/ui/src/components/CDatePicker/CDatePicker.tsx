import {
    computed,
    defineComponent,
    type PropType,
    provide,
    reactive,
    type SlotsType,
    Transition,
    unref,
} from 'vue'

import { $DATE_PICKER_API_KEY } from '../../constants'
import { propsFactory } from '../../utils'

import { CDatePickerDates } from './CDatePickerDates'
import { CDatePickerHeader } from './CDatePickerHeader'
import { CDatePickerMonths } from './CDatePickerMonths'
import { CDatePickerYears } from './CDatePickerYears'
import { parseDate } from './helpers'
import type { DatePickerDate, DisabledDates } from './types'
import { formatDate, LOCALE } from './utils'

type ViewMode = 'dates' | 'months' | 'years'

export type DatePickerSlotApi = {
    view: ViewMode
    value: string
    selected: DatePickerDate
    prevDisabled: boolean
    nextDisabled: boolean
    onNext: () => void
    onPrev: () => void
    onTable: () => void
    onToday: () => void
}

export type DatePickerWeekDay = {
    day: number;
    label: string | undefined
}

export type DatePickerEnrichedDate = {
    dateObj: DatePickerDate | null
    empty: boolean
    disabled: boolean
    highlighted: boolean
    isSelected: boolean
    isToday: boolean
}

export type DatePickerEnrichedMonth = {
    month: number
    label: string
    disabled: boolean
    isSelected: boolean
    isCurrent: boolean
    onSelect: () => void
}

export type DatePickerEnrichedYear = {
    year: number
    disabled: boolean
    isSelected: boolean
    isCurrent: boolean
    onSelect: () => void
}

type CDatePickerSlots = SlotsType<{
    'before-header': DatePickerSlotApi
    header: DatePickerSlotApi
    'before-body': DatePickerSlotApi
    body: DatePickerSlotApi
    footer: DatePickerSlotApi
    week: { days: DatePickerWeekDay[] }
    dates: { dates: DatePickerEnrichedDate[];
        onSelect: (d: DatePickerDate) => void }
    date: DatePickerDate & { isSelected: boolean;
        isToday: boolean }
    months: DatePickerEnrichedMonth[]
    month: DatePickerEnrichedMonth
    years: DatePickerEnrichedYear[]
    year: DatePickerEnrichedYear
}>

export const makeCDatePickerProps = propsFactory({
    modelValue: [Date, String, null] as PropType<Date | string | null>,
    lang: {
        type: String as PropType<string>,
        default: 'en',
    },
    format: {
        type: String,
        default: 'dd.MM.yyyy',
    },
    mondayFirst: Boolean,
    disabledDates: Object as PropType<DisabledDates>,
    highlightedDates: Array as PropType<(Date | string)[]>,
    minDate: [Date, String] as PropType<Date | string>,
    maxDate: [Date, String] as PropType<Date | string>,
})

export const CDatePicker = defineComponent({
    name: 'CDatePicker',
    props: makeCDatePickerProps(),
    emits: {
        'update:modelValue': (_value: Date | null) => !!_value,
        selected: (_value: Date | null) => !!_value,
    },
    slots: Object as CDatePickerSlots,
    setup(props, { emit, slots }) {
        const locale = computed(() => LOCALE[props.lang] ?? LOCALE['en'])

        const handlers = {
            onNext: () => {},
            onPrev: () => {},
        }

        provide($DATE_PICKER_API_KEY, handlers)

        const today = parseDate(new Date())

        const selected = computed<DatePickerDate>(() =>
            props.modelValue ? parseDate(new Date(props.modelValue)) : today,
        )

        const minDate = computed(() => props.minDate ? parseDate(new Date(props.minDate)) : null)
        const maxDate = computed(() => props.maxDate ? parseDate(new Date(props.maxDate)) : null)

        const state = reactive<{
            tableMonth: number
            tableYear: number
            view: ViewMode
            bodyTransition: string
        }>({
            tableMonth: selected.value.month,
            tableYear: selected.value.year,
            view: 'dates',
            bodyTransition: 'c-date-slide-left',
        })

        const headerValue = computed(() => {
            if (state.view === 'years') return `${state.tableYear}`
            if (state.view === 'months') return `${state.tableYear}`
            return `${locale.value.monthsAbbr[state.tableMonth]} ${state.tableYear}`
        })

        const displayYear = computed(() => selected.value.year)
        const displayDate = computed(() => {
            const {
                month,
                date,
                day,
            } = unref(selected)

            return `${locale.value.monthsAbbr[month]} ${date}, ${locale.value.week[day]}`
        })

        const prevDisabled = computed(() => {
            if (!minDate.value) return false

            if (state.view === 'dates') {
                return state.tableYear <= minDate.value.year && state.tableMonth <= minDate.value.month
            }

            if (state.view === 'months') return state.tableYear <= minDate.value.year

            return false
        })

        const nextDisabled = computed(() => {
            if (!maxDate.value) return false

            if (state.view === 'dates') {
                return state.tableYear >= maxDate.value.year && state.tableMonth >= maxDate.value.month
            }

            if (state.view === 'months') return state.tableYear >= maxDate.value.year

            return false
        })

        function onTableToggle() {
            if (state.view === 'dates') {
                state.bodyTransition = 'c-date-slide-up'; state.view = 'months'
                return
            }

            if (state.view === 'months') {
                state.bodyTransition = 'c-date-slide-up'; state.view = 'years'
                return
            }

            if (state.view === 'years') {
                state.bodyTransition = 'c-date-slide-down'
                state.view = 'months'
            }
        }

        function onYearUpdate(year: number) {
            state.tableYear = year
            state.bodyTransition = 'c-date-slide-down'
            state.view = 'months'
        }

        function onMonthUpdate(month: number) {
            state.tableMonth = month
            state.bodyTransition = 'c-date-slide-down'
            state.view = 'dates'
        }

        function onMonthChange(params: { month: number;
            year?: number }) {
            state.tableMonth = params.month
            if (params.year !== undefined) state.tableYear = params.year
        }

        function onDateSelect(date: DatePickerDate) {
            state.tableMonth = date.month
            state.tableYear = date.year
            const value = new Date(date.year, date.month, date.date as number)
            emit('update:modelValue', value)
            emit('selected', value)
        }

        function onToday() {
            state.tableMonth = today.month
            state.tableYear = today.year
            state.view = 'dates'
        }

        const slotApi = () => ({
            view: state.view,
            value: headerValue.value,
            selected: selected.value,
            prevDisabled: prevDisabled.value,
            nextDisabled: nextDisabled.value,
            onNext: () => handlers.onNext(),
            onPrev: () => handlers.onPrev(),
            onTable: onTableToggle,
            onToday,
        })

        const defaultBody = () => (
            <Transition name={state.bodyTransition} mode="out-in">
                {state.view === 'years' ? (
                    <CDatePickerYears
                        key="years"
                        year={state.tableYear}
                        minYear={minDate.value?.year}
                        maxYear={maxDate.value?.year}
                        onUpdate:year={onYearUpdate}
                    >
                        {{
                            ...(slots.years && { years: slots.years }),
                            ...(slots.year && { year: slots.year }),
                        }}
                    </CDatePickerYears>
                ) : state.view === 'months' ? (
                    <CDatePickerMonths
                        key="months"
                        month={state.tableMonth}
                        year={state.tableYear}
                        locale={locale.value.monthsAbbr}
                        minDate={minDate.value}
                        maxDate={maxDate.value}
                        onUpdate:month={onMonthUpdate}
                        onUpdate:year={(y: number) => { state.tableYear = y }}
                    >
                        {{
                            ...(slots.months && { months: slots.months }),
                            ...(slots.month && { month: slots.month }),
                        }}
                    </CDatePickerMonths>
                ) : (
                    <CDatePickerDates
                        key="dates"
                        year={state.tableYear}
                        month={state.tableMonth}
                        value={selected.value}
                        locale={locale.value.week}
                        mondayFirst={props.mondayFirst}
                        disabledDates={props.disabledDates}
                        highlightedDates={props.highlightedDates}
                        minDate={minDate.value}
                        maxDate={maxDate.value}
                        onUpdate:value={onDateSelect}
                        onUpdate:month={onMonthChange}
                    >
                        {{
                            ...(slots.week && { week: slots.week }),
                            ...(slots.dates && { dates: slots.dates }),
                            ...(slots.date && { date: slots.date }),
                        }}
                    </CDatePickerDates>
                )}
            </Transition>
        )

        return () => (
            <div class="c-date-picker">
                <div class="c-date-picker__display">
                    <div class="c-date-picker__display-year">{displayYear.value}</div>
                    <Transition name="c-date-fade" mode="out-in">
                        <div key={displayDate.value} class="c-date-picker__display-date">
                            {displayDate.value}
                        </div>
                    </Transition>
                </div>

                {slots['before-header']?.(slotApi())}

                {slots.header?.(slotApi()) ?? (
                    <CDatePickerHeader
                        prevDisabled={prevDisabled.value}
                        nextDisabled={nextDisabled.value}
                        onNext={() => handlers.onNext()}
                        onPrev={() => handlers.onPrev()}
                        onTable={onTableToggle}
                    >
                        {{ default: () => headerValue.value }}
                    </CDatePickerHeader>
                )}

                {slots['before-body']?.(slotApi())}

                <div class="c-date-picker__body">
                    {slots.body?.(slotApi()) ?? defaultBody()}
                </div>

                {slots.footer?.(slotApi())}
            </div>
        )
    },
})

export type CDatePickerProps = InstanceType<typeof CDatePicker>['$props']

export function datePickerValueToString(
    value: Date | string | null | undefined,
    format: string,
    lang: string,
): string {
    if (!value) return ''
    try {
        return formatDate(new Date(value), format, LOCALE[lang] ?? LOCALE['en'])
    } catch {
        return ''
    }
}
