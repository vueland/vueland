# CCol

A column in the 12-column grid system. Always used inside `CRow`. Column width is specified as a number from 1 to 12.

<script setup>
import BasicGridExample from '../../examples/CGrid/BasicGridExample.vue'
import ResponsiveCardsExample from '../../examples/CGrid/ResponsiveCardsExample.vue'
import OffsetOrderExample from '../../examples/CGrid/OffsetOrderExample.vue'
</script>

## Column sizes

All 12 columns in action — from 1/12 to full width combinations.

<BasicGridExample />

::: details Show code
```vue
<template>
  <!-- Three equal columns -->
  <c-row>
    <c-col cols="4"><div>4</div></c-col>
    <c-col cols="4"><div>4</div></c-col>
    <c-col cols="4"><div>4</div></c-col>
  </c-row>

  <!-- Two halves -->
  <c-row>
    <c-col cols="6"><div>6</div></c-col>
    <c-col cols="6"><div>6</div></c-col>
  </c-row>

  <!-- Asymmetric -->
  <c-row>
    <c-col cols="3"><div>3</div></c-col>
    <c-col cols="9"><div>9</div></c-col>
  </c-row>
</template>
```
:::

## Responsive product cards

Cards stack on mobile, show 2 per row on `sm`, and 3 on `md+`.

<ResponsiveCardsExample />

::: details Show code
```vue
<template>
  <c-row>
    <c-col
      v-for="card in cards"
      :key="card.id"
      cols="12"
      sm="6"
      md="4"
    >
      <c-card>…</c-card>
    </c-col>
  </c-row>
</template>
```
:::

## Offset and order

<OffsetOrderExample />

::: details Show code
```vue
<template>
  <!-- Offset: center a 4-column block -->
  <c-row>
    <c-col cols="4" offset="4">Centered</c-col>
  </c-row>

  <!-- Order: visually reorder without touching DOM -->
  <c-row>
    <c-col cols="4" order="3">A — shown last</c-col>
    <c-col cols="4" order="1">B — shown first</c-col>
    <c-col cols="4" order="2">C — shown second</c-col>
  </c-row>
</template>
```
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `string \| number` | `null` | Column span (1–12) |
| `offset` | `string \| number` | `null` | Left offset in columns |
| `order` | `string \| number` | `null` | Visual order (`order` CSS property) |

### Responsive props

For each breakpoint (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`):

| Prop | Type | Description |
|------|------|-------------|
| `xs` … `xxl` | `string \| number` | Column span from that breakpoint upward |
| `offset-xs` … `offset-xxl` | `string \| number` | Left offset from that breakpoint upward |
| `order-xs` … `order-xxl` | `string \| number` | Visual order from that breakpoint upward |

Breakpoint defaults: `xs` ≥ 0 px · `sm` ≥ 600 px · `md` ≥ 960 px · `lg` ≥ 1280 px · `xl` ≥ 1920 px · `xxl` ≥ 2560 px.

## Slots

| Slot | Description |
|------|-------------|
| `default` | Column content |

## See also

- [CRow](/en/components/CRow) — row container
- [CSpacer](/en/components/CSpacer) — flex spacer
- [Breakpoints](/en/guide/breakpoints) — breakpoint values and customization
