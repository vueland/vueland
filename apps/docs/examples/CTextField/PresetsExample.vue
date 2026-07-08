<script setup lang="ts">
    import { ref } from 'vue'

    const v1 = ref('')
    const v2 = ref('')
    const v3 = ref('')
    const v4 = ref('')
    const v5 = ref('')
    const v6 = ref('')
</script>

<template>
    <c-row class="gap-y-4">
        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v1"
                label="Blue"
                preset="input.blue"
            >
                <template #prepend>
                    <c-icon
                        name="fas:user"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>

        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v2"
                label="Teal"
                preset="input.teal"
            >
                <template #prepend>
                    <c-icon
                        name="fas:envelope"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>

        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v3"
                label="Green"
                preset="input.green"
            >
                <template #prepend>
                    <c-icon
                        name="fas:phone"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>

        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v4"
                label="Deep Purple"
                preset="input.deepPurple"
            >
                <template #prepend>
                    <c-icon
                        name="fas:lock"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>

        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v5"
                label="Orange"
                preset="input.orange"
            >
                <template #prepend>
                    <c-icon
                        name="fas:map-marker-alt"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>

        <c-col
            xxl="4"
            xl="4"
            lg="6"
            md="6"
            sm="12"
            class="px-2"
        >
            <c-text-field
                v-model="v6"
                label="Pink"
                preset="input.pink"
            >
                <template #prepend>
                    <c-icon
                        name="fas:heart"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>
    </c-row>
</template>
