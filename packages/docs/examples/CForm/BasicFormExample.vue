<template>
  <div class="ex-wrap">
    <CCard class="elevation-3" style="max-width: 400px">
      <CCardHeader class="bg-indigo pa-6 d-flex align-center" style="gap: 12px; color: #fff">
        <CIcon name="fas:user-circle" :size="32" source="fa" />
        <span style="font-size: 20px; font-weight: 600">Sign In</span>
      </CCardHeader>

      <CCardBody class="pa-6">
        <CForm ref="formRef" @submit.prevent="onSubmit">
          <template #default="{ validate }">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <CTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="emailRules"
                validate-on="blur"
              >
                <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
              </CTextField>

              <CTextField
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                label="Password"
                :rules="passwordRules"
                validate-on="blur"
              >
                <template #prepend><CIcon name="fas:lock" :size="16" source="fa" /></template>
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

              <div class="d-flex mt-2" style="gap: 8px">
                <CBtn class="bg-indigo elevation-1" style="color:#fff" @click="() => handleSubmit(validate)">
                  Sign in
                </CBtn>
                <CBtn variant="text" @click="handleReset">Reset</CBtn>
              </div>

              <p v-if="success" class="d-flex align-center mt-2 text-green" style="gap: 6px; font-weight: 500; margin: 0">
                <CIcon name="fas:check" :size="14" source="fa" /> Logged in as {{ form.email }}
              </p>
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
const success = ref(false)
const showPwd = ref(false)

const form = ref({ email: '', password: '' })

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Password is required' }),
  (v: string) => ({ valid: v.length >= 6, message: 'Minimum 6 characters' }),
]

async function handleSubmit(validate: () => Promise<boolean>) {
  if (await validate()) success.value = true
}

function handleReset() {
  form.value = { email: '', password: '' }
  success.value = false
}

function onSubmit() {}
</script>

<style scoped>
.ex-wrap {
  padding: 24px;
  display: flex;
  justify-content: center;
}
</style>
