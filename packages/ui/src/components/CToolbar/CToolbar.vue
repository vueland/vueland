<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        fixed?: boolean;
    }>()

    const classes = computed(() => ({ 'c-toolbar--fixed': props.fixed, }))
</script>

<template>
    <div
        class="c-toolbar"
        :class="classes"
    >
        <slot></slot>
    </div>
</template>
