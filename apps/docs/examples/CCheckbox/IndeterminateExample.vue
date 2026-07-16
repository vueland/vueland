<script setup lang="ts">
    import { computed, ref } from 'vue'

    const teams = ['Design', 'Engineering', 'Marketing']

    const invited = ref(['Design'])

    // Родитель полностью выводится из детей: геттер отвечает за галку,
    // сеттер — за «выбрать всё / снять всё».
    const allInvited = computed({
        get: () => invited.value.length === teams.length,
        set: (value: boolean) => {
            invited.value = value ? [...teams] : []
        },
    })

    const someInvited = computed(() =>
        invited.value.length > 0 && invited.value.length < teams.length)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16 pa-6"
            style="width:360px"
        >
            <div class="fs-xs fw-semi-bold text-uppercase text-blue-grey mb-4">
                Invite teams
            </div>

            <c-checkbox
                v-model="allInvited"
                :indeterminate="someInvited"
                label="All teams"
                no-details
            />

            <div class="d-flex flex-col gap-2 mt-2 pl-6">
                <c-checkbox
                    v-for="team in teams"
                    :key="team"
                    v-model="invited"
                    :value="team"
                    :label="team"
                    no-details
                />
            </div>

            <div class="fs-sm text-blue-grey mt-5">
                {{ invited.length }} of {{ teams.length }} teams invited
            </div>
        </c-card>
    </div>
</template>
