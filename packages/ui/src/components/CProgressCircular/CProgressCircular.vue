<script setup lang="ts">
    import { computed, unref } from 'vue'

    import { useProgressCircularPresets } from '@/composables/use-progress-presets'
    import { convertToUnit, toColorClass } from '@/utils'

    import type { CProgressCircularProps, CProgressCircularSlots } from './types'

    defineOptions({ name: 'CProgressCircular' })

    const props = defineProps<CProgressCircularProps>()

    defineSlots<CProgressCircularSlots>()

    const preset = useProgressCircularPresets({ props })

    // Радиус фиксированный: реальный размер задаёт viewBox
    const RADIUS = 20
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS
    const STROKE_DASH_ARRAY = Math.round(CIRCUMFERENCE * 1000) / 1000

    // Нечисловые и неположительные пропы откатываются к дефолтам,
    // иначе NaN/Infinity уезжают в атрибуты SVG
    function toPositive(value: number | string | undefined, fallback: number): number {
        const parsed = Number(value ?? fallback)

        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }

    const size = computed(() => toPositive(props.size, 32))

    // Толщина не может превышать половину диаметра — при width >= size
    // знаменатель viewBox уходит в ноль
    const width = computed(() => Math.min(toPositive(props.width, 4), size.value / 2))

    const normalizedValue = computed(() => {
        const parsed = Number(props.value ?? 0)

        return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0
    })

    const viewBoxSize = computed(() => {
        return RADIUS / (1 - width.value / size.value)
    })

    const viewBox = computed(() => {
        return `${viewBoxSize.value} ${viewBoxSize.value} ${2 * viewBoxSize.value} ${2 * viewBoxSize.value}`
    })

    const strokeWidth = computed(() => {
        return (width.value / size.value) * viewBoxSize.value * 2
    })

    const strokeDashOffset = computed(() => {
        return ((100 - normalizedValue.value) / 100) * CIRCUMFERENCE + 'px'
    })

    const rootClasses = computed(() => [
        // Обводка красится через currentColor, поэтому цвет — это text-утилита
        toColorClass('text', props.color),
        { 'c-progress-circular--indeterminate': props.indeterminate },
        ...unref(preset).root,
    ])

    const rootStyle = computed(() => ({
        width: convertToUnit(size.value),
        height: convertToUnit(size.value),
    }))

    const svgStyle = computed(() => {
        const rotate = Number(props.rotate ?? 0)

        return { transform: `rotate(${Number.isFinite(rotate) ? rotate : 0}deg)` }
    })
</script>

<template>
    <div
        class="c-progress-circular"
        :class="rootClasses"
        :style="rootStyle"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="indeterminate ? undefined : normalizedValue"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="viewBox"
            :style="svgStyle"
        >
            <circle
                v-if="!indeterminate"
                class="c-progress-circular__underlay"
                :class="preset.underlay"
                fill="transparent"
                :cx="2 * viewBoxSize"
                :cy="2 * viewBoxSize"
                :r="RADIUS"
                :stroke-width="strokeWidth"
                :stroke-dasharray="STROKE_DASH_ARRAY"
                stroke-dashoffset="0"
            />
            <circle
                class="c-progress-circular__overlay"
                :class="preset.overlay"
                fill="transparent"
                :cx="2 * viewBoxSize"
                :cy="2 * viewBoxSize"
                :r="RADIUS"
                :stroke-width="strokeWidth"
                :stroke-dasharray="STROKE_DASH_ARRAY"
                :stroke-dashoffset="strokeDashOffset"
            />
        </svg>
        <div
            class="c-progress-circular__info"
            :class="preset.info"
        >
            <slot :value="normalizedValue"></slot>
        </div>
    </div>
</template>
