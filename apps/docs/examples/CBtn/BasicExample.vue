<script setup lang="ts">
    import { ref } from 'vue'

    const count = ref(0)
</script>

<template>
    <div class="d-flex flex-col align-center gap-6 pa-8">
        <div class="d-flex gap-3">
            <c-btn @click="count++">
                Click me
            </c-btn>
            <c-btn disabled>
                Disabled
            </c-btn>
        </div>

        <c-btn
            block
            @click="count++"
        >
            Block button
        </c-btn>

        <span>Clicks: {{ count }}</span>
    </div>
</template>
