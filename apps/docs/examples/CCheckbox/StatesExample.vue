<script setup lang="ts">
    import { ref } from 'vue'

    const analytics = ref(true)
    const audit = ref(true)
    const terms = ref(false)

    const termsRules = [
        (value?: boolean) => ({
            valid: !!value,
            message: 'You must accept the terms',
        }),
    ]
</script>

<template>
    <div class="d-flex justify-center pa-4 sm:pa-8">
        <c-card class="checkbox-states__card elevation-3 radius-16 pa-6">
            <div class="d-flex items-center justify-between gap-4 mb-5">
                <div>
                    <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-1">
                        Workspace settings
                    </div>
                    <div class="fs-lg fw-semi-bold">
                        Privacy controls
                    </div>
                </div>
                <span class="checkbox-states__status">Beta</span>
            </div>

            <c-row class="gap-y-4">
                <c-col cols="12">
                    <c-checkbox
                        v-model="analytics"
                        label="Share anonymous analytics"
                        details="Editable — toggles freely"
                    />
                </c-col>

                <c-col cols="12">
                    <c-checkbox
                        v-model="audit"
                        label="Keep an audit log"
                        details="Readonly keeps the value visible but blocks changes"
                        readonly
                    />
                </c-col>

                <c-col cols="12">
                    <c-checkbox
                        :model-value="false"
                        label="Export to third parties"
                        details="Disabled blocks focus and changes"
                        disabled
                    />
                </c-col>

                <c-col cols="12">
                    <c-checkbox
                        v-model="terms"
                        label="I accept the terms of service"
                        :rules="termsRules"
                        validate-on="blur"
                        details="Validation runs on blur"
                    >
                        <template #details="{ errorMessage, details }">
                            <span :class="{ 'checkbox-states__error': !!errorMessage }">
                                {{ errorMessage || details }}
                            </span>
                        </template>
                    </c-checkbox>
                </c-col>
            </c-row>
        </c-card>
    </div>
</template>

<style scoped>
.checkbox-states__card {
  width: min(100%, 560px);
}
.checkbox-states__status {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--c-sys-color-success-container);
  color: var(--c-sys-color-on-success-container);
  font-size: 12px;
  font-weight: 700;
}
.checkbox-states__error {
  color: var(--c-sys-color-error);
}
</style>
