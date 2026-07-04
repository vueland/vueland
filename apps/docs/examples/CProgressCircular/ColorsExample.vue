<script setup lang="ts">
    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'error',
        'warning',
        'info',
    ] as const
</script>

<template>
    <div class="d-flex align-center justify-center gap-5 pa-8 flex-wrap">
        <c-progress-circular
            v-for="color in colors"
            :key="color"
            :color="color"
            value="70"
            size="48"
            width="5"
        />
    </div>
</template>
