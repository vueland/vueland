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
    <c-tooltip width="auto" open-on-hover close-on-leave align="top-center" :offset-y="6">
      <template #activator="{ on, activator }">
        <c-btn
          class="bg-indigo elevation-2 text-white"
          v-bind="activator"
          v-on="on"
          style="gap:8px"
        >
          <c-icon name="fas:bell" source="fa" :size="13" /> Subscribe
        </c-btn>
      </template>
      Get notified on every release
    </c-tooltip>

    <c-tooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="6">
      <template #activator="{ on, activator }">
        <c-btn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on" style="gap:8px">
          <c-icon name="fas:star" source="fa" :size="13" /> Star
        </c-btn>
      </template>
      Star this repository on GitHub
    </c-tooltip>
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
<c-tooltip width="auto" align="top-center" :offset-y="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <c-btn class="bg-indigo elevation-2 text-white" v-bind="activator" v-on="on">Top</c-btn>
  </template>
  Tooltip on the top
</c-tooltip>

<!-- To the right, vertically centered -->
<c-tooltip width="auto" align="right-center" :offset-x="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <c-btn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on">Right</c-btn>
  </template>
  Tooltip on the right
</c-tooltip>

<!-- Below, centered -->
<c-tooltip width="auto" align="bottom-center" :offset-y="8" open-on-hover close-on-leave>
  <template #activator="{ on, activator }">
    <c-btn class="bg-amber elevation-2 text-white" v-bind="activator" v-on="on">Bottom</c-btn>
  </template>
  Tooltip on the bottom
</c-tooltip>
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
    <c-tooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="8">
      <template #activator="{ on, activator }">
        <c-card class="pa-4" v-bind="activator" v-on="on">Instant</c-card>
      </template>
      Opens immediately
    </c-tooltip>

    <!-- Open delay -->
    <c-tooltip
      width="auto"
      open-on-hover
      close-on-leave
      align="bottom-center"
      :offset-y="8"
      :open-delay="400"
    >
      <template #activator="{ on, activator }">
        <c-card class="pa-4" v-bind="activator" v-on="on">Open 400ms</c-card>
      </template>
      Waits 400ms before showing
    </c-tooltip>

    <!-- Close delay -->
    <c-tooltip
      width="auto"
      open-on-hover
      close-on-leave
      align="bottom-center"
      :offset-y="8"
      :close-delay="600"
    >
      <template #activator="{ on, activator }">
        <c-card class="pa-4" v-bind="activator" v-on="on">Close 600ms</c-card>
      </template>
      Lingers 600ms before hiding
    </c-tooltip>
  </div>
</template>
```

:::

## Custom width

By default, the tooltip wraps its content (`width="auto"`). Pass `width` for a fixed size.

```html
<c-tooltip open-on-hover close-on-leave :width="240">
  <template #activator="{ on, activator }">
    <c-btn v-bind="activator" v-on="on">?</c-btn>
  </template>
  A longer description that needs a fixed width to wrap properly.
</c-tooltip>
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
