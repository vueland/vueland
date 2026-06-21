<script setup lang="ts">
    import { computed, useAttrs } from 'vue'

    import { CMenu } from '@/components'
    import { useId } from '@/composables'

    defineOptions({name: 'CTooltip'})

    const attrs = useAttrs()

    const tooltipId = useId(undefined, { prefix: 'c-tooltip' })
    const width = computed<string | number>(() => (attrs.width as number | undefined) ?? 'auto')
</script>

<template>
    <c-menu
        v-bind="$attrs"
        :id="tooltipId"
        :width
        class="c-tooltip"
        role="tooltip"
    >
        <template #activator="{ on, activator }">
            <slot
                name="activator"
                :activator="{ ...activator, 'aria-describedby': tooltipId }"
                :on
            ></slot>
        </template>
        <template #default>
            <slot></slot>
        </template>
    </c-menu>
</template>
