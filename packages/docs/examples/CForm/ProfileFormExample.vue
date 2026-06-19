<template>
  <div class="ex-wrap">
    <CCard class="elevation-3" style="max-width: 520px; width: 100%">
      <CCardHeader class="bg-indigo pa-6 d-flex align-center" style="gap: 12px; color: #fff">
        <CIcon name="fas:user-circle" :size="28" source="fa" />
        <span style="font-size: 18px; font-weight: 600">Edit Profile</span>
      </CCardHeader>

      <CCardBody class="pa-6">
        <CForm ref="formRef">
          <template #default="{ validate }">
            <div class="form-grid">
              <CTextField
                v-model="form.firstName"
                label="First name"
                :rules="requiredRule"
                validate-on="blur"
                preset="input.indigo"
              />
              <CTextField
                v-model="form.lastName"
                label="Last name"
                :rules="requiredRule"
                validate-on="blur"
                preset="input.indigo"
              />

              <div class="form-full">
                <CTextField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :rules="emailRules"
                  validate-on="blur"
                  preset="input.indigo"
                >
                  <template #prepend>
                    <CIcon name="fas:envelope" :size="14" source="fa" />
                  </template>
                </CTextField>
              </div>

              <div class="form-full">
                <CTextField
                  v-model="form.phone"
                  label="Phone"
                  type="tel"
                  :rules="phoneRules"
                  validate-on="blur"
                  preset="input.indigo"
                >
                  <template #prepend>
                    <CIcon name="fas:phone" :size="14" source="fa" />
                  </template>
                </CTextField>
              </div>

              <div class="form-full">
                <CTextField
                  v-model="form.website"
                  label="Website"
                  validate-on="blur"
                  preset="input.indigo"
                >
                  <template #prepend>
                    <CIcon name="fas:globe" :size="14" source="fa" />
                  </template>
                </CTextField>
              </div>

              <div class="form-full readonly-block">
                <CTextField
                  v-model="form.username"
                  label="Username"
                  readonly
                  preset="input.indigo"
                >
                  <template #prepend>
                    <CIcon name="fas:at" :size="14" source="fa" />
                  </template>
                  <template #details>
                    <span style="opacity: .6; font-size: 12px">Username cannot be changed</span>
                  </template>
                </CTextField>
              </div>

              <div class="form-actions">
                <CBtn
                  class="bg-indigo elevation-1"
                  style="color: #fff"
                  :disabled="saving"
                  @click="() => handleSave(validate)"
                >
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </CBtn>
                <CBtn variant="text" @click="handleReset">Cancel</CBtn>
              </div>

              <div v-if="saved" class="form-full success-msg text-green">
                <CIcon name="fas:check" :size="13" source="fa" />
                Profile updated successfully
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
const saving = ref(false)
const saved = ref(false)

const form = ref({
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  phone: '',
  website: '',
  username: 'alexjohnson',
})

const original = { ...form.value }

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]

const phoneRules = [
  (v: string) => ({
    valid: !v || /^\+?[\d\s\-()]{7,}$/.test(v),
    message: 'Invalid phone number',
  }),
]

async function handleSave(validate: () => Promise<boolean>) {
  saved.value = false
  saving.value = true
  const valid = await validate()
  if (valid) {
    await new Promise((r) => setTimeout(r, 700))
    saved.value = true
  }
  saving.value = false
}

function handleReset() {
  form.value = { ...original }
  saved.value = false
  formRef.value?.reset?.()
}
</script>

<style scoped>
.ex-wrap {
  padding: 24px;
  display: flex;
  justify-content: center;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.form-full {
  grid-column: 1 / -1;
}
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.success-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 13px;
}
.readonly-block :deep(.c-field--readonly) {
  opacity: 0.75;
}
@media (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
