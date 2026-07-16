<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    const locale = shallowRef('ru')

    const locales = [
        { tag: 'en', label: 'English', zone: 'New York' },
        { tag: 'ru', label: 'Русский', zone: 'Moscow' },
        { tag: 'de', label: 'Deutsch', zone: 'Berlin' },
        { tag: 'ja', label: '日本語', zone: 'Tokyo' },
    ]

    const active = computed(() => locales.find(item => item.tag === locale.value) ?? locales[0])
</script>

<template>
    <div class="date-locale">
        <c-row
            class="gap-y-5"
            align="stretch"
        >
            <c-col
                cols="12"
                md="5"
            >
                <div class="date-locale__rail">
                    <button
                        v-for="item in locales"
                        :key="item.tag"
                        :class="['date-locale__tab', item.tag === locale && 'date-locale__tab--active']"
                        type="button"
                        @click="locale = item.tag"
                    >
                        <span class="date-locale__tab-icon">
                            <c-icon
                                :name="item.tag === locale ? 'fas:check' : 'fas:globe'"
                                source="fa"
                                :size="12"
                            />
                        </span>
                        <span class="date-locale__tab-content">
                            <span class="date-locale__tab-label">{{ item.label }}</span>
                            <small>{{ item.zone }}</small>
                        </span>
                    </button>
                </div>
            </c-col>

            <c-col
                cols="12"
                md="7"
                class="d-flex justify-center"
            >
                <c-date-picker
                    :locale="locale"
                    :monday-first="locale !== 'en'"
                    preset="datePicker.neon"
                >
                    <template #before-body>
                        <div class="date-locale__banner">
                            <c-icon
                                name="fas:globe"
                                source="fa"
                                :size="13"
                            />
                            {{ active.zone }} calendar
                        </div>
                    </template>
                </c-date-picker>
            </c-col>
        </c-row>
    </div>
</template>

<style scoped>
.date-locale {
  padding: 30px;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(63, 81, 181, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(103, 58, 183, 0.12), rgba(0, 188, 212, 0.12));
}

.date-locale :deep(.c-date-picker) {
  --c-date-picker-header-bg: var(--c-sys-color-surface-container);
  --c-date-picker-body-bg: var(--c-sys-color-surface);
  --c-date-picker-selected-bg: #3f51b5;
  --c-date-picker-selected-color: #fff;
  --c-date-picker-today-color: #3f51b5;
  --c-date-picker-current-border-color: #3f51b5;
}

.date-locale__rail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.date-locale__tab {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 72px;
  padding: 12px 14px;
  border: 0;
  border-radius: 14px;
  background: var(--c-sys-color-surface-container);
  color: var(--c-sys-color-on-surface);
  cursor: pointer;
  text-align: left;
}

.date-locale__tab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
}

.date-locale__tab-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.date-locale__tab-label {
  font-size: 15px;
  line-height: 1.25;
}

.date-locale__tab small {
  color: var(--c-sys-color-on-surface-variant);
  font-size: 12px;
  line-height: 1.2;
}

.date-locale__tab--active {
  background: #3f51b5;
  color: #fff;
}

.date-locale__tab--active small {
  color: rgba(255, 255, 255, 0.76);
}

.date-locale__banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  color: #3f51b5;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
