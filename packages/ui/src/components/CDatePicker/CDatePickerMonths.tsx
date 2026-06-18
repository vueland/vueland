import { defineComponent, inject, type PropType } from 'vue'
import { type JSX } from 'vue/jsx-runtime'

import { $DATE_PICKER_HANDLERS_KEY } from '../../constants'

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
    },
    emits: {
        'update:month': (_month: number) => !!_month,
        'update:year': (_year: number) => !!_year,
    },
    setup(props, { emit }) {
        const CURRENT_MONTH = new Date().getMonth()

        const handlers = inject($DATE_PICKER_HANDLERS_KEY)

        if (handlers) {
            handlers.onNext = () => emit('update:year', props.year + 1)
            handlers.onPrev = () => emit('update:year', props.year - 1)
        }

        return () => {
            const cells = MONTHS.map((m) => (
                <div
                    class={[
                        'c-date-picker-months__cell',
                        m === props.month && 'c-date-picker-months__cell--selected',
                        m === CURRENT_MONTH && 'c-date-picker-months__cell--current',
                    ]}
                    onClick={() => emit('update:month', m)}
                >
                    {props.locale?.[m]}
                </div>
            ))

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
