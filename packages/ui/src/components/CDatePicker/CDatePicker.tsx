import {
    type ComponentPublicInstance,
    computed,
    defineComponent,
    type PropType,
    reactive,
    shallowRef,
    type SlotsType,
    Transition,
    unref,
} from 'vue'

import { isDef } from '../../helpers'
import { propsFactory } from '../../utils'

import { CDatePickerDates } from './CDatePickerDates'
import { CDatePickerHeader } from './CDatePickerHeader'
import { CDatePickerMonths } from './CDatePickerMonths'
import { CDatePickerYears } from './CDatePickerYears'
import { parseDate } from './helpers'
import type { DatePickerDate, DisabledDates } from './types'
import { formatDate, LOCALE } from './utils'

const enum ViewMode {
    DATES = 0,
    MONTHS = 1,
    YEARS = 2,
}

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

export type CDatePickerSlots = SlotsType<{
    'before-header': DatePickerSlotApi
    header: DatePickerSlotApi
    'before-body': DatePickerSlotApi
    body: DatePickerSlotApi
    footer: DatePickerSlotApi
    week: {
        days: DatePickerWeekDay[]
    }
    dates: {
        dates: DatePickerEnrichedDate[];
        onSelect: (d: DatePickerDate) => void
    }
    date: DatePickerDate & {
        isSelected: boolean;
        isToday: boolean
    }
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

type ModeInstance = ComponentPublicInstance<any, any, any, any,{
    onNext: () => void,
    onPrev: () => void,
}>

export const CDatePicker = defineComponent({
    name: 'CDatePicker',
    props: makeCDatePickerProps(),
    emits: {
        'update:modelValue': (_value: Date | null) => !!_value,
        selected: (_value: Date | null) => !!_value,
    },
    slots: {} as CDatePickerSlots,
    setup(props, { emit, slots }) {
        const picker = shallowRef<ModeInstance>()

        const today = parseDate(new Date())

        const selected = computed<DatePickerDate>(() =>
            props.modelValue ? parseDate(new Date(props.modelValue)) : today,
        )

        const locale = computed(() => LOCALE[props.lang] ?? LOCALE['en'])
        const minDate = computed(() => props.minDate ? parseDate(new Date(props.minDate)) : null)
        const maxDate = computed(() => props.maxDate ? parseDate(new Date(props.maxDate)) : null)

        const state = reactive<{
            tableMonth: number
            tableYear: number
            view: ViewMode
            bodyTransition: string
        }>({
            tableMonth: unref(selected).month,
            tableYear: unref(selected).year,
            view: ViewMode.DATES,
            bodyTransition: 'c-date-slide-left',
        })

        const headerValue = computed(() => {
            if (state.view === ViewMode.YEARS) {
                return `${state.tableYear}`
            }

            if (state.view === ViewMode.MONTHS) {
                return `${unref(locale).monthsAbbr[state.tableMonth]}`
            }

            return `${unref(locale).monthsAbbr[state.tableMonth]} ${state.tableYear}`
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

            if (state.view === ViewMode.YEARS) {
                return state.tableYear <= unref(minDate)!.year && state.tableMonth <= unref(minDate)!.month
            }

            if (state.view === ViewMode.MONTHS) return state.tableYear <= unref(minDate)!.year

            return false
        })

        const nextDisabled = computed(() => {
            if (!maxDate.value) return false

            if (state.view === ViewMode.DATES) {
                return state.tableYear >= unref(maxDate)!.year && state.tableMonth >= unref(maxDate)!.month
            }

            if (state.view === ViewMode.MONTHS) {
                return state.tableYear >= unref(maxDate)!.year
            }

            return false
        })

        function onTableToggle() {
            if (state.view === ViewMode.DATES) {
                state.bodyTransition = 'c-date-slide-up'
                state.view = ViewMode.MONTHS
                return
            }

            if (state.view === ViewMode.MONTHS) {
                state.bodyTransition = 'c-date-slide-up'
                state.view = ViewMode.YEARS
                return
            }

            if (state.view === ViewMode.YEARS) {
                state.bodyTransition = 'c-date-slide-down'
                state.view = ViewMode.MONTHS
            }
        }

        function onYearUpdate(year: number) {
            state.tableYear = year
            state.bodyTransition = 'c-date-slide-down'
            state.view = ViewMode.MONTHS
        }

        function onMonthUpdate(month: number) {
            state.tableMonth = month
            state.bodyTransition = 'c-date-slide-down'
            state.view = ViewMode.DATES
        }

        function onMonthChange(params: {
            month: number,
            year?: number
        }) {
            state.tableMonth = params.month

            if (isDef(params.year)) {
                state.tableYear = params.year!
            }
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
            state.view = ViewMode.DATES
        }

        const slotApi = () => ({
            view: state.view,
            value: headerValue.value,
            selected: selected.value,
            prevDisabled: prevDisabled.value,
            nextDisabled: nextDisabled.value,
            onNext: () => unref(picker)?.onNext(),
            onPrev: () => unref(picker)?.onPrev(),
            onTable: onTableToggle,
            onToday,
        })

        const defaultBody = () => (
            <Transition name={state.bodyTransition} mode="out-in">
                {state.view === ViewMode.YEARS ? (
                    <CDatePickerYears
                        key="years"
                        year={state.tableYear}
                        ref={picker}
                        minYear={minDate.value?.year}
                        maxYear={maxDate.value?.year}
                        onUpdate:year={onYearUpdate}
                    >
                        {{
                            ...(slots.years && { years: slots.years }),
                            ...(slots.year && { year: slots.year }),
                        }}
                    </CDatePickerYears>
                ) : state.view === ViewMode.MONTHS ? (
                    <CDatePickerMonths
                        key="months"
                        month={state.tableMonth}
                        year={state.tableYear}
                        ref={picker}
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
                        ref={picker}
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
                        onNext={() => unref(picker).onNext()}
                        onPrev={() => unref(picker).onPrev()}
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
