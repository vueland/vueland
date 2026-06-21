<script setup lang="ts">
    import { CBtn, CIcon } from '@/components'
    import { IconAliases } from '@/enums'

    defineOptions({ name: 'CDatePickerHeader' })

    defineProps<{
        disablePrev: boolean
        disableNext: boolean
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
                :class="['c-date-picker__header-btn', disablePrev && 'c-date-picker__header-btn--disabled']"
                :disabled="disablePrev"
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
                <slot></slot>
            </div>

            <c-btn
                :class="['c-date-picker__header-btn', disableNext && 'c-date-picker__header-btn--disabled']"
                :disabled="disableNext"
                @click="emit('next')"
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
