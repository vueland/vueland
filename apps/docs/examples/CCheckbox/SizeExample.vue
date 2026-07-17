<script setup lang="ts">
    import { ref } from 'vue'

    const selected = ref(['compact', 'comfortable'])

    const sizes = [
        {
            value: 'compact',
            label: 'Compact',
            size: 16,
        },
        {
            value: 'regular',
            label: 'Regular',
            size: 20,
        },
        {
            value: 'comfortable',
            label: 'Comfortable',
            size: 24,
        },
        {
            value: 'large',
            label: 'Large',
            size: '28px',
        },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-4 sm:pa-8">
        <c-card class="checkbox-size-example elevation-3 radius-16 pa-6">
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-5">
                Size
            </div>

            <c-row class="gap-y-4">
                <c-col
                    v-for="item in sizes"
                    :key="item.value"
                    cols="12"
                    sm="6"
                >
                    <c-checkbox
                        v-model="selected"
                        :value="item.value"
                        :label="`${item.label} ${item.size}`"
                        :size="item.size"
                        color="indigo"
                        no-details
                    />
                </c-col>
            </c-row>
        </c-card>
    </div>
</template>

<style scoped>
.checkbox-size-example {
  width: min(100%, 560px);
}
</style>
