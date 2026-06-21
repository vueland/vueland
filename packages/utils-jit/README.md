<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" style="max-width: 100%;">
</div>

<div align="center">
  <h1>@vueland/utils-jit</h1>
  <p>JIT utility layer of the <a href="https://github.com/vueland/vueland">Vueland platform</a></p>
  <p>
    <a href="https://vueland.github.io/vueland/en/plugins/utils-jit/getting-started">Documentation</a> ·
    <a href="https://www.npmjs.com/package/@vueland/utils-jit">npm</a>
  </p>
  <p>
    <a href="https://github.com/vueland/vueland">
      <img src="https://img.shields.io/github/stars/vueland/vueland?style=flat&logo=github&label=Star%20us%20on%20GitHub" alt="GitHub Stars">
    </a>
  </p>
</div>

---

`@vueland/utils-jit` is the JIT utility layer of the Vueland platform. It generates CSS utility classes on demand from your actual source usage — no predefined bundle, no purge step, no configuration overhead.

When used alongside `@vueland/ui`, a single `breakpoints` config in `vite.config.ts` automatically syncs JIT classes, predefined SCSS utilities, grid components, and the `useDisplay` composable. One source of truth for the entire visual layer.

## Documentation

https://vueland.github.io/vueland/en/plugins/utils-jit/getting-started

## Installation

```bash
# pnpm
pnpm add -D @vueland/utils-jit

# npm
npm install -D @vueland/utils-jit

# yarn
yarn add -D @vueland/utils-jit
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

The plugin scans your source files and generates only the CSS that is actually used.

## Breakpoints

Pass `breakpoints` once — everything syncs automatically:

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

This single config does four things:

1. **JIT classes** — responsive variants like `sm:bg-[#fff]` or `lg:w-[960px]` use these breakpoints.
2. **SCSS utilities** — predefined classes like `sm:d-flex`, `md:pa-4` from `@vueland/ui` are compiled with the same values.
3. **Grid components** — `CRow` and `CCol` responsive props use the same breakpoints.
4. **`useDisplay`** — the reactive composable picks up the values automatically at build time.

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
```

If you need to override breakpoints for `useDisplay` specifically, pass them explicitly — explicit values always win.

## Variants

```vue
<button class="w-[160px] hover:w-[180px] focus:px-[24px]">
  Button
</button>
```

## Responsive utilities

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px]"></div>
```

## Part of the Vueland platform

`@vueland/utils-jit` is the utility layer of the Vueland platform. The platform also includes:

- [`@vueland/ui`](https://www.npmjs.com/package/@vueland/ui) — UI components, grid system, composables, preset engine
- More plugins and adapters coming over time

See the [platform overview](https://github.com/vueland/vueland) for the full picture.

## ⭐ Support the project

If this package is useful to you, a star on GitHub goes a long way.

**[Star on GitHub →](https://github.com/vueland/vueland)**

## License

MIT
