<script setup lang="ts">
    import { ref } from 'vue'

    const destination = ref<string>()

    const cities = [
        'Amsterdam',
        'Barcelona',
        'Berlin',
        'Copenhagen',
        'Lisbon',
        'London',
        'Madrid',
        'Paris',
        'Prague',
        'Rome',
        'Stockholm',
        'Vienna',
    ]
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:380px"
        >
            <div class="d-flex items-center gap-2 mb-4">
                <c-icon
                    name="fas:box"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Shipping destination
                </span>
            </div>

            <c-autocomplete
                v-model="destination"
                label="City"
                placeholder="Start typing — try «B»"
                :items="cities"
                clearable
            />

            <div class="d-flex items-center gap-2 fs-sm mt-4">
                <template v-if="destination">
                    <c-icon
                        name="fas:check"
                        source="fa"
                        :size="12"
                        class="text-green"
                    />
                    <span>Courier available in <b>{{ destination }}</b></span>
                </template>
                <span
                    v-else
                    class="text-blue-grey"
                >
                    Pick a city to check courier coverage
                </span>
            </div>
        </c-card>
    </div>
</template>
