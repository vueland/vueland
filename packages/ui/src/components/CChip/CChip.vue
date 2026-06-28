<script setup lang="ts" generic="T">
    import { computed } from 'vue'

    import { IconAliases } from '@/enums'

    const props = defineProps<{
        closable?: boolean
        color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info'
        value?: T
    }>()

    defineEmits<{
        (e: 'close', value?: T): void
    }>()

    const classes = computed(() => `c-chip--${props.color ?? 'primary'}`)
</script>

<template>
    <div
        class="c-chip"
        :class="classes"
    >
        <div class="c-chip__content">
            <slot></slot>
        </div>
        <div
            v-if="closable"
            class="c-chip__close"
        >
            <c-icon
                size="22"
                :name="IconAliases.CLOSE"
                @click="$emit('close', value)"
            />
        </div>
    </div>
</template>
