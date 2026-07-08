<script setup lang="ts">
    import { computed, ref } from 'vue'

    type Member = {
        id: number
        name: string
        role: string
        color: string
    }

    const assignee = ref<number>()

    const members: Member[] = [
        { id: 1, name: 'Anna Smith', role: 'Product Designer', color: 'bg-pink' },
        { id: 2, name: 'Boris Lee', role: 'Software Engineer', color: 'bg-indigo' },
        { id: 3, name: 'Clara Diaz', role: 'Product Manager', color: 'bg-teal' },
        { id: 4, name: 'Daniel Kim', role: 'QA Engineer', color: 'bg-orange' },
    ]

    const reviewer = computed(() => members.find(member => member.id === assignee.value))

    const initials = (member: Member) =>
        member.name.split(' ').map(part => part[0]).join('')
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:380px"
        >
            <div class="d-flex items-center gap-2 mb-4">
                <c-icon
                    name="fas:code"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Review request
                </span>
            </div>

            <c-autocomplete
                v-model="assignee"
                label="Reviewer"
                placeholder="Search a member"
                :items="members"
                title-key="name"
                value-key="id"
                clearable
            />

            <div
                v-if="reviewer"
                class="reviewer radius-12 mt-4 pa-3 d-flex items-center gap-2"
            >
                <span
                    class="reviewer__avatar"
                    :class="reviewer.color"
                >
                    {{ initials(reviewer) }}
                </span>
                <div>
                    <div class="fs-sm fw-medium">
                        {{ reviewer.name }}
                    </div>
                    <div class="fs-xs text-blue-grey">
                        {{ reviewer.role }}
                    </div>
                </div>
                <span class="reviewer__model radius-pill px-3 py-1 fs-xs fw-semi-bold">
                    v-model: {{ assignee }}
                </span>
            </div>
            <div
                v-else
                class="fs-sm text-blue-grey mt-4"
            >
                Search matches the title (<code>title-key</code>), the model stores the id (<code>value-key</code>).
            </div>
        </c-card>
    </div>
</template>

<style scoped>
.reviewer {
  background: var(--c-sys-color-surface-container);
}
.reviewer__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}
.reviewer__model {
  margin-left: auto;
  background: var(--c-sys-color-surface-variant);
  color: var(--c-sys-color-on-surface-variant);
}
</style>
