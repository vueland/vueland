<script setup lang="ts">
    import { ref } from 'vue'

    const last = ref('')

    const actions = [
        { value: 'copy',   icon: 'fas:copy',  label: 'Copy',    kb: '⌘C' },
        { value: 'cut',    icon: 'fas:cut',   label: 'Cut',     kb: '⌘X' },
        { value: 'paste',  icon: 'fas:paste', label: 'Paste',   kb: '⌘V' },
        { value: 'rename', icon: 'fas:pen',   label: 'Rename…', kb: 'F2' },
    ]
</script>

<template>
    <div class="d-flex flex-col items-center gap-4 pa-8">
        <c-card
            class="elevation-4 radius-12"
            style="width:250px;overflow:hidden"
        >
            <c-list
                variant="menu"
                class="pa-2"
            >
                <c-list-item
                    v-for="a in actions"
                    :key="a.value"
                    :value="a.value"
                    class="px-3 py-2 radius-8"
                    @click="last = a.label"
                >
                    <c-list-item-icon>
                        <c-icon
                            :name="a.icon"
                            source="fa"
                            :size="14"
                            class="text-blue-grey"
                        />
                    </c-list-item-icon>
                    <span class="grow-1 fw-medium">{{ a.label }}</span>
                    <span class="kbd fs-xs fw-medium">{{ a.kb }}</span>
                </c-list-item>

                <div class="divider my-1 mx-2" />

                <c-list-item
                    value="delete"
                    class="px-3 py-2 radius-8 text-deep-orange"
                    @click="last = 'Delete'"
                >
                    <c-list-item-icon>
                        <c-icon
                            name="fas:trash"
                            source="fa"
                            :size="14"
                        />
                    </c-list-item-icon>
                    <span class="grow-1 fw-medium">Delete</span>
                </c-list-item>
            </c-list>
        </c-card>

        <div class="fs-sm text-blue-grey">
            Last action: <span class="fw-semi-bold">{{ last || '—' }}</span>
        </div>
    </div>
</template>

<style scoped>
    .kbd {
        padding: 2px 6px;
        border-radius: 6px;
        color: var(--c-app-text-secondary-color, #90a4ae);
        background: color-mix(in srgb, currentColor 12%, transparent);
    }

    .divider {
        height: 1px;
        background: var(--c-app-border-color, rgba(0, 0, 0, 0.1));
    }
</style>
