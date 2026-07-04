# CProgressLinear

Linear progress bar. Shows determinate progress from 0 to 100, an optional buffer, or an endless animation in `indeterminate` mode.

<script setup>
import BasicExample from '../../examples/CProgressLinear/BasicExample.vue'
import ColorsExample from '../../examples/CProgressLinear/ColorsExample.vue'
import BufferExample from '../../examples/CProgressLinear/BufferExample.vue'
import IndeterminateExample from '../../examples/CProgressLinear/IndeterminateExample.vue'
import PresetExample from '../../examples/CProgressLinear/PresetExample.vue'
</script>

## Basic usage

`value` sets the bar width in percent and is clamped to the 0–100 range.

<BasicExample />

::: details Show code

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <CProgressLinear :value="value" height="8" />

  <CBtn @click="value = Math.max(0, value - 10)">-10</CBtn>
  <CBtn @click="value = Math.min(100, value + 10)">+10</CBtn>
</template>
```

:::

## Colors and height

`color` accepts a semantic theme color, `height` sets the bar height in pixels. The track automatically uses the matching `*-container` token.

<ColorsExample />

::: details Show code

```html
<CProgressLinear color="primary" value="80" height="4" />
<CProgressLinear color="secondary" value="65" height="6" />
<CProgressLinear color="tertiary" value="50" height="8" />
<CProgressLinear color="success" value="90" height="10" />
<CProgressLinear color="warning" value="35" height="12" />
<CProgressLinear color="error" value="20" height="14" />
```

:::

## Buffer

`buffer-value` renders a semi-transparent bar ahead of the main one — useful for streaming and preloading scenarios.

<BufferExample />

::: details Show code

```vue
<template>
  <CProgressLinear :value="value" :buffer-value="buffer" height="8" />
  <CProgressLinear color="success" value="30" buffer-value="70" height="8" />
</template>
```

:::

## Indeterminate

Endless animation for operations with unknown duration.

<IndeterminateExample />

::: details Show code

```html
<CProgressLinear indeterminate height="4" />
<CProgressLinear indeterminate color="tertiary" height="6" />
<CProgressLinear indeterminate color="info" height="8" />
```

:::

## Presets

`CProgressLinear` supports the [preset system](/en/guide/presets). Zones map 1:1 to the DOM and cover every colorable element: `root`, `background` (track), `buffer`, and `bar` (applied to both bars in `indeterminate` mode) — the track, buffer, and bar are recolored with `bg-*` utilities. States: `indeterminate` and `complete` (`value` ≥ 100); `indeterminate` takes precedence.

In the demo below the bar is indigo while loading and turns green once `value` reaches 100 — no conditional classes in the template, the preset resolves the state on its own:

<PresetExample />

::: details Show code

```ts
// main.ts — register the preset once
createVuelandUI({
  presets: {
    progress: {
      download: {
        base: { bar: ['bg-indigo'] },
        complete: { bar: ['bg-green'] },
      },
    },
  },
})
```

```vue
<template>
  <CProgressLinear preset="progress.download" :value="value" height="8" />
</template>
```

:::

## Accessibility

The root element gets `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow` set to the current value. In `indeterminate` mode `aria-valuenow` is omitted, which matches the WAI-ARIA progressbar pattern.

---

## API

### Props

| Prop            | Type                                                                                    | Default     | Description                                   |
| --------------- | --------------------------------------------------------------------------------------- | ----------- | --------------------------------------------- |
| `value`         | `number \| string`                                                                      | `0`         | Bar width in percent, clamped to 0–100        |
| `bufferValue`   | `number \| string`                                                                      | —           | Buffer bar width in percent, clamped to 0–100 |
| `height`        | `number \| string`                                                                      | `4`         | Bar height (px)                               |
| `indeterminate` | `boolean`                                                                               | `false`     | Endless animation mode                        |
| `color`         | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Semantic theme color                          |
| `preset`        | `string`                                                                                | —           | Preset name (dot path) from the registry      |

### CSS variables

| Variable                          | Default                                |
| --------------------------------- | -------------------------------------- |
| `--c-progress-linear-color`       | `var(--c-sys-color-primary)`           |
| `--c-progress-linear-track-color` | `var(--c-sys-color-primary-container)` |
