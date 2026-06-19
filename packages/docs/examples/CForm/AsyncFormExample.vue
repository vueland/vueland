<template>
  <div class="ex-wrap">
    <CCard class="elevation-3" style="max-width: 420px">
      <CCardHeader class="bg-teal pa-6 d-flex align-center" style="gap: 12px; color: #fff">
        <CIcon name="fas:user" :size="28" source="fa" />
        <span style="font-size: 20px; font-weight: 600">Create Account</span>
      </CCardHeader>

      <CCardBody class="pa-6">
        <CForm ref="formRef">
          <template #default="{ validate }">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <CTextField
                v-model="form.username"
                label="Username"
                :rules="usernameRules"
                validate-on="blur"
                preset="input.teal"
              >
                <template #prepend><CIcon name="fas:at" :size="16" source="fa" /></template>
                <template #details="{ errorMessage, hasError, validating }">
                  <span v-if="validating" style="color:var(--c-app-primary-color)">Checking…</span>
                  <span v-else-if="hasError" style="color:var(--c-app-error-color)">{{ errorMessage }}</span>
                  <span v-else-if="form.username.length >= 3" class="text-green">✓ Available</span>
                  <span v-else style="opacity:.6">Letters and numbers only</span>
                </template>
              </CTextField>

              <CTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="emailRules"
                validate-on="blur"
                preset="input.blue"
              >
                <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
              </CTextField>

              <CTextField
                v-model="form.password"
                type="password"
                label="Password"
                :rules="passwordRules"
                validate-on="blur"
                preset="input.deepPurple"
              >
                <template #prepend><CIcon name="fas:key" :size="16" source="fa" /></template>
              </CTextField>

              <div class="mt-2">
                <CBtn class="bg-teal elevation-1" style="color:#fff" :disabled="loading" @click="() => handleSubmit(validate)">
                  {{ loading ? 'Creating account…' : 'Register' }}
                </CBtn>
              </div>

              <div v-if="success" class="d-flex align-center mt-2 text-green" style="gap: 6px; font-weight: 500">
                <CIcon name="fas:check" :size="14" source="fa" />
                Account created for <strong>{{ form.email }}</strong>!
              </div>
            </div>
          </template>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const loading = ref(false)
const success = ref(false)

const form = ref({ username: '', email: '', password: '' })

const takenUsernames = ['admin', 'root', 'vueland', 'user']

const usernameRules = [
  (v: string) => ({ valid: /^[a-zA-Z0-9_]{3,}$/.test(v), message: 'Min 3 chars, letters/numbers/underscore' }),
  async (v: string) => {
    await new Promise(r => setTimeout(r, 600))
    return { valid: !takenUsernames.includes(v.toLowerCase()), message: `"${v}" is already taken` }
  },
]
const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const passwordRules = [
  (v: string) => ({ valid: v.length >= 8, message: 'Minimum 8 characters' }),
  (v: string) => ({ valid: /[A-Z]/.test(v), message: 'At least one uppercase letter' }),
  (v: string) => ({ valid: /\d/.test(v), message: 'At least one number' }),
]

async function handleSubmit(validate: () => Promise<boolean>) {
  loading.value = true
  const valid = await validate()
  if (valid) {
    await new Promise(r => setTimeout(r, 800))
    success.value = true
  }
  loading.value = false
}
</script>

<style scoped>
.ex-wrap {
  padding: 24px;
  display: flex;
  justify-content: center;
}
</style>
