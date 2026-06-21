<template>
  <div class="d-flex align-center gap-4 pa-8 flex-wrap justify-center">
    <CMenu
      v-for="m in menus"
      :key="m.label"
      width="auto"
      open-on-click
      close-on-click-outside
      close-on-content-click
      align="bottom"
      :offset-y="4"
    >
      <template #activator="{ on, activator }">
        <CBtn :class="m.bg" class="elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
          <CIcon :name="m.icon" source="fa" :size="14" />
          {{ m.label }}
          <CIcon name="fas:chevron-down" source="fa" :size="10" />
        </CBtn>
      </template>

      <CCard class="elevation-4" style="min-width:220px">
        <CCardBody class="py-1 px-0">
          <CList>
            <CListItem
              v-for="item in m.items"
              :key="item.label"
              class="px-4"
              style="gap:12px"
              @click="notify(item.label)"
            >
              <CIcon :name="item.icon" source="fa" :size="13" style="width:14px;opacity:.55" />
              <span style="flex:1">{{ item.label }}</span>
              <span v-if="item.kb" class="kb">{{ item.kb }}</span>
            </CListItem>
          </CList>

          <template v-if="m.danger">
            <div class="sep" />
            <CList>
              <CListItem class="px-4 text-red" style="gap:12px" @click="notify(m.danger.label)">
                <CIcon :name="m.danger.icon" source="fa" :size="13" style="width:14px" />
                {{ m.danger.label }}
              </CListItem>
            </CList>
          </template>
        </CCardBody>
      </CCard>
    </CMenu>

    <Transition name="toast">
      <CChip v-if="msg" class="bg-teal" style="position:absolute;bottom:16px;right:16px">
        <CIcon name="fas:check" source="fa" :size="11" style="margin-right:6px" />
        {{ msg }}
      </CChip>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('')
let t: ReturnType<typeof setTimeout>
function notify(text: string) {
  msg.value = text
  clearTimeout(t)
  t = setTimeout(() => { msg.value = '' }, 2000)
}

const menus = [
  {
    label: 'File',
    icon: 'fas:folder',
    bg: 'bg-indigo',
    items: [
      { icon: 'fas:plus',   label: 'New file',   kb: '⌘N' },
      { icon: 'fas:folder', label: 'Open…',      kb: '⌘O' },
      { icon: 'fas:save',   label: 'Save',        kb: '⌘S' },
      { icon: 'fas:copy',   label: 'Save as…',   kb: '⌘⇧S' },
    ],
    danger: { icon: 'fas:trash', label: 'Delete file' },
  },
  {
    label: 'Edit',
    icon: 'fas:pen',
    bg: 'bg-deep-purple',
    items: [
      { icon: 'fas:undo',  label: 'Undo',  kb: '⌘Z' },
      { icon: 'fas:redo',  label: 'Redo',  kb: '⌘⇧Z' },
      { icon: 'fas:cut',   label: 'Cut',   kb: '⌘X' },
      { icon: 'fas:copy',  label: 'Copy',  kb: '⌘C' },
      { icon: 'fas:paste', label: 'Paste', kb: '⌘V' },
    ],
  },
  {
    label: 'View',
    icon: 'fas:eye',
    bg: 'bg-teal',
    items: [
      { icon: 'fas:search', label: 'Zoom in',     kb: '⌘+' },
      { icon: 'fas:search', label: 'Zoom out',    kb: '⌘-' },
      { icon: 'fas:expand', label: 'Full screen', kb: 'F11' },
    ],
  },
]
</script>

<style scoped>
.kb {
  font-size: 11px;
  color: var(--c-app-text-secondary-color);
  letter-spacing: .02em;
  flex-shrink: 0;
}
.text-red { color: #f44336 }
.sep { height: 1px; background: var(--c-app-border-color); margin: 4px 0 }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px) }
</style>
