<script setup lang="ts">
    const colColors = ['bg-indigo', 'bg-teal', 'bg-pink', 'bg-deep-purple', 'bg-amber', 'bg-blue']
</script>

<template>
    <div class="pa-4">
        <c-row class="mb-2">
            <c-col
                v-for="(col, i) in [4, 4, 4]"
                :key="col + 'a' + i"
                :cols="col"
            >
                <c-card class="elevation-1 radius-8 text-center pa-3 bg-blue-grey text-white">
                    {{ col }}
                </c-card>
            </c-col>
        </c-row>

        <c-row class="mb-2">
            <c-col
                v-for="col in [6, 6]"
                :key="col + 'b'"
                :cols="col"
            >
                <c-card class="elevation-1 radius-8 text-center pa-3 bg-indigo text-white">
                    {{ col }}
                </c-card>
            </c-col>
        </c-row>

        <c-row class="mb-2">
            <c-col cols="3">
                <c-card class="elevation-1 radius-8 text-center pa-3 bg-teal text-white">
                    3
                </c-card>
            </c-col>
            <c-col cols="9">
                <c-card class="elevation-1 radius-8 text-center pa-3 bg-teal text-white">
                    9
                </c-card>
            </c-col>
        </c-row>

        <c-row>
            <c-col
                v-for="n in 12"
                :key="n"
                cols="1"
            >
                <c-card
                    class="elevation-1 radius-4 text-center pa-2 text-white"
                    :class="colColors[(n - 1) % colColors.length]"
                    style="font-size:11px;font-weight:600"
                >
                    {{ n }}
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>
