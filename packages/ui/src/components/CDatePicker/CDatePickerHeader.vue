<script setup lang="ts">
    import { CBtn } from '@/components/CBtn'
    import { CIcon } from '@/components/CIcon'
    import { IconAliases } from '@/enums'

    import type {
        DatePickerHeaderEmits,
        DatePickerHeaderProps,
        DatePickerHeaderSlots,
    } from './types'

    defineOptions({ name: 'CDatePickerHeader' })

    defineProps<DatePickerHeaderProps>()

    const emit = defineEmits<DatePickerHeaderEmits>()

    defineSlots<DatePickerHeaderSlots>()
</script>

<template>
    <div class="c-date-picker__header">
        <div class="c-date-picker__header-nav">
            <c-btn
                :class="['c-date-picker__header-btn', disablePrev && 'c-date-picker__header-btn--disabled']"
                :disabled="disablePrev"
                aria-label="Previous period"
                @click="emit('previous-page')"
            >
                <c-icon
                    :name="IconAliases.CHEVRON_LEFT"
                    :size="20"
                />
            </c-btn>

            <button
                type="button"
                class="c-date-picker__header-display"
                aria-label="Change calendar view"
                @click="emit('toggle-view')"
            >
                <slot></slot>
            </button>

            <c-btn
                :class="['c-date-picker__header-btn', disableNext && 'c-date-picker__header-btn--disabled']"
                :disabled="disableNext"
                aria-label="Next period"
                @click="emit('next-page')"
            >
                <c-icon
                    :name="IconAliases.CHEVRON_RIGHT"
                    :size="20"
                />
            </c-btn>
        </div>

        <slot name="actions"></slot>
    </div>
</template>
