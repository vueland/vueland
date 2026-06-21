<script setup lang="ts">
    import { computed, useAttrs } from 'vue'

    import { useId } from '../../composables'
    import { CMenu } from '../CMenu'

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
    >
        <template #activator="{ on, activator }">
            <slot
                name="activator"
                :activator="{ ...activator, 'aria-describedby': tooltipId }"
                :on
            ></slot>
        </template>
        <template #default>
            <div
                :id="tooltipId"
                class="c-tooltip"
                role="tooltip"
            >
                <slot></slot>
            </div>
        </template>
    </c-menu>
</template>
