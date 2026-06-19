<script setup lang="ts">
    import { computed, ref } from 'vue'

    import type { PresetProps, ValidateProps } from '../../composables'
    import { IconAliases } from '../../enums'
    import { CDatePicker, type DatePickerDate, type DatePickerEnrichedDate, type DatePickerSlotApi, datePickerValueToString,type DatePickerWeekDay,type DisabledDates   } from '../CDatePicker'
    import { CField } from '../CField'
    import { CIcon } from '../CIcon'
    import { CInput } from '../CInput'
    import { CMenu } from '../CMenu'

    defineOptions({ name: 'CDateInput', inheritAttrs: false })

    const props = defineProps<CDateInputProps>()

    const emit = defineEmits<{
        'update:modelValue': [value: Date | null]
        focus: []
        blur: []
    }>()

    defineSlots<{
        prepend?(): any
        append?(): any
        date?(props: DatePickerDate & { isSelected: boolean; isToday: boolean }): any
        week?(props: { days: DatePickerWeekDay[] }): any
        dates?(props: { dates: DatePickerEnrichedDate[]; onSelect: (d: DatePickerDate) => void }): any
        'before-header'?(props: DatePickerSlotApi): any
        header?(props: DatePickerSlotApi): any
        'before-body'?(props: DatePickerSlotApi): any
        body?(props: DatePickerSlotApi): any
        footer?(props: DatePickerSlotApi): any
    }>()

    const model = defineModel<Date | null>()

    export type CDateInputProps = ValidateProps & PresetProps & {
        modelValue?: Date | null
        label?: string
        details?: string
        noDetails?: boolean
        clearable?: boolean
        disabled?: boolean
        readonly?: boolean
        typeable?: boolean
        placeholder?: string
        lang?: string
        format?: string
        mondayFirst?: boolean
        disabledDates?: DisabledDates
        highlightedDates?: (Date | string)[]
        minDate?: Date | string
        maxDate?: Date | string
    }

    const menuOpen = ref(false)
    const inputRef = ref()
    const fieldRef = ref()

    const displayValue = computed(() =>
        datePickerValueToString(model.value, props.format ?? 'dd.MM.yyyy', props.lang ?? 'en'),
    )

    function onDateSelect(value: Date | null) {
        model.value = value
        emit('update:modelValue', value)
        menuOpen.value = false
    }

    function onFieldClear() {
        model.value = null
        emit('update:modelValue', null)
    }

    function onTypeInput(val: string | number | null) {
        if (!props.typeable) return
        const parsed = new Date(val as string)
        if (!isNaN(parsed.getTime())) {
            model.value = parsed
            emit('update:modelValue', parsed)
        }
    }
</script>

<template>
    <c-input
        ref="inputRef"
        :model-value="model"
        v-bind="$attrs"
        kind="input"
        :label="label"
        :details="details"
        :no-details="noDetails"
        :clearable="clearable"
        :disabled="disabled"
        :readonly="readonly"
        :rules="rules"
        :validate-on="validateOn"
        :preset="preset"
        @focus="emit('focus')"
        @blur="emit('blur')"
    >
        <template #field="field">
            <c-menu
                v-model="menuOpen"
                bottom
                :offset-y="2"
                :width="320"
                close-on-click-outside
                :close-on-content-click="false"
                strategy="reverse"
            >
                <template #activator="{ activator }">
                    <div
                        class="c-date-input"
                        v-bind="activator"
                    >
                        <c-field
                            :id="field.uid"
                            ref="fieldRef"
                            :model-value="displayValue"
                            :label="field.label"
                            :preset="field.preset"
                            :focused="field.focused"
                            :error="field.hasError"
                            :clearable="field.clearable"
                            :readonly="!typeable"
                            no-input
                            :disabled="disabled"
                            v-bind="field.attrs"
                            @update:model-value="onTypeInput"
                            @focus="() => { field.focus(); if (!typeable) menuOpen = true }"
                            @blur="field.blur"
                            @clear="onFieldClear"
                        >
                            <template #prepend>
                                <slot
                                    v-if="$slots.prepend"
                                    name="prepend"
                                />
                                <span
                                    v-else
                                    style="cursor:pointer"
                                    @click="menuOpen = !menuOpen"
                                >
                                    <c-icon
                                        :name="IconAliases.CALENDAR"
                                        :size="18"
                                    />
                                </span>
                            </template>
                            <template
                                v-if="$slots.append"
                                #append
                            >
                                <slot name="append" />
                            </template>
                        </c-field>
                    </div>
                </template>

                <template #default>
                    <c-date-picker
                        :model-value="model"
                        :lang="lang"
                        :format="format"
                        :monday-first="mondayFirst"
                        :disabled-dates="(disabledDates as DisabledDates | undefined)"
                        :min-date="minDate"
                        :max-date="maxDate"
                        :highlighted-dates="highlightedDates"
                        @update:model-value="onDateSelect"
                        @selected="onDateSelect"
                    >
                        <template
                            v-if="$slots.date"
                            #date="slotProps"
                        >
                            <slot
                                name="date"
                                v-bind="slotProps"
                            />
                        </template>
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
                            v-if="$slots['before-header']"
                            #before-header="slotProps"
                        >
                            <slot
                                name="before-header"
                                v-bind="slotProps"
                            />
                        </template>
                        <template
                            v-if="$slots.header"
                            #header="slotProps"
                        >
                            <slot
                                name="header"
                                v-bind="slotProps"
                            />
                        </template>
                        <template
                            v-if="$slots['before-body']"
                            #before-body="slotProps"
                        >
                            <slot
                                name="before-body"
                                v-bind="slotProps"
                            />
                        </template>
                        <template
                            v-if="$slots.body"
                            #body="slotProps"
                        >
                            <slot
                                name="body"
                                v-bind="slotProps"
                            />
                        </template>
                        <template
                            v-if="$slots.footer"
                            #footer="slotProps"
                        >
                            <slot
                                name="footer"
                                v-bind="slotProps"
                            />
                        </template>
                    </c-date-picker>
                </template>
            </c-menu>
        </template>
    </c-input>
</template>
