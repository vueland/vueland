# Custom attrs

The plugin can be extended through `attrs` and `defineAttr`.

Use custom attrs when a component receives a literal prop value and creates utility classes from it at runtime. The scanner cannot see that generated class in source code, so `defineAttr` tells it which prop to read, how to validate the value, and which utility prefixes to generate.

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

Now literal attributes generate the configured candidates:

```html
<c-box tone="#fa5a5a" box-size="40px" />
```

```txt
bg-[#fa5a5a]
text-[#fa5a5a]
w-[40px]
h-[40px]
```

## `defineAttr` API

```ts
defineAttr({
  attr: 'tone',
  validator: isColorValue,
  prefixes: ['bg', 'text'],
})
```

| Field       | Type                         | Description                                                                 |
| ----------- | ---------------------------- | --------------------------------------------------------------------------- |
| `attr`      | `string`                     | Attribute or prop name to scan.                                             |
| `validator` | `(value: string) => boolean` | Checks the normalized attribute value before candidates are generated.      |
| `prefixes`  | `string[]`                   | Utility prefixes generated from the value.                                  |
| `normalize` | `(value: string) => string`  | Optional value normalizer. By default whitespace is removed inside a value. |

The default normalizer is useful for values such as `rgb(255, 90, 90)`: the generated candidate becomes `bg-[rgb(255,90,90)]`.

## Validators

You can use the built-in validators or pass any project function with the same `(value: string) => boolean` shape.

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

Examples:

```ts
defineAttr({
  attr: 'panel-width',
  validator: isSizeValue,
  prefixes: ['w'],
})

defineAttr({
  attr: 'content-space',
  validator: isPaddingValue,
  prefixes: ['pa'],
})
```

## Static values

The value must be static in the source code. The scanner sees literal values, including simple bound string literals:

```vue
<template>
  <c-box tone="#fa5a5a" />
  <c-box :tone="'#fa5a5a'" />
</template>
```

```tsx
export function Example() {
  return <Box tone={'#fa5a5a'} />
}
```

Runtime expressions are not evaluated:

```vue
<template>
  <c-box :tone="themeColor" />
</template>
```

## With `@vueland/ui`

When `@vueland/ui` is detected in the project, `utilsJIT` always scans the built-in `color` prop for Vueland components as an internal rule:

```ts
defineAttr({
  attr: 'color',
  validator: isColorValue,
  prefixes: ['bg', 'text'],
})
```

This is not a public option and `attrs` does not replace it. You can still add your own attrs:

```ts
utilsJIT({
  attrs: [
    defineAttr({
      attr: 'track-color',
      validator: isColorValue,
      prefixes: ['bg'],
    }),
  ],
})
```

In a project with `@vueland/ui`, both `color="#fa5a5a"` and `track-color="#22c55e"` are scanned.
