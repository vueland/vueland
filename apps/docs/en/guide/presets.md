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
      outline: { /* ... */ },
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
    input: { ...inputPresets },  // outline → input.outline
  },
})
```

For a full description of all zones, states, and preset types see the [Settings](/en/settings/) section.
