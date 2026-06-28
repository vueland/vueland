<script setup lang="ts">
    import { shallowRef } from 'vue'

    const value = shallowRef([])
    const email = shallowRef()

    const items = [
        { name: 'Alex', email: 'aaa@mail.ru' },
        { name: 'Vitaly', email: 'vvv@mail.ru' },
        { name: 'Mikhail', email: 'mmm@mail.ru' },
    ]
</script>

<template>
    <div class="grid-demo py-5">
        <c-row>
            <c-col
                v-for="it in 4"
                :key="it"
                xxl="3"
                xl="3"
                lg="3"
                md="6"
                class="min-h-[250px] pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h2>Simple card example</h2>
                    </c-card-header>
                    <c-card-body>
                        <c-select
                            v-model="value"
                            label="Select user"
                            clearable
                            multiple
                            chips
                            title-key="name"
                            :items
                            :options="{
                                noItemsMessage: 'No user found',
                            }"
                        />

                        <c-text-field
                            v-model="email"
                            label="Email address"
                        />
                    </c-card-body>
                    <c-card-footer>
                        <c-tooltip
                            align="top-center"
                            open-on-hover
                            open-on-focus
                            close-on-leave
                            close-on-blur
                            offset-y="8"
                            strategy="reverse"
                            class="radius-8 px-4 py-2"
                        >
                            <template #activator="{ on, activator }">
                                <c-btn
                                    v-bind="activator"
                                    variant="flat"
                                    color="success"
                                    v-on="on"
                                >
                                    tooltip
                                </c-btn>
                            </template>
                            <span>some text</span>
                        </c-tooltip>
                    </c-card-footer>
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>
