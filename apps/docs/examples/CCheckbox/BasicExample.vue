<script setup lang="ts">
    import { ref } from 'vue'

    const subscribed = ref(true)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="d-flex items-center gap-2 mb-4">
                <c-icon
                    name="fas:bell"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Notifications
                </span>
            </div>

            <c-checkbox
                v-model="subscribed"
                label="Email me about releases"
            />

            <div class="d-flex items-center gap-2 fs-sm text-blue-grey mt-4">
                Status
                <span
                    class="radius-pill text-white px-3 py-1 fs-xs fw-semi-bold"
                    :class="subscribed ? 'bg-green' : 'bg-blue-grey'"
                >
                    {{ subscribed ? 'subscribed' : 'unsubscribed' }}
                </span>
            </div>
        </c-card>
    </div>
</template>
