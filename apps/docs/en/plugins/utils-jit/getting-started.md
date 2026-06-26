# Getting Started

`@vueland/utils-jit` is a Vite plugin for generating CSS utilities in JIT mode.

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
import vue from '@vitejs/plugin-vue'
import { utilsJIT } from '@vueland/utils-jit'

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

```vue
<template>
  <div class="w-[300px] h-[200px] px-[16px] radius-[12px] z-[10]">Hello Vueland</div>
</template>
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
