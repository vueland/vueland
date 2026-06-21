<script setup lang="ts">
    import { ref } from 'vue'

    const val1 = ref('not-an-email')
    const val2 = ref('not-an-email')

    const emailRules = [
        (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email address' }),
    ]
</script>

<template>
    <div class="ex-wrap">
        <div class="compound-grid">
            <div class="compound-col">
                <div class="col-title">
                    Without compound states
                </div>
                <div class="col-desc">
                    <code>error.focused</code> not defined — when focused with error, field falls back to
                    <code>error</code> zone only. Label stays error-colored even while active.
                </div>
                <c-text-field
                    v-model="val1"
                    label="Email"
                    :rules="emailRules"
                    validate-on="blur"
                    preset="input.noCompound"
                >
                    <template #prepend>
                        <c-icon
                            name="fas:envelope"
                            :size="14"
                            source="fa"
                        />
                    </template>
                    <template #details="{ errorMessage, hasError }">
                        <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
                            {{ errorMessage || 'Focus the field to see the difference' }}
                        </span>
                    </template>
                </c-text-field>
            </div>

            <div class="compound-col">
                <div class="col-title">
                    With compound states
                </div>
                <div class="col-desc">
                    <code>error.focused</code> defined — when focused with error, label switches to
                    primary color to signal the user is actively fixing it.
                </div>
                <c-text-field
                    v-model="val2"
                    label="Email"
                    :rules="emailRules"
                    validate-on="blur"
                    preset="input.withCompound"
                >
                    <template #prepend>
                        <c-icon
                            name="fas:envelope"
                            :size="14"
                            source="fa"
                        />
                    </template>
                    <template #details="{ errorMessage, hasError }">
                        <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
                            {{ errorMessage || 'Focus the field to see the difference' }}
                        </span>
                    </template>
                </c-text-field>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ex-wrap {
  padding: 24px;
}
.compound-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.compound-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.col-title {
  font-size: 13px;
  font-weight: 600;
}
.col-desc {
  font-size: 12px;
  opacity: .65;
  line-height: 1.5;
}
code {
  font-size: 11px;
  background: var(--c-app-bg-color, #f5f5f5);
  padding: 1px 4px;
  border-radius: 3px;
}
@media (max-width: 600px) {
  .compound-grid { grid-template-columns: 1fr; }
}
</style>
