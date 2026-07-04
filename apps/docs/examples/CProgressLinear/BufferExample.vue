<script setup lang="ts">
    import {
        onBeforeUnmount,
        onMounted,
        ref,
    } from 'vue'

    const value = ref(10)
    const buffer = ref(30)

    let timer: ReturnType<typeof setInterval>

    onMounted(() => {
        timer = setInterval(() => {
            if (value.value >= 100) {
                value.value = 10
                buffer.value = 30
                return
            }

            value.value = Math.min(100, value.value + 5)
            buffer.value = Math.min(100, value.value + 20 + Math.random() * 10)
        }, 800)
    })

    onBeforeUnmount(() => {
        clearInterval(timer)
    })
</script>

<template>
    <div class="d-flex flex-col gap-4 pa-8">
        <c-progress-linear
            :value="value"
            :buffer-value="buffer"
            height="8"
        />
        <c-progress-linear
            color="success"
            value="30"
            buffer-value="70"
            height="8"
        />
    </div>
</template>
