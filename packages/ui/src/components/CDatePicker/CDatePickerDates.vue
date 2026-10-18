<script setup lang="ts">
    import {
        computed,
        inject,
        onBeforeUnmount,
        onMounted,
        shallowRef,
        unref
    } from 'vue'

    import type { KeyboardTarget } from '@/components/CKeyboardProvider/types'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $DATE_PICKER_PRESET_KEY, $KEYBOARD_API_KEY } from '@/constants'
    import { isDef } from '@/helpers'

    import {
        chunk,
        isDateDisabled,
        isEqualDates,
        isValidDateValue,
        parseDate,
    } from './helpers'
    import type {
        DatePickerDate,
        DatePickerDatesEmits,
        DatePickerDatesProps,
        DatePickerDatesSlots,
        DatePickerEnrichedDate,
        DatePickerWeekDay,
    } from './types'

    defineOptions({ name: 'CDatePickerDates' })

    const props = defineProps<DatePickerDatesProps>()

    const emit = defineEmits<DatePickerDatesEmits>()

    defineSlots<DatePickerDatesSlots>()

    defineExpose({
        showNextPage: showNextMonth,
        showPreviousPage: showPreviousMonth,
    })

    const rootRef = shallowRef<HTMLElement>()
    const transitionName = shallowRef('c-date-slide-left')
    const focusedDate = shallowRef<DatePickerDate>()

    const presetZones = inject($DATE_PICKER_PRESET_KEY, null)
    // Вьюха сама встаёт под клавиатурный контур пикера — семантика клавиш у неё
    const keyboard = inject($KEYBOARD_API_KEY, null)

    // Дни недели в нумерации Date#getDay: 0 — воскресенье
    const WEEK = [0, 1, 2, 3, 4, 5, 6]

    const today = parseDate(new Date())

    const weekDays = computed<DatePickerWeekDay[]>(() => {
        const week = props.mondayFirst ? [...WEEK.slice(1), WEEK[0]] : WEEK

        return week.map((day) => ({
            day,
            label: props.locale?.[day],
        }))
    })

    // 0-е число следующего месяца — последнее число текущего
    const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

    const parsedHighlighted = computed(() =>
        props.highlightedDates
            ?.filter(isValidDateValue)
            .map((date) => parseDate(date)) ?? [],
    )

    // Сетка целыми неделями: первую и последнюю строку добивают даты соседних
    // месяцев — Date сам перекатывает числа ≤ 0 и > daysInMonth через границу
    const dates = computed<DatePickerEnrichedDate[]>(() => {
        const firstDay = new Date(props.year, props.month, 1).getDay()
        const offset = unref(weekDays).findIndex(({ day }) => day === firstDay)
        const length = Math.ceil((offset + unref(daysInMonth)) / WEEK.length) * WEEK.length

        return Array.from({ length }, (_, i) => {
            const date = parseDate(new Date(props.year, props.month, i + 1 - offset))

            return {
                ...date,
                disabled: isDateDisabled(date, props),
                isOutside: date.month !== props.month,
                isHighlighted: unref(parsedHighlighted).some((d) => isEqualDates(date, d)),
                isSelected: isEqualDates(date, props.modelValue),
                isToday: isEqualDates(date, today),
                isFocused: isEqualDates(date, unref(focusedDate)),
            }
        })
    })

    const rows = computed(() => chunk(unref(dates), WEEK.length))

    // Date сам нормализует перекат через границу года
    function showAdjacentMonth(direction: 1 | -1) {
        const next = parseDate(new Date(props.year, props.month + direction, 1))

        transitionName.value = direction > 0 ? 'c-date-slide-left' : 'c-date-slide-right'

        emit('update:month', {
            month: next.month,
            year: next.year,
        })
    }

    function showNextMonth() {
        showAdjacentMonth(1)
    }

    function showPreviousMonth() {
        showAdjacentMonth(-1)
    }

    // Стартовая точка курсора: выбранная дата или сегодня, если видны в текущем
    // месяце, иначе 1-е число
    function getInitialFocusedDate(): DatePickerDate {
        const {
            modelValue,
            month,
            year
        } = props

        if (modelValue && modelValue.month === month && modelValue.year === year) {
            return modelValue
        }

        if (today.month === month && today.year === year) {
            return today
        }

        return parseDate(new Date(year, month, 1))
    }

    // Первое нажатие ставит курсор на стартовую точку, дальше — шаг от текущей.
    // Курсор за границей месяца перелистывает таблицу (шаг ≤ 7 дней — месяц всегда соседний)
    function moveDateFocus(delta: number) {
        const from = unref(focusedDate)

        const next = from
            ? parseDate(new Date(from.year, from.month, from.date + delta))
            : getInitialFocusedDate()

        focusedDate.value = next

        if (next.month !== props.month || next.year !== props.year) {
            showAdjacentMonth(delta > 0 ? 1 : -1)
        }
    }

    function focusDate(date: number) {
        focusedDate.value = parseDate(new Date(props.year, props.month, date))
    }

    // Единая точка выбора: клик по ячейке, onSelect из слота, Enter/Space
    function selectDate(date: DatePickerDate) {
        if (!isDateDisabled(date, props)) {
            emit('update:modelValue', date)
        }
    }

    function selectFocusedDate() {
        const date = unref(focusedDate)

        if (isDef(date)) {
            selectDate(date)
        }
    }

    const { onKeydown } = useKeyboard({
        ArrowLeft: () => moveDateFocus(-1),
        ArrowRight: () => moveDateFocus(1),
        ArrowUp: () => moveDateFocus(-7),
        ArrowDown: () => moveDateFocus(7),
        Home: () => focusDate(1),
        End: () => focusDate(unref(daysInMonth)),
        Enter: selectFocusedDate,
        Space: selectFocusedDate,
    }, { prevent: true })

    const keyboardTarget: KeyboardTarget = {
        onKeydown,
        blur: () => { focusedDate.value = undefined },
        getElement: () => unref(rootRef),
    }

    onMounted(() => keyboard?.register(keyboardTarget))
    onBeforeUnmount(() => keyboard?.unregister(keyboardTarget))
</script>

<template>
    <div
        ref="rootRef"
        class="c-date-picker-dates"
        role="grid"
    >
        <slot
            v-if="$slots.week"
            name="week"
            :days="weekDays"
        ></slot>
        <div
            v-else
            :class="['c-date-picker-dates__week', ...(presetZones?.week ?? [])]"
            role="row"
        >
            <span
                v-for="weekDay in weekDays"
                :key="weekDay.day"
                class="c-date-picker-dates__day"
                role="columnheader"
            >
                {{ weekDay.label }}
            </span>
        </div>

        <slot
            v-if="$slots.dates"
            name="dates"
            :dates
            :on-select="selectDate"
        />
        <transition
            v-else
            :name="transitionName"
            mode="out-in"
        >
            <div
                :key="`${year}-${month}`"
                class="c-date-picker-dates__dates"
                role="rowgroup"
            >
                <div
                    v-for="(row, ri) in rows"
                    :key="ri"
                    class="c-date-picker-dates__row"
                    role="row"
                >
                    <template
                        v-for="item in row"
                        :key="item.mls"
                    >
                        <div
                            v-if="item.isOutside"
                            class="c-date-picker-dates__cell c-date-picker-dates__cell--outside"
                            role="gridcell"
                        >
                            {{ item.date }}
                        </div>
                        <div
                            v-else
                            :class="[
                                'c-date-picker-dates__cell',
                                ...(presetZones?.cell ?? []),
                                item.isSelected && 'c-date-picker-dates__cell--selected',
                                item.isToday && !item.isSelected && 'c-date-picker-dates__cell--today',
                                item.disabled && 'c-date-picker-dates__cell--disabled',
                                item.isHighlighted && 'c-date-picker-dates__cell--highlighted',
                                item.isFocused && 'c-date-picker-dates__cell--focused',
                            ]"
                            role="gridcell"
                            :aria-selected="item.isSelected"
                            :aria-disabled="item.disabled || undefined"
                            @click="selectDate(item)"
                        >
                            <slot
                                v-if="$slots.date"
                                name="date"
                                v-bind="item"
                            />
                            <template v-else>
                                {{ item.date }}
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>
