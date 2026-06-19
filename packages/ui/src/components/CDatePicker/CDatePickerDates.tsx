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

import { $DATE_PICKER_API_KEY } from '../../constants'

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
        highlightedDates: Array as PropType<(Date | string)[]>,
        minDate: Object as PropType<DatePickerDate | null>,
        maxDate: Object as PropType<DatePickerDate | null>,
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
        const transitionName = shallowRef('c-date-slide-left')

        const api = inject($DATE_PICKER_API_KEY)!

        api.onNext = () => updateMonth(true)
        api.onPrev = () => updateMonth(false)

        const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

        function updateMonth(isNext: boolean) {
            transitionName.value = isNext ? 'c-date-slide-left' : 'c-date-slide-right'

            let month = props.month + (isNext ? 1 : -1)
            let year: number | undefined

            if (!isNext && month < FIRST_MONTH) { month = LAST_MONTH; year = props.year - 1 }
            if (isNext && month > LAST_MONTH) { month = FIRST_MONTH; year = props.year + 1 }

            emit('update:month', {
                month,
                year,
            })
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

        const parsedFromTo = computed(() => {
            const { from, to } = props.disabledDates ?? {}
            if (!from || !to) return null
            return {
                f: parseDate(new Date(from)).mls ?? 0,
                t: parseDate(new Date(to)).mls ?? 0,
            }
        })

        const parsedRanges = computed(() =>
            props.disabledDates?.ranges?.map((r) => ({
                f: parseDate(new Date(r.from)).mls ?? 0,
                t: parseDate(new Date(r.to)).mls ?? 0,
            })) ?? [],
        )

        const parsedHighlighted = computed(() =>
            props.highlightedDates?.map((d) => parseDate(new Date(d))) ?? [],
        )

        function isDisabled(date: DatePickerDate): boolean {
            if (!date.date) return false

            const mls = date.mls ?? 0
            const {
                disabledDates: d,
                minDate,
                maxDate,
            } = props

            const checks = [
                () => !!minDate && mls < (minDate.mls ?? 0),
                () => !!maxDate && mls > (maxDate.mls ?? 0),
                () => !!d?.daysOfMonth?.includes(date.date!),
                () => !!d?.days?.includes(date.day),
                () => !!d?.dates?.some((v) => `${new Date(v)}` === `${toDateString(date)}`),
                () => !!parsedFromTo.value && mls >= parsedFromTo.value.f && mls <= parsedFromTo.value.t,
                () => parsedRanges.value.some((r) => mls >= r.f && mls <= r.t),
                () => !!d?.custom?.(date),
            ]

            return checks.some((check) => check())
        }

        function isHighlighted(date: DatePickerDate): boolean {
            return parsedHighlighted.value.some((d) => isEqualDates(date, d))
        }

        watch(() => props.month, () => {
            buildDates()
        }, { immediate: true })

        return () => {
            const weekDays = DAYS.map((d) => ({
                day: d,
                label: props.locale?.[d],
            }))

            const weekRow = slots.week
                ? slots.week({ days: weekDays })
                : (
                    <div class="c-date-picker-dates__week">
                        {weekDays.map(({ label }) => (
                            <span class="c-date-picker-dates__day">{label}</span>
                        ))}
                    </div>
                )

            const enrichedDates = dates.value.map((dateObj) => {
                if (!dateObj || !dateObj.date) return {
                    dateObj,
                    empty: true,
                    disabled: false,
                    highlighted: false,
                    isSelected: false,
                    isToday: false,
                }
                const disabled = isDisabled(dateObj)
                const highlighted = isHighlighted(dateObj)
                dateObj.isHoliday = disabled
                dateObj.isHighlighted = highlighted
                return {
                    dateObj,
                    empty: false,
                    disabled,
                    highlighted,
                    isSelected: isEqualDates(dateObj, props.value),
                    isToday: isEqualDates(dateObj, today),
                }
            })

            const cellVNodes = enrichedDates.map(({
                dateObj,
                empty,
                disabled,
                highlighted,
                isSelected,
                isToday,
            }) => {
                if (empty || !dateObj?.date) {

                    return <div class="c-date-picker-dates__cell c-date-picker-dates__cell--empty" />
                }
                return (
                    <div
                        class={[
                            'c-date-picker-dates__cell',
                            isSelected && 'c-date-picker-dates__cell--selected',
                            isToday && !isSelected && 'c-date-picker-dates__cell--today',
                            disabled && 'c-date-picker-dates__cell--disabled',
                            highlighted && 'c-date-picker-dates__cell--highlighted',
                        ]}
                        onClick={() => !disabled && emit('update:value', dateObj!)}
                    >
                        {slots.date ? slots.date({
                            ...dateObj,
                            isSelected,
                            isToday,
                        }) : dateObj.date}
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

            const datesContent = slots.dates
                ? slots.dates({
                    dates: enrichedDates,
                    onSelect: (d: DatePickerDate) => !d.isHoliday && emit('update:value', d),
                })
                : (
                    <Transition name={transitionName.value} mode="out-in">
                        <div key={`${props.year}-${props.month}`} class="c-date-picker-dates__dates">
                            {rows}
                        </div>
                    </Transition>
                )

            return (
                <div class="c-date-picker-dates">
                    {weekRow}
                    {datesContent}
                </div>
            )
        }
    },
})
