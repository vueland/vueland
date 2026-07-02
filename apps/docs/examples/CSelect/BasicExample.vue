<script setup lang="ts">
    import { ref } from 'vue'

    const framework = ref()

    const frameworks = ['Vue', 'React', 'Svelte', 'Angular', 'Solid', 'Qwik']
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:340px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Project setup
            </div>

            <c-select
                v-model="framework"
                label="Framework"
                placeholder="Choose one"
                :items="frameworks"
                clearable
            />

            <div class="d-flex items-center gap-2 fs-sm text-blue-grey mt-4">
                Selected
                <span class="radius-pill bg-indigo text-white px-3 py-1 fs-xs fw-semi-bold">
                    {{ framework ?? '—' }}
                </span>
            </div>
        </c-card>
    </div>
</template>
