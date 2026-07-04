# Configuration

`utilsJIT` accepts an options object.

```ts
import { defineConfig } from 'vite'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    utilsJIT({
      include: [/\.(vue|js|ts|jsx|tsx|html|svelte|astro)$/],
      exclude: [/src\/fixtures/],
      emitFile: false,
      outFile: 'src/.generated/utils-jit.css',
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
      debug: false,
    }),
  ],
})
```

Add your framework plugin (`@vitejs/plugin-vue`, `@vitejs/plugin-react`, etc.) in the same `plugins` array when your app needs one.

## Options

| Option          | Type                      | Default                                                      | Description                                                                                                                                       |
| --------------- | ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `include`       | `Array<string \| RegExp>` | `[/\.(vue\|js\|ts\|jsx\|tsx\|html\|svelte\|astro)$/]`        | Files that should be scanned.                                                                                                                     |
| `exclude`       | `Array<string \| RegExp>` | Service directories                                          | Files and directories that should be ignored.                                                                                                     |
| `emitFile`      | `boolean`                 | `false`                                                      | Also write the CSS to a file (for debugging). By default the CSS is served only as a virtual module.                                              |
| `outFile`       | `string`                  | `src/.generated/utils-jit.css`                               | Path to the debug file relative to the Vite root. Only used when `emitFile: true`.                                                                |
| `breakpoints`   | `Record<string, number>`  | `{ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }` | Responsive breakpoints. When passed, they are **merged** with the defaults (values are overridden per key, new keys are added as class prefixes). |
| `attrs`         | `AttrRule[]`              | `[]`                                                         | Custom attributes/props whose literal values generate arbitrary utility candidates. See [Custom attrs](./custom-attrs).                           |
| `rules`         | `UtilityRule[]`           | `[]`                                                         | Custom utility rules.                                                                                                                             |
| `variants`      | `VariantMap`              | `{}`                                                         | Custom variants that are added to the built-in variants.                                                                                          |
| `banner`        | `string`                  | `/* @vueland/utils-jit: generated utilities */`              | Banner at the top of the generated CSS.                                                                                                           |
| `emitEmptyFile` | `boolean`                 | `true`                                                       | Serve a placeholder comment when no utilities are found (otherwise empty CSS).                                                                    |
| `debug`         | `boolean`                 | `false`                                                      | Prints diagnostic messages.                                                                                                                       |

## `emitFile`

By default the CSS is served as a virtual module, `virtual:utils-jit.css`, and is never written to disk — consumers import the module:

```ts
import 'virtual:utils-jit.css'
```

If you want to inspect the result as a file (for debugging, diffing, external tooling), enable `emitFile` — the CSS is additionally written to [`outFile`](#outfile). This does not change delivery: you still import the virtual module.

```ts
utilsJIT({
  emitFile: true,
})
```

## `outFile`

Path to the debug file relative to the Vite project `root`. **Only used when `emitFile: true`** — in the default mode no file is written.

```ts
utilsJIT({
  emitFile: true,
  outFile: 'src/styles/generated/utils.css',
})
```

You still import the virtual module, not this file:

```ts
import 'virtual:utils-jit.css'
```

## `include`

A list of patterns for files that should be scanned.

Default:

```ts
;[/\.(vue|js|ts|jsx|tsx|html|svelte|astro)$/]
```

Example:

```ts
utilsJIT({
  include: [/\.(vue|ts)$/],
})
```

Vue, React, Preact, Solid, Svelte, Astro, HTML, JS, and TS files are included by default. For other file types, include their extensions explicitly:

```ts
utilsJIT({
  include: [/\.(vue|js|ts|jsx|tsx|html|svelte|astro|mdx)$/],
})
```

## `exclude`

A list of patterns for files and directories that should be excluded from the initial scan, `transform`, and HMR.

By default, the following directories are excluded:

```txt
node_modules
.git
dist
build
coverage
.output
.nuxt
.turbo
.generated
storybook-static
playwright-report
```

Example:

```ts
utilsJIT({
  exclude: [/src\/fixtures/, /src\/legacy/, 'storybook-static'],
})
```

## `breakpoints`

An object of responsive breakpoints. The key is used as a class prefix, the value is the `min-width` in pixels. When provided, it is **merged** with the built-in defaults (`xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560`): the passed keys override values, the remaining default names are kept.

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

After that you can use the new prefix in JIT classes:

```html
<div class="sm:w-[640px] tablet:w-[1024px] lg:w-[1280px]"></div>
```

::: tip Why merge, not replace
In standalone usage, merging lets you override one value without losing the built-in responsive prefixes. In a Vueland app, the same names (`xs/sm/md/lg/xl/xxl`) are also a shared contract: `@vueland/ui` generates predefined `.md\:pa-4`, `.lg\:d-flex` classes and built-in responsive `CRow`/`CCol` props from them, and `useBreakpoints` exposes them at runtime. So you can override values and add **new** names (e.g. `tablet: 1280`), but the default names remain available.
:::

### Vueland UI: custom breakpoint names in grid components

Custom breakpoint names are compiled into the grid CSS, but Vue components do not receive new props for them. For example, `breakpoints: { tablet: 1280 }` generates tablet grid classes, but it does not make `<c-col tablet="6">` or `<c-row align-tablet="center">` valid props.

Use regular `class` bindings for custom names:

```vue
<template>
  <c-row class="tablet:justify-center">
    <c-col cols="12" class="tablet-6">Half width from tablet</c-col>
    <c-col cols="12" class="tablet-4 tablet:offset-1">One third from tablet</c-col>
  </c-row>
</template>
```

Default breakpoint props such as `sm="6"`, `md="4"`, `align-md="center"`, and `justify-lg="space-between"` are still available and use the values configured through `utilsJIT`.

### Key naming constraints

Breakpoint keys can be any string — they become CSS class prefixes and are valid in that context. However, if you use `@vueland/ui` and want the same breakpoints to apply to **predefined SCSS utility classes** (`sm:d-flex`, `md:pa-4`), the keys must be valid SCSS identifiers: they **cannot start with a digit**.

| Key               | JIT classes | SCSS utilities (with `@vueland/ui`) |
| ----------------- | ----------- | ----------------------------------- |
| `sm`, `md`, `xxl` | ✓           | ✓                                   |
| `'2xl'`, `'3xl'`  | ✓           | ✗ invalid SCSS identifier           |

If you only use `utils-jit` without `@vueland/ui` SCSS, keys like `'2xl'` are perfectly fine.

## `attrs`

Use `attrs` to scan custom component props or attributes whose literal values create utility classes at runtime. Configure each entry with `defineAttr`; see [Custom attrs](./custom-attrs) for examples, validators, and the `@vueland/ui` color prop behavior.

## `variants`

Custom variants allow you to extend the state and selector syntax.

```ts
utilsJIT({
  variants: {
    hocus: {
      kind: 'selector',
      value: '&:hover,&:focus',
    },
    selected: {
      kind: 'attribute',
      value: '[aria-selected="true"]',
    },
    tablet: {
      kind: 'media',
      value: 900,
    },
    dark: {
      kind: 'selector',
      value: '[data-theme="dark"] &',
    },
  },
})
```

## `emitEmptyFile`

When `emitEmptyFile: true` (the default) and no utility classes are found, the virtual module serves a placeholder comment (and the same text is written to the debug file when `emitFile` is on):

```css
/* @vueland/utils-jit: no utilities found */
```

When `emitEmptyFile: false`, empty CSS is served if no utility classes are found.

```ts
utilsJIT({
  emitEmptyFile: false,
})
```

## Working with class strings

The plugin scans static class-like strings in the files matched by `include`. It handles regular HTML/Vue `class`, Vue `:class`, React/Preact `className`, and string literals used in arrays or objects.

Vue examples:

```vue
<template>
  <div class="w-[200px]"></div>
  <div :class="['w-[200px]', active && 'px-[16px]']"></div>
  <div :class="{ 'radius-[12px]': rounded }"></div>
</template>
```

React example:

```tsx
export function Card({ active }: { active: boolean }) {
  return <div className={active ? 'w-[320px] px-[16px]' : 'w-[240px] px-[12px]'}>Content</div>
}
```

Besides classes, the plugin can scan custom literal attributes configured through [`attrs`](./custom-attrs). In projects with `@vueland/ui`, the built-in `color` prop is scanned automatically.

Runtime values are not evaluated. The class must exist in the source code as a static token.

This will not work:

```vue
<script setup lang="ts">
const width = 320
</script>

<template>
  <div :class="`w-[${width}px]`"></div>
</template>
```

This will work:

```vue
<template>
  <div :class="isWide ? 'w-[320px]' : 'w-[240px]'"></div>
</template>
```

## How generation works

When Vite starts, the plugin:

1. Walks through project files.
2. Skips service directories such as `node_modules`, `.git`, `dist`, `build`, `.generated`, and others.
3. Scans only files that match `include`.
4. Extracts utility tokens.
5. Validates values.
6. Serves the final CSS as the `virtual:utils-jit.css` module (and optionally a debug file when `emitFile` is on).

During development, the plugin updates CSS incrementally:

- adds rules for new tokens;
- removes rules when a token is no longer used anywhere;
- keeps a rule if the same token is still used in another file;
- skips re-tokenizing files whose content has not changed;
- reuses token parsing and CSS rule caches;
- invalidates the virtual module for hot replacement (HMR) without a full page reload.

## Limits and safety

To avoid generating unsafe or invalid CSS, the plugin limits arbitrary values:

- minimum token length: `5`;
- maximum token length: `180`;
- maximum value length: `160`;
- forbidden characters: `;`, `{`, `}`, `<`, `>`;
- CSS comments are forbidden inside values;
- the value must contain at least one letter or digit;
- only a safe subset of CSS value characters is allowed.

This safety check is applied to the resolved value of built-in rules and custom `defineRule` rules before a rule-specific `validate` function or `declaration` function runs.

The following classes will be ignored:

```html
<div class="w-[;]"></div>
<div class="w-[{}]"></div>
<div class="w-[<script>]"></div>
<div class="w-[...........................................]"></div>
```

## Recommendations

Use Utils JIT for precise arbitrary values and project-specific generated utilities. It works best as a focused layer next to your design system: keep repeated semantic decisions in theme tokens, presets, or component variants, and use JIT utilities for values and rules that really need to be generated from source usage.

Good:

```vue
<template>
  <c-card class="max-w-[720px] px-[24px] radius-[16px]"> Content </c-card>
</template>
```

Also good for local custom utilities:

```ts
defineRule({
  name: 'grid-cols',
  matcher: /^grid-cols-(\d+)$/,
  declaration: (value) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
  }),
})
```

If a value or behavior becomes a global design decision, move it into a theme token, preset, or component variant.

## Troubleshooting

### Utilities are not applied

Check that:

- `utilsJIT()` is added to `vite.config.ts`;
- the application imports `virtual:utils-jit.css` in its entry file;
- the project contains at least one supported utility class;
- the file with the classes matches `include`;
- the file is not ignored by `exclude`.

If no utility classes are found and `emitEmptyFile: true`, the virtual module serves this comment:

```css
/* @vueland/utils-jit: no utilities found */
```

If `emitEmptyFile: false`, empty CSS is served when no classes are found.

> If `emitFile: true` is enabled but the debug file did not appear, check that the `outFile` path is correct and writable within the project.

### The class exists, but CSS is not generated

Check that:

- the file matches `include`;
- the file is not ignored by `exclude`;
- the class is written statically and is not generated at runtime;
- the value passes validation;
- the utility is supported by built-in rules or added through `rules`;
- the variant exists in `breakpoints` or `variants`.

### A responsive prefix does not work

The prefix must be the name of an existing breakpoint. The default set is `xs`, `sm`, `md`, `lg`, `xl`, `xxl`; to add your own (e.g. `tablet`), pass it in `breakpoints` — it is merged with the defaults:

```ts
utilsJIT({
  breakpoints: {
    tablet: 900, // added to the default xs/sm/md/lg/xl/xxl
  },
})
```

> If you also use `@vueland/ui` SCSS utilities, avoid keys that start with a digit (`'2xl'`, `'3xl'`). See [Key naming constraints](#key-naming-constraints).

### A custom rule does not work

Check that `matcher` describes the utility part without variants.

For this class:

```html
<div class="hover:surface-[#fff]"></div>
```

`matcher` should match:

```txt
surface-[#fff]
```
