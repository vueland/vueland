<script setup lang="ts">
    import { computed, unref, useAttrs } from 'vue'

    import { useIcon } from '../../composables'
    import { convertToUnit } from '../../utils'

    import type { CIconProps } from './types'

    defineOptions({
        name: 'CIcon',
        inheritAttrs: false,
    })

    const props = defineProps<CIconProps>()

    const { tag = 'span' } = props

    const attrs = useAttrs()
    const resolvedIcon = useIcon(props)

    const rootStyle = computed(() => ({
        width: convertToUnit(unref(resolvedIcon).size ?? props.width ?? props.size ?? 16),
        height: convertToUnit(unref(resolvedIcon).size ?? props.height ?? props.size ?? 16),
    }))
</script>

<template>
    <component
        :is="tag"
        class="c-icon"
        :class="{ 'c-icon--empty': !resolvedIcon.found }"
        :style="rootStyle"
    >
        <component
            :is="resolvedIcon.component"
            v-if="resolvedIcon.found && resolvedIcon.kind === 'component'"
            class="c-icon__component"
            v-bind="attrs"
        />

        <svg
            v-else-if="resolvedIcon.found"
            class="c-icon__svg"
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="resolvedIcon.viewBox"
            fill="currentColor"
            focusable="false"
            v-bind="attrs"
        >
            <use
                v-if="resolvedIcon.href"
                :href="resolvedIcon.href"
            />

            <g
                v-else
                v-html="resolvedIcon.body"
            />
        </svg>
    </component>
</template>
