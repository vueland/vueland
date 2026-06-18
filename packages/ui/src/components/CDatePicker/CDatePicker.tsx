import {
    computed,
    defineComponent,
    type PropType,
    provide,
    reactive,
    Transition,
} from 'vue'

import { $DATE_PICKER_HANDLERS_KEY } from '../../constants'
import { propsFactory } from '../../utils'

import { CDatePickerDates } from './CDatePickerDates'
import { CDatePickerHeader } from './CDatePickerHeader'
import { CDatePickerMonths } from './CDatePickerMonths'
import { CDatePickerYears } from './CDatePickerYears'
import { parseDate } from './helpers'
import type { DatePickerDate, DisabledDates } from './types'
import { formatDate, LOCALE } from './utils'

type ViewMode = 'dates' | 'months' | 'years'

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
})

export const CDatePicker = defineComponent({
    name: 'CDatePicker',
    props: makeCDatePickerProps(),
    emits: {
        'update:modelValue': (_value: Date | null) => !!_value,
        selected: (_value: Date | null) => !!_value,
    },
    setup(props, { emit, slots }) {
        const locale = computed(() => LOCALE[props.lang] ?? LOCALE['en'])

        const handlers = reactive({
            onNext: () => {},
            onPrev: () => {},
        })
        provide($DATE_PICKER_HANDLERS_KEY, handlers)

        const today = parseDate(new Date())

        const initDate = (): DatePickerDate => {
            if (props.modelValue) return parseDate(new Date(props.modelValue))
            return today
        }

        const state = reactive<{
            selected: DatePickerDate
            tableMonth: number
            tableYear: number
            view: ViewMode
            bodyTransition: string
        }>({
            selected: initDate(),
            tableMonth: initDate().month,
            tableYear: initDate().year,
            view: 'dates',
            bodyTransition: 'c-date-slide-left',
        })

        const headerValue = computed(() => {
            if (state.view === 'years') return `${state.tableYear}`
            if (state.view === 'months') return `${state.tableYear}`
            return `${locale.value.monthsAbbr[state.tableMonth]} ${state.tableYear}`
        })

        const displayYear = computed(() => state.selected.year)
        const displayDate = computed(() => {
            const {
                month,
                date,
                day,
            } = state.selected
            return `${locale.value.monthsAbbr[month]} ${date}, ${locale.value.week[day]}`
        })

        function onTableToggle() {
            if (state.view === 'dates') { state.bodyTransition = 'c-date-slide-up'; state.view = 'months'; return }
            if (state.view === 'months') { state.bodyTransition = 'c-date-slide-up'; state.view = 'years'; return }
            if (state.view === 'years') { state.bodyTransition = 'c-date-slide-down'; state.view = 'months' }
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
            state.selected = date
            state.tableMonth = date.month
            state.tableYear = date.year
            const value = new Date(date.year, date.month, date.date as number)
            emit('update:modelValue', value)
            emit('selected', value)
        }

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

                <CDatePickerHeader
                    onNext={() => handlers.onNext()}
                    onPrev={() => handlers.onPrev()}
                    onTable={onTableToggle}
                >
                    {{ default: () => headerValue.value }}
                </CDatePickerHeader>

                <div class="c-date-picker__body">
                    <Transition name={state.bodyTransition} mode="out-in">
                        {state.view === 'years' ? (
                            <CDatePickerYears
                                key="years"
                                year={state.tableYear}
                                onUpdate:year={onYearUpdate}
                            />
                        ) : state.view === 'months' ? (
                            <CDatePickerMonths
                                key="months"
                                month={state.tableMonth}
                                year={state.tableYear}
                                locale={locale.value.monthsAbbr}
                                onUpdate:month={onMonthUpdate}
                                onUpdate:year={(y: number) => { state.tableYear = y }}
                            />
                        ) : (
                            <CDatePickerDates
                                key="dates"
                                year={state.tableYear}
                                month={state.tableMonth}
                                value={state.selected}
                                locale={locale.value.week}
                                mondayFirst={props.mondayFirst}
                                disabledDates={props.disabledDates}
                                onUpdate:value={onDateSelect}
                                onUpdate:month={onMonthChange}
                            >
                                {{ ...(slots.date && { date: slots.date }) }}
                            </CDatePickerDates>
                        )}
                    </Transition>
                </div>
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
