import {
    computed,
    defineComponent,
    inject,
    type PropType,
    shallowRef,
    Transition,
    watch,
} from 'vue'
import { type JSX } from 'vue/jsx-runtime'

import { $DATE_PICKER_HANDLERS_KEY } from '../../constants'

import { parseDate, toDateString } from './helpers'
import type { DatePickerDate, DisabledDates } from './types'

export const CDatePickerDates = defineComponent({
    name: 'CDatePickerDates',
    props: {
        locale: Array as PropType<string[]>,
        year: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        value: Object as PropType<DatePickerDate | null>,
        mondayFirst: Boolean,
        disabledDates: Object as PropType<DisabledDates>,
    },
    emits: {
        'update:value': (_date: DatePickerDate) => !!_date,
        'update:month': (_params: {
            month: number;
            year?: number
        }) => !!_params,
    },
    setup(props, { emit, slots }) {
        const FIRST_MONTH = 0
        const LAST_MONTH = 11
        const DAYS = [0, 1, 2, 3, 4, 5, 6]

        if (props.mondayFirst) DAYS.push(DAYS.splice(0, 1)[0])

        const today = parseDate(new Date())
        const dates = shallowRef<(DatePickerDate | null)[]>([])
        const transitioning = shallowRef(false)
        const transitionName = shallowRef('c-date-slide-left')

        const handlers = inject($DATE_PICKER_HANDLERS_KEY)

        if (handlers) {
            handlers.onNext = () => updateMonth(true)
            handlers.onPrev = () => updateMonth(false)
        }

        const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

        function updateMonth(isNext: boolean) {
            transitionName.value = isNext ? 'c-date-slide-left' : 'c-date-slide-right'

            const month = props.month + (isNext ? 1 : -1)

            const params: {
                month: number,
                year?: number
            } = { month }

            if (!isNext && month < FIRST_MONTH) {
                params.month = LAST_MONTH; params.year = props.year - 1
            }

            if (isNext && month > LAST_MONTH) {
                params.month = FIRST_MONTH; params.year = props.year + 1
            }

            transitioning.value = true
            emit('update:month', params)
        }

        function genDateObject(day: number): DatePickerDate {
            return parseDate(new Date(props.year, props.month, day))
        }

        function buildDates() {
            dates.value = []

            for (let i = 1; i <= daysInMonth.value; i++) {
                const dateObj = genDateObject(i)

                if (i === 1) {
                    const firstDayIndex = DAYS.indexOf(dateObj.day)

                    for (let j = 0; j < firstDayIndex; j++) {
                        dates.value.push({ date: null } as any)
                    }
                }

                dates.value.push(dateObj)
            }
        }

        function isEqualDates(a: DatePickerDate, b: DatePickerDate | null | undefined): boolean {
            if (!b) {
                return false
            }

            return a.date === b.date && a.month === b.month && a.year === b.year
        }

        function isDisabled(date: DatePickerDate): boolean {
            if (!date.date) {
                return false
            }

            const { disabledDates } = props

            if (!disabledDates) {
                return false
            }

            if (disabledDates.daysOfMonth?.includes(date.date)) {
                return true
            }

            if (disabledDates.days !== undefined && disabledDates.days.includes(date.day)) {
                return true
            }

            if (disabledDates.dates?.some((d) =>
                `${new Date(d)}` === `${toDateString(date)}`)) {
                return true
            }

            if (disabledDates.from && disabledDates.to) {
                const from = parseDate(new Date(disabledDates.from))
                const to = parseDate(new Date(disabledDates.to))

                if ((date.mls ?? 0) >= (from.mls ?? 0) && (date.mls ?? 0) <= (to.mls ?? 0)) {
                    return true
                }
            }

            if (disabledDates.ranges) {
                for (const r of disabledDates.ranges) {
                    const from = parseDate(new Date(r.from))
                    const to = parseDate(new Date(r.to))

                    if ((date.mls ?? 0) >= (from.mls ?? 0) && (date.mls ?? 0) <= (to.mls ?? 0)) {
                        return true
                    }
                }
            }

            return !!disabledDates.custom?.(date)
        }

        watch(() => props.month, () => {
            buildDates()
            transitioning.value = false
        }, { immediate: true })

        return () => {
            const weekRow = (
                <div class="c-date-picker-dates__week">
                    {DAYS.map((d) => (
                        <span class="c-date-picker-dates__day">{props.locale?.[d]}</span>
                    ))}
                </div>
            )

            const cellVNodes = dates.value.map((dateObj) => {
                if (!dateObj || !dateObj.date) {
                    return <div class="c-date-picker-dates__cell c-date-picker-dates__cell--empty" />
                }
                const disabled = isDisabled(dateObj)
                dateObj.isHoliday = disabled
                const isSelected = isEqualDates(dateObj, props.value)
                const isToday = isEqualDates(dateObj, today)

                return (
                    <div
                        class={[
                            'c-date-picker-dates__cell',
                            isSelected && 'c-date-picker-dates__cell--selected',
                            isToday && 'c-date-picker-dates__cell--today',
                            disabled && 'c-date-picker-dates__cell--disabled',
                        ]}
                        onClick={() => !disabled && emit('update:value', dateObj!)}
                    >
                        {slots.date ? slots.date(dateObj) : dateObj.date}
                    </div>
                )
            })

            const rows: JSX.Element[] = []

            for (let i = 0; i < cellVNodes.length; i += 7) {
                rows.push(
                    <div class="c-date-picker-dates__row">
                        {cellVNodes.slice(i, i + 7)}
                    </div>,
                )
            }

            return (
                <div class="c-date-picker-dates">
                    {weekRow}
                    <Transition name={transitionName.value} mode="out-in">
                        <div key={`${props.year}-${props.month}`} class="c-date-picker-dates__dates">
                            {rows}
                        </div>
                    </Transition>
                </div>
            )
        }
    },
})
