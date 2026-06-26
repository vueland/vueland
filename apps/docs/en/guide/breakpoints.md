# Breakpoints

Vueland uses a **single breakpoint system** shared across four layers:

- **CSS utility classes** — predefined responsive classes like `sm:d-flex`, `md:pa-4`
- **JIT classes** — arbitrary responsive classes like `sm:bg-[#fff]`, `lg:w-[960px]`
- **`useBreakpoints`** — reactive JS composable that exposes the current screen state
- **Grid components** — `CRow` and `CCol` use the same breakpoint values in grid CSS and built-in responsive props (e.g. `md="6"`, `align-lg="'center'"`); custom breakpoint names are used through generated classes such as `tablet-6`

See [Grid system](/en/components/CRow) for the component API.

By default each layer comes with sensible defaults. When you configure custom breakpoints, the values stay in sync automatically. Custom grid breakpoint names generate CSS classes, not additional Vue props.

## Default breakpoints

| Name | min-width | CSS prefix    |
| ---- | --------- | ------------- |
| xs   | 0         | — (no prefix) |
| sm   | 600px     | `sm:`         |
| md   | 960px     | `md:`         |
| lg   | 1280px    | `lg:`         |
| xl   | 1920px    | `xl:`         |
| xxl  | 2560px    | `xxl:`        |

## Full setup step by step

This section shows how to wire up the complete stack — custom breakpoints, SCSS utilities, grid components, and `useBreakpoints` — all from a single config.

### Step 1 — install packages

::: code-group

```bash [pnpm]
pnpm add @vueland/ui
pnpm add -D @vueland/utils-jit
```

```bash [npm]
npm install @vueland/ui
npm install -D @vueland/utils-jit
```

```bash [yarn]
yarn add @vueland/ui
yarn add -D @vueland/utils-jit
```

:::

### Step 2 — configure Vite

Add `utilsJIT()` to your plugins and set your breakpoints. This is the **only place** you need to define them — the plugin propagates the values to every layer automatically.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    vue(),
    utilsJIT({
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        tablet: 1280,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    }),
  ],
})
```

### Step 3 — import styles as SCSS source

::: warning Import SCSS, not pre-compiled CSS
This is the most critical step. The breakpoint values are injected into the SCSS **at compile time** by the Vite plugin. If you import the pre-built CSS file (`@vueland/ui/dist/styles.css`) instead of the SCSS source, the plugin has nothing to patch and your custom breakpoints will never reach the utility classes or grid components.
:::

In your app entry file, import both SCSS source files:

```ts
// src/main.ts
import '@vueland/ui/styles/styles.scss' // utilities + CSS variables
import '@vueland/ui/styles/lib.scss' // component styles
import '@vueland/ui/styles/utils.scss' // utilities
```

This triggers Vite's SCSS preprocessor, which is where the plugin intercepts the compilation and rewrites the `$grid-breakpoints` map with your values. Predefined utilities (`sm:d-flex`), JIT classes, grid component media queries, and `useBreakpoints` share the same values as a result.

Also import the generated JIT CSS file:

```ts
// src/main.ts
import 'virtual:utils-jit.css'
```

### Step 4 — register the UI library

```ts
// src/main.ts
import { createApp } from 'vue'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'

import '@vueland/ui/styles/styles.scss'
import '@vueland/ui/styles/lib.scss'
import '@vueland/ui/styles/utils.scss'
import 'virtual:utils-jit.css'

import App from './App.vue'

const app = createApp(App)

const vueland = createVuelandUI({
  components,
  // no need to pass breakpoints here — utils-jit injects them at build time
})

app.use(vueland)
app.mount('#app')
```

If you pass `breakpoints` explicitly to `createVuelandUI`, those values take priority over the ones from `utils-jit` for `useBreakpoints`. The SCSS compilation has already finished by then, so utility class breakpoints always come from the Vite plugin.

### Step 5 — use it

Everything is now wired up. Responsive utility classes, grid CSS, built-in grid component props, and `useBreakpoints` all react to the same breakpoint values.

**Responsive utility classes** — apply from a breakpoint upward (mobile-first):

```html
<div class="pa-2 md:pa-6 lg:pa-10">growing padding</div>
<div class="d-none md:d-flex">hidden on mobile</div>
<div class="text-center lg:text-left">alignment shifts on desktop</div>
```

**JIT classes with arbitrary values** — same responsive prefixes:

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px]">responsive width</div>
```

**Grid components** — `cols` sets the base width, breakpoint props override it upward:

```html
<c-row>
  <!-- full width on mobile, half on sm+, one third on md+ -->
  <c-col cols="12" sm="6" md="4">
    <c-card class="pa-4 elevation-2">Card</c-card>
  </c-col>
</c-row>
```

Custom breakpoint names from `utilsJIT` do not create new component props. Use the generated classes for those names:

```html
<c-row>
  <c-col cols="12" class="tablet-6">Half from tablet</c-col>
  <c-col cols="12" class="tablet-4">One third from tablet</c-col>
</c-row>
```

Row-level alignment also responds to breakpoints:

```html
<c-row align="start" align-md="center" justify="start" justify-lg="space-between">
  <c-col cols="4">A</c-col>
  <c-col cols="4">B</c-col>
</c-row>
```

**`useBreakpoints`** — reactive booleans in JS/Vue, synced to the same values:

```vue
<script setup lang="ts">
import { useBreakpoints } from '@vueland/ui/composables'

const { mdAndUp } = useBreakpoints()
</script>

<template>
  <c-row>
    <c-col :cols="mdAndUp ? 6 : 12"> Адаптивная колонка через JS </c-col>
  </c-row>
</template>
```

## Customization

### With `@vueland/utils-jit` (recommended)

Configure breakpoints once in `vite.config.ts` — the plugin syncs utility classes, grid CSS, built-in grid props, JIT classes, and `useBreakpoints` automatically. See [Step 2](#step-2-configure-vite) above.

### Without `@vueland/utils-jit`

Pass breakpoints directly to `createVuelandUI`. This controls `useBreakpoints` and SCSS utilities (only if you import SCSS source and build it yourself).

```ts
const vueland = createVuelandUI({
  components,
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
  },
})
```

Grid component column breakpoints (`sm="6"`, `md="4"`) come from the SCSS compile step and are not affected by this option — to customize those without `utils-jit` you would need to override the `$grid-breakpoints` SCSS variable manually.

### Priority

| Source                             | Priority                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `createVuelandUI({ breakpoints })` | **highest** — controls `useBreakpoints` only                                                            |
| `utilsJIT({ breakpoints })`        | controls SCSS utilities, grid CSS/classes, built-in grid prop values, `useBreakpoints`, and JIT classes |
| Built-in defaults                  | fallback                                                                                                |

## CSS utility responsive classes

Predefined utility classes follow the pattern `{bp}:{class}` and apply from the specified breakpoint upward (mobile-first):

```html
<!-- hidden on mobile, visible from md and up -->
<div class="d-none md:d-block">...</div>

<!-- padding grows with screen size -->
<div class="pa-2 md:pa-4 xl:pa-6">...</div>

<!-- flex direction changes on tablet -->
<div class="d-flex flex-col md:flex-row gap-4">...</div>
```

## `useBreakpoints` composable

`useBreakpoints` exposes reactive boolean refs for the current screen state in JS/Vue code.

```vue
<script setup lang="ts">
import { useBreakpoints } from '@vueland/ui/composables'

const { mdAndUp } = useBreakpoints()
</script>

<template>
  <c-row>
    <c-col :cols="mdAndUp ? 6 : 12"> Адаптивная колонка через JS </c-col>
  </c-row>
</template>
```

### Available properties

All properties are reactive `Ref<boolean>`.

#### Exact breakpoints

| Property      | Condition        |
| ------------- | ---------------- |
| `display.xs`  | width < sm       |
| `display.sm`  | sm ≤ width < md  |
| `display.md`  | md ≤ width < lg  |
| `display.lg`  | lg ≤ width < xl  |
| `display.xl`  | xl ≤ width < xxl |
| `display.xxl` | width ≥ xxl      |

#### Range helpers

| Property            | Condition       |
| ------------------- | --------------- |
| `display.smAndUp`   | width ≥ sm      |
| `display.mdAndUp`   | width ≥ md      |
| `display.lgAndUp`   | width ≥ lg      |
| `display.xlAndUp`   | width ≥ xl      |
| `display.smAndLess` | xs < width ≤ sm |
| `display.mdAndLess` | sm < width ≤ md |
| `display.lgAndLess` | md < width ≤ lg |
| `display.xlAndLess` | lg < width ≤ xl |
