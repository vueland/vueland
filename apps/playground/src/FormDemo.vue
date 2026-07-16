<script setup lang="ts">
    import { shallowRef } from 'vue'

    import { IconAliases } from '@/enums'

    const value = shallowRef([])
    const email = shallowRef([])
    const date = shallowRef()

    const rules = [
        val => ({
            valid: !!val.length,
            message: 'Required'
        })
    ]

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
                class="min-h-[270px] pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h2>Simple card example</h2>
                    </c-card-header>
                    <c-card-body>
                        <c-form>
                            <c-select
                                v-model="value"
                                label="Select user"
                                title-key="name"
                                value-key="email"
                                preset="input.soft"
                                :items
                                chips
                                clearable
                                multiple
                                :rules="rules"
                                details="some beautiful and long text for test"
                                :options="{
                                    noItemsMessage: 'No items',
                                }"
                            >
                                <template #prepend>
                                    <c-icon :name="IconAliases.CALENDAR" />
                                </template>
                            </c-select>

                            <c-autocomplete
                                v-model="email"
                                label="Select email"
                                title-key="email"
                                multiple
                                clearable
                                chips
                                value-key="name"
                                autocomplete="off"
                                preset="input.soft"
                                autocorrect="off"
                                autocapitalize="off"
                                spellcheck="false"
                                class="mt-4"
                                :items
                            >
                                <template #prepend>
                                    <c-icon :name="IconAliases.CALENDAR" />
                                </template>
                            </c-autocomplete>

                            <c-date-input
                                v-model="date"
                                :disabled-dates="{to: new Date(2026, 4, 10)}"
                                label="date"
                                format="MM-dd-yyyy"
                                locale="ru"
                                monday-first
                                clearable
                                preset="input.soft"
                            />
                        </c-form>
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
                                    color="#7C4DFF"
                                    preset="button.A"
                                    variant="outlined"
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
