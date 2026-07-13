<script setup lang="ts">
    import { ref } from 'vue'

    const val = ref('')
    const filled = ref('Hello world')
    const readonly = ref('Cannot edit this')
</script>

<template>
    <div class="input-state-demo d-flex flex-wrap gap-4">
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Default
                </div>
                <c-text-field
                    v-model="val"
                    label="Label"
                    preset="input.blue"
                />
            </div>
        </div>
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Focused
                </div>
                <c-text-field
                    v-model="val"
                    label="Label"
                    preset="input.blue"
                    :focused="true"
                />
            </div>
        </div>
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Filled
                </div>
                <c-text-field
                    v-model="filled"
                    label="Label"
                    preset="input.blue"
                />
            </div>
        </div>
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Error
                </div>
                <c-text-field
                    v-model="val"
                    label="Label"
                    preset="input.blue"
                    :rules="[() => ({ valid: false, message: 'Validation error' })]"
                    validate-on="blur"
                    :focused="false"
                />
            </div>
        </div>
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Disabled
                </div>
                <c-text-field
                    v-model="val"
                    label="Label"
                    preset="input.blue"
                    disabled
                />
            </div>
        </div>
        <div class="input-state-demo__item">
            <div class="d-flex flex-col gap-2">
                <div class="state-label">
                    Readonly
                </div>
                <c-text-field
                    v-model="readonly"
                    label="Label"
                    preset="input.blue"
                    readonly
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.input-state-demo__item {
  flex: 1 1 280px;
  min-width: min(100%, 260px);
}

.state-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: .5;
}
</style>
