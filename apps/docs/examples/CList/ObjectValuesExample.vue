<script setup lang="ts">
    import { computed, ref } from 'vue'

    type User = { id: number; name: string; role: string; initials: string; bg: string }

    const users: User[] = [
        { id: 1, name: 'Anna Smith',   role: 'Product Designer',  initials: 'AS', bg: 'bg-pink' },
        { id: 2, name: 'Boris Lee',    role: 'Software Engineer', initials: 'BL', bg: 'bg-indigo' },
        { id: 3, name: 'Clara Diaz',   role: 'Product Manager',   initials: 'CD', bg: 'bg-teal' },
        { id: 4, name: 'Dmitri Orlov', role: 'QA Engineer',       initials: 'DO', bg: 'bg-deep-orange' },
    ]

    // The initial value is a *different object reference* than the entries in
    // `users` — `item-key="id"` is what makes it match and render selected.
    const selected = ref<User[]>([{ ...users[1] }])

    const selectedIds = computed(() => selected.value.map(u => u.id))
</script>

<template>
    <div class="d-flex flex-col items-center gap-5 pa-8">
        <c-card
            class="elevation-3 radius-16"
            style="width:360px;overflow:hidden"
        >
            <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
                Assign reviewers
            </div>

            <c-list
                v-model="selected"
                variant="listbox"
                item-key="id"
                multiple
                class="pa-2"
            >
                <c-list-item
                    v-for="u in users"
                    :key="u.id"
                    :value="u"
                    class="px-3 py-2 radius-8"
                >
                    <span
                        class="d-inline-flex items-center justify-center radius-circle text-white fs-sm fw-semi-bold"
                        :class="u.bg"
                        style="width:38px;height:38px;flex-shrink:0"
                    >
                        {{ u.initials }}
                    </span>

                    <c-list-item-content>
                        <c-list-item-title class="fw-medium">
                            {{ u.name }}
                        </c-list-item-title>
                        <c-list-item-subtitle>{{ u.role }}</c-list-item-subtitle>
                    </c-list-item-content>

                    <c-icon
                        v-if="selectedIds.includes(u.id)"
                        name="fas:check"
                        source="fa"
                        :size="15"
                    />
                </c-list-item>
            </c-list>
        </c-card>

        <div class="d-flex items-center gap-2 fs-sm text-blue-grey">
            Selected ids
            <span
                v-for="id in selectedIds"
                :key="id"
                class="radius-pill bg-indigo text-white px-3 py-1 fs-xs fw-semi-bold"
            >
                {{ id }}
            </span>
            <span v-if="!selectedIds.length">—</span>
        </div>
    </div>
</template>
