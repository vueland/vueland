# CRow

A flex container that forms a row in the 12-column grid system. Works together with `CCol` to build responsive layouts.

<script setup>
import AlignmentExample from '../../examples/CGrid/AlignmentExample.vue'
import DashboardLayoutExample from '../../examples/CGrid/DashboardLayoutExample.vue'
</script>

## Alignment

Control vertical alignment of columns via `align` and horizontal distribution via `justify`.

<AlignmentExample />

::: details Show code
```vue
<template>
  <!-- align="start" · justify="start" -->
  <c-row align="start" justify="start">
    <c-col cols="2"><div style="height:60px">…</div></c-col>
    <c-col cols="2"><div style="height:90px">…</div></c-col>
    <c-col cols="2"><div style="height:50px">…</div></c-col>
  </c-row>

  <!-- align="center" · justify="center" -->
  <c-row align="center" justify="center">
    …
  </c-row>

  <!-- align="end" · justify="space-between" -->
  <c-row align="end" justify="space-between">
    …
  </c-row>
</template>
```
:::

## Dashboard layout example

A full responsive layout using `CRow` + `CCol`: stat cards, a bar chart, and a sidebar — all in one grid.

<DashboardLayoutExample />

::: details Show code
```vue
<template>
  <!-- Stats: 2 cols on mobile, 4 on md+ -->
  <c-row class="mb-4">
    <c-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
      <c-card>…</c-card>
    </c-col>
  </c-row>

  <!-- Chart + sidebar: full width on mobile, 8/4 on md+ -->
  <c-row>
    <c-col cols="12" md="8">
      <c-card>…chart…</c-card>
    </c-col>
    <c-col cols="12" md="4">
      <c-card>…top products…</c-card>
    </c-col>
  </c-row>
</template>
```
:::

## Responsive alignment

Each alignment prop has a per-breakpoint variant that overrides the base value from that viewport width upward (mobile-first):

```vue
<template>
  <c-row align="start" :align-md="'center'" :justify-lg="'space-between'">
    <c-col cols="12" md="6">A</c-col>
    <c-col cols="12" md="6">B</c-col>
  </c-row>
</template>
```

## No gutter

Remove the default column gutter with `no-gutter`:

```vue
<template>
  <c-row no-gutter>
    <c-col cols="6">A</c-col>
    <c-col cols="6">B</c-col>
  </c-row>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | `null` | Vertical alignment of columns (`align-items`) |
| `align-content` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'stretch'` | `null` | Alignment of wrapped rows (`align-content`) |
| `justify` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `null` | Horizontal distribution of columns (`justify-content`) |
| `no-gutter` | `boolean` | `false` | Removes the gap between columns |

### Responsive alignment props

For each breakpoint (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) the following props are available:

| Prop | Type | Description |
|------|------|-------------|
| `align-xs` … `align-xxl` | same as `align` | Override `align` from that breakpoint upward |
| `align-content-xs` … `align-content-xxl` | same as `align-content` | Override `align-content` from that breakpoint upward |
| `justify-xs` … `justify-xxl` | same as `justify` | Override `justify` from that breakpoint upward |

Breakpoint defaults: `xs` ≥ 0 px · `sm` ≥ 600 px · `md` ≥ 960 px · `lg` ≥ 1280 px · `xl` ≥ 1920 px · `xxl` ≥ 2560 px.

## Slots

| Slot | Description |
|------|-------------|
| `default` | Column components (`CCol`) or any other content |

## See also

- [CCol](/en/components/CCol) — column component
- [CSpacer](/en/components/CSpacer) — flex spacer
- [Breakpoints](/en/guide/breakpoints) — breakpoint values and customization
