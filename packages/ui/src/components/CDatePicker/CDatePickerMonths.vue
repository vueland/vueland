<script setup lang="ts">
    import { computed } from 'vue'

    import type { DatePickerDate } from './types'

    defineOptions({ name: 'CDatePickerMonths' })

    const props = defineProps<{
        month: number
        year: number
        locale?: string[]
        minDate?: DatePickerDate | null
        maxDate?: DatePickerDate | null
    }>()

    const emit = defineEmits<{
        'update:month': [month: number]
        'update:year': [year: number]
    }>()

    defineSlots<{
        months?(props: { months: EnrichedMonth[] }): any
        month?(props: EnrichedMonth): any
    }>()

    export type EnrichedMonth = {
        month: number
        label: string
        disabled: boolean
        isSelected: boolean
        isCurrent: boolean
        onSelect: () => void
    }

    const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const CELLS_IN_ROW = 3
    const CURRENT_YEAR = new Date().getFullYear()
    const CURRENT_MONTH = new Date().getMonth()

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

    const enrichedMonths = computed<EnrichedMonth[]>(() =>
        MONTHS.map((m) => ({
            month: m,
            label: props.locale?.[m] ?? '',
            disabled: isDisabled(m),
            isSelected: m === props.month,
            isCurrent: m === CURRENT_MONTH && props.year === CURRENT_YEAR,
            onSelect: () => { if (!isDisabled(m)) emit('update:month', m) },
        })),
    )

    const rows = computed(() => {
        const result: EnrichedMonth[][] = []
        for (let i = 0; i < enrichedMonths.value.length; i += CELLS_IN_ROW) {
            result.push(enrichedMonths.value.slice(i, i + CELLS_IN_ROW))
        }
        return result
    })

    defineExpose({
        onNext: () => emit('update:year', props.year + 1),
        onPrev: () => emit('update:year', props.year - 1),
    })
</script>

<template>
    <div class="c-date-picker-months">
        <slot
            v-if="$slots.months"
            name="months"
            :months="enrichedMonths"
        ></slot>
        <template v-else>
            <div
                v-for="(row, ri) in rows"
                :key="ri"
                class="c-date-picker-months__row"
            >
                <template
                    v-for="item in row"
                    :key="item.month"
                >
                    <slot
                        v-if="$slots.month"
                        name="month"
                        v-bind="item"
                    ></slot>
                    <div
                        v-else
                        :class="[
                            'c-date-picker-months__cell',
                            item.isSelected && 'c-date-picker-months__cell--selected',
                            item.isCurrent && 'c-date-picker-months__cell--current',
                            item.disabled && 'c-date-picker-months__cell--disabled',
                        ]"
                        @click="item.onSelect"
                    >
                        {{ item.label }}
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
