# CProgressCircular

Circular progress indicator. Shows determinate progress from 0 to 100 or an endless spinner in `indeterminate` mode. The default slot renders content in the center of the circle.

<script setup>
import BasicExample from '../../examples/CProgressCircular/BasicExample.vue'
import ColorsExample from '../../examples/CProgressCircular/ColorsExample.vue'
import IndeterminateExample from '../../examples/CProgressCircular/IndeterminateExample.vue'
import PresetExample from '../../examples/CProgressCircular/PresetExample.vue'
</script>

## Basic usage

`value` sets the progress percentage and is clamped to the 0–100 range. The default slot receives the normalized value.

<BasicExample />

::: details Show code

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(65)
</script>

<template>
  <CProgressCircular :value="value" size="96" width="8">
    <template #default="{ value: shown }">{{ shown }}%</template>
  </CProgressCircular>

  <CBtn @click="value = Math.max(0, value - 10)">-10</CBtn>
  <CBtn @click="value = Math.min(100, value + 10)">+10</CBtn>
</template>
```

:::

## Colors

`color` accepts a semantic theme color. The track (underlay) automatically uses the matching `*-container` token.

<ColorsExample />

::: details Show code

```html
<CProgressCircular value="70" size="48" width="5" color="primary" />
<CProgressCircular value="70" size="48" width="5" color="secondary" />
<CProgressCircular value="70" size="48" width="5" color="tertiary" />
<CProgressCircular value="70" size="48" width="5" color="success" />
<CProgressCircular value="70" size="48" width="5" color="error" />
<CProgressCircular value="70" size="48" width="5" color="warning" />
<CProgressCircular value="70" size="48" width="5" color="info" />
```

:::

## Indeterminate

Endless spinner for operations with unknown duration. `size` and `width` control the diameter and the stroke thickness.

<IndeterminateExample />

::: details Show code

```html
<CProgressCircular indeterminate size="24" width="3" />
<CProgressCircular indeterminate color="success" size="40" width="4" />
<CProgressCircular indeterminate color="error" size="64" width="6" />
```

:::

## Presets

`CProgressCircular` supports the [preset system](/en/guide/presets). Zones map 1:1 to the DOM and cover every colorable element: `root` (container), `underlay` (track ring), `overlay` (progress ring), and `info` (center content). The rings are SVG circles with `stroke: currentColor`, so `text-*` utilities recolor them. States: `indeterminate` and `complete` (`value` ≥ 100); `indeterminate` takes precedence.

In the demo below the ring and the counter are indigo/grey while uploading and turn green once `value` reaches 100 — no conditional classes in the template, the preset resolves the state on its own:

<PresetExample />

::: details Show code

```ts
// main.ts — register the preset once
createVuelandUI({
  presets: {
    progress: {
      upload: {
        base: {
          underlay: ['text-grey'],
          overlay: ['text-indigo'],
          info: ['text-grey'],
        },
        complete: {
          overlay: ['text-green'],
          info: ['text-green'],
        },
      },
    },
  },
})
```

```vue
<template>
  <CProgressCircular preset="progress.upload" :value="value" size="96" width="8">
    <template #default="{ value: shown }">{{ shown }}%</template>
  </CProgressCircular>
</template>
```

:::

## Accessibility

The root element gets `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow` set to the current value. In `indeterminate` mode `aria-valuenow` is omitted, which matches the WAI-ARIA progressbar pattern.

---

## API

### Props

| Prop            | Type                                                                                    | Default     | Description                              |
| --------------- | --------------------------------------------------------------------------------------- | ----------- | ---------------------------------------- |
| `value`         | `number \| string`                                                                      | `0`         | Progress percentage, clamped to 0–100    |
| `size`          | `number \| string`                                                                      | `32`        | Diameter (px)                            |
| `width`         | `number \| string`                                                                      | `4`         | Stroke width (px)                        |
| `rotate`        | `number \| string`                                                                      | `0`         | Rotation of the starting point (deg)     |
| `indeterminate` | `boolean`                                                                               | `false`     | Endless spinner mode                     |
| `color`         | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Semantic theme color                     |
| `preset`        | `string`                                                                                | —           | Preset name (dot path) from the registry |

### Slots

| Slot      | Props               | Description                                   |
| --------- | ------------------- | --------------------------------------------- |
| `default` | `{ value: number }` | Content in the center; receives clamped value |

### CSS variables

| Variable                               | Default                                |
| -------------------------------------- | -------------------------------------- |
| `--c-progress-circular-color`          | `var(--c-sys-color-primary)`           |
| `--c-progress-circular-underlay-color` | `var(--c-sys-color-primary-container)` |
