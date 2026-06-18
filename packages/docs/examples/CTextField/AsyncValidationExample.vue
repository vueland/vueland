<template>
  <div class="ex-wrap">
    <CTextField
      v-model="username"
      label="Username"
      :rules="usernameRules"
      validate-on="blur"
      preset="input.indigo"
    >
      <template #prepend><CIcon name="fas:at" :size="16" source="fa" /></template>
      <template #details="{ errorMessage, hasError, validating }">
        <span v-if="validating" style="color:var(--c-app-primary-color)">
          Checking availability…
        </span>
        <span v-else-if="hasError" style="color:var(--c-app-error-color)">
          {{ errorMessage }}
        </span>
        <span v-else-if="username.length >= 3" style="color:#4caf50">
          ✓ Username is available
        </span>
        <span v-else style="opacity:.6">Min 3 characters, must be unique</span>
      </template>
    </CTextField>

    <CTextField
      v-model="email"
      label="Email"
      :rules="emailRules"
      validate-on="blur"
      preset="input.blue"
    >
      <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
      <template #details="{ errorMessage, hasError, validating }">
        <span v-if="validating" style="color:var(--c-app-primary-color)">
          Verifying email…
        </span>
        <span v-else-if="hasError" style="color:var(--c-app-error-color)">
          {{ errorMessage }}
        </span>
        <span v-else style="opacity:.6">We'll send a verification link</span>
      </template>
    </CTextField>

    <p class="ex-hint">
      Try: <code>admin</code>, <code>user</code>, <code>root</code> (taken) or <code>test@taken.com</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const email = ref('')

const takenUsernames = ['admin', 'user', 'root', 'vueland']
const takenEmails = ['test@taken.com', 'admin@example.com']

const usernameRules = [
  (v: string) => ({ valid: v.length >= 3, message: 'Minimum 3 characters' }),
  async (v: string) => {
    await new Promise(r => setTimeout(r, 700))
    return { valid: !takenUsernames.includes(v.toLowerCase()), message: `"${v}" is already taken` }
  },
]

const emailRules = [
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email format' }),
  async (v: string) => {
    await new Promise(r => setTimeout(r, 600))
    return { valid: !takenEmails.includes(v.toLowerCase()), message: 'This email is already registered' }
  },
]
</script>

<style scoped>
.ex-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  max-width: 400px;
}
.ex-hint {
  font-size: 13px;
  opacity: .6;
  margin: 4px 0 0;
}
</style>
