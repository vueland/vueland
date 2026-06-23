<script setup lang="ts" generic="T">
    import { IconAliases } from '@/enums'

    defineProps<{
        closable?: boolean
        value?: T
    }>()

    defineEmits<{
        (e: 'close'): void
    }>()
</script>

<template>
    <div class="c-chip">
        <div class="c-chip__content">
            <slot></slot>
        </div>
        <div
            v-if="closable"
            class="c-chip__close"
        >
            <c-icon
                size="24"
                :name="IconAliases.CLOSE"
            />
        </div>
    </div>
</template>
