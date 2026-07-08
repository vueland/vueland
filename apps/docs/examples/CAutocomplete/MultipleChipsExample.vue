<script setup lang="ts">
    import { computed, ref } from 'vue'

    const stack = ref(['Vue', 'TypeScript'])

    const technologies = [
        'Vue',
        'React',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'Nuxt',
        'Vite',
        'GraphQL',
        'Go',
        'Rust',
    ]

    const TEAM_FIT = 5

    const progress = computed(() => Math.min(100, (stack.value.length / TEAM_FIT) * 100))
    const complete = computed(() => stack.value.length >= TEAM_FIT)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:420px"
        >
            <div class="d-flex items-center gap-2 mb-4">
                <c-icon
                    name="fas:briefcase"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Candidate stack
                </span>
                <span
                    class="radius-pill px-3 py-1 fs-xs fw-semi-bold text-white"
                    :class="complete ? 'bg-green' : 'bg-indigo'"
                >
                    {{ stack.length }} / {{ TEAM_FIT }}
                </span>
            </div>

            <c-autocomplete
                v-model="stack"
                label="Technologies"
                placeholder="Add a technology"
                :items="technologies"
                multiple
                chips
                clearable
            />

            <c-progress-linear
                :value="progress"
                :color="complete ? 'green' : 'indigo'"
                height="6"
                class="mt-4"
            />
            <div class="fs-xs text-blue-grey mt-2">
                {{ complete ? 'Great fit for the team stack!' : `Pick ${TEAM_FIT} technologies. Backspace in the empty field removes the last one.` }}
            </div>
        </c-card>
    </div>
</template>
