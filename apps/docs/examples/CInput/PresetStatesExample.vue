<script setup lang="ts">
    import { ref } from 'vue'

    const val = ref('')
    const filled = ref('Hello world')
    const readonly = ref('Cannot edit this')
</script>

<template>
    <div>
        <c-row>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
            <c-col
                xxl="4"
                xl="4"
                lg="6"
                md="6"
                sm="12"
                class="px-2"
            >
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
            </c-col>
        </c-row>
    </div>
</template>

<style scoped>
.state-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: .5;
}
</style>
