# Custom Rules

The plugin can be extended through `rules` and `defineRule`.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  defineRule,
  isColorValue,
  isSizeValue,
  utilsJIT,
} from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    vue(),
    utilsJIT({
      rules: [
        defineRule({
          name: 'surface',
          matcher: /^surface-\[(.+)\]$/,
          validate: isColorValue,
          declaration: (value) => ({
            backgroundColor: value,
          }),
          important: false,
        }),

        defineRule({
          name: 'size',
          matcher: /^size-\[(.+)\]$/,
          validate: isSizeValue,
          declaration: (value) => ({
            width: value,
            height: value,
          }),
        }),
      ],
    }),
  ],
})
```

Now you can use:

```vue
<template>
  <div class="surface-[#fff] size-[40px] hover:size-[48px]">
    Custom utilities
  </div>
</template>
```

Generated CSS:

```css
.surface-\[\#fff\]{background-color: #fff;}
.size-\[40px\]{width: 40px !important;height: 40px !important;}
.hover\:size-\[48px\]:hover{width: 48px !important;height: 48px !important;}
```

## `defineRule` API

```ts
defineRule({
  name: 'rule-name',
  matcher: /^rule-name-\[(.+)\]$/,
  validate: (value) => true,
  declaration: (value) => ({
    cssProperty: value,
  }),
  important: true,
})
```

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Rule name used for readability and debugging. |
| `matcher` | `RegExp` | Matcher for the utility part without variants. |
| `validate` | `(value: string) => boolean` | Validates the value inside `[]`. |
| `declaration` | `(value: string) => Record<string, string \| number> \| string[]` | Generates CSS declarations. |
| `important` | `boolean` | Adds `!important` to object-based declarations. Defaults to `true`. |

`matcher` receives only the utility part without variants.

For this class:

```html
<div class="hover:surface-[#fff]"></div>
```

`matcher` should match:

```txt
surface-[#fff]
```

## Declarations

`declaration` usually returns an object with CSS properties:

```ts
defineRule({
  name: 'bg',
  matcher: /^bg-\[(.+)\]$/,
  validate: isColorValue,
  declaration: (value) => ({
    backgroundColor: value,
  }),
})
```

CSS properties written in camelCase are automatically converted to kebab-case:

```ts
{
  backgroundColor: '#fff',
  borderTopLeftRadius: '8px',
}
```

Result:

```css
background-color: #fff !important;
border-top-left-radius: 8px !important;
```

CSS variables are preserved:

```ts
defineRule({
  name: 'token',
  matcher: /^token-\[(.+)\]$/,
  declaration: (value) => ({
    '--vl-token': value,
  }),
  important: false,
})
```

Result:

```css
--vl-token: #fff;
```

If `declaration` returns `string[]`, the strings are treated as final CSS declarations. In this case, `!important` is not added automatically.

```ts
defineRule({
  name: 'raw',
  matcher: /^raw-\[(.+)\]$/,
  declaration: (value) => [
    `--raw-value: ${value};`,
  ],
})
```

## Stricter validation

For custom rules, it is better to explicitly restrict the allowed value format:

```ts
import { defineRule } from '@vueland/utils-jit'

const gridColsRule = defineRule({
  name: 'grid-cols',
  matcher: /^grid-cols-\[(.+)\]$/,
  validate: (value) => /^\d+$/.test(value),
  declaration: (value) => ({
    gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
  }),
})
```

Usage:

```html
<div class="grid-cols-[3]"></div>
```

Result:

```css
.grid-cols-\[3\]{grid-template-columns: repeat(3, minmax(0, 1fr)) !important;}
```

## Validators

The package exports validators that can be used in custom rules:

```ts
import {
  isColorValue,
  isMarginValue,
  isOpacityValue,
  isPaddingValue,
  isPositionValue,
  isRadiusValue,
  isSizeValue,
  isZIndexValue,
} from '@vueland/utils-jit'
```

Example:

```ts
defineRule({
  name: 'text',
  matcher: /^text-\[(.+)\]$/,
  validate: isColorValue,
  declaration: (value) => ({
    color: value,
  }),
})
```
