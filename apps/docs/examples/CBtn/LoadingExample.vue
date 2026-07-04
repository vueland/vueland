<script setup lang="ts">
    import { ref } from 'vue'

    const loading = ref(false)

    function submit() {
        loading.value = true
        setTimeout(() => (loading.value = false), 2000)
    }
</script>

<template>
    <div class="d-flex justify-center gap-3 pa-8">
        <c-btn
            :loading="loading"
            @click="submit"
        >
            Submit
        </c-btn>

        <c-btn
            :loading="loading"
            color="teal"
            @click="submit"
        >
            Custom loader
            <template #loader>
                <span>Saving…</span>
            </template>
        </c-btn>
    </div>
</template>
