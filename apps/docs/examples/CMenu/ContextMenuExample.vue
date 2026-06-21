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

<template>
    <div class="pa-6">
        <div
            class="canvas pa-5 radius-10 select-none"
            @contextmenu.prevent="onContextMenu"
        >
            <div class="d-flex flex-wrap gap-3 justify-center">
                <c-card
                    v-for="file in files"
                    :key="file.name"
                    class="file-card pa-3 d-flex flex-col align-center gap-2 radius-8 elevation-1"
                >
                    <c-icon
                        :name="file.icon"
                        source="fa"
                        :size="22"
                        :style="{ color: file.color }"
                    />
                    <span class="file-name">{{ file.name }}</span>
                </c-card>
            </div>
            <div class="hint mt-3">
                Right-click anywhere to open context menu
            </div>
        </div>

        <c-menu
            v-model="open"
            :position-x="x"
            :position-y="y"
            width="auto"
            close-on-click-outside
            close-on-content-click
        >
            <c-card
                class="elevation-4"
                style="min-width:200px"
            >
                <c-card-body class="py-1 px-0">
                    <c-list>
                        <c-list-item
                            class="px-4"
                            style="gap:12px"
                            @click="toast('Opened')"
                        >
                            <c-icon
                                name="fas:eye"
                                source="fa"
                                :size="13"
                                style="width:14px;opacity:.5"
                            /> Open
                        </c-list-item>
                        <c-list-item
                            class="px-4"
                            style="gap:12px"
                            @click="toast('Renamed')"
                        >
                            <c-icon
                                name="fas:pen"
                                source="fa"
                                :size="13"
                                style="width:14px;opacity:.5"
                            /> Rename
                        </c-list-item>
                        <c-list-item
                            class="px-4"
                            style="gap:12px"
                            @click="toast('Path copied')"
                        >
                            <c-icon
                                name="fas:link"
                                source="fa"
                                :size="13"
                                style="width:14px;opacity:.5"
                            /> Copy path
                        </c-list-item>
                        <c-list-item
                            class="px-4"
                            style="gap:12px"
                            @click="toast('Shared')"
                        >
                            <c-icon
                                name="fas:share-alt"
                                source="fa"
                                :size="13"
                                style="width:14px;opacity:.5"
                            /> Share
                        </c-list-item>
                    </c-list>
                    <div class="sep" />
                    <c-list>
                        <c-list-item
                            class="px-4 text-red"
                            style="gap:12px"
                            @click="toast('Deleted')"
                        >
                            <c-icon
                                name="fas:trash"
                                source="fa"
                                :size="13"
                                style="width:14px"
                            /> Move to Trash
                        </c-list-item>
                    </c-list>
                </c-card-body>
            </c-card>
        </c-menu>

        <transition name="toast">
            <c-chip
                v-if="msg"
                class="bg-teal"
                style="position:absolute;bottom:16px;right:16px"
            >
                <c-icon
                    name="fas:check"
                    source="fa"
                    :size="11"
                    style="margin-right:6px"
                />
                {{ msg }}
            </c-chip>
        </transition>
    </div>
</template>

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
