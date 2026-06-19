# CTextField

`CTextField` is the primary text input component. Built on top of [`CInput`](/en/components/CInput), it provides a fully styled, accessible, and validatable `<input>` with a floating label, icon slots, hint text, and theme support.

<script setup>
import BasicExample from '../../examples/CTextField/BasicExample.vue'
import StatesExample from '../../examples/CTextField/StatesExample.vue'
import ValidationExample from '../../examples/CTextField/ValidationExample.vue'
import SlotsExample from '../../examples/CTextField/SlotsExample.vue'
import AsyncValidationExample from '../../examples/CTextField/AsyncValidationExample.vue'
import PresetsExample from '../../examples/CTextField/PresetsExample.vue'
</script>

## Usage

<BasicExample />

::: details Show code
```vue
<template>
  <CTextField
    v-model="value"
    id="basic-email"
    label="Email"
    placeholder="Enter your email"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>
```
:::

## States

`CTextField` supports all standard states: default, `disabled`, `readonly`, and `clearable`.

<StatesExample />

::: details Show code
```vue
<template>
  <CTextField v-model="value" label="Default" />
  <CTextField v-model="value" label="Disabled" disabled />
  <CTextField v-model="readonly" label="Readonly" readonly />
  <CTextField v-model="value" label="Clearable" clearable />
</template>
```
:::

## Validation

Pass an array of rule functions via the `rules` prop. Each rule receives the current value and returns `{ valid: boolean, message: string }`. Use `validate-on` to control when validation fires: `'input'` (default) or `'blur'`.

<ValidationExample />

::: details Show code
```vue
<template>
  <CTextField
    v-model="email"
    label="Email"
    :rules="emailRules"
    validate-on="blur"
    details="We'll never share your email"
  />
  <CTextField
    v-model="password"
    label="Password"
    type="password"
    :rules="passwordRules"
    validate-on="blur"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]

const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Password is required' }),
  (v: string) => ({ valid: v.length >= 8, message: 'Minimum 8 characters' }),
]
</script>
```
:::

## Prepend, append and details slots

The `prepend` and `append` slots place content inside the field borders. The `details` slot fully replaces the hint/error area.

<SlotsExample />

::: details Show code
```vue
<template>
  <!-- Prepend icon -->
  <CTextField v-model="search" label="Search">
    <template #prepend>
      <CIcon name="mdi-magnify" />
    </template>
  </CTextField>

  <!-- Append text -->
  <CTextField v-model="amount" label="Amount" type="number">
    <template #append>
      <span style="opacity: .6; font-size: 13px">USD</span>
    </template>
  </CTextField>

  <!-- Custom details slot -->
  <CTextField
    v-model="nickname"
    label="Nickname"
    :rules="nicknameRules"
    validate-on="input"
  >
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
        {{ errorMessage || `${nickname.length}/20 characters` }}
      </span>
    </template>
  </CTextField>
</template>
```
:::

## Async validation

Rules may return a `Promise`. While validation is in progress, the `details` slot receives `validating: true`.

<AsyncValidationExample />

::: details Show code
```vue
<template>
  <CTextField
    v-model="username"
    label="Username"
    :rules="usernameRules"
    validate-on="blur"
  >
    <template #details="{ errorMessage, hasError, validating }">
      <span v-if="validating" style="color: var(--c-app-primary-color)">
        Checking availability…
      </span>
      <span v-else-if="hasError" style="color: var(--c-app-error-color)">
        {{ errorMessage }}
      </span>
      <span v-else style="opacity: .6">Must be unique</span>
    </template>
  </CTextField>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const taken = ['admin', 'user', 'root']

const usernameRules = [
  (v: string) => ({ valid: v.length >= 3, message: 'Minimum 3 characters' }),
  async (v: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { valid: !taken.includes(v.toLowerCase()), message: `"${v}" is already taken` }
  },
]
</script>
```
:::

## Presets

Presets let you define the field's appearance (label color, border) once during plugin initialization and reuse by name via the `preset` prop.

<PresetsExample />

::: details Show code
```vue
<template>
  <CTextField v-model="value" label="Email" preset="input.blue">
    <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
  </CTextField>
</template>
```
:::

Register presets when initializing the plugin:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

createVuelandUI({
  presets: {
    input: {
      blue: {
        root:    ['text-blue'],
        focused: { label: ['text-blue'] },
        filled:  { label: ['text-blue'] },
        error:   { root: ['text-red'] },
      } satisfies CInputPreset,
    },
  },
})
```

### CInputPreset structure

```ts
type Zone = { root?: string[]; label?: string[]; input?: string[]; details?: string[] }

// error / disabled / readonly support nested compound states
type CompoundState = Zone & {
  focused?: Zone   // active when primary state + focused simultaneously
  filled?:  Zone   // active when primary state + filled simultaneously
}

type CInputPreset = Zone & {
  focused?:   Zone
  filled?:    Zone
  error?:     CompoundState
  disabled?:  CompoundState
  readonly?:  CompoundState
  prepended?: Zone
  appended?:  Zone
}
```

Internally the preset is split automatically: `root` and `details` are applied at the `CInput` level, while `label` and `input` are forwarded to `CField`.

**Compound states** let you style combinations of two simultaneous states. For example, to change the label color when a field has both an error _and_ focus:

```ts
const myPreset: CInputPreset = {
  label: ['text-blue'],
  error: {
    label: ['text-red'],
    focused: {
      label: ['text-red', 'font-bold'],  // error + focused at the same time
    },
  },
}
```

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | `undefined` | Field value (v-model) |
| `id` | `string` | auto | `<input>` id. Auto-generated with prefix `input-` if omitted |
| `label` | `string` | — | Floating label text |
| `placeholder` | `string` | — | Native `<input>` placeholder (attr) |
| `details` | `string` | — | Hint text shown below the field |
| `noDetails` | `boolean` | `false` | Hide the details area entirely |
| `clearable` | `boolean` | `false` | Show a clear button when the field has a value and is focused |
| `disabled` | `boolean` | `false` | Disable the field. Blocks focus and input |
| `readonly` | `boolean` | `false` | Read-only. Focus is allowed, editing is not |
| `focused` | `boolean` | `false` | Initial focused state |
| `rules` | `ValidateFn[]` | `[]` | Array of validation functions |
| `validateOn` | `'input' \| 'blur'` | `'input'` | When to trigger automatic validation |
| `preset` | `string` | — | Preset name from Vueland UI configuration |
| `type` | `string` | `'text'` | Native `<input>` type (passed as attr) |
| `name` | `string` | — | Native `<input>` name attr |
| `autocomplete` | `string` | — | Native `<input>` autocomplete attr |
| `required` | `boolean` | — | Native `<input>` required attr |
| `inputmode` | `string` | — | Native `<input>` inputmode attr |
| `pattern` | `string` | — | Native `<input>` pattern attr |
| `maxlength` | `number` | — | Native `<input>` maxlength attr |
| `minlength` | `number` | — | Native `<input>` minlength attr |
| `min` | `number` | — | Min value for `type="number"` |
| `max` | `number` | — | Max value for `type="number"` |
| `step` | `number` | — | Step for `type="number"` |
| `tabindex` | `number` | — | Native `<input>` tabindex attr |
| `enterkeyhint` | `string` | — | Mobile keyboard Enter button label |
| `aria-label` | `string` | — | Additional aria label (attr) |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `prepend` | — | Content placed on the left inside the field border |
| `append` | — | Content placed on the right inside the field border |
| `details` | `CInputDetailsSlotProps` | Replaces the entire hint/error area |

#### `details` slot props

| Prop | Type | Description |
|------|------|-------------|
| `errorMessage` | `string \| undefined` | Current error message |
| `hasError` | `boolean` | Whether there is an active error |
| `validating` | `boolean` | Whether async validation is currently running |
| `uid` | `string` | Field ID (matches the native `<input>` id) |
| `details` | `string \| undefined` | The value of the `details` prop |

### Events

| Event | Arguments | Description |
|-------|-----------|-------------|
| `update:modelValue` | `string \| number \| undefined` | Value changed (v-model) |
| `focus` | — | Field received focus |
| `blur` | — | Field lost focus |

### Expose

Methods available via template ref:

| Method | Signature | Description |
|--------|-----------|-------------|
| `validate` | `() => Promise<boolean>` | Trigger validation manually |
| `reset` | `() => void` | Clear the error state |
| `focus` | `() => void` | Programmatically focus the field |
| `blur` | `() => void` | Programmatically remove focus |

```vue
<template>
  <CTextField ref="fieldRef" v-model="value" label="Name" :rules="rules" />
  <CBtn @click="fieldRef?.validate()">Validate</CBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const fieldRef = ref()
const value = ref('')
const rules = [(v: string) => ({ valid: !!v, message: 'Required' })]
</script>
```

### ValidateFn type

```ts
type ValidateResult = { valid: boolean; message: string }
type ValidateFn = (value: any) => ValidateResult | Promise<ValidateResult>
```

---

## CSS variables

### CInput (root element)

| Variable | Default | Description |
|----------|---------|-------------|
| `--c-input-background-color` | `var(--c-app-surface-color)` | Component background |
| `--c-input-primary-color` | `var(--c-app-primary-color)` | Text color in default state |
| `--c-input-error-color` | `var(--c-app-error-color)` | Text color on error |
| `--c-input-disabled-color` | `var(--c-app-disabled-color)` | Text color when disabled |
| `--c-input-readonly-color` | `var(--c-app-primary-color)` | Text color when readonly |
| `--c-input-readonly-bg-color` | `grey lighten-4` | Field background when readonly |
| `--c-input-field-border-radius` | `var(--c-app-border-radius)` | Field border radius |
| `--c-input-details-height` | `24px` | Height of the details area |

### CField (border and label)

| Variable | Default | Description |
|----------|---------|-------------|
| `--c-field-border-color` | `var(--c-app-border-color, #e5e5e5)` | Border color |
| `--c-field-disabled-opacity` | `0.5` | Opacity when disabled |

### Override example

```vue
<CTextField
  v-model="value"
  label="Custom styled"
  style="
    --c-input-primary-color: #7c3aed;
    --c-field-border-color: #ddd6fe;
  "
/>
```

---

## State CSS classes

| Class | Condition |
|-------|-----------|
| `c-input--default` | No error, not disabled, not readonly |
| `c-input--focused` | Field is focused |
| `c-input--has-error` | Validation error is active |
| `c-input--disabled` | `disabled = true` |
| `c-input--readonly` | `readonly = true` |
| `c-input--clearable` | `clearable = true` |
| `c-input--validating` | Async validation is running |
| `c-field--focused` | Border is focused |
| `c-field--filled` | Field has a value (label is raised) |
| `c-field--disabled` | Border disabled |
| `c-field--readonly` | Border readonly (dashed) |
| `c-field--has-prepend` | prepend slot is present |
