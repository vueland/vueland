# Presets

Presets are named sets of utility classes that components apply to their internal zones depending on their state. They let you customize component appearance without writing CSS.

## How it works

Presets are registered in `createVuelandUI` under an arbitrary key. A component receives a preset name via the `preset` prop — a dot-separated string like `namespace.name`.

```ts
// src/plugins/vueland.ts
export const vueland = createVuelandUI({
  components,
  presets: {
    input: {
      outline: {/* ... */},
    },
  },
})
```

```vue
<CTextField preset="input.outline" label="Email" />
```

## Example: CTextField preset

A preset is a set of **flat presets keyed by state** — `base` is the resting look, and each state (`focused`, `filled`, `error`, `disabled`, `readonly`) is its own complete flat preset. At any moment exactly one state applies; its zones replace `base` per-zone.

```ts
// src/presets/input-presets.ts
import type { CInputPreset } from '@vueland/ui/types'

export const outline: CInputPreset = {
  base: {
    label: ['text-blue'],
  },
  focused: {
    label: ['text-cyan-darken-2'],
    field: ['text-cyan-darken-2'],
  },
  error: {
    label: ['text-red'],
    details: ['text-red'],
  },
  readonly: {
    label: ['text-grey'],
  },
}
```

```ts
import * as inputPresets from './presets/input-presets'

export const vueland = createVuelandUI({
  components,
  presets: {
    input: { ...inputPresets }, // outline → input.outline
  },
})
```

## Presets and the `color` prop

Colorable components (`CBtn`, `CChip`, `CProgressLinear`, `CProgressCircular`) have a `color` prop that accepts a palette token (`red-lighten-2`) or a raw color (`#fa5a5a`, `rgb(...)`, `var(...)`). Under the hood both mechanisms do the same thing — they add utility classes to the component zones — so they are additive and combine freely **as long as they own different aspects**: the preset owns the shape, shadow, typography, and states, while `color` is a one-off accent for a specific instance.

```html
<!-- the preset defines shape and behavior, color defines the color -->
<CBtn preset="button.pill" color="#7C4DFF">Save</CBtn>
```

When the preset and `color` define **the same property of the same zone** (for example both put `bg-*` on the button root), the outcome is decided by the rule order in the bundled CSS, not by the template order: all utilities have equal specificity and use `!important`. Don't rely on that order — treat such a conflict as a configuration mistake and keep the color in one place: either the preset or the prop.

For a full description of all zones, states, and preset types see the [Settings](/en/settings/) section.
