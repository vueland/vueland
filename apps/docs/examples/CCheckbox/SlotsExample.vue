<script setup lang="ts">
    import { ref } from 'vue'

    const starred = ref(true)
    const accepted = ref(false)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Repository
            </div>

            <c-checkbox
                v-model="starred"
                no-details
            >
                <template #icon="{ checked }">
                    <c-icon
                        name="fas:star"
                        source="fa"
                        :size="18"
                        :class="checked ? 'text-amber' : 'text-blue-grey-lighten-2'"
                    />
                </template>
                Star this repository
            </c-checkbox>

            <c-checkbox
                v-model="accepted"
                class="mt-3"
                no-details
            >
                <template #default="{ checked }">
                    <span class="d-flex items-center gap-2">
                        Watch releases
                        <c-chip
                            v-if="checked"
                            class="bg-indigo text-white fs-xs"
                        >
                            on
                        </c-chip>
                    </span>
                </template>
            </c-checkbox>
        </c-card>
    </div>
</template>
