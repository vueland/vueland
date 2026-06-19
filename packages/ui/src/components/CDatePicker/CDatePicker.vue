<script setup lang="ts">
    import {
        computed, reactive, shallowRef, unref,
    } from 'vue'

    import { isDef } from '../../helpers'

    import CDatePickerDates, { type EnrichedDate } from './CDatePickerDates.vue'
    import CDatePickerHeader from './CDatePickerHeader.vue'
    import CDatePickerMonths, { type EnrichedMonth } from './CDatePickerMonths.vue'
    import CDatePickerYears, { type EnrichedYear } from './CDatePickerYears.vue'
    import { parseDate } from './helpers'
    import type { DatePickerDate, DisabledDates } from './types'
    import { LOCALE } from './utils'

    defineOptions({ name: 'CDatePicker' })

    const props = withDefaults(defineProps<CDatePickerProps>(), {
        lang: 'en',
        format: 'dd.MM.yyyy',
    })

    const emit = defineEmits<{
        'update:modelValue': [value: Date | null]
        selected: [value: Date | null]
    }>()

    defineSlots<{
        'before-header'?(props: DatePickerSlotApi): any
        header?(props: DatePickerSlotApi): any
        'before-body'?(props: DatePickerSlotApi): any
        body?(props: DatePickerSlotApi): any
        footer?(props: DatePickerSlotApi): any
        week?(props: { days: DatePickerWeekDay[] }): any
        dates?(props: {
            dates: EnrichedDate[]
            onSelect: (d: DatePickerDate) => void }
        ): any
        date?(props: DatePickerDate & {
            isSelected: boolean;
            isToday: boolean
        }): any
        months?(props: { months: EnrichedMonth[] }): any
        month?(props: EnrichedMonth): any
        years?(props: { years: EnrichedYear[] }): any
        year?(props: EnrichedYear): any
    }>()

    const enum ViewMode {
        DATES = 0,
        MONTHS = 1,
        YEARS = 2,
    }

    export type DatePickerSlotApi = {
        view: ViewMode
        value: string
        selected: DatePickerDate
        prevDisabled: boolean
        nextDisabled: boolean
        onNext: () => void
        onPrev: () => void
        onTable: () => void
        onToday: () => void
    }

    export type DatePickerWeekDay = {
        day: number
        label: string | undefined
    }

    export type DatePickerEnrichedDate = EnrichedDate
    export type DatePickerEnrichedMonth = EnrichedMonth
    export type DatePickerEnrichedYear = EnrichedYear

    export type CDatePickerProps = {
        modelValue?: Date | string | null
        lang?: string
        format?: string
        mondayFirst?: boolean
        disabledDates?: DisabledDates
        highlightedDates?: (Date | string)[]
        minDate?: Date | string
        maxDate?: Date | string
    }

    type ModeRef = InstanceType<typeof CDatePickerDates> | InstanceType<typeof CDatePickerMonths> | InstanceType<typeof CDatePickerYears> | null

    const picker = shallowRef<ModeRef>(null)
    const today = parseDate(new Date())

    const selected = computed<DatePickerDate>(() =>
        props.modelValue ? parseDate(new Date(props.modelValue)) : today,
    )

    const locale = computed(() => LOCALE[props.lang] ?? LOCALE['en'])
    const minDate = computed(() => props.minDate ? parseDate(new Date(props.minDate)) : null)
    const maxDate = computed(() => props.maxDate ? parseDate(new Date(props.maxDate)) : null)

    const state = reactive({
        tableMonth: unref(selected).month,
        tableYear: unref(selected).year,
        view: ViewMode.DATES as ViewMode,
        bodyTransition: 'c-date-slide-left',
    })

    const headerValue = computed(() => {
        if (state.view === ViewMode.YEARS) return `${state.tableYear}`
        if (state.view === ViewMode.MONTHS) return `${unref(locale).monthsAbbr[state.tableMonth]}`

        return `${unref(locale).monthsAbbr[state.tableMonth]} ${state.tableYear}`
    })

    const displayYear = computed(() => selected.value.year)

    const displayDate = computed(() => {
        const {
            month,
            date,
            day
        } = unref(selected)
        return `${locale.value.monthsAbbr[month]} ${date}, ${locale.value.week[day]}`
    })

    const prevDisabled = computed(() => {
        if (!minDate.value) return false
        if (state.view === ViewMode.YEARS) return state.tableYear <= unref(minDate)!.year && state.tableMonth <= unref(minDate)!.month
        if (state.view === ViewMode.MONTHS) return state.tableYear <= unref(minDate)!.year
        return false
    })

    const nextDisabled = computed(() => {
        if (!maxDate.value) return false
        if (state.view === ViewMode.DATES) return state.tableYear >= unref(maxDate)!.year && state.tableMonth >= unref(maxDate)!.month
        if (state.view === ViewMode.MONTHS) return state.tableYear >= unref(maxDate)!.year
        return false
    })

    const slotApi = computed<DatePickerSlotApi>(() => ({
        view: state.view,
        value: headerValue.value,
        selected: selected.value,
        prevDisabled: prevDisabled.value,
        nextDisabled: nextDisabled.value,
        onNext: () => unref(picker)?.onNext(),
        onPrev: () => unref(picker)?.onPrev(),
        onTable: onTableToggle,
        onToday,
    }))

    function onTableToggle() {
        if (state.view === ViewMode.DATES) { state.bodyTransition = 'c-date-slide-up'; state.view = ViewMode.MONTHS; return }
        if (state.view === ViewMode.MONTHS) { state.bodyTransition = 'c-date-slide-up'; state.view = ViewMode.YEARS; return }
        if (state.view === ViewMode.YEARS) { state.bodyTransition = 'c-date-slide-down'; state.view = ViewMode.MONTHS }
    }

    function onYearUpdate(year: number) {
        state.tableYear = year
        state.bodyTransition = 'c-date-slide-down'
        state.view = ViewMode.MONTHS
    }

    function onMonthUpdate(month: number) {
        state.tableMonth = month
        state.bodyTransition = 'c-date-slide-down'
        state.view = ViewMode.DATES
    }

    function onMonthChange(params: {
        month: number;
        year?: number }) {
            state.tableMonth = params.month
            if (isDef(params.year)) state.tableYear = params.year!
        }

    function onDateSelect(date: DatePickerDate) {
        state.tableMonth = date.month
        state.tableYear = date.year
        const value = new Date(date.year, date.month, date.date as number)
        emit('update:modelValue', value)
        emit('selected', value)
    }

    function onToday() {
        state.tableMonth = today.month
        state.tableYear = today.year
        state.view = ViewMode.DATES
    }
</script>

<template>
    <div class="c-date-picker">
        <div class="c-date-picker__display">
            <div class="c-date-picker__display-year">
                {{ displayYear }}
            </div>
            <transition
                name="c-date-fade"
                mode="out-in"
            >
                <div
                    :key="displayDate"
                    class="c-date-picker__display-date"
                >
                    {{ displayDate }}
                </div>
            </transition>
        </div>

        <slot
            v-if="$slots['before-header']"
            name="before-header"
            v-bind="slotApi"
        />

        <slot
            v-if="$slots.header"
            name="header"
            v-bind="slotApi"
        />
        <c-date-picker-header
            v-else
            :prev-disabled="prevDisabled"
            :next-disabled="nextDisabled"
            @next="picker?.onNext()"
            @prev="picker?.onPrev()"
            @table="onTableToggle"
        >
            {{ headerValue }}
        </c-date-picker-header>

        <slot
            v-if="$slots['before-body']"
            name="before-body"
            v-bind="slotApi"
        />

        <div class="c-date-picker__body">
            <slot
                v-if="$slots.body"
                name="body"
                v-bind="slotApi"
            />
            <transition
                v-else
                :name="state.bodyTransition"
                mode="out-in"
            >
                <c-date-picker-years
                    v-if="state.view === 2"
                    key="years"
                    ref="picker"
                    :year="state.tableYear"
                    :min-year="minDate?.year"
                    :max-year="maxDate?.year"
                    @update:year="onYearUpdate"
                >
                    <template
                        v-if="$slots.years"
                        #years="slotProps"
                    >
                        <slot
                            name="years"
                            v-bind="slotProps"
                        />
                    </template>
                    <template
                        v-if="$slots.year"
                        #year="slotProps"
                    >
                        <slot
                            name="year"
                            v-bind="slotProps"
                        />
                    </template>
                </c-date-picker-years>

                <c-date-picker-months
                    v-else-if="state.view === 1"
                    key="months"
                    ref="picker"
                    :month="state.tableMonth"
                    :year="state.tableYear"
                    :locale="locale.monthsAbbr"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @update:month="onMonthUpdate"
                    @update:year="(y) => { state.tableYear = y }"
                >
                    <template
                        v-if="$slots.months"
                        #months="slotProps"
                    >
                        <slot
                            name="months"
                            v-bind="slotProps"
                        />
                    </template>
                    <template
                        v-if="$slots.month"
                        #month="slotProps"
                    >
                        <slot
                            name="month"
                            v-bind="slotProps"
                        />
                    </template>
                </c-date-picker-months>

                <c-date-picker-dates
                    v-else
                    key="dates"
                    ref="picker"
                    :year="state.tableYear"
                    :month="state.tableMonth"
                    :value="selected"
                    :locale="locale.week"
                    :monday-first="mondayFirst"
                    :disabled-dates="disabledDates"
                    :highlighted-dates="highlightedDates"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @update:value="onDateSelect"
                    @update:month="onMonthChange"
                >
                    <template
                        v-if="$slots.week"
                        #week="slotProps"
                    >
                        <slot
                            name="week"
                            v-bind="slotProps"
                        />
                    </template>
                    <template
                        v-if="$slots.dates"
                        #dates="slotProps"
                    >
                        <slot
                            name="dates"
                            v-bind="slotProps"
                        />
                    </template>
                    <template
                        v-if="$slots.date"
                        #date="slotProps"
                    >
                        <slot
                            name="date"
                            v-bind="slotProps"
                        />
                    </template>
                </c-date-picker-dates>
            </transition>
        </div>

        <slot
            v-if="$slots.footer"
            name="footer"
            v-bind="slotApi"
        />
    </div>
</template>
