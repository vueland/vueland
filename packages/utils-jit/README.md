<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" style="max-width: 100%;">
</div>

# @vueland/utils-jit

Vite JIT utility engine for the `Vueland` platform.

`@vueland/utils-jit` generates CSS utilities on demand from arbitrary utility classes used in your source files. It is designed for Vue/Vite projects that need a lightweight utility layer without shipping a large predefined CSS bundle.

## Documentation

Full documentation and examples are available here:

https://vueland.github.io/vueland/en/plugins/utils-jit/getting-started

## Installation

```bash
pnpm add -D @vueland/utils-jit
```

You also need Vite installed in your project:

```bash
pnpm add -D vite
```

## Usage

Add the plugin to your Vite config:

```ts
import { defineConfig } from 'vite'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    utilsJIT(),
  ],
})
```

Then use arbitrary utility classes in your templates:

```vue
<template>
  <button class="w-[160px] px-[20px] py-[12px] radius-[8px] bg-[#42b883] color-[#fff]">
    Button
  </button>
</template>
```

The plugin scans your project files and generates only the CSS utilities that are actually used.

## Breakpoints

When you pass `breakpoints` to the plugin, they become the **single source of truth** for both JIT responsive classes and predefined SCSS utility classes from `@vueland/ui`.

```ts
utilsJIT({
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

This does four things automatically:

1. **JIT classes** — responsive variants like `sm:bg-[#fff]` or `lg:w-[960px]` use these breakpoints.
2. **SCSS utilities** — predefined classes like `sm:d-flex`, `md:pa-4` from `@vueland/ui` are compiled with the same values via `@forward "maps/grids" with (...)`.
3. **Grid components** — `CRow` and `CCol` responsive props (`sm="6"`, `:align-md="'center'"`) and the generated column/offset/order CSS all use the same breakpoints.
4. **`useDisplay`** — if you use `@vueland/ui` without explicitly passing `breakpoints` to `createVuelandUI`, the plugin injects the values at build time so the reactive composable uses the same breakpoints automatically.

### Standalone (without `@vueland/ui`)

```ts
// vite.config.ts
utilsJIT({
  breakpoints: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 },
})
```

### Paired with `@vueland/ui`

```ts
// vite.config.ts — one config, everything synced
utilsJIT({
  breakpoints: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 },
})
```

```ts
// main.ts — no need to repeat breakpoints
import { createVuelandUI } from '@vueland/ui'

const vueland = createVuelandUI({ components })
// breakpoints are picked up from utils-jit automatically
```

If you want to override breakpoints for `useDisplay` specifically, pass them explicitly — explicit values always win:

```ts
createVuelandUI({
  components,
  breakpoints: { xs: 0, sm: 480, md: 960, lg: 1280, xl: 1280, xxl: 2560 },
})
```

## Variants

Utility classes can be combined with variants:

```vue
<template>
  <button class="w-[160px] hover:w-[180px] focus:px-[24px]">
    Button
  </button>
</template>
```

Example output:

```css
.hover\:w-\[180px\]:hover {
  width: 180px !important;
}
.focus\:px-\[24px\]:focus {
  padding-left: 24px !important;
  padding-right: 24px !important;
}
```

## Responsive utilities

Responsive variants are also supported:

```vue
<template>
  <div class="w-[100%] md:w-[720px] lg:w-[960px]">
  </div>
</template>
```

## Why @vueland/utils-jit?

- Generates utilities on demand
- Works with Vite
- Supports arbitrary values
- Supports pseudo-class and responsive variants
- Keeps generated CSS close to actual project usage
- Single `breakpoints` config syncs JIT classes, SCSS utilities, and `useDisplay`
- Designed to be used as part of the Vueland ecosystem

## npm

https://www.npmjs.com/package/@vueland/utils-jit

## License

MIT
