<script setup lang="ts">
    import { computed, useAttrs } from 'vue'

    import { CMenu } from '../CMenu'

    defineOptions({
        name: 'CTooltip',
    })

    const attrs = useAttrs()

    const width = computed<string | number>(() => (attrs.width as number | undefined) ?? 'auto')
</script>

<template>
    <c-menu
        v-bind="$attrs"
        :width
    >
        <template #activator="{ on, activator }">
            <slot
                name="activator"
                :activator
                :on
            />
        </template>
        <template #default>
            <div class="c-tooltip">
                <slot />
            </div>
        </template>
    </c-menu>
</template>
