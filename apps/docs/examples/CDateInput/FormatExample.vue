<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(new Date(2026, 6, 16))

    const formats = [
        { label: 'ISO', format: 'yyyy-MM-dd', locale: 'en', icon: 'fas:code' },
        { label: 'Russian long', format: 'd MMMM yyyy', locale: 'ru', icon: 'fas:globe' },
        { label: 'Compact US', format: 'MM/dd/yy', locale: 'en', icon: 'fas:pen' },
    ]

    const preview = computed(() =>
        date.value
            ? date.value.toISOString().slice(0, 10)
            : 'empty',
    )
</script>

<template>
    <div class="date-input-format d-flex justify-center">
        <div class="date-input-format__panel d-flex flex-col gap-4">
            <div class="date-input-format__summary d-flex items-center gap-3">
                <span class="date-input-format__icon d-flex items-center justify-center">
                    <c-icon
                        name="fas:globe"
                        source="fa"
                        :size="18"
                    />
                </span>

                <div>
                    <span class="date-input-format__eyebrow">Shared model</span>
                    <strong class="date-input-format__value">{{ preview }}</strong>
                </div>

                <div class="date-input-format__chips d-flex flex-wrap gap-2">
                    <span>Intl locale</span>
                    <span>3 masks</span>
                    <span>One value</span>
                </div>
            </div>

            <div class="date-input-format__fields d-flex flex-wrap gap-4">
                <c-date-input
                    v-for="item in formats"
                    :key="item.label"
                    v-model="date"
                    class="date-input-format__field"
                    :label="item.label"
                    :format="item.format"
                    :locale="item.locale"
                    preset="input.dateCampaign"
                    clearable
                >
                    <template #prepend>
                        <c-icon
                            :name="item.icon"
                            source="fa"
                            :size="15"
                        />
                    </template>
                </c-date-input>
            </div>
        </div>
    </div>
</template>

<style scoped>
.date-input-format {
  padding: 28px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 16% 18%, rgba(var(--c-sys-color-primary-rgb), 0.16), transparent 30%),
    linear-gradient(135deg, rgba(103, 58, 183, 0.12), rgba(0, 188, 212, 0.12)),
    var(--c-sys-color-surface);
}

.date-input-format__panel {
  width: min(100%, 720px);
}

.date-input-format__summary {
  align-self: center;
  width: min(100%, 520px);
  padding: 14px 16px;
  border: 1px solid rgba(var(--c-sys-color-primary-rgb), 0.18);
  border-radius: 16px;
  background: var(--c-sys-color-surface-container);
  color: var(--c-sys-color-on-surface);
}

.date-input-format__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 14px;
  background: var(--c-sys-color-primary);
  color: #fff;
}

.date-input-format__eyebrow {
  display: block;
  margin-bottom: 2px;
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}

.date-input-format__value {
  display: block;
  color: var(--c-sys-color-primary);
  font-size: 17px;
  line-height: 1.25;
}

.date-input-format__chips span {
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(var(--c-sys-color-primary-rgb), 0.1);
  color: var(--c-sys-color-primary);
  font-size: 12px;
  font-weight: 600;
}

.date-input-format__fields {
  justify-content: center;
}

.date-input-format__field {
  flex: 0 1 330px;
  min-width: min(100%, 280px);
  max-width: 330px;
}

@media (max-width: 680px) {
  .date-input-format {
    padding: 20px;
  }

  .date-input-format__summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .date-input-format__field {
    flex-basis: 100%;
    max-width: 420px;
  }
}
</style>
