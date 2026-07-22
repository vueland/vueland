<script setup lang="ts">
    import {
        computed,
        reactive,
        unref,
    } from 'vue'

    import { useButtonPresets } from '@/composables/use-button-presets'
    import { toColorClass } from '@/utils'

    import type { CBtnProps, CBtnState } from './types'

    defineOptions({ name: 'CBtn' })

    const props = defineProps<CBtnProps>()
    const emit = defineEmits<{ click: [e: MouseEvent] }>()

    const state: CBtnState = reactive({
        focused: false,
        active: false,
    })

    const preset = useButtonPresets({
        props,
        state,
    })

    const classes = computed(() => [
        {
            'c-btn--flat': !props.variant || props.variant === 'flat',
            'c-btn--outlined': props.variant === 'outlined',
            'c-btn--block': props.block,
            'c-btn--disabled': props.disabled,
            'c-btn--loading': props.loading,
        },
        // У outlined цвет — это текст и рамка (через currentColor), у flat — фон
        toColorClass(props.variant === 'outlined' ? 'text' : 'bg', props.color),
        ...unref(preset).root,
    ])

    function onClick(e: MouseEvent) {
        if (props.loading) {
            return
        }

        emit('click', e)
    }

    function onBlur() {
        state.focused = false
        state.active = false
    }

    // Пробел/Enter — клавиатурный аналог нажатия
    function onKeydown(e: KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            state.active = true
        }
    }
</script>

<template>
    <button
        type="button"
        class="c-btn"
        :class="classes"
        :disabled="disabled"
        :aria-busy="loading || undefined"
        @click="onClick"
        @focus="state.focused = true"
        @blur="onBlur"
        @pointerdown="state.active = true"
        @pointerup="state.active = false"
        @pointerleave="state.active = false"
        @keydown="onKeydown"
        @keyup="state.active = false"
    >
        <span
            class="c-btn__label"
            :class="[preset.label, { 'c-btn__label--hidden': loading }]"
        >
            <slot />
        </span>
        <span
            v-if="loading"
            class="c-btn__loader"
            :class="preset.loader"
        >
            <slot name="loader">
                <c-progress-circular
                    class="c-btn-progress"
                    indeterminate
                    size="20"
                    width="2"
                />
            </slot>
        </span>
    </button>
</template>
