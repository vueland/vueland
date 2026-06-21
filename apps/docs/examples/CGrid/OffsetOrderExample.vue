<template>
  <div class="pa-4 d-flex flex-col gap-4">
    <!-- Offset -->
    <div class="section-label">Offset</div>
    <c-row class="mb-2">
      <c-col cols="4" offset="4">
        <c-card class="elevation-1 radius-8 bg-indigo text-white text-center pa-3">
          cols="4" offset="4"
        </c-card>
      </c-col>
    </c-row>
    <c-row class="mb-2">
      <c-col cols="3">
        <c-card class="elevation-1 radius-8 bg-blue-grey text-white text-center pa-3">cols="3"</c-card>
      </c-col>
      <c-col cols="3" offset="6">
        <c-card class="elevation-1 radius-8 bg-indigo text-white text-center pa-3">offset="6"</c-card>
      </c-col>
    </c-row>

    <!-- Order -->
    <div class="section-label mt-2">Order — DOM order: A · B · C</div>
    <c-row>
      <c-col cols="4" order="3">
        <c-card class="elevation-1 radius-8 bg-deep-purple text-white text-center pa-3">
          A <span class="d-block" style="font-size:10px;opacity:.7">order 3</span>
        </c-card>
      </c-col>
      <c-col cols="4" order="1">
        <c-card class="elevation-1 radius-8 bg-teal text-white text-center pa-3">
          B <span class="d-block" style="font-size:10px;opacity:.7">order 1</span>
        </c-card>
      </c-col>
      <c-col cols="4" order="2">
        <c-card class="elevation-1 radius-8 bg-pink text-white text-center pa-3">
          C <span class="d-block" style="font-size:10px;opacity:.7">order 2</span>
        </c-card>
      </c-col>
    </c-row>
  </div>
</template>

<style scoped>
.section-label {
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: .5;
}
</style>
