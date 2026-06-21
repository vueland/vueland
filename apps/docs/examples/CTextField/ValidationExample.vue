<template>
  <div class="ex-wrap">
    <CTextField
      v-model="email"
      label="Email"
      :rules="emailRules"
      validate-on="blur"
      details="We'll never share your email"
      preset="input.blue"
    >
      <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
    </CTextField>

    <CTextField
      v-model="password"
      :type="showPwd ? 'text' : 'password'"
      label="Password"
      :rules="passwordRules"
      validate-on="blur"
      preset="input.deepPurple"
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

    <CTextField
      v-model="phone"
      label="Phone"
      :rules="phoneRules"
      validate-on="blur"
      preset="input.teal"
    >
      <template #prepend><CIcon name="fas:phone" :size="16" source="fa" /></template>
    </CTextField>

    <div class="ex-actions">
      <CBtn class="bg-blue elevation-1" style="color:#fff" @click="submit">Submit</CBtn>
      <CBtn variant="text" @click="reset">Reset</CBtn>
    </div>
    <p v-if="submitted" class="ex-success">✓ Submitted successfully!</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const phone = ref('')
const submitted = ref(false)
const showPwd = ref(false)

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Password is required' }),
  (v: string) => ({ valid: v.length >= 8, message: 'Minimum 8 characters' }),
  (v: string) => ({ valid: /[A-Z]/.test(v), message: 'At least one uppercase letter' }),
]
const phoneRules = [
  (v: string) => ({ valid: !!v, message: 'Phone is required' }),
  (v: string) => ({ valid: /^\+?[\d\s\-()]{7,}$/.test(v), message: 'Invalid phone number' }),
]

function submit() { submitted.value = true }
function reset() {
  email.value = ''
  password.value = ''
  phone.value = ''
  submitted.value = false
}
</script>

<style scoped>
.ex-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  max-width: 420px;
}
.ex-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.ex-success {
  color: #4caf50;
  font-weight: 500;
  margin: 0;
}
</style>
