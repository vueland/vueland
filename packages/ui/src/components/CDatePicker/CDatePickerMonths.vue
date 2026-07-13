<script setup lang="ts">
    import {
        computed,
        inject,
        onBeforeUnmount,
        onMounted,
        shallowRef
    } from 'vue'

    import type { KeyboardTarget } from '@/components/CKeyboardProvider/types'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $DATE_PICKER_PRESET_KEY, $KEYBOARD_API_KEY } from '@/constants'

    import { chunk } from './helpers'
    import type {
        DatePickerEnrichedMonth,
        DatePickerMonthsEmits,
        DatePickerMonthsProps,
        DatePickerMonthsSlots,
    } from './types'

    defineOptions({ name: 'CDatePickerMonths' })

    const props = defineProps<DatePickerMonthsProps>()

    const emit = defineEmits<DatePickerMonthsEmits>()

    defineSlots<DatePickerMonthsSlots>()

    defineExpose({
        onNext: () => emit('update:year', props.year + 1),
        onPrev: () => emit('update:year', props.year - 1),
    })

    const rootRef = shallowRef<HTMLElement>()

    const focused = shallowRef<number | null>(null)

    const presetZones = inject($DATE_PICKER_PRESET_KEY, null)

    const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const CELLS_IN_ROW = 3
    const CURRENT_YEAR = new Date().getFullYear()
    const CURRENT_MONTH = new Date().getMonth()

    const enrichedMonths = computed<DatePickerEnrichedMonth[]>(() =>
        MONTHS.map((m) => {
            const disabled = isDisabled(m)

            return {
                month: m,
                label: props.locale?.[m] ?? '',
                disabled,
                isSelected: m === props.value?.month && props.year === props.value.year,
                isCurrent: m === CURRENT_MONTH && props.year === CURRENT_YEAR,
                isFocused: m === focused.value,
                onSelect: () => { if (!disabled) emit('update:month', m) },
            }
        }),
    )

    const rows = computed(() => chunk(enrichedMonths.value, CELLS_IN_ROW))

    function isDisabled(m: number): boolean {
        const {
            minDate,
            maxDate,
            year
        } = props

        if (minDate && (year < minDate.year || (year === minDate.year && m < minDate.month))) return true
        if (maxDate && (year > maxDate.year || (year === maxDate.year && m > maxDate.month))) return true

        return false
    }

    // Первое нажатие ставит курсор на текущий месяц; выход за границы
    // года листает год, курсор заворачивается
    function moveFocus(delta: number) {
        if (focused.value === null) {
            focused.value = props.month
            return
        }

        const next = focused.value + delta

        if (next < 0) emit('update:year', props.year - 1)
        if (next > 11) emit('update:year', props.year + 1)

        focused.value = (next + 12) % 12
    }

    function selectFocused() {
        if (focused.value !== null) {
            enrichedMonths.value[focused.value]?.onSelect()
        }
    }

    const { onKeydown } = useKeyboard({
        ArrowLeft: () => moveFocus(-1),
        ArrowRight: () => moveFocus(1),
        ArrowUp: () => moveFocus(-CELLS_IN_ROW),
        ArrowDown: () => moveFocus(CELLS_IN_ROW),
        Home: () => { focused.value = 0 },
        End: () => { focused.value = 11 },
        Enter: selectFocused,
        Space: selectFocused,
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
</script>

<template>
    <div
        ref="rootRef"
        class="c-date-picker-months"
        role="grid"
    >
        <slot
            v-if="$slots.months"
            name="months"
            :months="enrichedMonths"
        />
        <template v-else>
            <div
                v-for="(row, ri) in rows"
                :key="ri"
                class="c-date-picker-months__row"
                role="row"
            >
                <template
                    v-for="item in row"
                    :key="item.month"
                >
                    <slot
                        v-if="$slots.month"
                        name="month"
                        v-bind="item"
                    />
                    <div
                        v-else
                        :class="[
                            'c-date-picker-months__cell',
                            ...(presetZones?.cell ?? []),
                            item.isSelected && 'c-date-picker-months__cell--selected',
                            item.isCurrent && 'c-date-picker-months__cell--current',
                            item.disabled && 'c-date-picker-months__cell--disabled',
                            item.isFocused && 'c-date-picker-months__cell--focused',
                        ]"
                        role="gridcell"
                        :aria-selected="item.isSelected"
                        :aria-disabled="item.disabled || undefined"
                        @click="item.onSelect"
                    >
                        {{ item.label }}
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
