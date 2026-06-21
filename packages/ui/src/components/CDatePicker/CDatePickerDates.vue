<script setup lang="ts">
    import {
        computed,
        shallowRef,
        unref,
        watch
    } from 'vue'

    import { parseDate, toDateString } from './helpers'
    import type { DatePickerDate, DisabledDates } from './types'

    defineOptions({ name: 'CDatePickerDates' })

    const props = defineProps<{
        locale?: string[]
        year: number
        month: number
        value?: DatePickerDate | null
        mondayFirst?: boolean
        disabledDates?: DisabledDates
        highlightedDates?: (Date | string)[]
        minDate?: DatePickerDate | null
        maxDate?: DatePickerDate | null
    }>()

    const emit = defineEmits<{
        'update:value': [date: DatePickerDate]
        'update:month': [params: { month: number, year?: number }]
    }>()

    defineSlots<{
        week?(props: { days: { day: number, label: string | undefined }[] }): any
        dates?(props: { dates: EnrichedDate[], onSelect: (d: DatePickerDate) => void }): any
        date?(props: DatePickerDate & { isSelected: boolean, isToday: boolean }): any
    }>()

    defineExpose({
        onNext: () => updateMonth(true),
        onPrev: () => updateMonth(false),
    })

    const dates = shallowRef<(DatePickerDate | null)[]>([])

    const transitionName = shallowRef('c-date-slide-left')

    const FIRST_MONTH = 0

    const LAST_MONTH = 11

    const DAYS = [0, 1, 2, 3, 4, 5, 6]

    const today = parseDate(new Date())

    const days = computed(() => {
        let days = DAYS

        if (props.mondayFirst) {
            days = DAYS.slice(1)
            days.push(DAYS[0])
        }

        return days
    })

    const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

    const weekDays = computed(() => unref(days).map((d) => ({
        day: d,
        label: props.locale?.[d]
    })))

    const parsedFromTo = computed(() => {
        const { from, to } = props.disabledDates ?? {}
        if (!from || !to) return null
        return {
            f: parseDate(new Date(from)).mls ?? 0,
            t: parseDate(new Date(to)).mls ?? 0
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

    const enrichedDates = computed<EnrichedDate[]>(() =>
        dates.value.map((dateObj) => {
            if (!dateObj || !dateObj.date) return {
                dateObj,
                empty: true,
                disabled: false,
                highlighted: false,
                isSelected: false,
                isToday: false
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
        }),
    )

    const rows = computed(() => {
        const result: EnrichedDate[][] = []
        for (let i = 0; i < enrichedDates.value.length; i += 7) {
            result.push(enrichedDates.value.slice(i, i + 7))
        }
        return result
    })

    function updateMonth(isNext: boolean) {
        transitionName.value = isNext ? 'c-date-slide-left' : 'c-date-slide-right'
        let month = props.month + (isNext ? 1 : -1)
        let year: number | undefined
        if (!isNext && month < FIRST_MONTH) { month = LAST_MONTH; year = props.year - 1 }
        if (isNext && month > LAST_MONTH) { month = FIRST_MONTH; year = props.year + 1 }
        emit('update:month', {
            month,
            year
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
                for (let j = 0; j < firstDayIndex; j++) dates.value.push({ date: null } as any)
            }
            dates.value.push(dateObj)
        }
    }

    function isEqualDates(a: DatePickerDate, b: DatePickerDate | null | undefined): boolean {
        if (!b) return false
        return a.date === b.date && a.month === b.month && a.year === b.year
    }

    function isDisabled(date: DatePickerDate): boolean {
        if (!date.date) return false
        const mls = date.mls ?? 0
        const {
            disabledDates: d,
            minDate,
            maxDate
        } = props
        return [
            () => !!minDate && mls < (minDate.mls ?? 0),
            () => !!maxDate && mls > (maxDate.mls ?? 0),
            () => !!d?.daysOfMonth?.includes(date.date!),
            () => !!d?.days?.includes(date.day),
            () => !!d?.dates?.some((v) => `${new Date(v)}` === `${toDateString(date)}`),
            () => !!parsedFromTo.value && mls >= parsedFromTo.value.f && mls <= parsedFromTo.value.t,
            () => parsedRanges.value.some((r) => mls >= r.f && mls <= r.t),
            () => !!d?.custom?.(date),
        ].some((check) => check())
    }

    function isHighlighted(date: DatePickerDate): boolean {
        return parsedHighlighted.value.some((d) => isEqualDates(date, d))
    }

    watch(() => props.month, buildDates, { immediate: true })

    export type EnrichedDate = {
        dateObj: DatePickerDate | null
        empty: boolean
        disabled: boolean
        highlighted: boolean
        isSelected: boolean
        isToday: boolean
    }
</script>

<template>
    <div class="c-date-picker-dates">
        <slot
            v-if="$slots.week"
            name="week"
            :days="weekDays"
        ></slot>
        <div
            v-else
            class="c-date-picker-dates__week"
        >
            <span
                v-for="wd in weekDays"
                :key="wd.day"
                class="c-date-picker-dates__day"
            >
                {{ wd.label }}
            </span>
        </div>

        <slot
            v-if="$slots.dates"
            name="dates"
            :dates="enrichedDates"
            :on-select="(d: DatePickerDate) => !d.isHoliday && emit('update:value', d)"
        ></slot>
        <transition
            v-else
            :name="transitionName"
            mode="out-in"
        >
            <div
                :key="`${year}-${month}`"
                class="c-date-picker-dates__dates"
            >
                <div
                    v-for="(row, ri) in rows"
                    :key="ri"
                    class="c-date-picker-dates__row"
                >
                    <template
                        v-for="(item, ci) in row"
                        :key="ci"
                    >
                        <div
                            v-if="item.empty || !item.dateObj?.date"
                            class="c-date-picker-dates__cell c-date-picker-dates__cell--empty"
                        ></div>
                        <div
                            v-else
                            :class="[
                                'c-date-picker-dates__cell',
                                item.isSelected && 'c-date-picker-dates__cell--selected',
                                item.isToday && !item.isSelected && 'c-date-picker-dates__cell--today',
                                item.disabled && 'c-date-picker-dates__cell--disabled',
                                item.highlighted && 'c-date-picker-dates__cell--highlighted',
                            ]"
                            @click="!item.disabled && emit('update:value', item.dateObj!)"
                        >
                            <slot
                                v-if="$slots.date"
                                name="date"
                                v-bind="{ ...item.dateObj!, isSelected: item.isSelected, isToday: item.isToday }"
                            ></slot>
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
