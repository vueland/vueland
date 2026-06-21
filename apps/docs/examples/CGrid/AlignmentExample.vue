<template>
    <div class="pa-4 d-flex flex-col gap-4">
        <div class="demo-label">
            align="start" · justify="start"
        </div>
        <c-row
            align="start"
            justify="start"
            class="demo-row"
        >
            <c-col
                v-for="h in [60, 90, 50]"
                :key="h + 'start'"
                cols="2"
            >
                <c-card
                    class="elevation-1 radius-8 bg-teal text-white d-flex items-center justify-center"
                    :style="{ height: h + 'px' }"
                >
                    {{ h }}px
                </c-card>
            </c-col>
        </c-row>

        <div class="demo-label">
            align="center" · justify="center"
        </div>
        <c-row
            align="center"
            justify="center"
            class="demo-row"
        >
            <c-col
                v-for="h in [60, 90, 50]"
                :key="h + 'center'"
                cols="2"
            >
                <c-card
                    class="elevation-1 radius-8 bg-indigo text-white d-flex items-center justify-center"
                    :style="{ height: h + 'px' }"
                >
                    {{ h }}px
                </c-card>
            </c-col>
        </c-row>

        <div class="demo-label">
            align="end" · justify="space-between"
        </div>
        <c-row
            align="end"
            justify="space-between"
            class="demo-row"
        >
            <c-col
                v-for="h in [60, 90, 50]"
                :key="h + 'end'"
                cols="2"
            >
                <c-card
                    class="elevation-1 radius-8 bg-pink text-white d-flex items-center justify-center"
                    :style="{ height: h + 'px' }"
                >
                    {{ h }}px
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>

<style scoped>
.demo-label {
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
  opacity: .6;
}

.demo-row {
  border-radius: 10px;
  min-height: 110px;
  padding: 8px;
  background: rgba(0,0,0,.04);
}
</style>
