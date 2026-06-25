<script setup lang="ts">
    import { ref } from 'vue'

    const selected = ref('comfortable')

    const densities = [
        { value: 'compact',     label: 'Compact',     hint: 'Tight spacing' },
        { value: 'comfortable', label: 'Comfortable', hint: 'Balanced (default)' },
        { value: 'spacious',    label: 'Spacious',    hint: 'Roomy layout' },
    ]
</script>

<template>
    <div class="d-flex flex-col items-center gap-5 pa-8">
        <c-card
            class="elevation-3 radius-16"
            style="width:300px;overflow:hidden"
        >
            <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
                Display density
            </div>

            <c-list
                v-model="selected"
                variant="listbox"
                mandatory
                class="pa-2"
            >
                <c-list-item
                    v-for="d in densities"
                    :key="d.value"
                    :value="d.value"
                    class="px-3 py-2 radius-8"
                >
                    <c-list-item-content>
                        <c-list-item-title class="fw-medium">
                            {{ d.label }}
                        </c-list-item-title>
                        <c-list-item-subtitle>{{ d.hint }}</c-list-item-subtitle>
                    </c-list-item-content>
                    <c-icon
                        v-if="selected === d.value"
                        name="fas:check"
                        source="fa"
                        :size="14"
                    />
                </c-list-item>
            </c-list>
        </c-card>

        <div class="d-flex items-center gap-2 fs-sm text-blue-grey">
            Selected
            <span class="radius-pill bg-indigo text-white px-3 py-1 fs-xs fw-semi-bold">
                {{ selected }}
            </span>
        </div>
    </div>
</template>
