<script setup lang="ts">
    const delays = [
        { icon: 'fas:check',     label: 'Instant',      sub: 'No delay',         tip: 'Opens immediately on hover', bg: 'bg-indigo',      open: 0,   close: 0 },
        { icon: 'fas:eye',       label: 'Open delay',   sub: 'open: 400ms',      tip: 'Waits 400ms before showing', bg: 'bg-light-blue',  open: 400, close: 0 },
        { icon: 'fas:eye-slash', label: 'Close delay',  sub: 'close: 600ms',     tip: 'Lingers 600ms before hiding', bg: 'bg-teal',       open: 0,   close: 600 },
        { icon: 'fas:cog',       label: 'Both',         sub: '300ms · 400ms',    tip: 'Open: 300ms · Close: 400ms', bg: 'bg-deep-purple', open: 300, close: 400 },
    ]
</script>

<template>
    <div class="d-flex flex-wrap gap-4 pa-8 justify-center">
        <c-tooltip
            v-for="item in delays"
            :key="item.label"
            width="auto"
            open-on-hover
            close-on-leave
            align="bottom-center"
            :offset-y="10"
            :open-delay="item.open"
            :close-delay="item.close"
        >
            <template #activator="{ on, activator }">
                <c-card
                    class="delay-card elevation-2 radius-12 pa-5 d-flex flex-col align-center gap-3"
                    v-bind="activator"
                    v-on="on"
                >
                    <div
                        class="icon-bg radius-10"
                        :class="item.bg"
                    >
                        <c-icon
                            :name="item.icon"
                            source="fa"
                            :size="18"
                        />
                    </div>
                    <div class="d-flex flex-col align-center gap-1">
                        <span class="card-label">{{ item.label }}</span>
                        <span class="card-sub">{{ item.sub }}</span>
                    </div>
                </c-card>
            </template>
            <span>{{ item.tip }}</span>
        </c-tooltip>
    </div>
</template>

<style scoped>
.delay-card {
  width: 140px;
  cursor: default;
  background: var(--c-sys-color-surface);
  transition: transform .15s, box-shadow .15s;
  border: 1px solid var(--c-sys-color-outline-variant);
}
.delay-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}
.icon-bg {
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.card-label {
  font-size: 13px;
  font-weight: 600;
}
.card-sub {
  font-size: 11px;
  color: var(--c-sys-color-on-surface-variant);
}
</style>
