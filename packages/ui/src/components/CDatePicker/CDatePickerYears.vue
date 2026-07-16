<script setup lang="ts">
    import {
        computed,
        inject,
        onBeforeUnmount,
        onMounted,
        shallowRef,
        watch
    } from 'vue'

    import type { KeyboardTarget } from '@/components/CKeyboardProvider/types'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $DATE_PICKER_PRESET_KEY, $KEYBOARD_API_KEY } from '@/constants'

    import { chunk } from './helpers'
    import type {
        DatePickerEnrichedYear,
        DatePickerYearsEmits,
        DatePickerYearsProps,
        DatePickerYearsSlots,
    } from './types'

    defineOptions({ name: 'CDatePickerYears' })

    const props = defineProps<DatePickerYearsProps>()
    const emit = defineEmits<DatePickerYearsEmits>()
    defineSlots<DatePickerYearsSlots>()
    defineExpose({
        showNextPage,
        showPreviousPage,
    })

    const rootRef = shallowRef<HTMLElement>()
    const pageIndex = shallowRef(0)
    const focused = shallowRef<number | null>(null)
    const transitionName = shallowRef('c-date-slide-left')

    const presetZones = inject($DATE_PICKER_PRESET_KEY, null)

    const CELLS_IN_ROW = 4
    const ON_TABLE = 20
    const DEFAULT_YEAR_SPAN = 100
    const CURRENT_YEAR = new Date().getFullYear()

    const yearBounds = computed(() => {
        const {
            maxYear,
            minYear,
            year,
        } = props
        const fallbackFrom = Math.min(CURRENT_YEAR - DEFAULT_YEAR_SPAN, year)
        const fallbackTo = Math.max(CURRENT_YEAR + DEFAULT_YEAR_SPAN, year)
        const from = minYear ?? fallbackFrom
        const to = maxYear ?? fallbackTo

        return {
            from: Math.min(from, to),
            to: Math.max(from, to),
        }
    })

    // Диапазон пикера по умолчанию ±100 лет от текущего, но расширяется до
    // выбранного года. min/max, если заданы, становятся границами навигации.
    const allYears = computed(() => {
        const { from, to } = yearBounds.value

        return Array.from({ length: to - from + 1 }, (_, i) => from + i)
    })
    const allPages = computed(() => chunk(allYears.value, ON_TABLE))

    const minRangeYear = computed(() => allYears.value[0])
    const maxRangeYear = computed(() => allYears.value[allYears.value.length - 1])

    const currentPage = computed(() => allPages.value[pageIndex.value] ?? [])

    const enrichedYears = computed<DatePickerEnrichedYear[]>(() =>
        currentPage.value.map((y) => {
            return {
                year: y,
                isSelected: y === props.value?.year,
                isCurrent: y === CURRENT_YEAR,
                isFocused: y === focused.value,
                onSelect: () => selectYear(y),
            }
        }),
    )

    const rows = computed(() => chunk(enrichedYears.value, CELLS_IN_ROW))

    function getYearPageIndex(year: number): number {
        return allPages.value.findIndex((page) => page.includes(year))
    }

    // Единственный владелец листания: направление анимации + текущая страница
    function showPage(page: number, forward: boolean) {
        transitionName.value = forward ? 'c-date-slide-left' : 'c-date-slide-right'
        pageIndex.value = page
    }

    function showNextPage() {
        if (pageIndex.value < allPages.value.length - 1) {
            showPage(pageIndex.value + 1, true)
        }
    }

    function showPreviousPage() {
        if (pageIndex.value > 0) {
            showPage(pageIndex.value - 1, false)
        }
    }

    function selectYear(year: number) {
        emit('update:year', year)
    }

    // Первое нажатие ставит курсор на текущий год, дальше — шаг в пределах
    // диапазона; страница следует за курсором
    function moveYearFocus(delta: number) {
        if (focused.value === null) {
            focused.value = props.year
            return
        }

        const next = Math.min(Math.max(focused.value + delta, minRangeYear.value), maxRangeYear.value)
        const page = getYearPageIndex(next)

        focused.value = next

        if (page >= 0 && page !== pageIndex.value) {
            showPage(page, delta > 0)
        }
    }

    function selectFocusedYear() {
        if (focused.value !== null) {
            enrichedYears.value.find((item) => item.year === focused.value)?.onSelect()
        }
    }

    const { onKeydown } = useKeyboard({
        ArrowLeft: () => moveYearFocus(-1),
        ArrowRight: () => moveYearFocus(1),
        ArrowUp: () => moveYearFocus(-CELLS_IN_ROW),
        ArrowDown: () => moveYearFocus(CELLS_IN_ROW),
        Home: () => { focused.value = currentPage.value[0] },
        End: () => { focused.value = currentPage.value[currentPage.value.length - 1] },
        Enter: selectFocusedYear,
        Space: selectFocusedYear,
    }, { prevent: true })

    // Вьюха сама встаёт под клавиатурный контур пикера — семантика клавиш у неё
    const keyboard = inject($KEYBOARD_API_KEY, null)

    const keyboardTarget: KeyboardTarget = {
        onKeydown,
        blur: () => { focused.value = null },
        getElement: () => rootRef.value,
    }

    onMounted(() => keyboard?.register(keyboardTarget))
    onBeforeUnmount(() => keyboard?.unregister(keyboardTarget))

    watch(() => [props.year, yearBounds.value.from, yearBounds.value.to] as const, ([year]) => {
        pageIndex.value = Math.max(getYearPageIndex(year), 0)
    }, { immediate: true })
</script>

<template>
    <div
        ref="rootRef"
        class="c-date-picker-years"
        role="grid"
    >
        <slot
            v-if="$slots.years"
            name="years"
            :years="enrichedYears"
        ></slot>
        <transition
            v-else
            :name="transitionName"
            mode="out-in"
        >
            <div
                :key="pageIndex"
                class="c-date-picker-years__grid"
                role="rowgroup"
            >
                <div
                    v-for="(row, ri) in rows"
                    :key="ri"
                    class="c-date-picker-years__row"
                    role="row"
                >
                    <template
                        v-for="item in row"
                        :key="item.year"
                    >
                        <slot
                            v-if="$slots.year"
                            name="year"
                            v-bind="item"
                        ></slot>
                        <div
                            v-else
                            :class="[
                                'c-date-picker-years__cell',
                                ...(presetZones?.cell ?? []),
                                item.isSelected && 'c-date-picker-years__cell--selected',
                                item.isCurrent && 'c-date-picker-years__cell--current',
                                item.isFocused && 'c-date-picker-years__cell--focused',
                            ]"
                            role="gridcell"
                            :aria-selected="item.isSelected"
                            @click="item.onSelect"
                        >
                            {{ item.year }}
                        </div>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>
