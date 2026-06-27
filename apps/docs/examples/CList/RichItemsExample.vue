<script setup lang="ts">
    import { ref } from 'vue'

    const selected = ref('inbox')

    const folders = [
        { value: 'inbox',   icon: 'fas:envelope',  bg: 'bg-indigo',    title: 'Inbox',   subtitle: '12 unread messages', badge: '12' },
        { value: 'starred', icon: 'fas:star',      bg: 'bg-amber',     title: 'Starred', subtitle: '3 conversations',    badge: '3' },
        { value: 'sent',    icon: 'fas:share-alt', bg: 'bg-teal',      title: 'Sent',    subtitle: 'Last sent 2h ago',   badge: '' },
        { value: 'trash',   icon: 'fas:trash',     bg: 'bg-blue-grey', title: 'Trash',   subtitle: 'Empty',              badge: '' },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16"
            style="width:340px;overflow:hidden"
        >
            <c-list
                v-model="selected"
                variant="listbox"
                mandatory
                class="pa-2"
            >
                <c-list-item
                    v-for="f in folders"
                    :key="f.value"
                    :value="f.value"
                    class="px-3 py-2 radius-8"
                >
                    <span
                        class="d-inline-flex items-center justify-center radius-circle text-white"
                        :class="f.bg"
                        style="width:38px;height:38px;flex-shrink:0"
                    >
                        <c-icon
                            :name="f.icon"
                            source="fa"
                            :size="15"
                        />
                    </span>

                    <c-list-item-content>
                        <c-list-item-title class="fw-medium">
                            {{ f.title }}
                        </c-list-item-title>
                        <c-list-item-subtitle>{{ f.subtitle }}</c-list-item-subtitle>
                    </c-list-item-content>

                    <span
                        v-if="f.badge"
                        class="badge fs-xs fw-semi-bold"
                        :class="selected === f.value ? 'badge--active' : 'bg-pink text-white'"
                    >
                        {{ f.badge }}
                    </span>
                </c-list-item>
            </c-list>
        </c-card>
    </div>
</template>

<style scoped>
    .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
    }

    /* On a selected (primary) row the badge inverts: surface bg + primary text */
    .badge--active {
        background: var(--c-sys-color-on-primary);
        color: var(--c-sys-color-primary);
    }
</style>
