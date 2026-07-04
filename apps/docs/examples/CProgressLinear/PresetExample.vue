<script setup lang="ts">
    import { ref } from 'vue'

    const value = ref(80)

    function decrease() {
        value.value = Math.max(0, value.value - 10)
    }

    function increase() {
        value.value = Math.min(100, value.value + 10)
    }
</script>

<template>
    <div class="d-flex flex-col align-center gap-6 pa-8">
        <c-progress-linear
            preset="progress.download"
            :value="value"
            height="8"
        />

        <div class="d-flex gap-3">
            <c-btn
                class="bg-indigo text-white elevation-2"
                @click="decrease"
            >
                -10
            </c-btn>
            <c-btn
                class="bg-indigo text-white elevation-2"
                @click="increase"
            >
                +10
            </c-btn>
        </div>
    </div>
</template>
