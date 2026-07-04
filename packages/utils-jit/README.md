<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" alt="Vueland" width="180">
  <h1>@vueland/utils-jit</h1>
  <p><strong>Framework-agnostic JIT utility CSS for Vite.</strong></p>
  <p>Standalone by design. Part of Vueland, but not locked to Vueland.</p>
  <p>
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Vue-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue">
    <img src="https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white" alt="Preact">
    <img src="https://img.shields.io/badge/Solid-2C4F7C?style=for-the-badge&logo=solid&logoColor=white" alt="Solid">
    <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte">
    <img src="https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
    <img src="https://img.shields.io/badge/Vanilla-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="Vanilla JavaScript">
  </p>
  <p>
    <a href="https://vueland.github.io/vueland/en/plugins/utils-jit/getting-started">Documentation</a> ·
    <a href="https://www.npmjs.com/package/@vueland/utils-jit">npm</a> ·
    <a href="https://github.com/vueland/vueland/tree/master/packages/utils-jit">Source</a>
  </p>
  <p>
    <a href="https://github.com/vueland/vueland">
      <img src="https://img.shields.io/github/stars/vueland/vueland?style=flat&logo=github&label=Star%20us%20on%20GitHub" alt="GitHub Stars">
    </a>
  </p>
</div>

---

`@vueland/utils-jit` is a standalone Vite plugin that generates CSS utility classes on demand from the classes used in your source code. It does not require Vue, React, `@vueland/ui`, or any runtime dependency. If your app is built by Vite, the plugin can generate utilities for it.

Use it as a tiny utility engine for any Vite project, or pair it with `@vueland/ui` for deeper Vueland integration. Note that `@vueland/ui` is still in active development and is not production-ready yet.

## Why

- Generate only the CSS your project actually uses.
- Use arbitrary-value utilities such as `w-[320px]`, `bg-[#42b883]`, `radius-[12px]`.
- Create your own utility classes with `defineRule`, including static and parameterized classes such as `flex-center` or `grid-cols-3`.
- Build a project-specific utility layer for your design system without shipping a large predefined CSS bundle.
- Keep responsive and state variants close to your markup: `md:w-[720px]`, `hover:bg-[#2f855a]`.
- Serve generated CSS through a virtual module. No generated file is required.

## Framework Support

The plugin scans class-like strings and generates CSS independently of the UI framework.

| Stack        | Works out of the box | Notes                                                    |
| ------------ | -------------------- | -------------------------------------------------------- |
| Vue          | Yes                  | `.vue` files are included by default.                    |
| React        | Yes                  | `.jsx` and `.tsx` files are included by default.         |
| Preact       | Yes                  | Uses the same JSX/TSX scanning path.                     |
| Solid        | Yes                  | Uses the same JSX/TSX scanning path.                     |
| Svelte       | Yes                  | `.svelte` files are included by default.                 |
| Astro        | Yes                  | `.astro` files are included by default.                  |
| Vanilla Vite | Yes                  | `.html`, `.js`, and `.ts` files are included by default. |

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

## Quick Start

Add the plugin to your Vite config:

```ts
import { defineConfig } from 'vite'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [utilsJIT()],
})
```

Import the generated CSS once in your entry file. It is served as a virtual module — no file is written to disk:

```ts
// main.ts
import 'virtual:utils-jit.css'
```

Then use utility classes anywhere your framework accepts class names:

```html
<button class="w-[160px] px-[20px] py-[12px] radius-[8px] bg-[#42b883] text-[#fff]">Button</button>
```

The plugin scans your source files and generates only the CSS that is actually used.

### React Example

```tsx
export function ActionButton() {
  return (
    <button className="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
  )
}
```

### Vue Example

```vue
<template>
  <button class="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
</template>
```

### Other Vite File Types

Vue, React, Preact, Solid, Svelte, Astro, HTML, JS, and TS files are scanned by default. Add extra file extensions to `include` only for other file types:

```ts
utilsJIT({
  include: [/\.(vue|js|ts|jsx|tsx|html|svelte|astro|mdx)$/],
})
```

## Custom Utilities

`defineRule` can describe arbitrary-value utilities, static utilities, and parameterized utilities.

That makes `@vueland/utils-jit` useful not only for one-off arbitrary values, but also for building your own focused utility-class layer: project tokens, layout shortcuts, component-adjacent helpers, and design-system conventions can all live in explicit rules while the plugin still emits only the classes used in source.

```ts
import { defineConfig } from 'vite'
import { defineRule, utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    utilsJIT({
      rules: [
        defineRule({
          name: 'surface',
          matcher: /^surface-\[(.+)\]$/,
          declaration: (value) => ({ backgroundColor: value }),
          important: false,
        }),
        defineRule({
          name: 'flex-center',
          matcher: /^flex-center$/,
          declaration: () => ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }),
        }),
        defineRule({
          name: 'grid-cols',
          matcher: /^grid-cols-(\d+)$/,
          validate: (value) => Number(value) > 0,
          declaration: (value) => ({
            display: 'grid',
            gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
          }),
        }),
      ],
    }),
  ],
})
```

```html
<div class="surface-[#fff] flex-center grid-cols-3 md:grid-cols-4"></div>
```

## Custom Attributes

`defineAttr` can scan literal component attributes or props and turn their values into generated utility candidates. Use the built-in validators, or pass your own `(value: string) => boolean` function.

```ts
import { defineConfig } from 'vite'
import { defineAttr, isColorValue, isSizeValue, utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    utilsJIT({
      attrs: [
        defineAttr({
          attr: 'tone',
          validator: isColorValue,
          prefixes: ['bg', 'text'],
        }),
        defineAttr({
          attr: 'box-size',
          validator: isSizeValue,
          prefixes: ['w', 'h'],
        }),
      ],
    }),
  ],
})
```

```html
<c-box tone="#fa5a5a" box-size="40px"></c-box>
```

This adds candidates such as `bg-[#fa5a5a]`, `text-[#fa5a5a]`, `w-[40px]`, and `h-[40px]`.

## Breakpoints

Pass `breakpoints` once to control responsive JIT variants:

```ts
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
})
```

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px]"></div>
```

### With `@vueland/ui`

`@vueland/utils-jit` is independent, but it is also Vueland-aware. When used alongside `@vueland/ui`, the same `breakpoints` config can sync multiple Vueland layers:

> `@vueland/ui` is in active development and is not production-ready yet.

1. **JIT classes** — responsive variants like `sm:bg-[#fff]` or `lg:w-[960px]` use these breakpoints.
2. **SCSS utilities** — predefined classes like `sm:d-flex`, `md:pa-4` from `@vueland/ui` are compiled with the same values.
3. **Grid components** — default `CRow` and `CCol` responsive props use the overridden default breakpoint values; custom breakpoint names generate CSS classes such as `tablet-6`, but do not create new Vue props.
4. **`useBreakpoints`** — the reactive composable picks up the values automatically at build time.

```vue
<template>
  <c-row>
    <c-col cols="12" class="tablet-6">Tablet half-width</c-col>
    <c-col cols="12" class="tablet-4">Tablet third-width</c-col>
  </c-row>
</template>
```

```ts
// vite.config.ts — one config, shared breakpoint values
utilsJIT({
  breakpoints: { xs: 0, sm: 600, md: 960, tablet: 1280, lg: 1280, xl: 1920, xxl: 2560 },
})
```

```ts
// main.ts — no need to repeat breakpoints
import { createVuelandUI } from '@vueland/ui'

const vueland = createVuelandUI({ components })
```

If you need to override breakpoints for `useBreakpoints` specifically, pass them explicitly — explicit values always win.

## Variants

```vue
<button class="w-[160px] hover:w-[180px] focus:px-[24px]">
  Button
</button>
```

## Part of Vueland, Independent by Design

`@vueland/utils-jit` belongs to the Vueland ecosystem, but it is a complete Vite plugin on its own. You can use it:

- without `@vueland/ui`;
- without Vue;
- in React, Preact, Solid, Svelte, Astro, or vanilla Vite projects;
- as a small custom utility engine for your own design system.

The Vueland platform also includes:

- [`@vueland/ui`](https://www.npmjs.com/package/@vueland/ui) — UI components, grid system, composables, preset engine. Active development, not production-ready yet.
- More plugins and adapters coming over time

See the [platform overview](https://github.com/vueland/vueland) for the full picture.

## ⭐ Support the project

If this package is useful to you, a star on GitHub goes a long way.

**[Star on GitHub →](https://github.com/vueland/vueland)**

## License

MIT
