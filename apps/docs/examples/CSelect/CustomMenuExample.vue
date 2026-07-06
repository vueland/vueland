<script setup lang="ts">
    import { computed, ref } from 'vue'

    type Region = {
        code: string
        name: string
        location: string
        latency: string
        badge: string
        color: string
    }

    const region = ref('eu')

    const regions: Region[] = [
        {
            code: 'us',
            name: 'North America',
            location: 'Virginia, USA',
            latency: '41 ms',
            badge: 'Default',
            color: 'bg-indigo',
        },
        {
            code: 'eu',
            name: 'Europe',
            location: 'Frankfurt, Germany',
            latency: '24 ms',
            badge: 'Recommended',
            color: 'bg-teal',
        },
        {
            code: 'ap',
            name: 'Asia Pacific',
            location: 'Singapore',
            latency: '67 ms',
            badge: 'New',
            color: 'bg-pink',
        },
    ]

    const selectedRegion = computed(() => regions.find(item => item.code === region.value))
</script>

<template>
    <div class="select-custom">
        <c-card class="select-custom__card elevation-3 radius-16 pa-6">
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Workspace region
            </div>

            <c-select
                v-model="region"
                label="Data region"
                placeholder="Choose a region"
                :items="regions"
                title-key="name"
                value-key="code"
                details="The menu is rendered through the menu slot"
                clearable
                preset="input.cyan"
            >
                <template #chips="{ items }">
                    <div
                        v-if="items.length && selectedRegion"
                        class="select-custom__value"
                    >
                        <span
                            class="select-custom__mark"
                            :class="selectedRegion.color"
                        >
                            {{ selectedRegion.code.toUpperCase() }}
                        </span>
                        <span class="select-custom__label">{{ items[0] }}</span>
                        <span class="select-custom__latency">{{ selectedRegion.latency }}</span>
                    </div>
                </template>

                <template #menu="{ items, onSelect }">
                    <c-list
                        variant="menu"
                        class="select-custom__menu"
                    >
                        <c-list-item
                            v-for="item in items"
                            :key="item.key"
                            :value="item.value"
                            class="select-custom__option"
                            @click="onSelect(item.value)"
                        >
                            <span
                                class="select-custom__mark"
                                :class="item.raw.color"
                            >
                                {{ item.raw.code.toUpperCase() }}
                            </span>

                            <c-list-item-content>
                                <c-list-item-title class="fw-medium">
                                    {{ item.title }}
                                </c-list-item-title>
                                <c-list-item-subtitle>
                                    {{ item.raw.location }} - {{ item.raw.latency }}
                                </c-list-item-subtitle>
                            </c-list-item-content>

                            <span
                                v-if="item.raw.badge"
                                class="select-custom__badge"
                            >
                                {{ item.raw.badge }}
                            </span>
                            <c-icon
                                v-if="item.value === region"
                                name="fas:check"
                                source="fa"
                                :size="14"
                                class="text-teal"
                            />
                        </c-list-item>
                    </c-list>
                </template>
            </c-select>

            <div
                v-if="selectedRegion"
                class="select-custom__summary"
            >
                <span>{{ selectedRegion.location }}</span>
                <strong>{{ selectedRegion.latency }}</strong>
            </div>
        </c-card>
    </div>
</template>

<style scoped>
.select-custom {
  display: flex;
  justify-content: center;
  padding: 32px;
}
.select-custom__card {
  width: min(100%, 440px);
}
.select-custom__value {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
}
.select-custom__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.select-custom__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.select-custom__latency {
  margin-left: auto;
  color: var(--c-sys-color-on-surface-variant);
  font-size: 12px;
  font-weight: 700;
}
.select-custom__menu {
  min-width: 360px;
  padding: 8px;
}
.select-custom__option {
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
}
.select-custom__badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--c-sys-color-surface-variant);
  color: var(--c-sys-color-on-surface-variant);
  font-size: 11px;
  font-weight: 700;
}
.select-custom__summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--c-sys-color-surface-container);
  color: var(--c-sys-color-on-surface-variant);
  font-size: 13px;
}
.select-custom__summary strong {
  color: var(--c-sys-color-on-surface);
}
@media (max-width: 640px) {
  .select-custom {
    padding: 16px;
  }
  .select-custom__menu {
    min-width: 280px;
  }
}
</style>
