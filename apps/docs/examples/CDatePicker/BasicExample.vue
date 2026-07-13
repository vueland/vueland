<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(null)

    const formatter = new Intl.DateTimeFormat('en', {
        dateStyle: 'full',
    })

    const selectedLabel = computed(() =>
        date.value ? formatter.format(date.value) : 'No date selected',
    )

    function selectToday() {
        date.value = new Date()
    }
</script>

<template>
    <div class="date-basic">
        <div class="date-basic__copy">
            <span class="date-basic__eyebrow">
                <c-icon
                    name="fas:calendar-alt"
                    source="fa"
                    :size="13"
                />
                Single date
            </span>
            <strong>{{ selectedLabel }}</strong>
            <span>
                Empty value opens on today, but today is only marked as current — not selected.
            </span>
            <div class="date-basic__actions">
                <c-btn
                    class="date-basic__btn date-basic__btn--primary"
                    @click="selectToday"
                >
                    <c-icon
                        name="fas:check"
                        source="fa"
                        :size="12"
                    />
                    Today
                </c-btn>
                <c-btn
                    class="date-basic__btn"
                    @click="date = null"
                >
                    <c-icon
                        name="fas:times"
                        source="fa"
                        :size="12"
                    />
                    Clear
                </c-btn>
            </div>
        </div>

        <c-date-picker v-model="date" />
    </div>
</template>

<style scoped>
.date-basic {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 32px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 18% 20%, rgba(63, 81, 181, 0.18), transparent 30%),
    linear-gradient(135deg, rgba(0, 150, 136, 0.12), rgba(233, 30, 99, 0.10));
}

.date-basic__copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 280px;
  color: var(--c-sys-color-on-surface);
}

.date-basic__copy strong {
  font-size: 24px;
  line-height: 1.15;
}

.date-basic__copy span:not(.date-basic__eyebrow) {
  color: var(--c-sys-color-on-surface-variant);
}

.date-basic__eyebrow,
.date-basic__actions,
.date-basic__btn {
  display: flex;
  align-items: center;
}

.date-basic__eyebrow {
  gap: 8px;
  color: var(--c-sys-color-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.date-basic__actions {
  gap: 10px;
}

.date-basic__btn {
  gap: 8px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--c-sys-color-surface-container);
  color: var(--c-sys-color-on-surface);
}

.date-basic__btn--primary {
  background: var(--c-sys-color-primary);
  color: var(--c-sys-color-on-primary);
}
</style>
