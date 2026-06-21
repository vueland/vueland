<template>
  <div class="d-flex flex-col align-center gap-6 pa-8">

    <!-- Toolbar -->
    <CCard class="elevation-2 pa-2">
      <div class="d-flex align-center gap-1">
        <CTooltip
          v-for="btn in toolbar"
          :key="btn.label"
          width="auto"
          open-on-hover
          close-on-leave
          align="top-center"
          :offset-y="6"
        >
          <template #activator="{ on, activator }">
            <CBtn
              variant="text"
              :class="btn.color"
              style="min-width:38px;width:38px;height:38px;padding:0"
              v-bind="activator"
              v-on="on"
              @click="last = btn.label"
            >
              <CIcon :name="btn.icon" source="fa" :size="15" />
            </CBtn>
          </template>
          {{ btn.label }}
        </CTooltip>

        <div class="vsep mx-1" />

        <CTooltip v-for="btn in toolbar2" :key="btn.label" width="auto" open-on-hover close-on-leave align="top-center" :offset-y="6">
          <template #activator="{ on, activator }">
            <CBtn
              variant="text"
              :class="btn.color"
              style="min-width:38px;width:38px;height:38px;padding:0"
              v-bind="activator"
              v-on="on"
              @click="last = btn.label"
            >
              <CIcon :name="btn.icon" source="fa" :size="15" />
            </CBtn>
          </template>
          {{ btn.label }}
        </CTooltip>
      </div>
    </CCard>

    <!-- Pills -->
    <div class="d-flex align-center gap-3 flex-wrap justify-center">
      <CTooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-indigo elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
            <CIcon name="fas:bell" source="fa" :size="13" /> Subscribe
          </CBtn>
        </template>
        Get notified on every release
      </CTooltip>

      <CTooltip width="auto" open-on-hover close-on-leave align="top-center" :offset-y="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
            <CIcon name="fas:star" source="fa" :size="13" /> Star
          </CBtn>
        </template>
        Star this repository on GitHub
      </CTooltip>

      <CTooltip width="auto" open-on-hover close-on-leave align="right-center" :offset-x="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-deep-purple elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
            <CIcon name="fas:share-alt" source="fa" :size="13" /> Share
          </CBtn>
        </template>
        Copy the sharing link
      </CTooltip>
    </div>

    <Transition name="toast">
      <CChip v-if="last" class="bg-indigo">
        <CIcon name="fas:check" source="fa" :size="11" style="margin-right:6px" />
        {{ last }}
      </CChip>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const last = ref('')

const toolbar = [
  { icon: 'fas:undo',  label: 'Undo',          color: 'text-indigo' },
  { icon: 'fas:redo',  label: 'Redo',          color: 'text-indigo' },
  { icon: 'fas:copy',  label: 'Copy',          color: 'text-light-blue' },
  { icon: 'fas:cut',   label: 'Cut',           color: 'text-light-blue' },
  { icon: 'fas:paste', label: 'Paste',         color: 'text-light-blue' },
]

const toolbar2 = [
  { icon: 'fas:heart', label: 'Add to favorites', color: 'text-pink' },
  { icon: 'fas:star',  label: 'Star this repo',   color: 'text-amber' },
  { icon: 'fas:trash', label: 'Delete',            color: 'text-red' },
]
</script>

<style scoped>
.text-indigo     { color: #3f51b5 !important }
.text-light-blue { color: #03a9f4 !important }
.text-pink       { color: #e91e63 !important }
.text-amber      { color: #ffc107 !important }
.text-red        { color: #f44336 !important }
.vsep { width: 1px; height: 24px; background: var(--c-app-border-color) }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px) }
</style>
