<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(null)

    const today = new Date()

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const quickDates = [
        { label: 'Today', value: shift(0) },
        { label: '+3 days', value: shift(3) },
        { label: '+1 week', value: shift(7) },
    ]

    const eta = computed(() =>
        date.value
            ? new Intl.DateTimeFormat('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            }).format(date.value)
            : 'No date selected',
    )
</script>

<template>
    <div class="date-input-basic">
        <section class="date-input-basic__panel">
            <div class="date-input-basic__header">
                <c-icon
                    name="fas:box"
                    source="fa"
                    :size="20"
                />
                <div>
                    <strong>Delivery window</strong>
                    <span>{{ eta }}</span>
                </div>
            </div>

            <c-date-input
                v-model="date"
                label="Delivery date"
                details="Pick a date from the calendar"
                preset="input.dateBooking"
                clearable
            >
                <template #prepend>
                    <c-icon
                        name="fas:calendar-alt"
                        source="fa"
                        :size="16"
                    />
                </template>
            </c-date-input>

            <div class="date-input-basic__actions">
                <button
                    v-for="item in quickDates"
                    :key="item.label"
                    type="button"
                    @click="date = item.value"
                >
                    {{ item.label }}
                </button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.date-input-basic {
  display: flex;
  justify-content: center;
  padding: 32px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(0, 150, 136, 0.16), rgba(33, 150, 243, 0.10)),
    var(--c-sys-color-surface);
}

.date-input-basic__panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 420px);
  padding: 22px;
  border: 1px solid var(--c-sys-color-outline-variant);
  border-radius: 16px;
  background: var(--c-sys-color-surface-container-low);
  box-shadow: var(--c-sys-elevation-2, 0 16px 36px rgba(0, 0, 0, 0.14));
}

.date-input-basic__header {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--c-sys-color-on-surface);
}

.date-input-basic__header > div {
  display: flex;
  flex-direction: column;
}

.date-input-basic__header strong {
  font-size: 16px;
}

.date-input-basic__header span {
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}

.date-input-basic__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.date-input-basic__actions button {
  padding: 7px 12px;
  border: 1px solid rgba(0, 150, 136, 0.36);
  border-radius: 999px;
  background: rgba(0, 150, 136, 0.10);
  color: #00796b;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}
</style>
