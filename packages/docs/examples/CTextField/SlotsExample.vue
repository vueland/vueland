<template>
  <div class="ex-grid">
    <!-- Prepend icon -->
    <CTextField v-model="search" label="Search" clearable preset="input.blue">
      <template #prepend>
        <CIcon name="fas:search" :size="16" source="fa" />
      </template>
    </CTextField>

    <!-- Prepend text prefix -->
    <CTextField v-model="username" label="Username" preset="input.deepPurple">
      <template #prepend>
        <span class="prefix">@</span>
      </template>
    </CTextField>

    <!-- Append icon -->
    <CTextField v-model="github" label="GitHub profile">
      <template #append>
        <CIcon name="fab:github" :size="18" source="fa" />
      </template>
    </CTextField>

    <!-- Append text suffix -->
    <CTextField v-model="amount" label="Amount" type="number" preset="input.green">
      <template #append>
        <span class="suffix">USD</span>
      </template>
    </CTextField>

    <!-- Custom details slot -->
    <CTextField
      v-model="nickname"
      label="Nickname"
      :rules="nicknameRules"
      validate-on="input"
      preset="input.orange"
    >
      <template #prepend>
        <CIcon name="fas:hashtag" :size="16" source="fa" />
      </template>
      <template #details="{ errorMessage, hasError }">
        <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
          {{ errorMessage || `${nickname.length}/20 characters` }}
        </span>
      </template>
    </CTextField>

    <!-- Prepend + Append -->
    <CTextField v-model="promo" label="Promo code" preset="input.pink">
      <template #prepend>
        <CIcon name="fas:percent" :size="16" source="fa" />
      </template>
      <template #append>
        <CIcon name="fas:check" :size="16" source="fa" style="color:var(--c-app-success-color, #4caf50)" />
      </template>
    </CTextField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const username = ref('')
const github = ref('')
const amount = ref('')
const nickname = ref('')
const promo = ref('SAVE20')

const nicknameRules = [
  (v: string) => ({ valid: v.length <= 20, message: 'Max 20 characters' }),
]
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
.prefix, .suffix {
  font-size: 13px;
  opacity: .6;
  padding: 0 4px;
}
</style>
