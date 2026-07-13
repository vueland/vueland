<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(null)

    const today = new Date()

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const minDate = shift(0)
    const maxDate = shift(45)
    const highlightedDates = [shift(5), shift(12), shift(21), shift(34)]
    const disabledDates = { days: [0, 6] }

    const modelLabel = computed(() =>
        date.value
            ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date.value)
            : 'Waiting for a complete valid date',
    )
</script>

<template>
    <div class="date-input-typeable">
        <div class="date-input-typeable__copy">
            <c-icon
                name="fas:pen"
                source="fa"
                :size="18"
            />
            <div>
                <strong>Type or pick</strong>
                <span>{{ modelLabel }}</span>
            </div>
        </div>

        <c-date-input
            v-model="date"
            label="Departure"
            details="Use dd.MM.yyyy, weekdays only"
            format="dd.MM.yyyy"
            typeable
            clearable
            preset="input.dateBooking"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :highlighted-dates="highlightedDates"
        >
            <template #prepend>
                <c-icon
                    name="fas:calendar-alt"
                    source="fa"
                    :size="16"
                />
            </template>
            <template #footer>
                <div class="date-input-typeable__footer">
                    <c-icon
                        name="fas:shield-alt"
                        source="fa"
                        :size="12"
                    />
                    Weekends are blocked
                </div>
            </template>
        </c-date-input>
    </div>
</template>

<style scoped>
.date-input-typeable {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(0, 150, 136, 0.12), rgba(255, 193, 7, 0.12)),
    var(--c-sys-color-surface);
}

.date-input-typeable__copy {
  display: flex;
  flex: 1 1 220px;
  gap: 12px;
  align-items: center;
  padding: 18px;
  border-radius: 14px;
  background: var(--c-sys-color-surface-container);
  color: var(--c-sys-color-on-surface);
}

.date-input-typeable__copy > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-input-typeable :deep(.c-date-input) {
  flex: 1 1 320px;
  min-width: min(100%, 260px);
}

.date-input-typeable__copy span {
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}

.date-input-typeable__footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 10px 14px 14px;
  color: #00796b;
  font-size: 12px;
  font-weight: 700;
}

</style>
