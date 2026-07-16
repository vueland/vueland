<script setup lang="ts">
    import { ref } from 'vue'

    const selected = ref(['teal', 'rose', 'amber', 'custom'])

    const colors = [
        {
            value: 'teal',
            label: 'Teal',
            color: 'teal',
        },
        {
            value: 'indigo',
            label: 'Indigo',
            color: 'indigo',
        },
        {
            value: 'rose',
            label: 'Rose',
            color: 'pink-darken-1',
        },
        {
            value: 'amber',
            label: 'Amber',
            color: 'amber-darken-2',
        },
        {
            value: 'green',
            label: 'Green',
            color: 'green-darken-1',
        },
        {
            value: 'cyan',
            label: 'Cyan',
            color: 'cyan-darken-2',
        },
        {
            value: 'purple',
            label: 'Purple',
            color: 'deep-purple-lighten-1',
        },
        {
            value: 'red',
            label: 'Red',
            color: 'red-darken-1',
        },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-4 sm:pa-8">
        <c-card class="checkbox-color-example elevation-3 radius-16 pa-6">
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-5">
                Color
            </div>

            <c-row class="gap-y-4">
                <c-col
                    v-for="item in colors"
                    :key="item.value"
                    cols="12"
                    sm="6"
                    md="4"
                >
                    <c-checkbox
                        v-model="selected"
                        :value="item.value"
                        :label="item.label"
                        :color="item.color"
                        no-details
                    />
                </c-col>

                <c-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                    <c-checkbox
                        v-model="selected"
                        value="custom"
                        label="Custom CSS color"
                        color="#e65100"
                        no-details
                    />
                </c-col>

                <c-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                    <c-checkbox
                        v-model="selected"
                        value="brand"
                        label="Brand variable"
                        color="var(--c-sys-color-primary)"
                        no-details
                    />
                </c-col>
            </c-row>
        </c-card>
    </div>
</template>

<style scoped>
.checkbox-color-example {
  width: min(100%, 720px);
}
</style>
