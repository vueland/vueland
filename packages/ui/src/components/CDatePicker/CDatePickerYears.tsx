import {
    defineComponent,
    inject,
    shallowRef,
    Transition,
} from 'vue'
import { type JSX } from 'vue/jsx-runtime'

import { $DATE_PICKER_API_KEY } from '../../constants'

const CELLS_IN_ROW = 4
const ON_TABLE = 20
const LIMIT = 100
const CURRENT_YEAR = new Date().getFullYear()

export const CDatePickerYears = defineComponent({
    name: 'CDatePickerYears',
    props: {
        year: {
            type: Number,
            required: true,
        },
        minYear: Number,
        maxYear: Number,
    },
    emits: { 'update:year': (_year: number) => !!_year },

    setup(props, { emit, slots }) {
        const api = inject($DATE_PICKER_API_KEY)!
        const allPages: number[][] = []
        const pageIndex = shallowRef(0)
        const transitionName = shallowRef('c-date-slide-left')

        const fromYear = CURRENT_YEAR - LIMIT

        let page: number[] = []

        for (let i = 0; i <= LIMIT * 2; i++) {
            page.push(fromYear + i)

            if (page.length === ON_TABLE) {
                allPages.push(page)
                page = []
            }
        }

        if (page.length) allPages.push(page)

        pageIndex.value = allPages.findIndex((p) => p.includes(props.year)) ?? 0

        api.onNext = () => {
            if (pageIndex.value < allPages.length - 1) {
                transitionName.value = 'c-date-slide-left'
                pageIndex.value++
            }
        }

        api.onPrev = () => {
            if (pageIndex.value > 0) {
                transitionName.value = 'c-date-slide-right'
                pageIndex.value--
            }
        }

        return () => {
            const currentPage = allPages[pageIndex.value] ?? []

            const enrichedYears = currentPage.map((y) => ({
                year: y,
                disabled: (props.minYear !== undefined && y < props.minYear)
                    || (props.maxYear !== undefined && y > props.maxYear),
                isSelected: y === props.year,
                isCurrent: y === CURRENT_YEAR,
                onSelect: () => {
                    const disabled = (props.minYear !== undefined && y < props.minYear)
                        || (props.maxYear !== undefined && y > props.maxYear)
                    if (!disabled) emit('update:year', y)
                },
            }))

            if (slots.years) {
                return (
                    <div class="c-date-picker-years">
                        {slots.years(enrichedYears)}
                    </div>
                )
            }

            const cells = enrichedYears.map((item) =>
                slots.year
                    ? slots.year(item)
                    : (
                        <div
                            class={[
                                'c-date-picker-years__cell',
                                item.isSelected && 'c-date-picker-years__cell--selected',
                                item.isCurrent && 'c-date-picker-years__cell--current',
                                item.disabled && 'c-date-picker-years__cell--disabled',
                            ]}
                            onClick={item.onSelect}
                        >
                            {item.year}
                        </div>
                    ),
            )

            const rows: JSX.Element[] = []
            for (let i = 0; i < cells.length; i += CELLS_IN_ROW) {
                rows.push(
                    <div class="c-date-picker-years__row">
                        {cells.slice(i, i + CELLS_IN_ROW)}
                    </div>,
                )
            }

            return (
                <div class="c-date-picker-years">
                    <Transition name={transitionName.value} mode="out-in">
                        <div key={pageIndex.value} class="c-date-picker-years__grid">
                            {rows}
                        </div>
                    </Transition>
                </div>
            )
        }
    },
})
