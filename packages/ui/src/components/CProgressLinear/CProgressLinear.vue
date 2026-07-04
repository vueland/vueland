<script setup lang="ts">
    import { computed, unref } from 'vue'

    import { useProgressLinearPresets } from '@/composables/use-progress-presets'
    import { convertToUnit } from '@/utils'

    import type { CProgressLinearProps } from './types'

    defineOptions({ name: 'CProgressLinear' })

    const props = defineProps<CProgressLinearProps>()

    const preset = useProgressLinearPresets({ props })

    // Нечисловой value/bufferValue схлопывается в 0,
    // иначе NaN уезжает в width и aria-valuenow
    function clampPercent(value: number | string | undefined): number {
        const parsed = Number(value ?? 0)

        return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0
    }

    const normalizedValue = computed(() => clampPercent(props.value))

    const normalizedBuffer = computed(() => clampPercent(props.bufferValue))

    const rootClasses = computed(() => [
        `c-progress-linear--${props.color ?? 'primary'}`,
        ...unref(preset).root,
    ])

    const rootStyle = computed(() => {
        const height = Number(props.height ?? 4)

        return { height: convertToUnit(Number.isFinite(height) && height > 0 ? height : 4) }
    })
</script>

<template>
    <div
        class="c-progress-linear"
        :class="rootClasses"
        :style="rootStyle"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="indeterminate ? undefined : normalizedValue"
    >
        <div
            class="c-progress-linear__background"
            :class="preset.background"
        ></div>
        <div
            v-if="bufferValue"
            class="c-progress-linear__buffer"
            :class="preset.buffer"
            :style="{ width: `${normalizedBuffer}%` }"
        ></div>
        <div
            v-if="indeterminate"
            class="c-progress-linear__indeterminate"
        >
            <div
                class="c-progress-linear__bar c-progress-linear__bar--long"
                :class="preset.bar"
            ></div>
            <div
                class="c-progress-linear__bar c-progress-linear__bar--short"
                :class="preset.bar"
            ></div>
        </div>
        <div
            v-else
            class="c-progress-linear__bar"
            :class="preset.bar"
            :style="{ width: `${normalizedValue}%` }"
        ></div>
    </div>
</template>
