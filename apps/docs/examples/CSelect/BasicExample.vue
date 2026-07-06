<script setup lang="ts">
    import { computed, ref } from 'vue'

    const environment = ref('Staging')

    const environments = ['Preview', 'Staging', 'Production']

    const badge = computed(() => ({
        Preview: 'bg-blue-grey',
        Staging: 'bg-orange',
        Production: 'bg-green',
    }[environment.value ?? ''] ?? 'bg-blue-grey'))
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="d-flex items-center gap-2 mb-4">
                <c-icon
                    name="fas:cog"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Deployment target
                </span>
            </div>

            <c-select
                v-model="environment"
                label="Environment"
                placeholder="Choose one"
                :items="environments"
                clearable
            />

            <div class="d-flex items-center gap-2 fs-sm text-blue-grey mt-4">
                Deploys to
                <span
                    class="radius-pill text-white px-3 py-1 fs-xs fw-semi-bold"
                    :class="badge"
                >
                    {{ environment ?? 'nowhere' }}
                </span>
            </div>
        </c-card>
    </div>
</template>
