import {
    defineComponent,
    inject,
    ref,
    Transition,
} from 'vue'
import { type JSX } from 'vue/jsx-runtime'

import { $DATE_PICKER_HANDLERS_KEY } from '../../constants'

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
    },
    emits: { 'update:year': (_year: number) => !!_year },
    setup(props, { emit }) {
        const allPages: number[][] = []
        const pageIndex = ref(0)
        const transitionName = ref('c-date-slide-left')

        // build all pages of years
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

        // set initial page to the one containing current year
        pageIndex.value = allPages.findIndex((p) => p.includes(props.year)) ?? 0

        const handlers = inject($DATE_PICKER_HANDLERS_KEY)

        if (handlers) {
            handlers.onNext = () => {
                if (pageIndex.value < allPages.length - 1) {
                    transitionName.value = 'c-date-slide-left'
                    pageIndex.value++
                }
            }
            handlers.onPrev = () => {
                if (pageIndex.value > 0) {
                    transitionName.value = 'c-date-slide-right'
                    pageIndex.value--
                }
            }
        }

        return () => {
            const currentPage = allPages[pageIndex.value] ?? []

            const cells = currentPage.map((y) => (
                <div
                    class={[
                        'c-date-picker-years__cell',
                        y === props.year && 'c-date-picker-years__cell--selected',
                        y === CURRENT_YEAR && 'c-date-picker-years__cell--current',
                    ]}
                    onClick={() => emit('update:year', y)}
                >
                    {y}
                </div>
            ))

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
