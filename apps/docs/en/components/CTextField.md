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
  <CTextField v-model="value" id="basic-email" label="Email" placeholder="Enter your email" />
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

If `modelValue` holds the displayed text and you need to validate a different value, pass it via the `validation-value` prop — rules receive it instead of `modelValue`. This is how `CSelect` validates the selected model rather than the string shown in the field.

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
  <CTextField v-model="nickname" label="Nickname" :rules="nicknameRules" validate-on="input">
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-sys-color-error)' : 'inherit' }">
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
  <CTextField v-model="username" label="Username" :rules="usernameRules" validate-on="blur">
    <template #details="{ errorMessage, hasError, validating }">
      <span v-if="validating" style="color: var(--c-sys-color-primary)">
        Checking availability…
      </span>
      <span v-else-if="hasError" style="color: var(--c-sys-color-error)">
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
    await new Promise((resolve) => setTimeout(resolve, 800))
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
        base: {
          field: {
            base: { label: ['text-blue'] },
            focused: { label: ['text-blue'], root: ['text-blue'] },
            filled: { label: ['text-blue'] },
            error: { label: ['text-red'] },
          },
        },
        error: { details: ['text-red'] },
      } satisfies CInputPreset,
    },
  },
})
```

### CInputPreset structure

A preset is a set of **snapshots keyed by state** — `base` plus optional per-state overrides. `CInput` owns the `root` and `details` zones, while the field preset (`CFieldPreset`) is composed in by value:

```ts
type CInputZone = 'root' | 'details'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

type CInputSnapshot = Partial<Record<CInputZone, string[]>> & {
  field?: CFieldPreset
  menu?: CMenuPreset
  list?: CListPreset
}

type CInputPreset = Partial<Record<'base' | CInputState, CInputSnapshot>>
```

The component is in a single current state, and that state's snapshot is applied — its zones replace `base` per-zone, no stacking and no priorities. See [CInput → Preset system](/en/components/CInput#preset-system) for the full model.

The preset is distributed automatically: `CInput` applies `root` and `details` and shares the set with the subtree via provide/inject; `CField` picks up the nested `field` preset from the `base` snapshot and resolves its own states (field `root`, `input`, `label`, `prepend`, `append`) itself.

---

## API

### Props

`CTextField` accepts [`CInput`](/en/components/CInput#props) props, including `label`, `details`, `clearable`, `disabled`, `readonly`, `focused`, `dirty`, `rules`, `validateOn`, `validationValue`, and `preset`.

`v-model` works with `string | number | null | undefined`.

### Native attributes

`CTextField` does **not** wrap `<input>` attributes in its own props. Thanks to `inheritAttrs`, any non-prop attribute falls through to the inner `<input>` as-is — so just use the standard HTML attributes directly:

```vue
<CTextField
  type="number"
  placeholder="0"
  :min="0"
  :max="100"
  :step="5"
  inputmode="numeric"
  maxlength="10"
  autocomplete="off"
  name="amount"
  required
/>
```

`pattern`, `minlength`, `tabindex`, `enterkeyhint` and any `data-*` / `aria-*` attributes fall through the same way. These are **not** documented as props — they are the standard native `<input>` contract.

### Slots

| Slot      | Props                    | Description                                         |
| --------- | ------------------------ | --------------------------------------------------- |
| `prepend` | —                        | Content placed on the left inside the field border  |
| `append`  | —                        | Content placed on the right inside the field border |
| `menu`    | `{ id: string }`         | Dropdown content associated with the field          |
| `details` | `CInputDetailsSlotProps` | Replaces the entire hint/error area                 |

#### `menu` slot props

| Prop | Type     | Description                                    |
| ---- | -------- | ---------------------------------------------- |
| `id` | `string` | Menu ID associated with the field (`uid-menu`) |

#### `details` slot props

| Prop           | Type                  | Description                                   |
| -------------- | --------------------- | --------------------------------------------- |
| `errorMessage` | `string \| undefined` | Current error message                         |
| `hasError`     | `boolean`             | Whether there is an active error              |
| `validating`   | `boolean`             | Whether async validation is currently running |
| `uid`          | `string`              | Field ID (matches the native `<input>` id)    |
| `details`      | `string \| undefined` | The value of the `details` prop               |

### Events

| Event               | Arguments                       | Description             |
| ------------------- | ------------------------------- | ----------------------- |
| `update:modelValue` | `string \| number \| undefined` | Value changed (v-model) |
| `focus`             | —                               | Field received focus    |
| `blur`              | —                               | Field lost focus        |

### Expose

Methods available via template ref:

| Method     | Signature                | Description                      |
| ---------- | ------------------------ | -------------------------------- |
| `validate` | `() => Promise<boolean>` | Trigger validation manually      |
| `reset`    | `() => void`             | Clear the error state            |
| `focus`    | `() => void`             | Programmatically focus the field |
| `blur`     | `() => void`             | Programmatically remove focus    |

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

| Variable                        | Default                               | Description                 |
| ------------------------------- | ------------------------------------- | --------------------------- |
| `--c-input-details-height`      | `var(--c-sys-control-height-sm)`      | Height of the details area  |
| `--c-input-transition-duration` | `var(--c-sys-motion-duration-medium)` | Color transition duration   |
| `--c-input-primary-color`       | `var(--c-sys-color-primary)`          | Text color in default state |
| `--c-input-error-color`         | `var(--c-sys-color-error)`            | Text color on error         |
| `--c-input-disabled-color`      | `var(--c-sys-color-disabled)`         | Text color when disabled    |
| `--c-input-readonly-color`      | `var(--c-sys-color-readonly)`         | Text color when readonly    |

### CField (border and label)

| Variable                         | Default                                 | Description                    |
| -------------------------------- | --------------------------------------- | ------------------------------ |
| `--c-field-min-height`           | `var(--c-sys-control-height-md)`        | Minimum field height           |
| `--c-field-prepend-min-width`    | `var(--c-sys-control-height-md)`        | Min width of the prepend zone  |
| `--c-field-append-min-width`     | `var(--c-sys-control-icon-size)`        | Min width of the append zone   |
| `--c-field-padding-inline`       | `var(--c-sys-control-padding-inline)`   | Horizontal field padding       |
| `--c-field-border-radius`        | `var(--c-sys-shape-md)`                 | Field border radius            |
| `--c-field-transition-duration`  | `var(--c-sys-motion-duration-medium)`   | Field transition duration      |
| `--c-field-density-offset`       | `var(--c-sys-density-scale)`            | Added height offset            |
| `--c-field-bg-color`             | `var(--c-sys-color-surface)`            | Field background               |
| `--c-field-focused-bg-color`     | `var(--c-sys-color-surface-bright)`     | Field background on focus      |
| `--c-field-disabled-bg-color`    | `var(--c-sys-color-surface-dim)`        | Field background when disabled |
| `--c-field-label-color`          | `var(--c-sys-color-primary)`            | Label color                    |
| `--c-field-focused-border-color` | `var(--c-sys-color-focus-ring)`         | Focus border color             |
| `--c-field-border-color`         | `var(--c-sys-color-outline)`            | Border color                   |
| `--c-field-border-width`         | `var(--c-sys-border-width-thin)`        | Border width                   |
| `--c-field-focused-border-width` | `var(--c-sys-border-width-medium)`      | Focus border width             |
| `--c-field-input-text-color`     | `var(--c-sys-color-on-surface)`         | Typed text color               |
| `--c-field-placeholder-color`    | `var(--c-sys-color-placeholder)`        | Placeholder color              |
| `--c-field-error-bg-color`       | `var(--c-sys-color-surface)`            | Field background on error      |
| `--c-field-error-text-color`     | `var(--c-sys-color-error)`              | Text color on error            |
| `--c-field-error-border-color`   | `var(--c-sys-color-error)`              | Border color on error          |
| `--c-field-readonly-bg-color`    | `var(--c-sys-color-readonly-container)` | Field background when readonly |
| `--c-field-disabled-opacity`     | `var(--c-sys-state-disabled-opacity)`   | Opacity when disabled          |

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

| Class                  | Condition                            |
| ---------------------- | ------------------------------------ |
| `c-input--default`     | No error, not disabled, not readonly |
| `c-input--focused`     | Field is focused                     |
| `c-input--has-error`   | Validation error is active           |
| `c-input--disabled`    | `disabled = true`                    |
| `c-input--readonly`    | `readonly = true`                    |
| `c-input--clearable`   | `clearable = true`                   |
| `c-input--validating`  | Async validation is running          |
| `c-field--focused`     | Border is focused                    |
| `c-field--filled`      | Field has a value (label is raised)  |
| `c-field--disabled`    | Border disabled                      |
| `c-field--readonly`    | Border readonly (dashed)             |
| `c-field--has-prepend` | prepend slot is present              |
