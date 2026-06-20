<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" style="max-width: 100%;">
</div>

# @vueland/ui

> **⚠️ Active development — not production ready**
> The library is under active development. APIs may change between releases without notice. Use in production at your own risk.

Vue 3 component library for the Vueland platform. Provides a set of UI components, a 12-column flexbox grid system, utility classes, and a single breakpoint configuration shared across all layers.

## Documentation

Full documentation, examples, and guides are available at:

https://vueland.github.io/vueland/en/guide/getting-started

## Installation

::: code-group

```bash [pnpm]
pnpm add @vueland/ui
```

```bash [npm]
npm install @vueland/ui
```

```bash [yarn]
yarn add @vueland/ui
```

## Setup

### 1. Register the library

```ts
// src/main.ts
import { createApp } from 'vue'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'

import '@vueland/ui/src/styles/styles.scss'
import '@vueland/ui/src/styles/themes/default-theme.scss'

import App from './App.vue'

const app = createApp(App)
app.use(createVuelandUI({ components }))
app.mount('#app')
```

> **Import SCSS source, not pre-compiled CSS.** The styles are compiled by Vite at build time. If you import `dist/styles.css`, custom breakpoints configured via `@vueland/utils-jit` will not be applied.

### 2. Use components

Components are registered globally after `app.use(vueland)`:

```vue
<template>
  <c-row>
    <c-col cols="12" sm="6" md="4">
      <c-card class="pa-4 elevation-2">Hello Vueland</c-card>
    </c-col>
  </c-row>
</template>
```

## Breakpoints

The default breakpoint scale follows Material Design:

| Name | min-width |
|------|-----------|
| xs   | 0         |
| sm   | 600px     |
| md   | 960px     |
| lg   | 1280px    |
| xl   | 1920px    |
| xxl  | 2560px    |

Breakpoints are shared across four layers: predefined SCSS utility classes, JIT classes, grid components (`CRow`, `CCol`), and the `useDisplay` composable.

To customize them, use [`@vueland/utils-jit`](https://www.npmjs.com/package/@vueland/utils-jit) — one config in `vite.config.ts` syncs all layers automatically. See the [Breakpoints guide](https://vueland.github.io/vueland/en/guide/breakpoints) for the full step-by-step setup.

## Grid system

12-column flexbox grid built on `CRow`, `CCol`, and `CSpacer`:

```vue
<c-row align="center" justify="space-between">
  <!-- full width on mobile, 6 cols on sm+, 4 cols on md+ -->
  <c-col cols="12" sm="6" md="4">
    <c-card class="pa-4">Card</c-card>
  </c-col>
</c-row>
```

Responsive column props, offset, order, and row-level alignment all follow the same breakpoint scale.

## Utility classes

Predefined utility classes cover spacing, colors, typography, flex, display, sizing, elevation, borders, and more. All support responsive prefixes:

```html
<div class="pa-2 md:pa-6 lg:pa-10">responsive padding</div>
<div class="d-none md:d-flex">hidden on mobile</div>
<div class="bg-indigo text-white radius-12 elevation-2">styled card</div>
```

## `useDisplay` composable

Reactive screen state in JS/Vue, synced to the same breakpoints:

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { $BREAKPOINTS_KEY } from '@vueland/ui/constants'

const display = inject($BREAKPOINTS_KEY)!
</script>

<template>
  <c-col :cols="display.mdAndUp.value ? 6 : 12">
    Adaptive column
  </c-col>
</template>
```

## npm

https://www.npmjs.com/package/@vueland/ui

## License

MIT
