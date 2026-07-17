<script setup lang="ts">
    import { computed, ref } from 'vue'

    const channels = ['In-app', 'Email', 'SMS']

    const enabled = ref(['In-app'])

    const allEnabled = computed({
        get: () => enabled.value.length === channels.length,
        set: (value: boolean) => {
            enabled.value = value ? [...channels] : []
        },
    })

    const someEnabled = computed(() =>
        enabled.value.length > 0 && enabled.value.length < channels.length)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Delivery channels
            </div>

            <c-checkbox
                v-model="allEnabled"
                :indeterminate="someEnabled"
                label="All channels"
                preset="input.consent"
                no-details
            />

            <div class="d-flex flex-col gap-2 mt-2 pl-6">
                <c-checkbox
                    v-for="channel in channels"
                    :key="channel"
                    v-model="enabled"
                    :value="channel"
                    :label="channel"
                    preset="input.consent"
                    no-details
                />
                <c-checkbox
                    :model-value="false"
                    label="Push (coming soon)"
                    preset="input.consent"
                    disabled
                    no-details
                />
            </div>
        </c-card>
    </div>
</template>
