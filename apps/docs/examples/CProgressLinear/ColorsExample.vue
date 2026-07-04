<script setup lang="ts">
    const bars = [
        { color: 'primary', value: 80, height: 4 },
        { color: 'secondary', value: 65, height: 6 },
        { color: 'tertiary', value: 50, height: 8 },
        { color: 'success', value: 90, height: 10 },
        { color: 'warning', value: 35, height: 12 },
        { color: 'error', value: 20, height: 14 },
    ] as const
</script>

<template>
    <div class="d-flex flex-col gap-4 pa-8">
        <c-progress-linear
            v-for="bar in bars"
            :key="bar.color"
            :color="bar.color"
            :value="bar.value"
            :height="bar.height"
        />
    </div>
</template>
