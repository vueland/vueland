<script setup lang="ts">
    import {
        computed,
        unref,
        useAttrs
    } from 'vue'

    import { useIcon } from '@/composables/use-icon'
    import { convertToUnit } from '@/utils'

    import type { CIconProps, CIconSlots } from './types'

    defineOptions({
        name: 'CIcon',
        inheritAttrs: false,
    })

    const props = defineProps<CIconProps>()
    defineSlots<CIconSlots>()

    const attrs = useAttrs()

    const resolvedIcon = useIcon(props)

    const { tag = 'span' } = props

    // Явный размер главнее дефолта из реестра иконок.
    const rootStyle = computed(() => ({
        width: convertToUnit(props.width ?? props.size ?? unref(resolvedIcon).size ?? 16),
        height: convertToUnit(props.height ?? props.size ?? unref(resolvedIcon).size ?? 16),
    }))
</script>

<template>
    <component
        :is="tag"
        class="c-icon"
        :class="{ 'c-icon--empty': !resolvedIcon.found && !$slots.default }"
        :style="rootStyle"
    >
        <component
            :is="resolvedIcon.component"
            v-if="resolvedIcon.found && resolvedIcon.kind === 'component'"
            class="c-icon__component"
            v-bind="attrs"
        />

        <svg
            v-else-if="resolvedIcon.found || $slots.default"
            class="c-icon__svg"
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="resolvedIcon.viewBox"
            fill="currentColor"
            focusable="false"
            v-bind="attrs"
        >
            <slot
                v-if="$slots.default"
                :icon="resolvedIcon"
            />

            <use
                v-else-if="resolvedIcon.href"
                :href="resolvedIcon.href"
            />

            <g
                v-else-if="resolvedIcon.body"
                v-html="resolvedIcon.body"
            />

            <path
                v-else-if="resolvedIcon.path"
                :d="resolvedIcon.path"
            />
        </svg>
    </component>
</template>
