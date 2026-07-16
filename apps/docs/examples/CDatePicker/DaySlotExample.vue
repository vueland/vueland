<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const today = new Date()
    const date = shallowRef<Date | null>(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4))

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const events = [
        { date: shift(1), icon: 'fas:bell', color: '#f06292', label: 'Reminder' },
        { date: shift(4), icon: 'fas:star', color: '#ff9800', label: 'Launch' },
        { date: shift(8), icon: 'fas:briefcase', color: '#009688', label: 'Review' },
        { date: shift(14), icon: 'fas:heart', color: '#e91e63', label: 'Care day' },
    ]

    const highlightedDates = events.map(item => item.date)

    function eventFor(day: number, month: number, year: number) {
        return events.find(item =>
            item.date.getDate() === day
            && item.date.getMonth() === month
            && item.date.getFullYear() === year,
        )
    }

    function eventIcon(day: number, month: number, year: number) {
        return eventFor(day, month, year)?.icon
    }

    function eventColor(day: number, month: number, year: number) {
        return eventFor(day, month, year)?.color
    }

    const selectedLabel = computed(() =>
        date.value
            ? new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(date.value)
            : 'No selected day',
    )
</script>

<template>
    <div class="date-slots">
        <c-date-picker
            v-model="date"
            :highlighted-dates="highlightedDates"
            preset="datePicker.neon"
        >
            <template #before-header="{ showToday }">
                <div class="date-slots__toolbar">
                    <span>
                        <c-icon
                            name="fas:list-ul"
                            source="fa"
                            :size="13"
                        />
                        Sprint calendar
                    </span>
                    <button
                        type="button"
                        @click="showToday"
                    >
                        Today
                    </button>
                </div>
            </template>

            <template #date="{ date: day, month, year, isHighlighted, isSelected, isToday }">
                <div :class="['date-slots__day', isSelected && 'date-slots__day--selected']">
                    <span>{{ day }}</span>
                    <c-icon
                        v-if="isHighlighted && eventIcon(day, month, year)"
                        :name="eventIcon(day, month, year)"
                        source="fa"
                        :size="9"
                        :style="{ color: isSelected ? 'currentColor' : eventColor(day, month, year) }"
                    />
                    <span
                        v-else-if="isToday"
                        class="date-slots__today"
                    ></span>
                </div>
            </template>

            <template #month="{ label, month, isSelected, isCurrent, disabled, onSelect }">
                <button
                    :class="[
                        'date-slots__month',
                        isSelected && 'date-slots__month--selected',
                        isCurrent && 'date-slots__month--current',
                    ]"
                    type="button"
                    :disabled="disabled"
                    @click="onSelect"
                >
                    <span>{{ label }}</span>
                    <small>Q{{ Math.floor(month / 3) + 1 }}</small>
                </button>
            </template>

            <template #year="{ year, isSelected, isCurrent, onSelect }">
                <button
                    :class="[
                        'date-slots__year',
                        isSelected && 'date-slots__year--selected',
                        isCurrent && 'date-slots__year--current',
                    ]"
                    type="button"
                    @click="onSelect"
                >
                    <c-icon
                        v-if="year % 5 === 0"
                        name="fas:star"
                        source="fa"
                        :size="10"
                    />
                    {{ year }}
                </button>
            </template>

            <template #footer>
                <div class="date-slots__footer">
                    <span>{{ selectedLabel }}</span>
                    <span>{{ events.length }} highlighted events</span>
                </div>
            </template>
        </c-date-picker>

        <div class="date-slots__events">
            <strong>Event slots</strong>
            <span
                v-for="item in events"
                :key="item.label"
            >
                <c-icon
                    :name="item.icon"
                    source="fa"
                    :size="12"
                    :style="{ color: item.color }"
                />
                {{ item.label }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.date-slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding: 30px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(63, 81, 181, 0.16), rgba(255, 152, 0, 0.14)),
    var(--c-sys-color-surface);
}

.date-slots :deep(.c-date-picker) {
  --c-date-picker-header-bg: var(--c-sys-color-surface-container);
  --c-date-picker-body-bg: var(--c-sys-color-surface);
  --c-date-picker-selected-bg: #5e35b1;
  --c-date-picker-selected-color: #ffffff;
  --c-date-picker-highlighted-bg: rgba(255, 152, 0, 0.16);
  --c-date-picker-highlighted-color: #ef6c00;
  --c-date-picker-today-color: #5e35b1;
  --c-date-picker-current-border-color: #5e35b1;
}

.date-slots__toolbar,
.date-slots__toolbar span,
.date-slots__day,
.date-slots__month,
.date-slots__year,
.date-slots__footer,
.date-slots__events span {
  display: flex;
  align-items: center;
}

.date-slots__toolbar {
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  color: #5e35b1;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.date-slots__toolbar span {
  gap: 8px;
}

.date-slots__toolbar button {
  border: 0;
  border-radius: 999px;
  padding: 5px 10px;
  background: rgba(94, 53, 177, 0.12);
  color: #5e35b1;
  cursor: pointer;
  font-weight: 700;
}

.date-slots__day {
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  min-height: 30px;
}

.date-slots__today {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: currentColor;
}

.date-slots__month,
.date-slots__year {
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.date-slots__month {
  flex-direction: column;
}

.date-slots__month small {
  opacity: 0.62;
}

.date-slots__month--current,
.date-slots__year--current {
  color: #5e35b1;
  font-weight: 800;
}

.date-slots__month--selected,
.date-slots__year--selected {
  background: #5e35b1;
  color: #fff;
}

.date-slots__footer {
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px 16px;
  color: #5e35b1;
  font-size: 12px;
  font-weight: 800;
}

.date-slots__events {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: center;
  min-width: 200px;
  padding: 18px;
  border-radius: 16px;
  background: var(--c-sys-color-surface-container);
  box-shadow: var(--c-sys-elevation-2);
}

.date-slots__events span {
  gap: 10px;
  color: var(--c-sys-color-on-surface-variant);
}
</style>
