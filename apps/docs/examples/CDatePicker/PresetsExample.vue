<script setup lang="ts">
    import { shallowRef } from 'vue'

    const today = new Date()

    const neonDate = shallowRef(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6))
    const agendaDate = shallowRef(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13))

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const neonHighlights = [shift(2), shift(6), shift(10)]
    const agendaHighlights = [shift(13), shift(17), shift(28)]
</script>

<template>
    <div class="date-presets">
        <div class="date-presets__item date-presets__item--neon">
            <div class="date-presets__title">
                <c-icon
                    name="fas:star"
                    source="fa"
                    :size="14"
                />
                Neon preset
            </div>
            <c-date-picker
                v-model="neonDate"
                preset="datePicker.neon"
                :highlighted-dates="neonHighlights"
            />
        </div>

        <div class="date-presets__item date-presets__item--agenda">
            <div class="date-presets__title">
                <c-icon
                    name="fas:briefcase"
                    source="fa"
                    :size="14"
                />
                Agenda preset
            </div>
            <c-date-picker
                v-model="agendaDate"
                preset="datePicker.agenda"
                :highlighted-dates="agendaHighlights"
                :disabled-dates="{ days: [0, 6] }"
            />
        </div>
    </div>
</template>

<style scoped>
.date-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 30px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 20% 20%, rgba(63, 81, 181, 0.18), transparent 32%),
    radial-gradient(circle at 80% 20%, rgba(0, 150, 136, 0.16), transparent 32%),
    linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(233, 30, 99, 0.08));
}

.date-presets__item {
  display: flex;
  flex: 1 1 320px;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-width: min(100%, 300px);
}

.date-presets__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.date-presets__item--neon {
  color: #3f51b5;
}

.date-presets__item--agenda {
  color: #00796b;
}

.date-presets__item--neon :deep(.c-date-picker) {
  --c-date-picker-elevation: 0 18px 42px rgba(63, 81, 181, 0.24);
  --c-date-picker-header-bg: var(--c-sys-color-surface-container);
  --c-date-picker-body-bg: var(--c-sys-color-surface);
  --c-date-picker-selected-bg: #3f51b5;
  --c-date-picker-selected-color: #fff;
  --c-date-picker-highlighted-bg: rgba(63, 81, 181, 0.14);
  --c-date-picker-highlighted-color: #3f51b5;
  --c-date-picker-today-color: #3f51b5;
  --c-date-picker-current-border-color: #3f51b5;
}

.date-presets__item--agenda :deep(.c-date-picker) {
  --c-date-picker-elevation: 0 18px 42px rgba(0, 121, 107, 0.22);
  --c-date-picker-header-bg: var(--c-sys-color-surface-container);
  --c-date-picker-body-bg: var(--c-sys-color-surface);
  --c-date-picker-selected-bg: #00796b;
  --c-date-picker-selected-color: #fff;
  --c-date-picker-highlighted-bg: rgba(0, 150, 136, 0.16);
  --c-date-picker-highlighted-color: #00796b;
  --c-date-picker-today-color: #00796b;
  --c-date-picker-current-border-color: #00796b;
}
</style>
