<script setup lang="ts">
    import { ref } from 'vue'

    const val = ref('')
    const readonly = ref('Cannot be edited')
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
                v-model="val"
                label="Default"
            />
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
                v-model="val"
                label="Clearable"
                clearable
                preset="input.blue"
            >
                <template #prepend>
                    <c-icon
                        name="fas:search"
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
                v-model="val"
                label="Disabled"
                disabled
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
                v-model="readonly"
                label="Readonly"
                readonly
            >
                <template #prepend>
                    <c-icon
                        name="fas:pen"
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
                v-model="val"
                label="With details"
                details="Hint text below the field"
                preset="input.indigo"
            >
                <template #prepend>
                    <c-icon
                        name="fas:bell"
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
                v-model="val"
                label="With error"
                :rules="[() => ({ valid: false, message: 'This field has an error' })]"
                validate-on="blur"
            >
                <template #prepend>
                    <c-icon
                        name="fas:shield-alt"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </c-col>
    </c-row>
</template>
