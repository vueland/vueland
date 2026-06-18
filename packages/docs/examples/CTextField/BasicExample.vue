<template>
  <div class="ex-grid">
    <CTextField v-model="name" label="Full name" clearable>
      <template #prepend>
        <CIcon name="fas:user" :size="16" source="fa" />
      </template>
    </CTextField>

    <CTextField v-model="email" label="Email" preset="input.blue">
      <template #prepend>
        <CIcon name="fas:envelope" :size="16" source="fa" />
      </template>
    </CTextField>

    <CTextField
      v-model="password"
      :type="showPwd ? 'text' : 'password'"
      label="Password"
      preset="input.deepPurple"
    >
      <template #prepend>
        <CIcon name="fas:lock" :size="16" source="fa" />
      </template>
      <template #append>
        <CIcon
          :name="showPwd ? 'fas:eye-slash' : 'fas:eye'"
          :size="16"
          source="fa"
          style="cursor:pointer"
          @click="showPwd = !showPwd"
        />
      </template>
    </CTextField>

    <CTextField v-model="phone" label="Phone" preset="input.teal">
      <template #prepend>
        <CIcon name="fas:phone" :size="16" source="fa" />
      </template>
    </CTextField>

    <CTextField v-model="location" label="Location" preset="input.orange">
      <template #prepend>
        <CIcon name="fas:map-marker-alt" :size="16" source="fa" />
      </template>
    </CTextField>

    <CTextField v-model="amount" label="Amount" type="number" preset="input.green">
      <template #prepend>
        <CIcon name="fas:dollar-sign" :size="16" source="fa" />
      </template>
    </CTextField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const location = ref('')
const amount = ref('')
const showPwd = ref(false)
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
