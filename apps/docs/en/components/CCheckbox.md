# CCheckbox

`CCheckbox` is a checkbox built on top of [`CInput`](/en/components/CInput) and [`CSelectControl`](/en/components/CSelectControl). It wraps a real `<input type="checkbox">`, so focus, keyboard and screen-reader behaviour are the native ones. It binds a boolean or collects values into an array, supports an indeterminate state, and takes part in [`CForm`](/en/components/CForm) validation.

Any `CInput` prop — `label`, `details`, `no-details`, `rules`, `validate-on`, `disabled`, `readonly`, `preset` — is forwarded to the underlying input.

<script setup>
import BasicExample from '../../examples/CCheckbox/BasicExample.vue'
import GroupExample from '../../examples/CCheckbox/GroupExample.vue'
import IndeterminateExample from '../../examples/CCheckbox/IndeterminateExample.vue'
import StatesExample from '../../examples/CCheckbox/StatesExample.vue'
import SlotsExample from '../../examples/CCheckbox/SlotsExample.vue'
import PresetExample from '../../examples/CCheckbox/PresetExample.vue'
</script>

## Basic usage

Bind a boolean with `v-model` and pass a `label`.

<BasicExample />

::: details Show code

```vue
<template>
  <CCheckbox v-model="subscribed" label="Email me about releases" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const subscribed = ref(true)
</script>
```

:::

## Groups

Point several checkboxes at the same array model and give each one a `value`. Checking a box appends its `value` to the array, unchecking removes it — no group wrapper needed.

<GroupExample />

::: details Show code

```vue
<template>
  <CCheckbox
    v-for="scope in available"
    :key="scope.value"
    v-model="scopes"
    :value="scope.value"
    :label="scope.label"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scopes = ref(['read'])

const available = [
  { value: 'read', label: 'Read repositories' },
  { value: 'write', label: 'Write repositories' },
  { value: 'admin', label: 'Manage members' },
]
</script>
```

:::

## Indeterminate

`indeterminate` renders the third state and sets the native `indeterminate` property on the input, so assistive tech reports the checkbox as _mixed_. It is independent of `modelValue`: a checkbox can be unchecked and mixed at the same time.

Toggling clears it — the component emits `update:indeterminate` with `false`. In the typical "select all" case the parent state is fully derived from the children, so a one-way `:indeterminate` binding is enough.

<IndeterminateExample />

::: details Show code

```vue
<template>
  <CCheckbox v-model="allInvited" :indeterminate="someInvited" label="All teams" no-details />

  <CCheckbox
    v-for="team in teams"
    :key="team"
    v-model="invited"
    :value="team"
    :label="team"
    no-details
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const teams = ['Design', 'Engineering', 'Marketing']
const invited = ref(['Design'])

const allInvited = computed({
  get: () => invited.value.length === teams.length,
  set: (value: boolean) => {
    invited.value = value ? [...teams] : []
  },
})

const someInvited = computed(() => invited.value.length > 0 && invited.value.length < teams.length)
</script>
```

:::

## States and validation

`rules` receive the model value — the boolean, or the array in group mode. With `validate-on="blur"` validation runs once the checkbox loses focus.

<StatesExample />

::: details Show code

```vue
<template>
  <CCheckbox
    v-model="terms"
    label="I accept the terms of service"
    :rules="termsRules"
    validate-on="blur"
    details="Validation runs on blur"
  >
    <template #details="{ errorMessage, details }">
      <span :class="{ error: !!errorMessage }">{{ errorMessage || details }}</span>
    </template>
  </CCheckbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref(false)

const termsRules = [(value?: boolean) => ({ valid: !!value, message: 'You must accept the terms' })]
</script>
```

:::

## Slots

The default slot replaces the `label` text and receives the current state; `icon` replaces the box itself.

<SlotsExample />

::: details Show code

```vue
<template>
  <CCheckbox v-model="starred" no-details>
    <template #icon="{ checked }">
      <CIcon
        name="fas:star"
        source="fa"
        :size="18"
        :class="checked ? 'text-amber' : 'text-blue-grey-lighten-2'"
      />
    </template>
    Star this repository
  </CCheckbox>

  <CCheckbox v-model="accepted" no-details>
    <template #default="{ checked }">
      <span class="d-flex items-center gap-2">
        Watch releases
        <CChip v-if="checked" class="bg-indigo text-white fs-xs">on</CChip>
      </span>
    </template>
  </CCheckbox>
</template>
```

:::

The label is not a click target of its own — the native input covers the whole component, which is what makes the entire row clickable. Interactive elements (links, buttons) placed inside the slots will not receive clicks; put them next to the checkbox instead.

## Presets

The checkbox reads its preset from the input set: the nested `checkbox` field of the `base` snapshot takes a plain `CCheckboxPreset`, the same way `field` takes a `CFieldPreset`. Zones are `root`, `icon` and `label`; states collapse in the order `disabled > readonly > error > focused > indeterminate > checked`.

<PresetExample />

::: details Show code

```ts
import type { CInputPreset } from '@vueland/ui/types'

const consent: CInputPreset = {
  base: {
    checkbox: {
      base: { icon: ['text-blue-grey'], label: ['text-blue-grey'] },
      checked: { icon: ['text-indigo'], label: ['text-indigo', 'fw-semi-bold'] },
      indeterminate: { icon: ['text-indigo'] },
      focused: { icon: ['text-indigo-darken-2'] },
      error: { icon: ['text-red'], label: ['text-red'] },
      disabled: { icon: ['text-grey-lighten-1'], label: ['text-grey-lighten-1'] },
    },
  },
  error: { details: ['text-red'] },
}
```

```vue
<template>
  <CCheckbox v-model="allEnabled" label="All channels" preset="input.consent" />
</template>
```

:::

## Behaviour

- **Keyboard** — the native input handles it: `Tab` focuses, `Space` toggles.
- **Readonly** — the checkbox stays focusable and keeps its value visible, but toggling is cancelled and the model never changes. It is exposed as `aria-readonly`, since a native checkbox has no readonly of its own.
- **Disabled** — blocks focus and changes, and rules are not evaluated.
- **Icons** — the box comes from the `checkboxOn` / `checkboxOff` / `checkboxIndeterminate` [icon aliases](/en/guide/icons), so a whole app can be reskinned from the icon config.

## API

### CCheckbox props

| Prop            | Type                  | Default | Description                                                   |
| --------------- | --------------------- | ------- | ------------------------------------------------------------- |
| `modelValue`    | `T \| T[] \| boolean` | `false` | Checked state, or the array collecting `value`s in group mode |
| `value`         | `T`                   | —       | Value added to / removed from the model when toggled          |
| `indeterminate` | `boolean`             | `false` | Third state; cleared on toggle                                |
| `size`          | `number \| string`    | —       | Box size in pixels; forwarded to `CIcon`                      |
| `disabled`      | `boolean`             | `false` | Blocks focus and changes                                      |
| `readonly`      | `boolean`             | `false` | Keeps the value visible and focusable, but blocks changes     |

Any [`CInput`](/en/components/CInput) prop — `label`, `details`, `no-details`, `rules`, `validate-on`, `preset`, … — is forwarded to the underlying input.

### CCheckbox events

| Event                  | Arguments             | Description                                       |
| ---------------------- | --------------------- | ------------------------------------------------- |
| `update:modelValue`    | `T \| T[] \| boolean` | Emitted when the checked state changes            |
| `update:indeterminate` | `boolean`             | Emitted with `false` when the checkbox is toggled |

### CCheckbox slots

| Slot      | Props                                                            | Description                     |
| --------- | ---------------------------------------------------------------- | ------------------------------- |
| `default` | `{ checked: boolean, indeterminate: boolean }`                   | Replaces the `label` text       |
| `icon`    | `{ checked: boolean, indeterminate: boolean }`                   | Replaces the box                |
| `details` | `{ errorMessage?: string, details?: string, hasError: boolean }` | Overrides the hint / error line |
