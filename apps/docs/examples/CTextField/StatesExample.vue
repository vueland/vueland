<script setup lang="ts">
    import { ref } from 'vue'

    const val = ref('')
    const readonly = ref('Cannot be edited')
</script>

<template>
    <div class="text-field-demo d-flex flex-wrap gap-4">
        <div class="text-field-demo__item">
            <c-text-field
                v-model="val"
                label="Default"
            />
        </div>

        <div class="text-field-demo__item">
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
        </div>

        <div class="text-field-demo__item">
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
        </div>

        <div class="text-field-demo__item">
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
        </div>

        <div class="text-field-demo__item">
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
        </div>

        <div class="text-field-demo__item">
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
        </div>
    </div>
</template>

<style scoped>
.text-field-demo__item {
  flex: 1 1 280px;
  min-width: min(100%, 260px);
}
</style>
