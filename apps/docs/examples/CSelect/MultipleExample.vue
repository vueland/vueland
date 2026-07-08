<script setup lang="ts">
    import { computed, ref } from 'vue'

    const channels = ref(['Email', 'Slack'])

    const allChannels = ['Email', 'Slack', 'Push', 'SMS', 'Webhook']

    const summary = computed(() => channels.value.length
        ? `${channels.value.length} channel${channels.value.length === 1 ? '' : 's'} active`
        : 'Notifications are off')
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:400px"
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
                <span
                    class="channels-badge radius-pill px-3 py-1 fs-xs fw-semi-bold text-white"
                    :class="channels.length ? 'bg-indigo' : 'bg-blue-grey'"
                >
                    {{ summary }}
                </span>
            </div>

            <c-select
                v-model="channels"
                label="Channels"
                placeholder="Where do we ping you?"
                :items="allChannels"
                multiple
                chips
                clearable
            />

            <div class="fs-xs text-blue-grey mt-4">
                A selected option can be removed with a second click in the menu.
            </div>
        </c-card>
    </div>
</template>

<style scoped>
.channels-badge {
  margin-left: auto;
}
</style>
