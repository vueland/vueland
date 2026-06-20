<template>
  <div class="d-flex justify-center pa-6">
    <CCard class="elevation-2 form-card">
      <div class="form-header d-flex align-center gap-3 px-6 py-5">
        <div class="header-icon">
          <CIcon name="fas:user" :size="18" source="fa" />
        </div>
        <div>
          <div class="fs-lg fw-bold">Create Account</div>
          <div class="fs-sm" style="opacity:.5">Fill in your details below</div>
        </div>
      </div>

      <CCardBody class="px-6 pb-6 pt-5">
        <CForm ref="formRef">
          <template #default="{ validate }">
            <div class="d-flex flex-col gap-4">
              <CTextField
                v-model="form.username"
                label="Username"
                :rules="usernameRules"
                validate-on="blur"
                preset="input.blue"
              >
                <template #prepend>
                  <CIcon name="fas:at" :size="14" source="fa" />
                </template>
                <template #details="{ errorMessage, hasError, validating }">
                  <span v-if="validating" class="text-blue fs-sm">Checking availability…</span>
                  <span v-else-if="hasError" class="text-red fs-sm">{{ errorMessage }}</span>
                  <span v-else-if="form.username.length >= 3" class="text-green fs-sm">✓ Available</span>
                  <span v-else class="fs-sm" style="opacity:.5">Letters, numbers and underscore</span>
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
                <template #prepend>
                  <CIcon name="fas:envelope" :size="14" source="fa" />
                </template>
              </CTextField>

              <CTextField
                v-model="form.password"
                type="password"
                label="Password"
                :rules="passwordRules"
                validate-on="blur"
                preset="input.blue"
              >
                <template #prepend>
                  <CIcon name="fas:key" :size="14" source="fa" />
                </template>
              </CTextField>

              <div class="d-flex align-center gap-3 mt-2">
                <CBtn class="btn-primary" :disabled="loading" @click="() => handleSubmit(validate)">
                  {{ loading ? 'Creating account…' : 'Register' }}
                </CBtn>
              </div>

              <div v-if="success" class="d-flex align-center gap-2 text-green fw-semi-bold fs-sm">
                <CIcon name="fas:check" :size="13" source="fa" />
                Account created for {{ form.email }}!
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
    await new Promise((r) => setTimeout(r, 600))
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
  (v: string) => ({ valid: /\d/.test(v), message: 'At least one digit' }),
]

async function handleSubmit(validate: () => Promise<boolean>) {
  loading.value = true
  const valid = await validate()
  if (valid) {
    await new Promise((r) => setTimeout(r, 800))
    success.value = true
  }
  loading.value = false
}
</script>

<style scoped>
.form-card { max-width: 400px; width: 100%; }

.form-header { border-bottom: 1px solid var(--vp-c-divider, #e5e5e5); }

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff;
  flex-shrink: 0;
  line-height: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff !important;
  font-weight: 600;
  padding: 0 24px;
}
</style>
