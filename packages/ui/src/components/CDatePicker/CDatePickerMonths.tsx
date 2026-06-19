import { defineComponent, inject, type PropType } from 'vue'
import { type JSX } from 'vue/jsx-runtime'

import { $DATE_PICKER_API_KEY } from '../../constants'

import type { DatePickerDate } from './types'

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const CELLS_IN_ROW = 3

export const CDatePickerMonths = defineComponent({
    name: 'CDatePickerMonths',
    props: {
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        locale: Array as PropType<string[]>,
        minDate: Object as PropType<DatePickerDate | null>,
        maxDate: Object as PropType<DatePickerDate | null>,
    },
    emits: {
        'update:month': (_month: number) => !!_month,
        'update:year': (_year: number) => !!_year,
    },
    setup(props, { emit, slots }) {
        const CURRENT_YEAR = new Date().getFullYear()
        const CURRENT_MONTH = new Date().getMonth()

        const api = inject($DATE_PICKER_API_KEY)!

        api.onNext = () => emit('update:year', props.year + 1)
        api.onPrev = () => emit('update:year', props.year - 1)

        function isDisabled(m: number): boolean {
            if (props.minDate) {
                if (props.year < props.minDate.year) return true
                if (props.year === props.minDate.year && m < props.minDate.month) return true
            }
            if (props.maxDate) {
                if (props.year > props.maxDate.year) return true
                if (props.year === props.maxDate.year && m > props.maxDate.month) return true
            }
            return false
        }

        return () => {
            const enrichedMonths = MONTHS.map((m) => ({
                month: m,
                label: props.locale?.[m] ?? '',
                disabled: isDisabled(m),
                isSelected: m === props.month,
                isCurrent: m === CURRENT_MONTH && props.year === CURRENT_YEAR,
                onSelect: () => !isDisabled(m) && emit('update:month', m),
            }))

            if (slots.months) {
                return (
                    <div class="c-date-picker-months">
                        {slots.months(enrichedMonths)}
                    </div>
                )
            }

            const cells = enrichedMonths.map((item) =>
                slots.month
                    ? slots.month(item)
                    : (
                        <div
                            class={[
                                'c-date-picker-months__cell',
                                item.isSelected && 'c-date-picker-months__cell--selected',
                                item.isCurrent && 'c-date-picker-months__cell--current',
                                item.disabled && 'c-date-picker-months__cell--disabled',
                            ]}
                            onClick={item.onSelect}
                        >
                            {item.label}
                        </div>
                    ),
            )

            const rows: JSX.Element[] = []
            for (let i = 0; i < cells.length; i += CELLS_IN_ROW) {
                rows.push(
                    <div class="c-date-picker-months__row">
                        {cells.slice(i, i + CELLS_IN_ROW)}
                    </div>,
                )
            }

            return (
                <div class="c-date-picker-months">
                    {rows}
                </div>
            )
        }
    },
})
