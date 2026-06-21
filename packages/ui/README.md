<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" style="max-width: 100%;">
</div>

<div align="center">
  <h1>@vueland/ui</h1>
  <p>UI layer of the <a href="https://github.com/vueland/vueland">Vueland platform</a></p>
  <p>
    <a href="https://vueland.github.io/vueland/en/components/">Documentation</a> ·
    <a href="https://www.npmjs.com/package/@vueland/ui">npm</a>
  </p>
  <p>
    <a href="https://github.com/vueland/vueland">
      <img src="https://img.shields.io/github/stars/vueland/vueland?style=flat&logo=github&label=Star%20us%20on%20GitHub" alt="GitHub Stars">
    </a>
  </p>
</div>

---

> **⚠️ Active development — not production ready**
> APIs may change between releases without notice. Production-ready components are marked **Stable** in the docs.

`@vueland/ui` is the UI layer of the Vueland platform. It provides components built for real-world frontend needs: a 12-column grid, form controls with validation and presets, overlays, composables, and a slot-first architecture that lets you replace visual sections of complex components without losing their behavior.

## Documentation

Full documentation, examples, and component API references:

https://vueland.github.io/vueland/en/guide/getting-started

## Installation

```bash
# pnpm
pnpm add @vueland/ui

# npm
npm install @vueland/ui

# yarn
yarn add @vueland/ui
```

## Setup

### 1. Register the library

```ts
// src/main.ts
import { createApp } from 'vue'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'

import '@vueland/ui/styles/styles.scss'
import '@vueland/ui/styles/lib.scss'

import App from './App.vue'

const app = createApp(App)
app.use(createVuelandUI({ components }))
app.mount('#app')
```

> **Import SCSS source, not pre-compiled CSS.** Styles are compiled by Vite at build time. If you import `dist/styles.css`, breakpoints configured via `@vueland/utils-jit` will not be applied.

### 2. Use components

Components are registered globally after `app.use(vueland)`:

```vue
<template>
  <CRow>
    <CCol cols="12" sm="6" md="4">
      <CCard class="pa-4 elevation-2">Hello Vueland</CCard>
    </CCol>
  </CRow>
</template>
```

## Breakpoints

Material Design breakpoint scale, shared across the grid, utility classes, and `useDisplay`:

| Name | min-width |
|------|-----------|
| xs   | 0         |
| sm   | 600px     |
| md   | 960px     |
| lg   | 1280px    |
| xl   | 1920px    |
| xxl  | 2560px    |

To customize breakpoints, use [`@vueland/utils-jit`](https://www.npmjs.com/package/@vueland/utils-jit) — one config in `vite.config.ts` syncs all layers. See the [Breakpoints guide](https://vueland.github.io/vueland/en/guide/breakpoints).

## Grid system

```vue
<CRow align="center" justify="space-between">
  <CCol cols="12" sm="6" md="4">
    <CCard class="pa-4">Card</CCard>
  </CCol>
</CRow>
```

## Utility classes

```html
<div class="pa-2 md:pa-6 lg:pa-10">responsive padding</div>
<div class="d-none md:d-flex">hidden on mobile</div>
<div class="bg-indigo text-white radius-12 elevation-2">styled card</div>
```

## `useDisplay` composable

```vue
<script setup lang="ts">
import { useBreakpoints } from '@vueland/ui/composables'

const { mdAndUp } = useBreakpoints()
</script>

<template>
  <CRow>
    <CCol :cols="mdAndUp ? 6 : 12">Adaptive column</CCol>
  </CRow>
</template>
```

## Part of the Vueland platform

`@vueland/ui` is one part of the Vueland platform. The platform also includes:

- [`@vueland/utils-jit`](https://www.npmjs.com/package/@vueland/utils-jit) — JIT utility class generation for Vite
- More plugins and adapters coming over time

See the [platform overview](https://github.com/vueland/vueland) for the full picture.

## ⭐ Support the project

If this package is useful to you, a star on GitHub goes a long way.

**[Star on GitHub →](https://github.com/vueland/vueland)**

## License

MIT
