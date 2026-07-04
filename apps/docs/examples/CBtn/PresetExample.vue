<script setup lang="ts">
    import { ref } from 'vue'

    const loading = ref(false)
    const disabled = ref(false)

    function save() {
        loading.value = true
        setTimeout(() => (loading.value = false), 2000)
    }
</script>

<template>
    <div class="d-flex flex-col align-center gap-4 pa-8">
        <c-btn
            preset="button.save"
            :loading="loading"
            :disabled="disabled"
            @click="save"
        >
            Save
        </c-btn>

        <c-checkbox
            v-model="disabled"
            label="disabled"
        />
    </div>
</template>
