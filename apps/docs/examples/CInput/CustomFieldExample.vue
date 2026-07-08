<script setup lang="ts">
    import { ref } from 'vue'

    const search = ref('')
    const bio = ref('')
    const bioRules = [
        (v: string) => ({ valid: v.length <= 200, message: 'Maximum 200 characters' }),
    ]
</script>

<template>
    <div class="max-w-full">
        <c-row class="gap-y-2">
            <c-col
                cols="6"
                offset="3"
            >
                <!-- Search bar -->
                <c-input v-model="search">
                    <template #field="field">
                        <div
                            class="search-bar"
                            :class="{ 'search-bar--focused': field.focused }"
                        >
                            <svg
                                class="search-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="8"
                                />
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
                            <kbd
                                v-if="!search"
                                class="search-kbd"
                            >⌘K</kbd>
                            <button
                                v-else
                                class="search-clear"
                                @click="search = ''"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    width="14"
                                    height="14"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </template>
                </c-input>
            </c-col>

            <c-col
                cols="6"
                offset="3"
            >
                <!-- Textarea with counter -->
                <c-input
                    v-model="bio"
                    :rules="bioRules"
                    validate-on="input"
                >
                    <template #field="field">
                        <div
                            class="rich-textarea"
                            :class="{ 'rich-textarea--focused': field.focused, 'rich-textarea--error': field.hasError }"
                        >
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
                                    :style="{ color: field.hasError ? 'var(--c-sys-color-error)' : '' }"
                                >
                                    {{ field.hasError ? 'Maximum 200 characters' : 'Markdown supported' }}
                                </span>
                            </div>
                        </div>
                    </template>
                </c-input>
            </c-col>
        </c-row>
    </div>
</template>

<style scoped lang="scss">
/* ---- OTP ---- */
.otp-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.otp-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-sys-color-on-surface);
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
  border: 1.5px solid var(--c-sys-color-outline-variant);
  border-radius: 10px;
  background: var(--c-sys-color-surface);
  color: var(--c-sys-color-on-surface);
  outline: none;
  transition: border-color .15s, box-shadow .15s;
  caret-color: transparent;
}
.otp-cell:focus {
  border-color: var(--c-sys-color-primary);
  box-shadow: 0 0 0 3px var(--c-sys-state-focus-color);
}
.otp-cell--filled {
  border-color: var(--c-sys-color-primary);
  background: var(--c-sys-state-hover-color);
}
.otp-cell--error {
  border-color: var(--c-sys-color-error) !important;
}
.otp-hint {
  font-size: 12px;
  color: var(--c-sys-color-on-surface-variant);
  transition: color .15s;
}

/* ---- Search ---- */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 44px;
  width: 100%;
  border-radius: 999px;
  border: 1.5px solid var(--c-sys-color-outline-variant);
  background: var(--c-sys-color-surface);
  transition: border-color .15s, box-shadow .15s;
}

.search-bar--focused {
  border-color: var(--c-sys-color-primary);
  box-shadow: 0 0 0 3px var(--c-sys-state-focus-color);
}

.search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--c-sys-color-on-surface-variant);
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--c-sys-color-on-surface);
  font-size: 14px;
}
.search-input::placeholder {
  color: var(--c-sys-color-on-surface-variant);
}
.search-kbd {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--c-sys-color-outline-variant);
  color: var(--c-sys-color-on-surface-variant);
  background: var(--c-sys-color-surface-variant);
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
  background: var(--c-sys-color-surface-variant);
  border-radius: 50%;
  cursor: pointer;
  color: var(--c-sys-color-on-surface-variant);
  flex-shrink: 0;
}

/* ---- Rich textarea ---- */
.rich-textarea {
  border: 1.5px solid var(--c-sys-color-outline-variant);
  border-radius: 12px;
  width: 100%;
  background: var(--c-sys-color-surface);
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.rich-textarea--focused {
  border-color: var(--c-sys-color-primary);
  box-shadow: 0 0 0 3px var(--c-sys-state-focus-color);
}
.rich-textarea--error {
  border-color: var(--c-sys-color-error);
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
  color: var(--c-sys-color-on-surface-variant);
}
.rich-textarea__counter {
  font-size: 11px;
  color: var(--c-sys-color-on-surface-variant);
  transition: color .15s;
}
.rich-textarea__counter--warn { color: var(--c-sys-color-warning); }
.rich-textarea__counter--error { color: var(--c-sys-color-error); }
.rich-textarea__input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 4px 14px;
  background: transparent;
  color: var(--c-sys-color-on-surface);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.6;
}
.rich-textarea__input::placeholder { color: var(--c-sys-color-on-surface-variant); }
.rich-textarea__footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 14px 10px;
  border-top: 1px solid var(--c-sys-color-outline-variant);
  background: var(--c-sys-color-surface-variant);
}
.rich-textarea__hint {
  font-size: 11px;
  color: var(--c-sys-color-on-surface-variant);
  transition: color .15s;
}
</style>
