<template>
    <div class="d-flex justify-center align-center pa-10">
        <c-row
            class="tooltip-grid gap-y-4"
            align="center"
        >
            <!-- row 1 -->
            <c-col cols="4" />
            <c-col
                cols="4"
                class="d-flex justify-center"
            >
                <c-tooltip
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="top-center"
                    :offset-y="8"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            class="bg-indigo elevation-2 text-white"
                            v-bind="activator"
                            style="gap:6px"
                            v-on="on"
                        >
                            <c-icon
                                name="fas:chevron-down"
                                source="fa"
                                :size="11"
                                style="transform:rotate(180deg)"
                            /> Top
                        </c-btn>
                    </template>
                    align="top-center"
                </c-tooltip>
            </c-col>
            <c-col cols="4" />

            <!-- row 2 -->
            <c-col
                cols="4"
                class="d-flex justify-center"
            >
                <c-tooltip
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="left-center"
                    :offset-x="8"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            class="bg-teal elevation-2 text-white"
                            v-bind="activator"
                            style="gap:6px"
                            v-on="on"
                        >
                            <c-icon
                                name="fas:chevron-down"
                                source="fa"
                                :size="11"
                                style="transform:rotate(90deg)"
                            /> Left
                        </c-btn>
                    </template>
                    align="left-center"
                </c-tooltip>
            </c-col>

            <c-col
                cols="4"
                class="d-flex justify-center"
            >
                <div class="dot-wrap">
                    <div class="dot" />
                </div>
            </c-col>

            <c-col
                cols="4"
                class="d-flex justify-center"
            >
                <c-tooltip
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="right-center"
                    :offset-x="8"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            class="bg-deep-purple elevation-2 text-white"
                            v-bind="activator"
                            style="gap:6px"
                            v-on="on"
                        >
                            Right <c-icon
                                name="fas:chevron-down"
                                source="fa"
                                :size="11"
                                style="transform:rotate(-90deg)"
                            />
                        </c-btn>
                    </template>
                    align="right-center"
                </c-tooltip>
            </c-col>

            <!-- row 3 -->
            <c-col cols="4" />
            <c-col
                cols="4"
                class="d-flex justify-center"
            >
                <c-tooltip
                    width="auto"
                    open-on-hover
                    close-on-leave
                    align="bottom-center"
                    :offset-y="8"
                >
                    <template #activator="{ on, activator }">
                        <c-btn
                            class="bg-amber elevation-2 text-white"
                            v-bind="activator"
                            style="gap:6px"
                            v-on="on"
                        >
                            <c-icon
                                name="fas:chevron-down"
                                source="fa"
                                :size="11"
                            /> Bottom
                        </c-btn>
                    </template>
                    align="bottom-center"
                </c-tooltip>
            </c-col>
            <c-col cols="4" />
        </c-row>
    </div>
</template>

<style scoped>
.tooltip-grid { width: min(100%, 360px) }
.dot-wrap { display: flex; align-items: center; justify-content: center; padding: 20px }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-sys-color-outline-variant) }
</style>
