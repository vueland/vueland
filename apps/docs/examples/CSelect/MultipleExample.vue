<script setup lang="ts">
    import { ref } from 'vue'

    const skills = ref(['Vue', 'TypeScript'])

    const allSkills = ['Vue', 'React', 'TypeScript', 'Node.js', 'Go', 'Rust', 'GraphQL']
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:400px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Candidate profile
            </div>

            <c-select
                v-model="skills"
                label="Skills"
                placeholder="Add skills"
                :items="allSkills"
                multiple
                chips
                clearable
            />
        </c-card>
    </div>
</template>
