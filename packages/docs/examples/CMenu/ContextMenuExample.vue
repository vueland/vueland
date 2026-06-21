<template>
  <div class="pa-6">
    <div class="canvas pa-5 radius-10 select-none" @contextmenu.prevent="onContextMenu">
      <div class="d-flex flex-wrap gap-3 justify-center">
        <CCard
          v-for="file in files"
          :key="file.name"
          class="file-card pa-3 d-flex flex-col align-center gap-2 radius-8 elevation-1"
        >
          <CIcon :name="file.icon" source="fa" :size="22" :style="{ color: file.color }" />
          <span class="file-name">{{ file.name }}</span>
        </CCard>
      </div>
      <div class="hint mt-3">Right-click anywhere to open context menu</div>
    </div>

    <CMenu v-model="open" :position-x="x" :position-y="y" width="auto" close-on-click-outside close-on-content-click>
      <CCard class="elevation-4" style="min-width:200px">
        <CCardBody class="py-1 px-0">
          <CList>
            <CListItem class="px-4" style="gap:12px" @click="toast('Opened')">
              <CIcon name="fas:eye"       source="fa" :size="13" style="width:14px;opacity:.5" /> Open
            </CListItem>
            <CListItem class="px-4" style="gap:12px" @click="toast('Renamed')">
              <CIcon name="fas:pen"       source="fa" :size="13" style="width:14px;opacity:.5" /> Rename
            </CListItem>
            <CListItem class="px-4" style="gap:12px" @click="toast('Path copied')">
              <CIcon name="fas:link"      source="fa" :size="13" style="width:14px;opacity:.5" /> Copy path
            </CListItem>
            <CListItem class="px-4" style="gap:12px" @click="toast('Shared')">
              <CIcon name="fas:share-alt" source="fa" :size="13" style="width:14px;opacity:.5" /> Share
            </CListItem>
          </CList>
          <div class="sep" />
          <CList>
            <CListItem class="px-4 text-red" style="gap:12px" @click="toast('Deleted')">
              <CIcon name="fas:trash" source="fa" :size="13" style="width:14px" /> Move to Trash
            </CListItem>
          </CList>
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

const open = ref(false)
const x = ref(0)
const y = ref(0)
const msg = ref('')

const files = [
  { icon: 'fas:file',   name: 'README.md',    color: '#64b5f6' },
  { icon: 'fas:folder', name: 'src',           color: '#ffb74d' },
  { icon: 'fas:cog',    name: 'vite.config',   color: '#9e9e9e' },
  { icon: 'fas:box',    name: 'package.json',  color: '#81c784' },
  { icon: 'fas:code',   name: 'styles.css',    color: '#ba68c8' },
  { icon: 'fas:key',    name: '.env',           color: '#ef5350' },
]

function onContextMenu(e: MouseEvent) {
  open.value = false
  setTimeout(() => {
    x.value = e.pageX
    y.value = e.pageY
    open.value = true
  }, 0)
}

let timer: ReturnType<typeof setTimeout>
function toast(text: string) {
  msg.value = text
  clearTimeout(timer)
  timer = setTimeout(() => { msg.value = '' }, 2000)
}
</script>

<style scoped>
.canvas {
  background: var(--c-app-surface-color);
  border: 1.5px dashed var(--c-app-border-color);
  min-height: 130px;
}
.file-card {
  width: 88px;
  cursor: default;
  background: var(--c-app-surface-color);
  transition: transform .12s, box-shadow .12s;
}
.file-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,.12) }
.file-name {
  font-size: 10px;
  color: var(--c-app-text-secondary-color);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.hint { font-size: 11px; text-align: center; color: var(--c-app-text-secondary-color); font-style: italic }
.text-red { color: #f44336 }
.sep { height: 1px; background: var(--c-app-border-color) }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px) }
</style>
