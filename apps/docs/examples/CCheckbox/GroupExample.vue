<script setup lang="ts">
    import { ref } from 'vue'

    const scopes = ref(['read'])

    const available = [
        {
            value: 'read',
            label: 'Read repositories',
        },
        {
            value: 'write',
            label: 'Write repositories',
        },
        {
            value: 'admin',
            label: 'Manage members',
        },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Token scopes
            </div>

            <div class="d-flex flex-col gap-2">
                <c-checkbox
                    v-for="scope in available"
                    :key="scope.value"
                    v-model="scopes"
                    :value="scope.value"
                    :label="scope.label"
                    no-details
                />
            </div>

            <div class="d-flex items-center gap-2 flex-wrap mt-5">
                <c-chip
                    v-for="scope in scopes"
                    :key="scope"
                    class="bg-indigo text-white"
                >
                    {{ scope }}
                </c-chip>
                <span
                    v-if="!scopes.length"
                    class="fs-sm text-blue-grey"
                >
                    No scopes granted
                </span>
            </div>
        </c-card>
    </div>
</template>
