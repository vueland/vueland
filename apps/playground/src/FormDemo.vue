<script setup lang="ts">
    import {
        shallowRef,
        unref,
        watchEffect
    } from 'vue'

    import { useBreakpoints } from '@/composables'

    const display = useBreakpoints()

    const value = shallowRef([])

    const items = [
        {name: 'Alex', email: 'aaa@mail.ru'},
        {name: 'Vitaly', email: 'vvv@mail.ru'},
        {name: 'Mikhail', email: 'mmm@mail.ru'},
    ]

    watchEffect(() => {{
        Object.keys(display).forEach(key => unref(display[key]))
    }})
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
                class="h-[250px] pa-1 md:pa-4 lg:pa-1 d-flex"
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
                            title-key="name"
                            :items
                            :options="{
                                noItemsMessage: 'No user found',
                            }"
                        />
                    </c-card-body>
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>
