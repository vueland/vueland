# CSpacer

A functional component that expands to fill available space in a flex container. Use it inside `CRow` or any flex layout to push adjacent content to opposite ends.

<script setup>
import SpacerExample from '../../examples/CGrid/SpacerExample.vue'
</script>

## Examples

Toolbar, article header, and paginator — three common patterns where `CSpacer` distributes space between elements.

<SpacerExample />

::: details Show code
```vue
<template>
  <!-- Toolbar: logo left, links + button right -->
  <c-row align="center" no-gutter>
    <div>⚡ Dashboard</div>
    <c-spacer />
    <div class="d-flex gap-3">
      <span>Docs</span>
      <button>Sign In</button>
    </div>
  </c-row>

  <!-- Article header: avatar + name left, actions right -->
  <c-row align="center" no-gutter>
    <div><!-- avatar --></div>
    <div>Jane Doe</div>
    <c-spacer />
    <div class="d-flex gap-2">
      <button>🔖</button>
      <button>❤️</button>
    </div>
  </c-row>

  <!-- Pagination: prev left, page center, next right -->
  <c-row align="center" no-gutter>
    <button>← Prev</button>
    <c-spacer />
    <span>Page 3 of 12</span>
    <c-spacer />
    <button>Next →</button>
  </c-row>
</template>
```
:::

## How it works

`CSpacer` renders a `<div class="c-spacer">` with `flex: 1 1 auto`, which causes it to grow and consume all remaining space in the row.

## Props

`CSpacer` has no props.

## Slots

`CSpacer` has no slots.

## See also

- [CRow](/en/components/CRow) — row container
- [CCol](/en/components/CCol) — column component
