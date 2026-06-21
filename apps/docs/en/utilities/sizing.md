# Sizing

Utilities for controlling width, height, and min/max sizes.

## Width

| Class | width |
|-------|-------|
| `w-0` | `0` |
| `w-25` | `25%` |
| `w-50` | `50%` |
| `w-75` | `75%` |
| `w-100` | `100%` |
| `w-auto` | `auto` |
| `w-fit` | `fit-content` |
| `w-min` | `min-content` |
| `w-max` | `max-content` |
| `w-screen` | `100vw` |

## Height

| Class | height |
|-------|--------|
| `h-0` | `0` |
| `h-25` | `25%` |
| `h-50` | `50%` |
| `h-75` | `75%` |
| `h-100` | `100%` |
| `h-auto` | `auto` |
| `h-fit` | `fit-content` |
| `h-min` | `min-content` |
| `h-max` | `max-content` |
| `h-screen` | `100vh` |

## Min sizes

| Class | Property | Value |
|-------|----------|-------|
| `min-w-0` | `min-width` | `0` |
| `min-w-full` | `min-width` | `100%` |
| `min-h-0` | `min-height` | `0` |
| `min-h-full` | `min-height` | `100%` |
| `min-h-screen` | `min-height` | `100vh` |

## Max sizes

| Class | Property | Value |
|-------|----------|-------|
| `max-w-full` | `max-width` | `100%` |
| `max-w-screen` | `max-width` | `100vw` |
| `max-w-none` | `max-width` | `none` |
| `max-h-full` | `max-height` | `100%` |
| `max-h-screen` | `max-height` | `100vh` |
| `max-h-none` | `max-height` | `none` |

## Arbitrary values (JIT)

The `utils-jit` package allows arbitrary sizes:

```html
<div class="w-[320px]">Width 320px</div>
<div class="h-[200px]">Height 200px</div>
<div class="w-[50%] h-[calc(100vh-64px)]">Computed sizes</div>
```

## Examples

```html
<!-- Full container width -->
<div class="w-100">100% width</div>

<!-- Constrained centered layout -->
<div class="w-[960px] max-w-100 mx-auto pa-4">
  Page content
</div>

<!-- Full-screen section -->
<section class="w-screen min-h-screen d-flex items-center justify-center">
  Full-screen block
</section>
```
