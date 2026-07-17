# CCheckbox

`CCheckbox` is a checkbox built on top of [`CInput`](/en/components/CInput) and [`CSelectControl`](/en/components/CSelectControl). It wraps a real `<input type="checkbox">`, so focus, keyboard and screen-reader behaviour are the native ones. It binds a boolean or collects values into an array, supports an indeterminate state, and takes part in [`CForm`](/en/components/CForm) validation.

Any `CInput` prop — `label`, `details`, `no-details`, `rules`, `validate-on`, `disabled`, `readonly`, `preset` — is forwarded to the underlying input.

<script setup>
import BasicExample from '../../examples/CCheckbox/BasicExample.vue'
import GroupExample from '../../examples/CCheckbox/GroupExample.vue'
import IndeterminateExample from '../../examples/CCheckbox/IndeterminateExample.vue'
import StatesExample from '../../examples/CCheckbox/StatesExample.vue'
import ColorExample from '../../examples/CCheckbox/ColorExample.vue'
import SizeExample from '../../examples/CCheckbox/SizeExample.vue'
import SlotsExample from '../../examples/CCheckbox/SlotsExample.vue'
import PresetExample from '../../examples/CCheckbox/PresetExample.vue'
</script>

## Basic usage

Bind a boolean with `v-model` and pass a `label`.

<BasicExample />

::: details Show code

```vue
<template>
  <c-checkbox v-model="subscribed" label="Email me about releases" />
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
  <c-checkbox
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

## Color

`color` sets the box colour through a text utility (`text-{color}`), so it accepts palette tokens and raw CSS colours.

::: tip A raw colour must be a literal
Arbitrary classes (`text-[#e65100]`) are generated through a static source scan: `color="#e65100"` works, `:color="someVar"` with a raw value does not. Palette tokens are unaffected.
:::

<ColorExample />

::: details Show code

```vue
<template>
  <c-checkbox
    v-for="item in variants"
    :key="item.value"
    v-model="selected"
    :value="item.value"
    :label="item.label"
    :color="item.color"
    no-details
  />

  <c-checkbox
    v-model="selected"
    value="custom"
    label="Custom CSS color"
    color="#e65100"
    no-details
  />

  <c-checkbox
    v-model="selected"
    value="brand"
    label="Brand variable"
    color="var(--c-sys-color-primary)"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(['teal', 'rose', 'amber', 'custom'])

const variants = [
  { value: 'teal', label: 'Teal', color: 'teal' },
  { value: 'indigo', label: 'Indigo', color: 'indigo' },
  { value: 'rose', label: 'Rose', color: 'pink-darken-1' },
  { value: 'amber', label: 'Amber', color: 'amber-darken-2' },
  { value: 'green', label: 'Green', color: 'green-darken-1' },
  { value: 'cyan', label: 'Cyan', color: 'cyan-darken-2' },
  { value: 'purple', label: 'Purple', color: 'deep-purple-lighten-1' },
  { value: 'red', label: 'Red', color: 'red-darken-1' },
]
</script>
```

:::

## Size

`size` changes only the box size, leaving the row height and label typography alone. Numbers become pixels, while strings are passed through as CSS values.

<SizeExample />

::: details Show code

```vue
<template>
  <c-checkbox
    v-for="item in variants"
    :key="item.value"
    v-model="selected"
    :value="item.value"
    :label="item.label"
    :size="item.size"
    color="indigo"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(['compact'])

const variants = [
  { value: 'compact', label: 'Compact 16', size: 16 },
  { value: 'regular', label: 'Regular 20', size: 20 },
  { value: 'comfortable', label: 'Comfortable 24', size: 24 },
  { value: 'large', label: 'Large 28', size: '28px' },
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
  <c-checkbox v-model="allInvited" :indeterminate="someInvited" label="All teams" no-details />

  <c-checkbox
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
  <c-checkbox
    v-model="terms"
    label="I accept the terms of service"
    :rules="termsRules"
    validate-on="blur"
    details="Validation runs on blur"
  >
    <template #details="{ errorMessage, details }">
      <span :class="{ error: !!errorMessage }">{{ errorMessage || details }}</span>
    </template>
  </c-checkbox>
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
  <c-checkbox v-model="starred" no-details>
    <template #icon="{ checked }">
      <c-icon
        name="fas:star"
        source="fa"
        :size="18"
        :class="checked ? 'text-amber' : 'text-blue-grey-lighten-2'"
      />
    </template>
    Star this repository
  </c-checkbox>

  <c-checkbox v-model="accepted" no-details>
    <template #default="{ checked }">
      <span class="d-flex items-center gap-2">
        Watch releases
        <c-chip v-if="checked" class="bg-indigo text-white fs-xs">on</c-chip>
      </span>
    </template>
  </c-checkbox>
</template>
```

:::

The label is not a click target of its own — the native input covers the whole component, which is what makes the entire row clickable. Interactive elements (links, buttons) placed inside the slots will not receive clicks; put them next to the checkbox instead.

## Presets

The checkbox reads its preset from the input set: the nested `checkbox` field of the `base` snapshot takes a plain `CCheckboxPreset`, the same way `field` takes a `CFieldPreset`. Zones are `root`, `icon` and `label`; states collapse in the order `disabled > readonly > error > focused > indeterminate > checked`. For checkboxes, `focused` applies only on `:focus-visible`.

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
  <c-checkbox v-model="allEnabled" label="All channels" preset="input.consent" />
</template>
```

:::

## Behaviour

- **Keyboard** — the native input handles it: `Tab` focuses, `Space` toggles.
- **Readonly** — the checkbox stays focusable and keeps its value visible, but toggling is cancelled and the model never changes. It is exposed as `aria-readonly`, since a native checkbox has no readonly of its own.
- **Disabled** — blocks focus and changes, and rules are not evaluated.
- **Animation** — checking fills the box and draws the tick with `stroke-dashoffset`; the indeterminate dash scales and rotates in. Both use the system motion tokens and collapse to instant under `prefers-reduced-motion: reduce`.

## Styling

The box is not an icon: it is a CSS border, while the tick and dash take their geometry from the `checkboxCheckMark` and `checkboxIndeterminateMark` aliases and render inside one `CIcon` SVG layer as centreline paths. That is what makes the tick drawable — a filled glyph from an icon set has no centreline to run a dash along, so `checkboxOn` and `checkboxIndeterminate` play no part here. Use the `icon` slot to replace the box entirely.

Overriding those aliases through `icons.aliases` reskins the marks app-wide. Supply centreline paths, not silhouettes — with a filled glyph the dash traces the outline instead of drawing the mark. Both marks share one SVG whose `viewBox` comes from the check-mark entry, so author them in the same coordinate system.

Two custom properties are exposed on `.c-checkbox__icon`:

| Variable                  | Default                    | Description                                  |
| ------------------------- | -------------------------- | -------------------------------------------- |
| `--c-checkbox-size`       | `20px`                     | Box size; the `size` prop sets this          |
| `--c-checkbox-mark-color` | `--c-sys-color-on-primary` | Tick and dash colour, against the filled box |

The box itself is painted with `currentColor`, so colour utilities and preset zones drive it.

## API

### Props

| Prop            | Type                  | Default | Description                                                   |
| --------------- | --------------------- | ------- | ------------------------------------------------------------- |
| `modelValue`    | `T \| T[] \| boolean` | `false` | Checked state, or the array collecting `value`s in group mode |
| `value`         | `T`                   | —       | Value added to / removed from the model when toggled          |
| `indeterminate` | `boolean`             | `false` | Third state; cleared on toggle                                |
| `color`         | `string`              | —       | Box colour: palette token or raw CSS colour                   |
| `size`          | `number \| string`    | `20px`  | Box size; sets `--c-checkbox-size`                            |
| `disabled`      | `boolean`             | `false` | Blocks focus and changes                                      |
| `readonly`      | `boolean`             | `false` | Keeps the value visible and focusable, but blocks changes     |

Any [`CInput`](/en/components/CInput) prop — `label`, `details`, `no-details`, `rules`, `validate-on`, `preset`, … — is forwarded to the underlying input.

### Events

| Event                  | Arguments             | Description                                       |
| ---------------------- | --------------------- | ------------------------------------------------- |
| `update:modelValue`    | `T \| T[] \| boolean` | Emitted when the checked state changes            |
| `update:indeterminate` | `boolean`             | Emitted with `false` when the checkbox is toggled |

### Slots

| Slot      | Props                                                            | Description                     |
| --------- | ---------------------------------------------------------------- | ------------------------------- |
| `default` | `{ checked: boolean, indeterminate: boolean }`                   | Replaces the `label` text       |
| `icon`    | `{ checked: boolean, indeterminate: boolean }`                   | Replaces the box                |
| `details` | `{ errorMessage?: string, details?: string, hasError: boolean }` | Overrides the hint / error line |
