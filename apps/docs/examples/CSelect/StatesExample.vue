<script setup lang="ts">
    import { ref } from 'vue'

    const plan = ref('Team')
    const region = ref('EU West')
    const channel = ref<string>()

    const plans = ['Starter', 'Team', 'Business', 'Enterprise']
    const regions = ['US East', 'EU West', 'Asia Pacific']
    const environments = ['Preview', 'Staging', 'Production']
    const channels = ['Stable', 'Beta', 'Canary']

    const channelRules = [
        (value?: string) => ({ valid: !!value, message: 'Select a release channel' }),
    ]
</script>

<template>
    <div class="select-states">
        <c-card class="select-states__card elevation-3 radius-16 pa-6">
            <div class="d-flex items-center justify-between gap-4 mb-5">
                <div>
                    <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-1">
                        Deployment settings
                    </div>
                    <div class="fs-lg fw-semi-bold">
                        Release controls
                    </div>
                </div>
                <span class="select-states__status">Live</span>
            </div>

            <div class="select-states__grid">
                <c-select
                    v-model="plan"
                    label="Plan"
                    placeholder="Choose a plan"
                    :items="plans"
                    details="Current billing plan"
                    clearable
                    preset="input.indigo"
                />

                <c-select
                    v-model="region"
                    label="Region"
                    :items="regions"
                    details="Keeps the selected value visible"
                    readonly
                    preset="input.teal"
                />

                <c-select
                    model-value="Production"
                    label="Environment"
                    :items="environments"
                    details="Disabled blocks focus and changes"
                    disabled
                    preset="input.orange"
                />

                <c-select
                    v-model="channel"
                    label="Release channel"
                    placeholder="Required before deploy"
                    :items="channels"
                    :rules="channelRules"
                    validate-on="blur"
                    details="Validation runs on blur"
                    clearable
                    preset="input.pink"
                >
                    <template #details="{ errorMessage, details }">
                        <span :class="{ 'select-states__error': !!errorMessage }">
                            {{ errorMessage || details }}
                        </span>
                    </template>
                </c-select>
            </div>
        </c-card>
    </div>
</template>

<style scoped>
.select-states {
  display: flex;
  justify-content: center;
  padding: 32px;
}
.select-states__card {
  width: min(100%, 720px);
}
.select-states__status {
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
.select-states__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.select-states__error {
  color: var(--c-sys-color-error);
}
@media (max-width: 640px) {
  .select-states {
    padding: 16px;
  }
  .select-states__grid {
    grid-template-columns: 1fr;
  }
}
</style>
