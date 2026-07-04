# Variants

Variants are added before the utility class name using `:`.

```html
<div class="hover:w-[320px] md:px-[24px] focus-visible:bg-[#eee]"></div>
```

They work with built-in arbitrary-value utilities and with custom utilities created through [`defineRule`](./custom-rules), for example `hover:flex-center` or `md:grid-cols-3`.

## Pseudo-classes

The following variants are available by default:

```txt
hover
focus
focus-visible
focus-within
active
disabled
checked
visited
first
last
odd
even
```

Example:

```html
<button class="w-[160px] hover:w-[180px] focus:px-[20px] active:radius-[10px]">Button</button>
```

Result:

```css
.hover\:w-\[180px\]:hover {
  width: 180px !important;
}
.focus\:px-\[20px\]:focus {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.active\:radius-\[10px\]:active {
  border-radius: 10px !important;
}
```

## Responsive variants

The following breakpoints are available by default:

```ts
{
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}
```

Example:

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px] xl:w-[1200px] xxl:w-[1440px]">Container</div>
```

Result:

```css
@media (min-width: 960px) {
  .md\:w-\[720px\] {
    width: 720px !important;
  }
}
@media (min-width: 1280px) {
  .lg\:w-\[960px\] {
    width: 960px !important;
  }
}
@media (min-width: 1920px) {
  .xl\:w-\[1200px\] {
    width: 1200px !important;
  }
}
@media (min-width: 2560px) {
  .xxl\:w-\[1440px\] {
    width: 1440px !important;
  }
}
```

## Custom variants

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
  },
})
```

Usage:

```html
<div class="hocus:w-[320px] selected:bg-[#eee] tablet:px-[24px]"></div>
```

Result:

```css
.hocus\:w-\[320px\]:hover,
.hocus\:w-\[320px\]:focus {
  width: 320px !important;
}
.selected\:bg-\[\#eee\][aria-selected='true'] {
  background-color: #eee !important;
}
@media (min-width: 900px) {
  .tablet\:px-\[24px\] {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
}
```

## Theme variants

Dark mode is part of the application's theming strategy. Different projects may implement it through `.dark`, `data-theme`, CSS variables, a provider, or a custom theme layer. The plugin does not enforce a specific model.

If you need a `dark:` variant, add it explicitly through `variants`.

### Using `data-theme`

```ts
utilsJIT({
  variants: {
    dark: {
      kind: 'selector',
      value: '[data-theme="dark"] &',
    },
  },
})
```

Usage:

```html
<div class="bg-[#fff] dark:bg-[#111] text-[#111] dark:text-[#fff]"></div>
```

Result:

```css
[data-theme='dark'] .dark\:bg-\[\#111\] {
  background-color: #111 !important;
}
[data-theme='dark'] .dark\:color-\[\#fff\] {
  color: #fff !important;
}
```

### Using `.dark`

```ts
utilsJIT({
  variants: {
    dark: {
      kind: 'selector',
      value: '.dark &',
    },
  },
})
```

Usage:

```html
<div class="dark:bg-[#111]"></div>
```

Result:

```css
.dark .dark\:bg-\[\#111\] {
  background-color: #111 !important;
}
```

## Combining variants

Pseudo-classes, selector variants, and responsive variants can be combined.

`hocus:` is not a built-in variant. Add it to `variants` before using it:

```ts
utilsJIT({
  variants: {
    hocus: {
      kind: 'selector',
      value: '&:hover,&:focus',
    },
  },
})
```

Now `hocus:` can be combined with responsive variants:

```html
<button class="hover:md:w-[240px] focus:lg:px-[32px] hocus:xl:bg-[#eee]">Responsive button</button>
```

Result:

```css
@media (min-width: 960px) {
  .hover\:md\:w-\[240px\]:hover {
    width: 240px !important;
  }
}
@media (min-width: 1280px) {
  .focus\:lg\:px-\[32px\]:focus {
    padding-left: 32px !important;
    padding-right: 32px !important;
  }
}
@media (min-width: 1920px) {
  .hocus\:xl\:bg-\[\#eee\]:hover,
  .hocus\:xl\:bg-\[\#eee\]:focus {
    background-color: #eee !important;
  }
}
```
