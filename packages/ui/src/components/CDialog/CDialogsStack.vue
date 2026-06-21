<script setup lang="ts">
    import { COverlay } from '@/components/COverlay'
    import { useDialogsStack } from '@/composables'

    const { current } = useDialogsStack()
</script>

<template>
    <c-overlay :model-value="true">
        <component
            :is="current.component"
            v-if="current"
            v-bind="current.props"
        />
    </c-overlay>
</template>
