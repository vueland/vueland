<template>
  <div class="ex-grid">
    <CTextField v-model="val" label="Default" />

    <CTextField v-model="val" label="Clearable" clearable preset="input.blue">
      <template #prepend><CIcon name="fas:search" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="val" label="Disabled" disabled>
      <template #prepend><CIcon name="fas:lock" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField v-model="readonly" label="Readonly" readonly preset="input.teal">
      <template #prepend><CIcon name="fas:pen" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField
      v-model="val"
      label="With details"
      details="Hint text below the field"
      preset="input.indigo"
    >
      <template #prepend><CIcon name="fas:bell" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField
      v-model="val"
      label="With error"
      :rules="[() => ({ valid: false, message: 'This field has an error' })]"
      validate-on="blur"
    >
      <template #prepend><CIcon name="fas:shield-alt" :size="16" source="fa" /></template>
    </CTextField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const readonly = ref('Cannot be edited')
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
