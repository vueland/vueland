<script setup lang="ts">
    import { useDialogsStack } from '../../composables'
    import { COverlay } from '../COverlay'

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
