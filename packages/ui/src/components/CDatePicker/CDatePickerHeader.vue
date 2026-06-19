<script setup lang="ts">
    import { IconAliases } from '../../enums'
    import { CBtn } from '../CBtn'
    import { CIcon } from '../CIcon'

    defineOptions({ name: 'CDatePickerHeader' })

    defineProps<{
        prevDisabled?: boolean
        nextDisabled?: boolean
    }>()

    const emit = defineEmits<{
        next: []
        prev: []
        table: []
    }>()
</script>

<template>
    <div class="c-date-picker__header">
        <div class="c-date-picker__header-nav">
            <c-btn
                :class="['c-date-picker__header-btn', prevDisabled && 'c-date-picker__header-btn--disabled']"
                :disabled="prevDisabled"
                @click="emit('prev')"
            >
                <c-icon
                    :name="IconAliases.CHEVRON_LEFT"
                    :size="20"
                />
            </c-btn>

            <div
                class="c-date-picker__header-display"
                @click="emit('table')"
            >
                <slot />
            </div>

            <c-btn
                :class="['c-date-picker__header-btn', nextDisabled && 'c-date-picker__header-btn--disabled']"
                :disabled="nextDisabled"
                @click="emit('next')"
            >
                <c-icon
                    :name="IconAliases.CHEVRON_RIGHT"
                    :size="20"
                />
            </c-btn>
        </div>

        <slot name="actions" />
    </div>
</template>
