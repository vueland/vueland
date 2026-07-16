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
    } from './types'

    defineOptions({ name: 'CDatePickerDates' })

    const props = defineProps<DatePickerDatesProps>()

    const emit = defineEmits<DatePickerDatesEmits>()

    defineSlots<DatePickerDatesSlots>()

    defineExpose({
        onNext: () => updateMonth(true),
        onPrev: () => updateMonth(false),
    })

    const rootRef = shallowRef<HTMLElement>()
    const transitionName = shallowRef('c-date-slide-left')
    const focusedDate = shallowRef<DatePickerDate>()

    const presetZones = inject($DATE_PICKER_PRESET_KEY, null)
    // Вьюха сама встаёт под клавиатурный контур пикера — семантика клавиш у неё
    const keyboard = inject($KEYBOARD_API_KEY, null)

    const DAYS = [0, 1, 2, 3, 4, 5, 6]

    const EMPTY_CELL: DatePickerEnrichedDate = {
        dateObj: null,
        empty: true,
        disabled: false,
        highlighted: false,
        isSelected: false,
        isToday: false,
        isFocused: false,
    }

    const today = parseDate(new Date())

    const days = computed(() => props.mondayFirst ? [...DAYS.slice(1), DAYS[0]] : DAYS)

    const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

    const weekDays = computed(() => days.value.map((day) => ({
        day,
        label: props.locale?.[day]
    })))

    // Сетка месяца: null-ячейки до первого дня недели, дальше все числа месяца
    const dates = computed<(DatePickerDate | null)[]>(() => {
        const first = parseDate(new Date(props.year, props.month, 1))
        const offset = days.value.indexOf(first.day)
        const cells: (DatePickerDate | null)[] = Array(offset).fill(null)

        for (let day = 1; day <= daysInMonth.value; day++) {
            cells.push(parseDate(new Date(props.year, props.month, day)))
        }

        return cells
    })

    const parsedHighlighted = computed(() =>
        props.highlightedDates
            ?.filter(isValidDateValue)
            .map((date) => parseDate(date)) ?? [],
    )

    const enrichedDates = computed<DatePickerEnrichedDate[]>(() =>
        dates.value.map((date) => date ? enrichDate(date) : EMPTY_CELL),
    )

    const rows = computed(() => chunk(unref(enrichedDates), DAYS.length))

    function enrichDate(date: DatePickerDate): DatePickerEnrichedDate {
        const disabled = isDateDisabled(date, props)
        const highlighted = isHighlighted(date)

        return {
            dateObj: {
                ...date,
                isHoliday: disabled,
                isHighlighted: highlighted,
            },
            empty: false,
            disabled,
            highlighted,
            isSelected: isEqualDates(date, props.modelValue ?? undefined),
            isToday: isEqualDates(date, today),
            isFocused: isEqualDates(date, unref(focusedDate)),
        }
    }

    // Date сам нормализует перекат через границу года
    function updateMonth(isNext: boolean) {
        const next = parseDate(new Date(props.year, props.month + (isNext ? 1 : -1), 1))

        transitionName.value = isNext ? 'c-date-slide-left' : 'c-date-slide-right'

        emit('update:month', {
            month: next.month,
            year: next.year,
        })
    }

    function isHighlighted(date: DatePickerDate): boolean {
        return unref(parsedHighlighted).some((d) => isEqualDates(date, d))
    }

    // Стартовая точка курсора: выбранная дата или сегодня, если видны в текущем
    // месяце, иначе 1-е число
    function focusStartPoint(): DatePickerDate {
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
    function moveFocus(delta: number) {
        const from = unref(focusedDate)

        const next = from
            ? parseDate(new Date(from.year, from.month, from.date + delta))
            : focusStartPoint()

        focusedDate.value = next

        if (next.month !== props.month || next.year !== props.year) {
            updateMonth(delta > 0)
        }
    }

    function focusDay(day: number) {
        focusedDate.value = parseDate(new Date(props.year, props.month, day))
    }

    // Единая точка выбора: клик по ячейке, onSelect из слота, Enter/Space
    function select(date: DatePickerDate) {
        if (!date.isHoliday) {
            emit('update:modelValue', date)
        }
    }

    function selectFocused() {
        const date = unref(focusedDate)

        if (date && !isDateDisabled(date, props)) {
            emit('update:modelValue', date)
        }
    }

    const { onKeydown } = useKeyboard({
        ArrowLeft: () => moveFocus(-1),
        ArrowRight: () => moveFocus(1),
        ArrowUp: () => moveFocus(-7),
        ArrowDown: () => moveFocus(7),
        Home: () => focusDay(1),
        End: () => focusDay(unref(daysInMonth)),
        Enter: selectFocused,
        Space: selectFocused,
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
                v-for="wd in weekDays"
                :key="wd.day"
                class="c-date-picker-dates__day"
                role="columnheader"
            >
                {{ wd.label }}
            </span>
        </div>

        <slot
            v-if="$slots.dates"
            name="dates"
            :dates="enrichedDates"
            :on-select="select"
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
                        v-for="(item, ci) in row"
                        :key="ci"
                    >
                        <div
                            v-if="item.empty"
                            class="c-date-picker-dates__cell c-date-picker-dates__cell--empty"
                            role="gridcell"
                        ></div>
                        <div
                            v-else
                            :class="[
                                'c-date-picker-dates__cell',
                                ...(presetZones?.cell ?? []),
                                item.isSelected && 'c-date-picker-dates__cell--selected',
                                item.isToday && !item.isSelected && 'c-date-picker-dates__cell--today',
                                item.disabled && 'c-date-picker-dates__cell--disabled',
                                item.highlighted && 'c-date-picker-dates__cell--highlighted',
                                item.isFocused && 'c-date-picker-dates__cell--focused',
                            ]"
                            role="gridcell"
                            :aria-selected="item.isSelected"
                            :aria-disabled="item.disabled || undefined"
                            @click="select(item.dateObj!)"
                        >
                            <slot
                                v-if="$slots.date"
                                name="date"
                                v-bind="{ ...item.dateObj!, isSelected: item.isSelected, isToday: item.isToday }"
                            />
                            <template v-else>
                                {{ item.dateObj!.date }}
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>
