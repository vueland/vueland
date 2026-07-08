# CInput

`CInput` is the low-level primitive for building input controls. It manages focus state, validation, aria attributes, and [`CForm`](/en/components/CForm) integration. It does not render a native `<input>` itself — instead it exposes everything through the `field` slot so the consumer can build any kind of control on top.

:::tip When to use CInput directly?
For most use cases, prefer [`CTextField`](/en/components/CTextField). Use `CInput` when you need a non-standard control: a styled textarea, a PIN input, a numeric stepper, or any other widget that needs validation and focus state.
:::

<script setup>
import CustomFieldExample from '../../examples/CInput/CustomFieldExample.vue'
import PresetStatesExample from '../../examples/CInput/PresetStatesExample.vue'
</script>

## Example: custom field

<CustomFieldExample />

::: details Show code

```vue
<template>
  <CInput v-model="search">
    <template #field="field">
      <div class="search-bar" :class="{ 'search-bar--focused': field.focused }">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-bind="field.attrs"
          class="search-input"
          placeholder="Search anything…"
          :value="search"
          @input="
            (e: any) => {
              search = e.target.value
              field.input(e.target.value)
            }
          "
          @focus="field.focus"
          @blur="field.blur"
        />
        <kbd v-if="!search" class="search-kbd">⌘K</kbd>
        <button v-else class="search-clear" @click="search = ''">
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
  </CInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
</script>
```

:::

---

## Preset system

The preset system is the primary way to style `CInput`-based components. Instead of writing conditional CSS classes in every template, you define a **preset** once and reference it by name. The component resolves the right classes automatically for the current state.

Every value is an array of utility class names, so presets work with any utility-first CSS engine you have configured.

### Zones

A flat preset (`ZonePreset`) maps **zones** to class lists. Zones map 1:1 to the rendered DOM:

`CInput` itself owns two zones:

| Zone      | Element                |
| --------- | ---------------------- |
| `root`    | the `.c-input` wrapper |
| `details` | the hint / error row   |

Nested parts are described by their components' own presets and composed into the input snapshot **by value** — the same format standalone components use:

| Field   | Preset type    | Zones                                                    | States                                           |
| ------- | -------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `field` | `CFieldPreset` | `root` (.c-field), `input`, `label`, `prepend`, `append` | `focused` `filled` `error` `disabled` `readonly` |
| `menu`  | `CMenuPreset`  | `root` (.c-menu)                                         | `opened` `closed`                                |
| `list`  | `CListPreset`  | `root` (.c-list), `option` (.c-list-item)                | `disabled` `readonly`                            |

### The CInputPreset type

A preset is a set of **flat presets keyed by state**. `base` is the resting look; each state is its own complete flat preset:

```ts
type CInputZone = 'root' | 'details'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

// one snapshot: own zones + nested component presets (by value)
type CInputSnapshot = Partial<Record<CInputZone, string[]>> & {
  field?: CFieldPreset
  menu?: CMenuPreset
  list?: CListPreset
}

// base + optional per-state snapshots — everything optional
type CInputPreset = Partial<Record<'base' | CInputState, CInputSnapshot>>
```

There are **no compound states.** Nesting happens only at component boundaries: put a nested preset in `base` — its own states are resolved by that component itself.

### One state at a time

The component is always in a single current state, and that state's preset is applied (or `base` when the field is at rest). The active state's zones replace the base zones **per-zone**; a zone the state doesn't define falls back to `base`. There's nothing to stack and no priorities to reason about — you just define a flat preset per state.

:::tip Why one state, not stacked?
Utility classes are `!important` with equal specificity, so stacking conflicting classes (say two `bg-*`) is resolved by stylesheet order, not by intent. Applying exactly one set of classes per zone keeps the result predictable.
:::

### Addressing a state directly

Each state is itself a flat preset, addressable by `name.state`. `input.blue` is the whole set; `input.blue.focused` is just the focused flat preset.

### Registering presets

Presets are registered globally in `createVuelandUI`:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

function makePreset(color: string): CInputPreset {
  return {
    base: {
      field: {
        base: { label: [color] },
        focused: { label: [color], root: [color] },
        filled: { label: [color] },
        error: { label: ['text-red'], root: ['text-red'] },
        readonly: { label: ['text-grey'] },
        // `disabled` is dimmed by the component; add a state only to override
      },
    },
    error: { details: ['text-red'] },
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

### CInput → CField distribution

You write a **single** preset. `CInput` resolves it, applies its own zones (`root`, `details`), and shares the set with the subtree through `provide`/`inject`. `CField`, `CMenu` and `CList` pick up their nested presets (`field`/`menu`/`list`) from the `base` snapshot and resolve their own states themselves. Each of them also has its own `preset` prop — it overrides the context, so standalone usage keeps working. Nothing is mutated globally.

### All states at a glance

<PresetStatesExample />

The example above uses `preset="input.blue"` across six states:

- **Default** — `base` zones
- **Focused** — `focused` replaces base per-zone
- **Filled** — `filled` replaces base (label floats up, keeps color)
- **Error** — `error` replaces base (red)
- **Disabled** — interaction blocked; the component dims the field
- **Readonly** — value visible but not editable

---

## API

### Props

| Prop              | Type                            | Default     | Description                                                                                              |
| ----------------- | ------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue`      | `T \| T[] \| undefined \| null` | `undefined` | Field value (v-model)                                                                                    |
| `id`              | `string`                        | auto        | Base ID used to generate `uid`, `uid-label`, `uid-details`                                               |
| `label`           | `string`                        | —           | Label text (forwarded into the `field` slot)                                                             |
| `details`         | `string`                        | —           | Hint text shown below the field                                                                          |
| `noDetails`       | `boolean`                       | `false`     | Hide the details area entirely                                                                           |
| `clearable`       | `boolean`                       | `false`     | Forward `clearable` into the `field` slot                                                                |
| `disabled`        | `boolean`                       | `false`     | Blocks focus, adds `aria-disabled`                                                                       |
| `readonly`        | `boolean`                       | `false`     | Adds `aria-readonly`, blocks editing                                                                     |
| `focused`         | `boolean`                       | `false`     | Initial focused state                                                                                    |
| `dirty`           | `boolean`                       | `false`     | Marks the field as filled for visual state                                                               |
| `role`            | `CInputRole`                    | —           | Semantic role. Drives the aria wiring and the `uid` prefix                                               |
| `rules`           | `ValidateFn[]`                  | `[]`        | Validation functions                                                                                     |
| `validateOn`      | `'input' \| 'blur'`             | `'input'`   | When to trigger automatic validation                                                                     |
| `validationValue` | `any`                           | —           | Value passed to `rules` instead of `modelValue` — for fields where `modelValue` holds the displayed text |
| `preset`          | `string`                        | —           | Preset name (dot-path into the `presets` object passed to `createVuelandUI`)                             |

#### CInputRole type

```ts
type CInputRole = 'combobox' | 'checkbox' | 'radio' | 'listbox'
```

| Value        | Behavior                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `'combobox'` | Adds `role="combobox"`, `aria-haspopup="listbox"`, `aria-controls`, `aria-expanded` — for select / autocomplete activators |
| `'checkbox'` | Wires `aria-labelledby` to the label                                                                                       |
| `'radio'`    | Wires `aria-labelledby` to the label                                                                                       |
| `'listbox'`  | For listbox-based controls (aria wiring + `uid` prefix)                                                                    |

### Slots

| Slot      | Props                    | Description                                    |
| --------- | ------------------------ | ---------------------------------------------- |
| `field`   | `CInputFieldSlotProps`   | **Required.** Renders the actual input control |
| `details` | `CInputDetailsSlotProps` | Replaces the hint/error area                   |

#### `field` slot props

| Prop           | Type                        | Description                                              |
| -------------- | --------------------------- | -------------------------------------------------------- |
| `uid`          | `string`                    | Generated ID for the native `<input>`                    |
| `attrs`        | `Record<string, unknown>`   | Ready-to-use aria + native attrs — spread with `v-bind`  |
| `focused`      | `boolean`                   | Current focus state                                      |
| `label`        | `string \| undefined`       | Value of the `label` prop                                |
| `clearable`    | `boolean \| undefined`      | Value of the `clearable` prop                            |
| `disabled`     | `boolean \| undefined`      | Value of the `disabled` prop                             |
| `readonly`     | `boolean \| undefined`      | Value of the `readonly` prop                             |
| `dirty`        | `boolean \| undefined`      | Value of the `dirty` prop                                |
| `preset`       | `CInputPreset \| undefined` | Resolved preset set (also provided to the field subtree) |
| `hasError`     | `boolean`                   | Whether there is an active validation error              |
| `errorMessage` | `string \| undefined`       | Current error message                                    |
| `validating`   | `boolean`                   | Whether async validation is running                      |
| `focus`        | `() => void`                | Call when the native element receives focus              |
| `blur`         | `() => void`                | Call when the native element loses focus                 |
| `reset`        | `() => void`                | Clear the validation error                               |
| `validate`     | `() => Promise<boolean>`    | Trigger validation                                       |

#### `details` slot props

| Prop           | Type                  | Description                         |
| -------------- | --------------------- | ----------------------------------- |
| `uid`          | `string`              | Field ID                            |
| `errorMessage` | `string \| undefined` | Current error message               |
| `hasError`     | `boolean`             | Whether there is an error           |
| `validating`   | `boolean`             | Whether async validation is running |
| `details`      | `string \| undefined` | Value of the `details` prop         |

### Events

| Event   | Arguments | Description          |
| ------- | --------- | -------------------- |
| `focus` | `boolean` | Field received focus |
| `blur`  | —         | Field lost focus     |

### Expose

| Method     | Signature                | Description                      |
| ---------- | ------------------------ | -------------------------------- |
| `validate` | `() => Promise<boolean>` | Trigger validation manually      |
| `reset`    | `() => void`             | Clear the error state            |
| `focus`    | `() => void`             | Programmatically focus the field |
| `blur`     | `() => void`             | Programmatically remove focus    |

---

## CForm integration

`CInput` automatically registers its `validate` method with the nearest parent `CForm`. When `form.validate()` is called, all registered fields are validated in parallel via `Promise.all`.

```vue
<template>
  <CForm>
    <template #default="{ validate }">
      <CInput v-model="pin" :rules="rules">
        <template #field="field">
          <input
            :id="field.uid"
            v-bind="field.attrs"
            :value="pin"
            @input="(e: any) => {}"
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

| Attribute                           | Condition                                    |
| ----------------------------------- | -------------------------------------------- |
| `aria-labelledby="{uid}-label"`     | `label` is set, or `kind` = checkbox/radio   |
| `aria-label`                        | If `label` is the only label                 |
| `aria-describedby="{uid}-details"`  | `details` prop or error message is present   |
| `aria-invalid="true"`               | Validation error is active                   |
| `aria-errormessage="{uid}-details"` | Error message is present                     |
| `aria-disabled="true"`              | `disabled = true`                            |
| `aria-readonly="true"`              | `readonly = true`                            |
| `aria-haspopup="listbox"`           | `kind = 'listbox'`                           |
| `aria-controls="{uid}-menu"`        | `kind = 'listbox'`                           |
| `aria-expanded`                     | `kind = 'listbox'` (updated on focus change) |

---

## CSS variables

| Variable                        | Default                               | Description                 |
| ------------------------------- | ------------------------------------- | --------------------------- |
| `--c-input-details-height`      | `var(--c-sys-control-height-sm)`      | Height of the details area  |
| `--c-input-transition-duration` | `var(--c-sys-motion-duration-medium)` | Color transition duration   |
| `--c-input-primary-color`       | `var(--c-sys-color-primary)`          | Text color in default state |
| `--c-input-error-color`         | `var(--c-sys-color-error)`            | Text color on error         |
| `--c-input-disabled-color`      | `var(--c-sys-color-disabled)`         | Text color when disabled    |
| `--c-input-readonly-color`      | `var(--c-sys-color-readonly)`         | Text color when readonly    |

> Field backgrounds for `focused`/`readonly`/`disabled`/`error` states are rendered by `CField` (`--c-field-focused-bg-color`, `--c-field-readonly-bg-color`, `--c-field-disabled-bg-color`, `--c-field-error-bg-color`), not `CInput`.

---

## State CSS classes

| Class                 | Condition                            |
| --------------------- | ------------------------------------ |
| `c-input--default`    | No error, not disabled, not readonly |
| `c-input--focused`    | Field is focused                     |
| `c-input--has-error`  | Validation error is active           |
| `c-input--disabled`   | `disabled = true`                    |
| `c-input--readonly`   | `readonly = true`                    |
| `c-input--dirty`      | `dirty = true`                       |
| `c-input--clearable`  | `clearable = true`                   |
| `c-input--validating` | Async validation is running          |
