<template>
  <div class="example-wrap example-grid">
    <!-- CInput as base for a PIN input -->
    <CInput
      v-model="pin"
      id="custom-pin"
      label="PIN code"
      kind="input"
      :rules="pinRules"
      validate-on="blur"
    >
      <template #field="field">
        <div class="custom-pin-field" :class="{ 'has-error': field.hasError }">
          <label :for="field.uid" class="custom-pin-label">PIN code</label>
          <input
            v-bind="field.attrs"
            :id="field.uid"
            type="password"
            maxlength="4"
            inputmode="numeric"
            placeholder="••••"
            class="custom-pin-input"
            :value="pin"
            @input="(e: any) => { pin = e.target.value; field.input(e.target.value) }"
            @focus="field.focus"
            @blur="field.blur"
          />
        </div>
      </template>
      <template #details="{ errorMessage, hasError }">
        <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit', opacity: hasError ? 1 : .6 }">
          {{ errorMessage || '4-digit PIN' }}
        </span>
      </template>
    </CInput>

    <!-- CInput with textarea -->
    <CInput
      v-model="bio"
      id="custom-bio"
      label="Bio"
      kind="area"
      :rules="bioRules"
      validate-on="input"
      details="Tell us about yourself"
    >
      <template #field="field">
        <div class="custom-textarea-wrap">
          <label :for="field.uid">Bio</label>
          <textarea
            v-bind="field.attrs"
            :id="field.uid"
            rows="3"
            placeholder="Write something…"
            class="custom-textarea"
            :value="bio"
            @input="(e: any) => { bio = e.target.value; field.input(e.target.value) }"
            @focus="field.focus"
            @blur="field.blur"
          />
          <span class="custom-textarea-count">{{ bio.length }}/200</span>
        </div>
      </template>
    </CInput>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const bio = ref('')

const pinRules = [
  (v: string) => ({ valid: /^\d{4}$/.test(v), message: 'Enter a 4-digit PIN' }),
]

const bioRules = [
  (v: string) => ({ valid: v.length <= 200, message: 'Maximum 200 characters' }),
]
</script>

<style scoped>
.custom-pin-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid var(--c-app-border-color);
  border-radius: var(--c-app-border-radius);
  transition: border-color 0.2s;
}
.custom-pin-field:focus-within {
  border-color: var(--c-app-primary-color);
}
.custom-pin-field.has-error {
  border-color: var(--c-app-error-color);
}
.custom-pin-label {
  font-size: 12px;
  opacity: .6;
}
.custom-pin-input {
  outline: none;
  border: none;
  background: transparent;
  font-size: 18px;
  letter-spacing: 4px;
  width: 100%;
  color: var(--c-app-text-color);
}

.custom-textarea-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid var(--c-app-border-color);
  border-radius: var(--c-app-border-radius);
  transition: border-color 0.2s;
  position: relative;
}
.custom-textarea-wrap:focus-within {
  border-color: var(--c-app-primary-color);
}
.custom-textarea-wrap label {
  font-size: 12px;
  opacity: .6;
}
.custom-textarea {
  outline: none;
  border: none;
  background: transparent;
  resize: none;
  width: 100%;
  color: var(--c-app-text-color);
  font-family: inherit;
}
.custom-textarea-count {
  font-size: 11px;
  opacity: .5;
  text-align: right;
}
</style>
