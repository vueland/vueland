<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const launch = shallowRef<Date | null>(new Date(2026, 6, 16))

    const highlightedDates = [
        new Date(2026, 6, 16),
        new Date(2026, 6, 22),
        new Date(2026, 6, 29),
    ]

    const label = computed(() =>
        launch.value
            ? new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(launch.value)
            : 'Pick a launch day',
    )
</script>

<template>
    <div class="date-input-slots">
        <div class="date-input-slots__shell">
            <div class="date-input-slots__intro">
                <c-icon
                    name="fas:star"
                    source="fa"
                    :size="18"
                />
                <div>
                    <strong>Campaign launch</strong>
                    <span>{{ label }}</span>
                </div>
            </div>

            <c-date-input
                v-model="launch"
                label="Launch date"
                format="d MMM yyyy"
                locale="en"
                preset="input.dateCampaign"
                :highlighted-dates="highlightedDates"
                clearable
            >
                <template #prepend>
                    <c-icon
                        name="fas:bell"
                        source="fa"
                        :size="15"
                    />
                </template>
                <template #append>
                    <c-icon
                        name="fas:chevron-down"
                        source="fa"
                        :size="13"
                    />
                </template>
                <template #before-body>
                    <div class="date-input-slots__banner">
                        <c-icon
                            name="fas:list-ul"
                            source="fa"
                            :size="12"
                        />
                        Editorial milestones
                    </div>
                </template>
                <template #date="{ date: day, isHighlighted }">
                    <span class="date-input-slots__day">
                        {{ day }}
                        <c-icon
                            v-if="isHighlighted"
                            name="fas:star"
                            source="fa"
                            :size="8"
                        />
                    </span>
                </template>
                <template #footer>
                    <div class="date-input-slots__footer">
                        <c-icon
                            name="fas:heart"
                            source="fa"
                            :size="12"
                        />
                        Synced with marketing calendar
                    </div>
                </template>
            </c-date-input>
        </div>
    </div>
</template>

<style scoped>
.date-input-slots {
  display: flex;
  justify-content: center;
  padding: 32px;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(63, 81, 181, 0.22), transparent 34%),
    linear-gradient(135deg, rgba(103, 58, 183, 0.14), rgba(0, 188, 212, 0.12)),
    var(--c-sys-color-surface);
}

.date-input-slots__shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 430px);
  padding: 22px;
  border: 1px solid var(--c-sys-color-outline-variant);
  border-radius: 16px;
  background: var(--c-sys-color-surface-container-low);
  box-shadow: var(--c-sys-elevation-2, 0 16px 36px rgba(0, 0, 0, 0.14));
}

.date-input-slots__intro {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--c-sys-color-on-surface);
}

.date-input-slots__intro > div {
  display: flex;
  flex-direction: column;
}

.date-input-slots__intro span {
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}

.date-input-slots__banner,
.date-input-slots__footer,
.date-input-slots__day {
  display: flex;
  align-items: center;
}

.date-input-slots__banner {
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  color: #3f51b5;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.date-input-slots__day {
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 28px;
}

.date-input-slots__footer {
  justify-content: center;
  gap: 8px;
  padding: 10px 14px 14px;
  color: #3f51b5;
  font-size: 12px;
  font-weight: 700;
}
</style>
