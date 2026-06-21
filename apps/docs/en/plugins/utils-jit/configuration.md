# Configuration

`utilsJIT` accepts an options object.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    vue(),
    utilsJIT({
      outFile: 'src/.generated/utils-jit.css',
      include: [/\.(vue|js|ts|jsx|tsx|html)$/],
      exclude: [/src\/fixtures/],
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

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `include` | `Array<string \| RegExp>` | `[/\.(vue\|js\|ts\|jsx\|tsx\|html)$/]` | Files that should be scanned. |
| `exclude` | `Array<string \| RegExp>` | Service directories | Files and directories that should be ignored. |
| `outFile` | `string` | `src/.generated/utils-jit.css` | Path to the generated CSS file relative to the Vite root. |
| `breakpoints` | `Record<string, number>` | `{ sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }` | Responsive breakpoints. When passed, fully replaces the defaults. |
| `rules` | `UtilityRule[]` | `[]` | Custom utility rules. |
| `variants` | `VariantMap` | `{}` | Custom variants that are added to the built-in variants. |
| `banner` | `string` | `/* @vueland/utils-jit: generated utilities */` | Banner at the top of the generated CSS file. |
| `emitEmptyFile` | `boolean` | `true` | Creates a file with a comment when no utilities are found. |
| `debug` | `boolean` | `false` | Prints diagnostic messages. |

## `outFile`

Path to the generated CSS file relative to the Vite project `root`.

```ts
utilsJIT({
  outFile: 'src/styles/generated/utils.css',
})
```

After changing this option, update the import path accordingly:

```ts
import './styles/generated/utils.css'
```

## `include`

A list of patterns for files that should be scanned.

Default:

```ts
[/\.(vue|js|ts|jsx|tsx|html)$/]
```

Example:

```ts
utilsJIT({
  include: [/\.(vue|ts)$/],
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
  exclude: [
    /src\/fixtures/,
    /src\/legacy/,
    'storybook-static',
  ],
})
```

## `breakpoints`

An object of responsive breakpoints. The key is used as a class prefix, the value is the `min-width` in pixels. When provided, the object **fully replaces** the built-in defaults.

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

After that you can use:

```html
<div class="sm:w-[640px] lg:w-[1024px]"></div>
```

### Key naming constraints

Breakpoint keys can be any string — they become CSS class prefixes and are valid in that context. However, if you use `@vueland/ui` and want the same breakpoints to apply to **predefined SCSS utility classes** (`sm:d-flex`, `md:pa-4`), the keys must be valid SCSS identifiers: they **cannot start with a digit**.

| Key | JIT classes | SCSS utilities (with `@vueland/ui`) |
|-----|-------------|-------------------------------------|
| `sm`, `md`, `xxl` | ✓ | ✓ |
| `'2xl'`, `'3xl'` | ✓ | ✗ invalid SCSS identifier |

If you only use `utils-jit` without `@vueland/ui` SCSS, keys like `'2xl'` are perfectly fine.

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

When `emitEmptyFile: true`, a file is created with this content if no utility classes are found:

```css
/* @vueland/utils-jit: no utilities found */
```

When `emitEmptyFile: false`, the file will not be created until the plugin finds at least one utility class.

```ts
utilsJIT({
  emitEmptyFile: false,
})
```

## Working with Vue `class` and `:class`

The plugin first tries to quickly extract the content of `class="..."` and `:class="..."`, then tokenizes the extracted chunks.

Static strings inside `:class` are supported:

```vue
<template>
  <div :class="['w-[200px]', active && 'px-[16px]']"></div>
  <div :class="{ 'radius-[12px]': rounded }"></div>
</template>
```

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
6. Generates the final CSS file.

During development, the plugin updates CSS incrementally:

- adds rules for new tokens;
- removes rules when a token is no longer used anywhere;
- keeps a rule if the same token is still used in another file;
- reuses token parsing and CSS rule caches;
- notifies the Vite watcher when the generated CSS changes.

## Limits and safety

To avoid generating unsafe or invalid CSS, the plugin limits arbitrary values:

- minimum token length: `5`;
- maximum token length: `180`;
- maximum value length: `160`;
- forbidden characters: `;`, `{`, `}`, `<`, `>`;
- CSS comments are forbidden inside values;
- the value must contain at least one letter or digit;
- only a safe subset of CSS value characters is allowed.

The following classes will be ignored:

```html
<div class="w-[;]"></div>
<div class="w-[{}]"></div>
<div class="w-[<script>]"></div>
<div class="w-[...........................................]"></div>
```

## Recommendations

Use Utils JIT for precise arbitrary values, not as a replacement for the entire design system.

Good:

```vue
<template>
  <c-card class="max-w-[720px] px-[24px] radius-[16px]">
    Content
  </c-card>
</template>
```

If a value is repeated across the project, it is better to move it into a theme, preset, or component variant.

## Troubleshooting

### The CSS file was not created

Check that:

- `utilsJIT()` is added to `vite.config.ts`;
- the project contains at least one supported utility class;
- the `outFile` path is correct;
- the generated CSS file is imported by the application;
- the file matches `include`;
- the file is not ignored by `exclude`.

If no utility classes are found and `emitEmptyFile: true`, the file will be created with this comment:

```css
/* @vueland/utils-jit: no utilities found */
```

If `emitEmptyFile: false`, the file will appear only after at least one utility class is found.

### The class exists, but CSS is not generated

Check that:

- the file matches `include`;
- the file is not ignored by `exclude`;
- the class is written statically and is not generated at runtime;
- the value passes validation;
- the utility is supported by built-in rules or added through `rules`;
- the variant exists in `breakpoints` or `variants`.

### A responsive prefix does not work

The breakpoint must be explicitly listed in the `breakpoints` option. The default set only includes `sm`, `md`, `lg`, `xl`, `xxl` — any other prefix must be added manually:

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
