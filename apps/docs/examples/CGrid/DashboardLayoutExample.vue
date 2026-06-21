<template>
  <div class="pa-4">
    <!-- Stats row -->
    <c-row class="mb-4">
      <c-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
        <c-card class="elevation-2 radius-16">
          <c-card-header class="d-flex items-center justify-center py-4" :class="stat.bgClass">
            <span style="font-size:28px">{{ stat.icon }}</span>
          </c-card-header>
          <c-card-body class="pa-3">
            <div class="font-weight-bold mb-1" style="font-size:20px">{{ stat.value }}</div>
            <div style="font-size:12px;opacity:.5">{{ stat.label }}</div>
            <div class="font-weight-bold mt-1" :class="stat.up ? 'text-green' : 'text-red'" style="font-size:12px">
              {{ stat.up ? '↑' : '↓' }} {{ stat.delta }}
            </div>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>

    <!-- Chart + Sidebar -->
    <c-row>
      <c-col cols="12" md="8">
        <c-card class="elevation-2 radius-16">
          <c-card-header class="bg-indigo d-flex items-center justify-space-between px-4 py-3">
            <span class="font-weight-bold text-white">Revenue</span>
            <span class="text-white" style="font-size:12px;opacity:.7">Last 7 days</span>
          </c-card-header>
          <c-card-body class="px-4 pb-4">
            <div class="chart">
              <div v-for="(bar, i) in bars" :key="i" class="chart__bar-wrap">
                <div
                  class="chart__bar radius-4"
                  :class="bar.active ? 'bg-teal' : 'bg-indigo'"
                  :style="{ height: bar.h + 'px', opacity: bar.active ? 1 : .3 }"
                />
                <div style="font-size:11px;opacity:.5">{{ bar.day }}</div>
              </div>
            </div>
          </c-card-body>
        </c-card>
      </c-col>

      <c-col cols="12" md="4">
        <c-card class="elevation-2 radius-16" style="height:100%">
          <c-card-header class="bg-deep-purple px-4 py-3">
            <span class="font-weight-bold text-white">Top Products</span>
          </c-card-header>
          <c-card-body class="px-4 pb-4">
            <div v-for="p in products" :key="p.name" class="d-flex items-center gap-2 mb-3">
              <div class="dot radius-circle" :class="p.bgClass" />
              <span style="font-size:13px;width:80px;flex-shrink:0">{{ p.name }}</span>
              <div class="bar-track radius-4">
                <div class="bar-fill radius-4" :class="p.bgClass" :style="{ width: p.pct + '%' }" />
              </div>
              <span style="font-size:12px;font-weight:700;width:32px;text-align:right;opacity:.6">{{ p.pct }}%</span>
            </div>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { icon: '💰', label: 'Revenue', value: '$24.8k', delta: '12%', up: true,  bgClass: 'bg-teal' },
  { icon: '🛒', label: 'Orders',  value: '1 204',  delta: '8%',  up: true,  bgClass: 'bg-pink' },
  { icon: '👤', label: 'Users',   value: '8 391',  delta: '3%',  up: true,  bgClass: 'bg-indigo' },
  { icon: '↩️', label: 'Returns', value: '37',     delta: '2%',  up: false, bgClass: 'bg-amber' },
]

const bars = [
  { day: 'Mon', h: 60,  active: false },
  { day: 'Tue', h: 90,  active: false },
  { day: 'Wed', h: 75,  active: false },
  { day: 'Thu', h: 110, active: false },
  { day: 'Fri', h: 130, active: true  },
  { day: 'Sat', h: 95,  active: false },
  { day: 'Sun', h: 70,  active: false },
]

const products = [
  { name: 'Headphones', pct: 68, bgClass: 'bg-indigo' },
  { name: 'Smart Watch', pct: 49, bgClass: 'bg-teal' },
  { name: 'Camera',     pct: 34, bgClass: 'bg-red' },
  { name: 'Speaker',    pct: 21, bgClass: 'bg-pink' },
]
</script>

<style scoped>
.chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 150px;
  padding-top: 16px;
}

.chart__bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.chart__bar {
  width: 100%;
  transition: height 0.3s ease;
}

.dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  background: rgba(0,0,0,.08);
  height: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.4s ease;
}
</style>
