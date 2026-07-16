<script setup lang="ts">
    import {
        computed,
        inject,
        onBeforeUnmount,
        onMounted,
        reactive,
        shallowRef,
        watch
    } from 'vue'

    import { CKeyboardProvider } from '@/components/CKeyboardProvider'
    import type { KeyboardTarget } from '@/components/CKeyboardProvider/types'
    import { useDatePickerPresets } from '@/composables/use-date-picker-presets'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $KEYBOARD_API_KEY } from '@/constants'

    import CDatePickerDates from './CDatePickerDates.vue'
    import CDatePickerHeader from './CDatePickerHeader.vue'
    import CDatePickerMonths from './CDatePickerMonths.vue'
    import CDatePickerYears from './CDatePickerYears.vue'
    import { isValidDateValue, parseDate } from './helpers'
    import { mergeLocale } from './locales'
    import type {
        CDatePickerEmits,
        CDatePickerProps,
        CDatePickerSlots,
        DatePickerDate,
        DatePickerSlotApi,
        DatePickerView,
        DatePickerViewApi,
    } from './types'

    defineOptions({ name: 'CDatePicker' })

    const props = defineProps<CDatePickerProps>()

    const emit = defineEmits<CDatePickerEmits>()

    defineSlots<CDatePickerSlots>()

    const activeViewRef = shallowRef<DatePickerViewApi | null>(null)
    const keyboardRef = shallowRef()
    const rootRef = shallowRef<HTMLElement>()

    const keyboard = inject($KEYBOARD_API_KEY, null)

    const tabIndex = keyboard ? -1 : 0
    const today = parseDate(new Date())

    const selected = computed<DatePickerDate | null>(() =>
        isValidDateValue(props.modelValue) ? parseDate(props.modelValue) : null,
    )
    const displayValue = computed<DatePickerDate>(() => selected.value ?? today)

    const state = reactive({
        tableMonth: displayValue.value.month,
        tableYear: displayValue.value.year,
        view: 'dates' as DatePickerView,
        bodyTransition: 'c-date-slide-left',
    })

    const presetZones = useDatePickerPresets({
        props,
        view: () => state.view,
    })

    const dateLocale = computed(() => mergeLocale(props.locale))
    const minDate = computed(() => isValidDateValue(props.minDate) ? parseDate(props.minDate) : null)
    const maxDate = computed(() => isValidDateValue(props.maxDate) ? parseDate(props.maxDate) : null)

    const headerValue = computed(() => {
        if (state.view === 'years') {
            return `${state.tableYear}`
        }

        if (state.view === 'months') {
            return dateLocale.value.monthsAbbr[state.tableMonth]
        }

        return `${dateLocale.value.monthsAbbr[state.tableMonth]} ${state.tableYear}`
    })

    const displayDate = computed(() => {
        const {
            month,
            date,
            day
        } = displayValue.value

        return `${dateLocale.value.monthsAbbr[month]} ${date}, ${dateLocale.value.week[day]}`
    })

    const disablePrev = computed(() => {
        if (!minDate.value) {
            return false
        }

        if (state.view === 'dates') {
            return getMonthOffset(state.tableYear, state.tableMonth, minDate.value) <= 0
        }

        if (state.view === 'months') {
            return state.tableYear <= minDate.value.year
        }

        return false
    })

    const disableNext = computed(() => {
        if (!maxDate.value) {
            return false
        }

        if (state.view === 'dates') {
            return getMonthOffset(state.tableYear, state.tableMonth, maxDate.value) >= 0
        }

        if (state.view === 'months') {
            return state.tableYear >= maxDate.value.year
        }

        return false
    })

    const slotApi = computed<DatePickerSlotApi>(() => ({
        view: state.view,
        value: headerValue.value,
        selected: selected.value,
        disablePrev: disablePrev.value,
        disableNext: disableNext.value,
        preset: presetZones.value,
        showNextPage: () => activeViewRef.value?.showNextPage(),
        showPreviousPage: () => activeViewRef.value?.showPreviousPage(),
        toggleView,
        showToday,
    }))

    function showView(view: DatePickerView, transition: string) {
        state.bodyTransition = transition
        state.view = view
    }

    function getMonthOffset(year: number, month: number, date: DatePickerDate): number {
        return (year * 12 + month) - (date.year * 12 + date.month)
    }

    // Клик по хедеру поднимает вьюху крупнее: dates → months → years, из years — назад в months
    function toggleView() {
        if (state.view === 'dates') {
            showView('months', 'c-date-slide-up')
        } else if (state.view === 'months') {
            showView('years', 'c-date-slide-up')
        } else {
            showView('months', 'c-date-slide-down')
        }
    }

    function selectYear(year: number) {
        state.tableYear = year
        showView('months', 'c-date-slide-down')
    }

    function selectMonth(month: number) {
        state.tableMonth = month
        showView('dates', 'c-date-slide-down')
    }

    function displayMonth(params: {
        month: number
        year: number
    }) {
        state.tableMonth = params.month
        state.tableYear = params.year
    }

    function displayYear(year: number) {
        state.tableYear = year
    }

    function selectDate(date: DatePickerDate) {
        state.tableMonth = date.month
        state.tableYear = date.year

        const value = new Date(date.year, date.month, date.date)

        emit('update:modelValue', value)
    }

    function showToday() {
        state.tableMonth = today.month
        state.tableYear = today.year
        showView('dates', 'c-date-slide-down')
    }

    watch(displayValue, (val) => {
        state.tableMonth = val.month
        state.tableYear = val.year
    })

    // Активная вьюха сама регистрируется во внутреннем контуре — пикер только
    // доставляет события: с корня (standalone) или из контура хоста (CDateInput),
    // где фокус остаётся в поле.

    const { onKeydown } = useKeyboard({ '*': (e) => keyboardRef.value?.forward(e) })

    const keyboardTarget: KeyboardTarget = {
        onKeydown,
        blur: () => rootRef.value?.blur(),
        getElement: () => rootRef.value,
    }

    onMounted(() => keyboard?.register(keyboardTarget))
    onBeforeUnmount(() => keyboard?.unregister(keyboardTarget))
</script>

<template>
    <div
        ref="rootRef"
        :class="['c-date-picker', ...presetZones.root]"
        :tabindex="tabIndex"
        @keydown="onKeydown"
    >
        <div :class="['c-date-picker__display', ...presetZones.display]">
            <div class="c-date-picker__display-year">
                {{ displayValue.year }}
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

        <c-date-picker-header
            :class="presetZones.header"
            :disable-prev
            :disable-next
            @next-page="activeViewRef?.showNextPage()"
            @previous-page="activeViewRef?.showPreviousPage()"
            @toggle-view="toggleView"
        >
            {{ headerValue }}
        </c-date-picker-header>

        <slot
            v-if="$slots['before-body']"
            name="before-body"
            v-bind="slotApi"
        />

        <div class="c-date-picker__body">
            <c-keyboard-provider ref="keyboardRef">
                <transition
                    :name="state.bodyTransition"
                    mode="out-in"
                >
                    <c-date-picker-years
                        v-if="state.view === 'years'"
                        key="years"
                        ref="activeViewRef"
                        :year="state.tableYear"
                        :value="selected"
                        :min-year="minDate?.year"
                        :max-year="maxDate?.year"
                        @update:year="selectYear"
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
                        v-else-if="state.view === 'months'"
                        key="months"
                        ref="activeViewRef"
                        :month="state.tableMonth"
                        :year="state.tableYear"
                        :value="selected"
                        :locale="dateLocale.monthsAbbr"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @update:month="selectMonth"
                        @update:year="displayYear"
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
                        ref="activeViewRef"
                        :model-value="selected"
                        :year="state.tableYear"
                        :month="state.tableMonth"
                        :locale="dateLocale.week"
                        :monday-first="mondayFirst"
                        :disabled-dates="disabledDates"
                        :highlighted-dates="highlightedDates"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @update:model-value="selectDate"
                        @update:month="displayMonth"
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
            </c-keyboard-provider>
        </div>

        <slot
            v-if="$slots.footer"
            name="footer"
            v-bind="slotApi"
        />
    </div>
</template>
