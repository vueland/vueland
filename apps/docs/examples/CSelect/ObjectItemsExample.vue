<script setup lang="ts">
    import { ref } from 'vue'

    const assignee = ref()

    const members = [
        { id: 1, name: 'Anna Smith',   role: 'Product Designer' },
        { id: 2, name: 'Boris Lee',    role: 'Software Engineer' },
        { id: 3, name: 'Clara Diaz',   role: 'Product Manager' },
        { id: 4, name: 'Dmitri Orlov', role: 'QA Engineer' },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Assign task
            </div>

            <c-select
                v-model="assignee"
                label="Assignee"
                placeholder="Select a member"
                :items="members"
                title-key="name"
                value-key="id"
                clearable
            />

            <div class="d-flex items-center gap-2 fs-sm text-blue-grey mt-4">
                Stored value
                <span class="radius-pill bg-teal text-white px-3 py-1 fs-xs fw-semi-bold">
                    {{ assignee ?? '—' }}
                </span>
            </div>
        </c-card>
    </div>
</template>
