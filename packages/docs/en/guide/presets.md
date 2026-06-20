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

```ts
// src/presets/input-presets.ts
import type { CInputPreset } from '@vueland/ui/types'

export const outline: CInputPreset = {
  root: ['text-blue'],
  focused: {
    root: ['text-cyan-darken-2'],
  },
  error: {
    root: ['text-red'],
    focused: {
      root: ['text-red-darken-2'],
    },
  },
  disabled: {
    root: ['text-grey'],
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
