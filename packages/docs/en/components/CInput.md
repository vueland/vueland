# CInput

`CInput` is the low-level primitive for building input controls. It manages focus state, validation, aria attributes, and [`CForm`](/en/components/CForm) integration. It does not render a native `<input>` itself — instead it exposes everything through the `field` slot so the consumer can build any kind of control on top.

:::tip When to use CInput directly?
For most use cases, prefer [`CTextField`](/en/components/CTextField). Use `CInput` when you need a non-standard control: a styled textarea, a PIN input, a numeric stepper, or any other widget that needs validation and focus state.
:::

<script setup>
import CustomFieldExample from '../../examples/CInput/CustomFieldExample.vue'
import PresetStatesExample from '../../examples/CInput/PresetStatesExample.vue'
import PresetCompoundExample from '../../examples/CInput/PresetCompoundExample.vue'
</script>

## Example: custom field

<CustomFieldExample />

::: details Show code
```vue
<template>
  <CInput
    v-model="pin"
    id="custom-pin"
    label="PIN code"
    kind="input"
    :rules="pinRules"
    validate-on="blur"
  >
    <template #field="field">
      <div class="pin-wrap" :class="{ 'has-error': field.hasError }">
        <label :for="field.uid">PIN code</label>
        <input
          v-bind="field.attrs"
          :id="field.uid"
          type="password"
          maxlength="4"
          inputmode="numeric"
          :value="pin"
          @input="(e: any) => { pin = e.target.value; field.input(e.target.value) }"
          @focus="field.focus"
          @blur="field.blur"
        />
      </div>
    </template>
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
        {{ errorMessage || '4-digit PIN' }}
      </span>
    </template>
  </CInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const pinRules = [
  (v: string) => ({ valid: /^\d{4}$/.test(v), message: 'Enter a 4-digit PIN' }),
]
</script>
```
:::

---

## Preset system

The preset system is the primary way to style `CInput`-based components. Instead of writing conditional CSS classes in every template, you define a **preset object** once and reference it by name. The component resolves the correct classes automatically based on the active state.

Presets work hand in hand with utility classes — every value in a preset is an array of utility class names. This makes presets completely framework-agnostic: they work with any utility-first CSS engine you have configured.

### The CInputPreset type

```ts
type CInputZone = {
  root?: string[]    // classes on the CInput root element
  label?: string[]   // classes on the floating label
  input?: string[]   // classes on the native <input>
  details?: string[] // classes on the hint/error row
}

type CInputCompoundState = CInputZone & {
  focused?: CInputZone  // compound: primary state + focused simultaneously
  filled?: CInputZone   // compound: primary state + filled simultaneously
}

type CInputPreset = CInputZone & {
  // interaction states
  focused?: CInputZone
  filled?: CInputZone
  error?: CInputCompoundState
  disabled?: CInputCompoundState
  readonly?: CInputCompoundState

  // structural modifiers (always additive)
  prepended?: CInputZone
  appended?: CInputZone
}
```

### State priority chain

Only **one interaction state** is active at a time. When multiple conditions are true simultaneously, the highest-priority state wins and the others are ignored:

```
disabled  >  readonly  >  error  >  focused  >  filled
```

For example, if the field has an error and is also focused, the `error` state wins — unless you have defined the `error.focused` compound state, in which case that takes over instead.

### Compound states

Compound states let you define unique styling for combinations of two conditions. They live **inside** a primary state and override it when the secondary condition is also true:

| Compound key | Active when |
|---|---|
| `error.focused` | field has error **and** is focused |
| `error.filled` | field has error **and** has a value |
| `disabled.focused` | field is disabled **and** is focused |
| `disabled.filled` | field is disabled **and** has a value |
| `readonly.focused` | field is readonly **and** is focused |
| `readonly.filled` | field is readonly **and** has a value |

:::warning No fallback to base
When any interaction state is active, the base zone (`root`, `label`, etc. defined at the top level) is **not** applied. If a state zone is defined but doesn't contain a specific key (e.g. `error.label` is missing), that key returns `[]` rather than falling back to the base value.

This is intentional — it prevents base-state colors from leaking through when a state is active.
:::

### Structural modifiers

`prepended` and `appended` are the only **always-additive** modifiers — they are merged on top of whichever interaction state is currently active. Use them to shift the label position or adjust padding when an icon slot is used:

```ts
prepended: {
  label: ['pl-10'],   // shift label right to clear the icon
  input: ['pl-10'],
}
```

### Registering presets

Presets are registered globally in `createVuelandUI`:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

function makePreset(color: string): CInputPreset {
  return {
    root: [color],
    focused: {
      root: [color],
      label: [color],
    },
    filled: {
      label: [color],
    },
    error: {
      root: ['text-red'],
      label: ['text-red'],
      focused: {
        // while fixing the error — show primary color on label
        root: [color],
        label: [color],
      },
      filled: {
        label: ['text-red'],
      },
    },
    disabled: {
      root: ['opacity-50'],
    },
    readonly: {
      root: ['text-grey'],
      label: ['text-grey'],
    },
  }
}

const vueland = createVuelandUI({
  presets: {
    input: {
      blue: makePreset('text-blue'),
      teal: makePreset('text-teal'),
    },
  },
})
```

Then use the preset by name on any `CInput`-based component:

```vue
<CTextField preset="input.blue" ... />
<CTextField preset="input.teal" ... />
```

### CField preset auto-generation

When you register a `CInputPreset`, `CInput` automatically derives a `CFieldPreset` from it and registers it internally as `__field.<preset-name>`. The `CField` component (which renders the outline, label, and slots) picks this up transparently — you never need to write `CFieldPreset` manually.

The derived `CFieldPreset` contains only the `label` and `input` zones (the `root` and `details` zones belong to `CInput`, not `CField`), and preserves all compound sub-states.

### All states at a glance

<PresetStatesExample />

The example above uses `preset="input.blue"` across six states. Notice:
- **Default** — base classes applied
- **Focused** — `focused.label` and `focused.root` replace the base
- **Filled** — `filled.label` replaces the base (label floats up, keeps color)
- **Error** — `error.root` and `error.label` replace everything
- **Disabled** — `disabled` zone applied; interaction is blocked
- **Readonly** — `readonly` zone applied; value visible but not editable

### Compound states in action

<PresetCompoundExample />

The left column has no `error.focused` defined — when you focus a field with an error, the label stays error-colored. The right column defines `error.focused.label` with the primary color, signaling to the user that they are actively fixing the problem.

::: details Show preset definition
```ts
// Without compound states
const noCompound: CInputPreset = {
  root: ['text-blue'],
  focused: { label: ['text-blue'], root: ['text-blue'] },
  filled:  { label: ['text-blue'] },
  error: {
    root:  ['text-red'],
    label: ['text-red'],
    // no error.focused — when error+focused, stays red
  },
}

// With compound states
const withCompound: CInputPreset = {
  root: ['text-blue'],
  focused: { label: ['text-blue'], root: ['text-blue'] },
  filled:  { label: ['text-blue'] },
  error: {
    root:  ['text-red'],
    label: ['text-red'],
    focused: {
      // error + focused → switch label back to primary color
      label: ['text-blue'],
      root:  ['text-blue'],
    },
    filled: {
      label: ['text-red'],  // error + filled → keep red
    },
  },
}
```
:::

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any` | `undefined` | Field value (v-model) |
| `id` | `string` | auto | Base ID used to generate `uid`, `uid-label`, `uid-details` |
| `label` | `string` | — | Label text (forwarded into the `field` slot) |
| `details` | `string` | — | Hint text shown below the field |
| `noDetails` | `boolean` | `false` | Hide the details area entirely |
| `clearable` | `boolean` | `false` | Forward `clearable` into the `field` slot |
| `disabled` | `boolean` | `false` | Blocks focus, adds `aria-disabled` |
| `readonly` | `boolean` | `false` | Adds `aria-readonly`, blocks editing |
| `focused` | `boolean` | `false` | Initial focused state |
| `kind` | `CInputKind` | — | Control type. Affects aria attributes and uid generation |
| `rules` | `ValidateFn[]` | `[]` | Validation functions |
| `validateOn` | `'input' \| 'blur'` | `'input'` | When to trigger automatic validation |
| `preset` | `string` | — | Preset name (dot-path into the `presets` object passed to `createVuelandUI`) |

#### CInputKind type

```ts
type CInputKind = 'input' | 'area' | 'checkbox' | 'radio' | 'listbox'
```

| Value | Behavior |
|-------|----------|
| `'input'` | Standard text input |
| `'area'` | Multi-line input |
| `'checkbox'` | Adds `aria-labelledby` automatically |
| `'radio'` | Adds `aria-labelledby` automatically |
| `'listbox'` | Adds `aria-haspopup`, `aria-controls`, `aria-expanded` |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `field` | `CInputFieldSlotProps` | **Required.** Renders the actual input control |
| `details` | `CInputDetailsSlotProps` | Replaces the hint/error area |

#### `field` slot props

| Prop | Type | Description |
|------|------|-------------|
| `uid` | `string` | Generated ID for the native `<input>` |
| `attrs` | `Record<string, any>` | Ready-to-use aria + native attrs — spread with `v-bind` |
| `focused` | `boolean` | Current focus state |
| `label` | `string \| undefined` | Value of the `label` prop |
| `clearable` | `boolean \| undefined` | Value of the `clearable` prop |
| `disabled` | `boolean \| undefined` | Value of the `disabled` prop |
| `readonly` | `boolean \| undefined` | Value of the `readonly` prop |
| `preset` | `string \| undefined` | Resolved preset name |
| `hasError` | `boolean` | Whether there is an active validation error |
| `errorMessage` | `string \| undefined` | Current error message |
| `validating` | `boolean` | Whether async validation is running |
| `focus` | `() => void` | Call when the native element receives focus |
| `blur` | `() => void` | Call when the native element loses focus |
| `input` | `(val: any) => void` | Call when the value changes |
| `reset` | `() => void` | Clear the validation error |
| `validate` | `() => Promise<boolean>` | Trigger validation |

#### `details` slot props

| Prop | Type | Description |
|------|------|-------------|
| `uid` | `string` | Field ID |
| `errorMessage` | `string \| undefined` | Current error message |
| `hasError` | `boolean` | Whether there is an error |
| `validating` | `boolean` | Whether async validation is running |
| `details` | `string \| undefined` | Value of the `details` prop |

### Events

| Event | Arguments | Description |
|-------|-----------|-------------|
| `focus` | `boolean` | Field received focus |
| `blur` | `boolean` | Field lost focus |
| `input` | `any` | Value changed |

### Expose

| Method | Signature | Description |
|--------|-----------|-------------|
| `validate` | `() => Promise<boolean>` | Trigger validation manually |
| `reset` | `() => void` | Clear the error state |
| `focus` | `() => void` | Programmatically focus the field |
| `blur` | `() => void` | Programmatically remove focus |
| `input` | `(val: any) => void` | Programmatically set a value |

---

## CForm integration

`CInput` automatically registers its `validate` method with the nearest parent `CForm`. When `form.validate()` is called, all registered fields are validated in parallel via `Promise.all`.

```vue
<template>
  <CForm>
    <template #default="{ validate }">
      <CInput v-model="pin" :rules="rules" kind="input">
        <template #field="field">
          <input
            :id="field.uid"
            v-bind="field.attrs"
            :value="pin"
            @input="(e: any) => field.input(e.target.value)"
            @focus="field.focus"
            @blur="field.blur"
          />
        </template>
      </CInput>
      <button @click="validate">Validate</button>
    </template>
  </CForm>
</template>
```

---

## Automatic aria attributes

`CInput` computes aria attributes and passes them via `field.attrs`. Always spread `v-bind="field.attrs"` on the native element.

| Attribute | Condition |
|-----------|-----------|
| `aria-labelledby="{uid}-label"` | `label` is set, or `kind` = checkbox/radio |
| `aria-label` | If `label` is the only label |
| `aria-describedby="{uid}-details"` | `details` prop or error message is present |
| `aria-invalid="true"` | Validation error is active |
| `aria-errormessage="{uid}-details"` | Error message is present |
| `aria-disabled="true"` | `disabled = true` |
| `aria-readonly="true"` | `readonly = true` |
| `aria-haspopup="listbox"` | `kind = 'listbox'` |
| `aria-controls="{uid}-menu"` | `kind = 'listbox'` |
| `aria-expanded` | `kind = 'listbox'` (updated on focus change) |

---

## CSS variables

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
