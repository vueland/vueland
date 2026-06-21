<template>
  <div class="ex-grid">
    <CTextField v-model="v1" label="Blue" preset="input.blue">
      <template #prepend><CIcon name="fas:user" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="v2" label="Teal" preset="input.teal">
      <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="v3" label="Green" preset="input.green">
      <template #prepend><CIcon name="fas:phone" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="v4" label="Deep Purple" preset="input.deepPurple">
      <template #prepend><CIcon name="fas:lock" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="v5" label="Orange" preset="input.orange">
      <template #prepend><CIcon name="fas:map-marker-alt" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="v6" label="Pink" preset="input.pink">
      <template #prepend><CIcon name="fas:heart" :size="16" source="fa" /></template>
    </CTextField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('')
const v5 = ref('')
const v6 = ref('')
</script>

<style scoped>
.ex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
}
@media (max-width: 600px) {
  .ex-grid { grid-template-columns: 1fr; }
}
</style>
