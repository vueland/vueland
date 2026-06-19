<template>
  <div class="ex-grid">

    <!-- OTP input -->
    <CInput
      v-model="otp"
      kind="input"
      :rules="otpRules"
      validate-on="blur"
    >
      <template #field="field">
        <div class="otp-wrap" :class="{ 'otp-wrap--error': field.hasError }">
          <span class="otp-label">Verification code</span>
          <div class="otp-cells">
            <input
              v-for="(_, i) in 6"
              :key="i"
              :ref="el => { if (el) cellRefs[i] = el as HTMLInputElement }"
              class="otp-cell"
              :class="{ 'otp-cell--filled': otp[i], 'otp-cell--error': field.hasError }"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="otp[i] ?? ''"
              @focus="field.focus"
              @blur="field.blur"
              @keydown="(e) => onKeydown(e, i)"
              @input="(e) => onCellInput(e, i, field)"
              @paste="(e) => onPaste(e, field)"
            />
          </div>
          <span class="otp-hint" :style="{ color: field.hasError ? 'var(--c-app-error-color)' : '' }">
            {{ field.hasError ? 'Invalid code' : 'Enter the 6-digit code from your email' }}
          </span>
        </div>
      </template>
    </CInput>

    <!-- Search bar -->
    <CInput v-model="search" kind="input">
      <template #field="field">
        <div class="search-bar" :class="{ 'search-bar--focused': field.focused }">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-bind="field.attrs"
            class="search-input"
            placeholder="Search anything…"
            :value="search"
            @input="(e: any) => { search = e.target.value; field.input(e.target.value) }"
            @focus="field.focus"
            @blur="field.blur"
          />
          <kbd v-if="!search" class="search-kbd">⌘K</kbd>
          <button v-else class="search-clear" @click="search = ''">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>
    </CInput>

    <!-- Textarea with counter -->
    <CInput
      v-model="bio"
      kind="area"
      :rules="bioRules"
      validate-on="input"
    >
      <template #field="field">
        <div class="rich-textarea" :class="{ 'rich-textarea--focused': field.focused, 'rich-textarea--error': field.hasError }">
          <div class="rich-textarea__header">
            <span class="rich-textarea__label">About me</span>
            <span
              class="rich-textarea__counter"
              :class="{ 'rich-textarea__counter--warn': bio.length > 180, 'rich-textarea__counter--error': field.hasError }"
            >
              {{ bio.length }}/200
            </span>
          </div>
          <textarea
            v-bind="field.attrs"
            class="rich-textarea__input"
            placeholder="Tell the world something about yourself…"
            rows="4"
            :value="bio"
            @input="(e: any) => { bio = e.target.value; field.input(e.target.value) }"
            @focus="field.focus"
            @blur="field.blur"
          />
          <div class="rich-textarea__footer">
            <span
              class="rich-textarea__hint"
              :style="{ color: field.hasError ? 'var(--c-app-error-color)' : '' }"
            >
              {{ field.hasError ? 'Maximum 200 characters' : 'Markdown supported' }}
            </span>
          </div>
        </div>
      </template>
    </CInput>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const otp = ref('')
const search = ref('')
const bio = ref('')
const cellRefs = ref<HTMLInputElement[]>([])

const otpRules = [
  (v: string) => ({ valid: /^\d{6}$/.test(v), message: 'Invalid code' }),
]
const bioRules = [
  (v: string) => ({ valid: v.length <= 200, message: 'Maximum 200 characters' }),
]

function onCellInput(e: Event, index: number, field: any) {
  const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  const chars = otp.value.split('')
  chars[index] = val
  otp.value = chars.join('').slice(0, 6)
  field.input(otp.value)
  if (val && index < 5) cellRefs.value[index + 1]?.focus()
}

function onKeydown(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace' && !otp.value[index] && index > 0) {
    cellRefs.value[index - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent, field: any) {
  e.preventDefault()
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
  otp.value = digits
  field.input(digits)
  cellRefs.value[Math.min(digits.length, 5)]?.focus()
}
</script>

<style scoped>
.ex-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 480px;
}

/* ---- OTP ---- */
.otp-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.otp-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-app-text-color);
}
.otp-cells {
  display: flex;
  gap: 8px;
}
.otp-cell {
  width: 44px;
  height: 52px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  border: 1.5px solid var(--c-app-border-color);
  border-radius: 10px;
  background: var(--c-app-surface-color);
  color: var(--c-app-text-color);
  outline: none;
  transition: border-color .15s, box-shadow .15s;
  caret-color: transparent;
}
.otp-cell:focus {
  border-color: var(--c-app-primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-app-primary-color) 15%, transparent);
}
.otp-cell--filled {
  border-color: var(--c-app-primary-color);
  background: color-mix(in srgb, var(--c-app-primary-color) 6%, transparent);
}
.otp-cell--error {
  border-color: var(--c-app-error-color) !important;
}
.otp-hint {
  font-size: 12px;
  color: var(--c-app-text-secondary-color);
  transition: color .15s;
}

/* ---- Search ---- */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 44px;
  border-radius: 999px;
  border: 1.5px solid var(--c-app-border-color);
  background: var(--c-app-surface-color);
  transition: border-color .15s, box-shadow .15s;
}
.search-bar--focused {
  border-color: var(--c-app-primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-app-primary-color) 15%, transparent);
}
.search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--c-app-text-secondary-color);
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--c-app-text-color);
  font-size: 14px;
}
.search-input::placeholder {
  color: var(--c-app-text-secondary-color);
}
.search-kbd {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--c-app-border-color);
  color: var(--c-app-text-secondary-color);
  background: var(--c-app-surface-variant-color);
  font-family: inherit;
  white-space: nowrap;
}
.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: var(--c-app-surface-variant-color);
  border-radius: 50%;
  cursor: pointer;
  color: var(--c-app-text-secondary-color);
  flex-shrink: 0;
}

/* ---- Rich textarea ---- */
.rich-textarea {
  border: 1.5px solid var(--c-app-border-color);
  border-radius: 12px;
  background: var(--c-app-surface-color);
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.rich-textarea--focused {
  border-color: var(--c-app-primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-app-primary-color) 15%, transparent);
}
.rich-textarea--error {
  border-color: var(--c-app-error-color);
}
.rich-textarea__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 4px;
}
.rich-textarea__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-app-text-secondary-color);
}
.rich-textarea__counter {
  font-size: 11px;
  color: var(--c-app-text-secondary-color);
  transition: color .15s;
}
.rich-textarea__counter--warn { color: var(--c-app-warning-color); }
.rich-textarea__counter--error { color: var(--c-app-error-color); }
.rich-textarea__input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 4px 14px;
  background: transparent;
  color: var(--c-app-text-color);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.6;
}
.rich-textarea__input::placeholder { color: var(--c-app-text-secondary-color); }
.rich-textarea__footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 14px 10px;
  border-top: 1px solid var(--c-app-border-color);
  background: var(--c-app-surface-variant-color);
}
.rich-textarea__hint {
  font-size: 11px;
  color: var(--c-app-text-secondary-color);
  transition: color .15s;
}
</style>
