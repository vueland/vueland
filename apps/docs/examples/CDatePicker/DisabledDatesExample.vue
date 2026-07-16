<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(null)

    const today = new Date()

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const minDate = shift(0)
    const maxDate = shift(42)

    const disabledDates = {
        days: [0, 6],
        ranges: [{
            from: shift(12),
            to: shift(15),
        }],
        dates: [shift(24)],
    }

    const highlightedDates = [shift(3), shift(9), shift(18), shift(31)]

    const selectedLabel = computed(() =>
        date.value
            ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date.value)
            : 'Pick a production day',
    )
</script>

<template>
    <div class="date-rules">
        <c-date-picker
            v-model="date"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :highlighted-dates="highlightedDates"
            preset="datePicker.agenda"
        >
            <template #date="{ date: day, isHighlighted, isHoliday }">
                <div class="date-rules__day">
                    <span>{{ day }}</span>
                    <c-icon
                        v-if="isHoliday"
                        name="fas:ban"
                        source="fa"
                        :size="9"
                    />
                    <span
                        v-else-if="isHighlighted"
                        class="date-rules__marker"
                    ></span>
                </div>
            </template>
            <template #footer>
                <div class="date-rules__footer">
                    <c-icon
                        name="fas:briefcase"
                        source="fa"
                        :size="13"
                    />
                    {{ selectedLabel }}
                </div>
            </template>
        </c-date-picker>

        <div class="date-rules__legend">
            <span>
                <i class="date-rules__dot date-rules__dot--teal"></i>
                Release windows
            </span>
            <span>
                <c-icon
                    name="fas:ban"
                    source="fa"
                    :size="11"
                />
                Weekends and freeze dates
            </span>
            <span>
                <c-icon
                    name="fas:shield-alt"
                    source="fa"
                    :size="11"
                />
                6-week planning horizon
            </span>
        </div>
    </div>
</template>

<style scoped>
.date-rules {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding: 30px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(0, 150, 136, 0.16), rgba(33, 150, 243, 0.10)),
    var(--c-sys-color-surface);
}

.date-rules :deep(.c-date-picker) {
  --c-date-picker-header-bg: var(--c-sys-color-surface-container);
  --c-date-picker-body-bg: var(--c-sys-color-surface);
  --c-date-picker-selected-bg: #00796b;
  --c-date-picker-selected-color: #ffffff;
  --c-date-picker-highlighted-bg: rgba(0, 150, 136, 0.16);
  --c-date-picker-highlighted-color: #00796b;
  --c-date-picker-today-color: #00796b;
  --c-date-picker-current-border-color: #00796b;
}

.date-rules__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 28px;
}

.date-rules__marker,
.date-rules__dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
}

.date-rules__marker,
.date-rules__dot--teal {
  background: #00a68a;
}

.date-rules__footer,
.date-rules__legend,
.date-rules__legend span {
  display: flex;
  align-items: center;
}

.date-rules__footer {
  gap: 8px;
  justify-content: center;
  padding: 10px 16px 16px;
  color: #00796b;
  font-weight: 700;
}

.date-rules__legend {
  flex-direction: column;
  align-self: center;
  gap: 12px;
  min-width: 240px;
  padding: 18px;
  border-radius: 14px;
  background: var(--c-sys-color-surface-container);
  box-shadow: var(--c-sys-elevation-2, 0 12px 30px rgba(0, 0, 0, 0.16));
}

.date-rules__legend span {
  gap: 10px;
  width: 100%;
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}
</style>
