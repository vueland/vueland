<script setup lang="ts">
    import { ref } from 'vue'

    const selected = ref<string[]>(['frontend', 'design'])

    const skills = [
        { value: 'design',   label: 'Design',   icon: 'fas:pen' },
        { value: 'frontend', label: 'Frontend', icon: 'fas:code' },
        { value: 'backend',  label: 'Backend',  icon: 'fas:box' },
        { value: 'devops',   label: 'DevOps',   icon: 'fas:cog' },
        { value: 'qa',       label: 'QA',       icon: 'fas:shield-alt' },
    ]
</script>

<template>
    <div class="d-flex flex-col items-center gap-5 pa-8">
        <c-card
            class="elevation-3 radius-16"
            style="width:300px;overflow:hidden"
        >
            <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
                Pick your stack
            </div>

            <c-list
                v-model="selected"
                variant="listbox"
                multiple
                class="pa-2"
            >
                <c-list-item
                    v-for="s in skills"
                    :key="s.value"
                    :value="s.value"
                    class="px-3 py-2 radius-8"
                >
                    <c-list-item-icon>
                        <c-icon
                            :name="s.icon"
                            source="fa"
                            :size="14"
                        />
                    </c-list-item-icon>
                    <span class="grow-1 fw-medium">{{ s.label }}</span>
                    <c-icon
                        v-if="selected.includes(s.value)"
                        name="fas:check"
                        source="fa"
                        :size="14"
                    />
                </c-list-item>
            </c-list>
        </c-card>

        <div
            class="d-flex flex-wrap justify-center items-center gap-2"
            style="max-width:300px"
        >
            <span
                v-for="s in selected"
                :key="s"
                class="radius-pill bg-teal text-white px-3 py-1 fs-xs fw-semi-bold text-capitalize"
            >
                {{ s }}
            </span>
            <span
                v-if="!selected.length"
                class="fs-sm text-blue-grey"
            >Nothing selected yet</span>
        </div>
    </div>
</template>
