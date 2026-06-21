<script setup lang="ts">
    import { useBreakpoints } from '@vueland/ui/composables'

    const bp = useBreakpoints()

    console.log(bp)
</script>

<template>
    <c-app>
        <c-main>
            <c-row class="pt-2" align="end" justify="start">
                <c-col
                    v-for="it of 10"
                    :key="it"
                    cols="12"
                    xxl="2"
                    xl="3"
                    lg="3"
                    md="4"
                    sm="6"
                    class="elevation-2 radius-8 d-flex justify-center align-center"
                >
                    <c-card>
                        <c-card-header>
                            <h2>some title</h2>
                        </c-card-header>
                        <c-card-body>
                            <c-select
                                label="test title"
                                :rules="[(val) => ({valid: !!val, message: 'Required'})]"
                                :items="['one', 'two', 'three']"
                            />
                        </c-card-body>
                        <c-card-footer>
                            <c-tooltip
                                open-on-click
                                close-on-click-outside
                                class=""
                                offset-y="4"
                                strategy="reverse"
                                align="top-center"
                            >
                                <template #activator="{ on, activator }">
                                    <c-btn v-on="on" v-bind="activator" class="bg-primary text-white elevation-2 hover:bg-blue">APPROVE</c-btn>
                                </template>
                                <span>ooops some tooltip text here</span>
                            </c-tooltip>
                        </c-card-footer>
                    </c-card>
                </c-col>
            </c-row>
        </c-main>
    </c-app>
</template>
