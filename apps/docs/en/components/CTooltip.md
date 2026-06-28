# CTooltip

A lightweight tooltip built on top of `CMenu`. Displays helper text next to an activator element. Follows the WAI-ARIA tooltip pattern — the activator automatically receives `aria-describedby`.

<script setup>
import BasicExample from '../../examples/CTooltip/BasicExample.vue'
import PositioningExample from '../../examples/CTooltip/PositioningExample.vue'
import DelayExample from '../../examples/CTooltip/DelayExample.vue'
</script>

## Basic usage

<BasicExample />

::: details Show code

```vue
<template>
  <div class="d-flex align-center gap-3">
    <CTooltip width="auto" open-on-hover close-on-leave align="top-center" :offset-y="6">
      <template #activator="{ on, activator }">
        <CBtn class="bg-indigo elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
          <CIcon name="fas:bell" source="fa" :size="13" /> Subscribe
        </CBtn>
      </template>
      Get notified on every release
    </CTooltip>

    <CTooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="6">
      <template #activator="{ on, activator }">
        <CBtn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
          <CIcon name="fas:star" source="fa" :size="13" /> Star
        </CBtn>
      </template>
      Star this repository on GitHub
    </CTooltip>
  </div>
</template>
```

:::

## Positioning

`align` controls which side the tooltip appears on and how it aligns along the cross axis.

<PositioningExample />

::: details Show code

```html
<!-- Above, centered -->
<CTooltip width="auto" align="top-center" :offset-y="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <CBtn class="bg-indigo elevation-2 text-white" v-bind="activator" v-on="on">Top</CBtn>
  </template>
  Tooltip on the top
</CTooltip>

<!-- To the right, vertically centered -->
<CTooltip width="auto" align="right-center" :offset-x="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <CBtn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on">Right</CBtn>
  </template>
  Tooltip on the right
</CTooltip>

<!-- Below, centered -->
<CTooltip width="auto" align="bottom-center" :offset-y="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <CBtn class="bg-amber elevation-2 text-white" v-bind="activator" v-on="on">Bottom</CBtn>
  </template>
  Tooltip on the bottom
</CTooltip>
```

:::

## Delays

`open-delay` / `close-delay` prevent accidental triggers during fast mouse movement.

<DelayExample />

::: details Show code

```vue
<template>
  <div class="d-flex gap-4">
    <!-- No delay -->
    <CTooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="8">
      <template #activator="{ on, activator }">
        <CCard class="pa-4" v-bind="activator" v-on="on">Instant</CCard>
      </template>
      Opens immediately
    </CTooltip>

    <!-- Open delay -->
    <CTooltip
      width="auto"
      open-on-hover
      close-on-leave
      align="bottom-center"
      :offset-y="8"
      :open-delay="400"
    >
      <template #activator="{ on, activator }">
        <CCard class="pa-4" v-bind="activator" v-on="on">Open 400ms</CCard>
      </template>
      Waits 400ms before showing
    </CTooltip>

    <!-- Close delay -->
    <CTooltip
      width="auto"
      open-on-hover
      close-on-leave
      align="bottom-center"
      :offset-y="8"
      :close-delay="600"
    >
      <template #activator="{ on, activator }">
        <CCard class="pa-4" v-bind="activator" v-on="on">Close 600ms</CCard>
      </template>
      Lingers 600ms before hiding
    </CTooltip>
  </div>
</template>
```

:::

## Custom width

By default, the tooltip wraps its content (`width="auto"`). Pass `width` for a fixed size.

```html
<CTooltip open-on-hover close-on-leave :width="240">
  <template #activator="{ on, activator }">
    <CBtn v-bind="activator" v-on="on">?</CBtn>
  </template>
  A longer description that needs a fixed width to wrap properly.
</CTooltip>
```

## Accessibility

`CTooltip` automatically:

- Generates a unique `id` for the tooltip container
- Sets `role="tooltip"` on the container
- Adds `aria-describedby` with that `id` to the activator

```html
<!-- Resulting HTML -->
<button aria-describedby="c-tooltip-abc123">Hover me</button>
<div id="c-tooltip-abc123" role="tooltip" class="c-tooltip c-menu">Save changes</div>
```

---

## API

`CTooltip` accepts all props, slots, and events from `CMenu`.

### Props

| Prop           | Type               | Default  | Description                                                               |
| -------------- | ------------------ | -------- | ------------------------------------------------------------------------- |
| `width`        | `number \| string` | `'auto'` | Tooltip width                                                             |
| `openOnHover`  | `boolean`          | —        | Open on mouseenter                                                        |
| `closeOnLeave` | `boolean`          | —        | Close on mouseleave                                                       |
| `openDelay`    | `number \| string` | —        | Delay before opening (ms)                                                 |
| `closeDelay`   | `number \| string` | —        | Delay before closing (ms)                                                 |
| `align`        | `AlignValue`       | —        | Side + cross-axis alignment (e.g. `bottom-center`, `top`, `right-center`) |
| `offsetX`      | `number \| string` | —        | Horizontal offset (px)                                                    |
| `offsetY`      | `number \| string` | —        | Vertical offset (px)                                                      |

> All other `CMenu` props are also accepted.

### CSS variables

| Variable                    | Default                                     |
| --------------------------- | ------------------------------------------- |
| `--c-tooltip-bg-color`      | `var(--c-sys-color-surface)`                |
| `--c-tooltip-text-color`    | `var(--c-sys-color-on-surface)`             |
| `--c-tooltip-padding`       | `var(--c-sys-space-1) var(--c-sys-space-3)` |
| `--c-tooltip-border-radius` | `var(--c-sys-shape-sm)`                     |
| `--c-tooltip-border-color`  | `var(--c-sys-color-outline-variant)`        |
| `--c-tooltip-border-width`  | `var(--c-sys-border-width-thin)`            |
| `--c-tooltip-elevation`     | `var(--c-sys-elevation-2)`                  |

`CTooltip` is built on `CMenu` and forwards background, text color, border radius and elevation to the matching `--c-menu-*` variables.

### Slots

| Slot        | Props               | Description                           |
| ----------- | ------------------- | ------------------------------------- |
| `activator` | `{ on, activator }` | The element that triggers the tooltip |
| `default`   | —                   | Tooltip content                       |

### Events

Inherits all `CMenu` events: `open`, `close`, `update:modelValue`.
