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

<template>
    <div class="d-flex align-center gap-4 pa-8 flex-wrap justify-center">
        <c-menu
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
                <c-btn
                    :class="m.bg"
                    class="elevation-2 text-white"
                    v-bind="activator"
                    style="gap:8px"
                    v-on="on"
                >
                    <c-icon
                        :name="m.icon"
                        source="fa"
                        :size="14"
                    />
                    {{ m.label }}
                    <c-icon
                        name="fas:chevron-down"
                        source="fa"
                        :size="10"
                    />
                </c-btn>
            </template>

            <c-card
                class="elevation-4"
                style="min-width:220px"
            >
                <c-card-body class="py-1 px-0">
                    <c-list>
                        <c-list-item
                            v-for="item in m.items"
                            :key="item.label"
                            class="px-4"
                            style="gap:12px"
                            @click="notify(item.label)"
                        >
                            <c-icon
                                :name="item.icon"
                                source="fa"
                                :size="13"
                                style="width:14px;opacity:.55"
                            />
                            <span style="flex:1">{{ item.label }}</span>
                            <span
                                v-if="item.kb"
                                class="kb"
                            >{{ item.kb }}</span>
                        </c-list-item>
                    </c-list>

                    <template v-if="m.danger">
                        <div class="sep" />
                        <c-list>
                            <c-list-item
                                class="px-4 text-red"
                                style="gap:12px"
                                @click="notify(m.danger.label)"
                            >
                                <c-icon
                                    :name="m.danger.icon"
                                    source="fa"
                                    :size="13"
                                    style="width:14px"
                                />
                                {{ m.danger.label }}
                            </c-list-item>
                        </c-list>
                    </template>
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
