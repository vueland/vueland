<script setup lang="ts">
    import { computed, unref } from 'vue'

    import { useButtonPresets } from '@/composables/use-button-presets'

    import type { CBtnProps } from './types'

    defineOptions({ name: 'CBtn' })

    const props = defineProps<CBtnProps>()
    const emit = defineEmits<{ click: [e: MouseEvent] }>()

    const preset = useButtonPresets({ props })

    const classes = computed(() => [
        `c-btn--${props.color ?? 'primary'}`,
        {
            'c-btn--flat': !props.variant || props.variant === 'flat',
            'c-btn--outlined': props.variant === 'outlined',
            'c-btn--block': props.block,
            'c-btn--disabled': props.disabled,
        },
        ...unref(preset).root,
    ])
</script>

<template>
    <button
        class="c-btn"
        :class="classes"
        :disabled="disabled"
        @click="(e) => emit('click', e)"
    >
        <div
            class="c-btn__label"
            :class="preset.label"
        >
            <slot></slot>
        </div>
    </button>
</template>
