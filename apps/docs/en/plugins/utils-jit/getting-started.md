# Getting Started

`@vueland/utils-jit` is a standalone Vite plugin for generating CSS utility classes in JIT mode. It scans the classes used in your source files and serves only the CSS that is actually needed.

The package is part of the Vueland ecosystem, but it does not require Vue or `@vueland/ui`. Use it in any Vite project: Vue, React, Preact, Solid, Svelte, Astro, or plain HTML. When paired with `@vueland/ui`, it also becomes the shared breakpoint layer for JIT classes, predefined SCSS utilities, grid components, and `useBreakpoints`.

## Installation

::: code-group

```bash [pnpm]
pnpm add -D @vueland/utils-jit
```

```bash [npm]
npm install -D @vueland/utils-jit
```

```bash [yarn]
yarn add -D @vueland/utils-jit
```

:::

## Plugin setup

Add `utilsJIT()` to your `vite.config.ts`.

```ts
import { defineConfig } from 'vite'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [utilsJIT()],
})
```

If your app uses a framework plugin, keep it next to `utilsJIT()`:

```ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), utilsJIT()],
})
```

By default the CSS is served as a virtual module, `virtual:utils-jit.css` — no file is written to disk. Import it once in your application entry file, for example in `src/main.ts`:

```ts
import 'virtual:utils-jit.css'
```

If you want to inspect the result as a file (for debugging), enable [`emitFile`](./configuration#emitfile) — the CSS will additionally be written to [`outFile`](./configuration#outfile).

## Quick example

```html
<div class="w-[300px] h-[200px] px-[16px] radius-[12px] z-[10]">Hello utilities</div>
```

The virtual module will serve roughly this CSS:

```css
/* @vueland/utils-jit: generated utilities */
.h-\[200px\] {
  height: 200px !important;
}
.px-\[16px\] {
  padding-left: 16px !important;
  padding-right: 16px !important;
}
.radius-\[12px\] {
  border-radius: 12px !important;
}
.w-\[300px\] {
  width: 300px !important;
}
.z-\[10\] {
  z-index: 10 !important;
}
```

Generated rules are sorted by utility token name in the output, so you should not rely on the order of classes in the template.

## Framework examples

Vue / HTML-like templates:

```vue
<template>
  <button class="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
</template>
```

React / Preact:

```tsx
export function SaveButton() {
  return (
    <button className="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
  )
}
```

The class token must exist statically in source code. Runtime-built strings are not evaluated:

```vue
<!-- This is found -->
<div :class="isWide ? 'w-[320px]' : 'w-[240px]'"></div>

<!-- This is not evaluated -->
<div :class="`w-[${width}px]`"></div>
```

## Other file types

The default scan includes `.vue`, `.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.svelte`, and `.astro`. Add other file extensions through [`include`](./configuration#include):

```ts
utilsJIT({
  include: [/\.(vue|js|ts|jsx|tsx|html|svelte|astro|mdx)$/],
})
```

## With Vueland UI

In a Vueland app, `utilsJIT()` can be the single place where responsive breakpoints are configured:

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

Those values are used by JIT classes like `md:w-[720px]`, predefined SCSS utilities like `md:pa-4`, grid CSS/classes, and `useBreakpoints`. See [configuration](./configuration#breakpoints) for the full integration details.
