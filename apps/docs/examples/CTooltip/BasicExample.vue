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

<template>
    <div class="d-flex flex-col align-center gap-6 pa-8">
        <!-- Toolbar -->
        <c-card class="elevation-2 pa-2">
            <div class="d-flex align-center gap-1">
                <c-tooltip
                    v-for="btn in toolbar"
                    :key="btn.label"
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="top-center"
                    :offset-y="6"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            variant="text"
                            :class="btn.color"
                            style="min-width:38px;width:38px;height:38px;padding:0"
                            v-bind="activator"
                            v-on="on"
                            @click="last = btn.label"
                        >
                            <c-icon
                                :name="btn.icon"
                                source="fa"
                                :size="15"
                            />
                        </c-btn>
                    </template>
                    {{ btn.label }}
                </c-tooltip>

                <div class="vsep mx-1" />

                <c-tooltip
                    v-for="btn in toolbar2"
                    :key="btn.label"
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="top-center"
                    :offset-y="6"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            variant="text"
                            :class="btn.color"
                            style="min-width:38px;width:38px;height:38px;padding:0"
                            v-bind="activator"
                            v-on="on"
                            @click="last = btn.label"
                        >
                            <c-icon
                                :name="btn.icon"
                                source="fa"
                                :size="15"
                            />
                        </c-btn>
                    </template>
                    {{ btn.label }}
                </c-tooltip>
            </div>
        </c-card>

        <!-- Pills -->
        <div class="d-flex align-center gap-3 flex-wrap justify-center">
            <c-tooltip
                width="auto"
                open-on-hover
                close-on-leave
                align="bottom-center"
                :offset-y="8"
            >
                <template #activator="{ on, activator }">
                    <c-btn
                        class="bg-indigo elevation-2 text-white"
                        v-bind="activator"
                        style="gap:8px"
                        v-on="on"
                    >
                        <c-icon
                            name="fas:bell"
                            source="fa"
                            :size="13"
                        /> Subscribe
                    </c-btn>
                </template>
                Get notified on every release
            </c-tooltip>

            <c-tooltip
                width="auto"
                open-on-hover
                close-on-leave
                align="top-center"
                :offset-y="8"
            >
                <template #activator="{ on, activator }">
                    <c-btn
                        class="bg-teal elevation-2 text-white"
                        v-bind="activator"
                        style="gap:8px"
                        v-on="on"
                    >
                        <c-icon
                            name="fas:star"
                            source="fa"
                            :size="13"
                        /> Star
                    </c-btn>
                </template>
                Star this repository on GitHub
            </c-tooltip>

            <c-tooltip
                width="auto"
                open-on-hover
                close-on-leave
                align="right-center"
                :offset-x="8"
            >
                <template #activator="{ on, activator }">
                    <c-btn
                        class="bg-deep-purple elevation-2 text-white"
                        v-bind="activator"
                        style="gap:8px"
                        v-on="on"
                    >
                        <c-icon
                            name="fas:share-alt"
                            source="fa"
                            :size="13"
                        /> Share
                    </c-btn>
                </template>
                Copy the sharing link
            </c-tooltip>
        </div>

        <transition name="toast">
            <c-chip
                v-if="last"
                class="bg-indigo"
            >
                <c-icon
                    name="fas:check"
                    source="fa"
                    :size="11"
                    style="margin-right:6px"
                />
                {{ last }}
            </c-chip>
        </transition>
    </div>
</template>

<style scoped>
.text-indigo     { color: #3f51b5 !important }
.text-light-blue { color: #03a9f4 !important }
.text-pink       { color: #e91e63 !important }
.text-amber      { color: #ffc107 !important }
.text-red        { color: #f44336 !important }
.vsep { width: 1px; height: 24px; background: var(--c-sys-color-outline-variant) }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px) }
</style>
