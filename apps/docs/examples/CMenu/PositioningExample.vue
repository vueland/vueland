<template>
  <div class="d-flex flex-wrap gap-4 pa-10 justify-center align-center">
    <CMenu
      v-for="pos in positions"
      :key="pos.label"
      v-bind="pos.props"
      width="auto"
      open-on-click
      close-on-click-outside
      close-on-content-click
    >
      <template #activator="{ on, activator }">
        <CBtn :class="pos.bg" class="elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px;min-width:110px">
          <CIcon :name="pos.icon" source="fa" :size="13" />
          {{ pos.label }}
        </CBtn>
      </template>

      <CCard class="elevation-3" style="min-width:180px">
        <CCardBody class="py-1 px-0">
          <div class="pos-label px-4 py-2 d-flex align-center gap-2" :style="{ color: pos.accent }">
            <CIcon :name="pos.icon" source="fa" :size="12" />
            <span style="font-size:12px;font-weight:600">Opens {{ pos.label.toLowerCase() }}</span>
          </div>
          <div class="sep" />
          <CList>
            <CListItem v-for="item in options" :key="item.label" class="px-4" style="gap:10px">
              <CIcon name="fas:check" source="fa" :size="11" style="width:14px;opacity:.4" />
              {{ item.label }}
            </CListItem>
          </CList>
        </CCardBody>
      </CCard>
    </CMenu>
  </div>
</template>

<script setup lang="ts">
const options = [
  { label: 'Option one' },
  { label: 'Option two' },
  { label: 'Option three' },
]

const positions = [
  { label: 'Bottom', icon: 'fas:chevron-down',  bg: 'bg-indigo',     accent: '#3f51b5', props: { align: 'bottom', offsetY: 8 } },
  { label: 'Top',    icon: 'fas:chevron-down',  bg: 'bg-light-blue', accent: '#03a9f4', props: { align: 'top',    offsetY: 8 } },
  { label: 'Right',  icon: 'fas:chevron-down',  bg: 'bg-teal',       accent: '#009688', props: { align: 'right', offsetX: 8 } },
  { label: 'Left',   icon: 'fas:chevron-down',  bg: 'bg-deep-purple',accent: '#673ab7', props: { align: 'left',  offsetX: 8 } },
]
</script>

<style scoped>
.sep { height: 1px; background: var(--c-app-border-color) }
</style>
