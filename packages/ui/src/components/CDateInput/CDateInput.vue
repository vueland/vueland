<script setup lang="ts">
    import {
        computed,
        shallowRef,
        unref,
    } from 'vue'

    import {
        CDatePicker,
        dateToFormatString,
        isDateDisabled,
        parseDate,
        parseDateString
    } from '@/components/CDatePicker'
    import { CIcon } from '@/components/CIcon'
    import { CKeyboardProvider } from '@/components/CKeyboardProvider'
    import { CMenu } from '@/components/CMenu'
    import { CTextField } from '@/components/CTextField'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { IconAliases } from '@/enums'

    import type { CDateInputProps, CDateInputSlots } from './types'

    defineOptions({ name: 'CDateInput' })

    const props = defineProps<CDateInputProps>()

    defineSlots<CDateInputSlots>()

    const model = defineModel<Date | null>()

    const cTextFieldRef = shallowRef()
    const keyboardRef = shallowRef()
    const menu = shallowRef(false)

    const displayValue = computed(() =>
        dateToFormatString(model.value, props.format ?? 'dd.MM.yyyy', props.locale),
    )

    const classes = computed(() => ({
        'c-date-input--typeable': props.typeable
    }))

    const canOpen = () => !unref(cTextFieldRef)?.isReadonly() && !unref(cTextFieldRef)?.isDisabled()

    function onDateSelect(value: Date | null) {
        model.value = value
        menu.value = false
    }

    function onClear() {
        model.value = null
    }

    function onFocus() {
        if (!canOpen()) {
            return
        }

        menu.value = true
    }

    function onMenuClose() {
        unref(cTextFieldRef)?.blur()
    }

    // В non-typeable поле не редактируется — дата приходит только из пикера
    function onBeforeInput(e: Event) {
        if (!props.typeable) {
            e.preventDefault()
        }
    }

    // Ввод коммитится только когда строка целиком совпала с маской формата,
    // дата существует и не запрещена — тем же isDateDisabled, что и сетка
    function onTypeInput(val: string | number | undefined | null) {
        if (
            !props.typeable
            || unref(cTextFieldRef).isReadonly()
            || unref(cTextFieldRef).isDisabled()
        ) {
            return
        }

        const parsed = parseDateString(`${val ?? ''}`, props.format ?? 'dd.MM.yyyy')

        if (!parsed) {
            return
        }

        const date = parseDate(parsed)

        const bounds = {
            disabledDates: props.disabledDates,
            minDate: props.minDate ? parseDate(props.minDate) : null,
            maxDate: props.maxDate ? parseDate(props.maxDate) : null,
        }

        if (!isDateDisabled(date, bounds)) {
            model.value = parsed
        }
    }

    // Фокус остаётся в поле — клавиши форвардятся пикеру через клавиатурный
    // контур. В typeable-режиме навигация принадлежит редактированию текста:
    // меню открывается фокусом или ArrowDown, выбор в пикере — мышью.
    const open = (e: KeyboardEvent) => {
        if (!canOpen()) {
            return
        }

        // if (unref(menu)) return
        e.preventDefault()
        menu.value = true
        unref(cTextFieldRef)?.focus()
        unref(keyboardRef)?.forward(e)
    }

    const openOrType = (e: KeyboardEvent) => {
        if (!canOpen()) {
            return
        }

        if (!props.typeable && !unref(menu)) {
            open(e)
        }

        unref(keyboardRef)?.forward(e)
    }

    const { onKeydown } = useKeyboard({
        Tab: () => {
            menu.value = false
            unref(cTextFieldRef)?.blur()
        },
        Escape: () => {
            menu.value = false
            unref(cTextFieldRef)?.blur()
        },
        Enter: openOrType,
        ArrowDown: open,
        Space: openOrType,
        '*': (e) => {
            if (!props.typeable && unref(menu)) {
                unref(keyboardRef)?.forward(e)
            }
        },
    })
</script>

<template>
    <c-text-field
        ref="cTextFieldRef"
        :model-value="displayValue"
        :validation-value="model"
        class="c-date-input"
        :class="classes"
        :inputmode="typeable ? undefined : 'none'"
        :dirty="!!model"
        v-bind="$attrs"
        @beforeinput="onBeforeInput"
        @paste="onBeforeInput"
        @drop="onBeforeInput"
        @keydown="onKeydown"
        @update:model-value="onTypeInput"
        @clear="onClear"
        @focus="onFocus"
    >
        <template #prepend>
            <slot name="prepend">
                <c-icon
                    :name="IconAliases.CALENDAR"
                    :size="18"
                />
            </slot>
        </template>
        <template
            v-if="$slots.append"
            #append
        >
            <slot name="append" />
        </template>
        <template
            v-if="$slots.details"
            #details="slotProps"
        >
            <slot
                name="details"
                v-bind="slotProps"
            />
        </template>
        <template #menu="{ id }">
            <c-menu
                :id
                v-model="menu"
                activator="parent"
                align="bottom-left"
                :offset-y="2"
                :width="320"
                close-on-click-outside
                strategy="reverse"
                @close="onMenuClose"
            >
                <c-keyboard-provider ref="keyboardRef">
                    <c-date-picker
                        :model-value="model"
                        :locale="locale"
                        :monday-first="mondayFirst"
                        :disabled-dates="disabledDates"
                        :highlighted-dates="highlightedDates"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @update:model-value="onDateSelect"
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
                            v-if="$slots['before-body']"
                            #before-body="slotProps"
                        >
                            <slot
                                name="before-body"
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
                </c-keyboard-provider>
            </c-menu>
        </template>
    </c-text-field>
</template>
