<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const date = shallowRef<Date | null>(null)

    const today = new Date()

    const shift = (days: number) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

    const minDate = shift(1)
    const maxDate = shift(30)
    const disabledDates = {
        days: [5],
        dates: [shift(10), shift(17)],
    }

    const rules = [
        (value?: Date | null) => ({
            valid: !!value,
            message: 'Pick a shipping date',
        }),
        (value?: Date | null) => ({
            valid: !value || value.getDay() !== 5,
            message: 'Friday is reserved for inventory',
        }),
    ]

    const status = computed(() =>
        date.value
            ? 'Ready to schedule'
            : 'Validation waits for a date',
    )
</script>

<template>
    <div class="date-input-validation">
        <div class="date-input-validation__card">
            <div class="date-input-validation__title">
                <c-icon
                    name="fas:shield-alt"
                    source="fa"
                    :size="18"
                />
                <span>{{ status }}</span>
            </div>

            <c-date-input
                v-model="date"
                label="Shipping date"
                :rules="rules"
                validate-on="input"
                :min-date="minDate"
                :max-date="maxDate"
                :disabled-dates="disabledDates"
                preset="input.dateBooking"
                clearable
            >
                <template #details="{ errorMessage, details }">
                    <span class="date-input-validation__details">
                        <c-icon
                            :name="errorMessage ? 'fas:times' : 'fas:check'"
                            source="fa"
                            :size="11"
                        />
                        {{ errorMessage || details || 'Next 30 days, no Fridays' }}
                    </span>
                </template>
                <template #date="{ date: day, isToday }">
                    <span class="date-input-validation__day">
                        {{ day }}
                        <c-icon
                            v-if="isToday"
                            name="fas:star"
                            source="fa"
                            :size="8"
                        />
                    </span>
                </template>
            </c-date-input>
        </div>
    </div>
</template>

<style scoped>
.date-input-validation {
  display: flex;
  justify-content: center;
  padding: 32px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(0, 150, 136, 0.14), rgba(76, 175, 80, 0.10)),
    var(--c-sys-color-surface);
}

.date-input-validation__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(100%, 420px);
  padding: 22px;
  border: 1px solid var(--c-sys-color-outline-variant);
  border-radius: 16px;
  background: var(--c-sys-color-surface-container-low);
}

.date-input-validation__title,
.date-input-validation__details,
.date-input-validation__day {
  display: flex;
  align-items: center;
}

.date-input-validation__title {
  gap: 10px;
  color: var(--c-sys-color-on-surface);
  font-weight: 700;
}

.date-input-validation__details {
  gap: 7px;
  color: var(--c-sys-color-on-surface-variant);
}

.date-input-validation__day {
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 28px;
}
</style>
