# Spacing

Utilities for controlling `margin`, `padding`, and `gap`. Step is 4px: value `N` → `N × 4px`.

## Side abbreviations

| Suffix | Sides |
|--------|-------|
| (none) | all sides |
| `t`    | top   |
| `b`    | bottom |
| `l`    | left  |
| `r`    | right |
| `x`    | left + right |
| `y`    | top + bottom |

## Margin

| Class | Property | Value |
|-------|----------|-------|
| `ma-{n}` | `margin` | `n × 4px` |
| `mt-{n}` | `margin-top` | `n × 4px` |
| `mb-{n}` | `margin-bottom` | `n × 4px` |
| `ml-{n}` | `margin-left` | `n × 4px` |
| `mr-{n}` | `margin-right` | `n × 4px` |
| `mx-{n}` | `margin-left` + `margin-right` | `n × 4px` |
| `my-{n}` | `margin-top` + `margin-bottom` | `n × 4px` |
| `ma-auto` | `margin` | `auto` |
| `mx-auto` | `margin-left` + `margin-right` | `auto` |

## Padding

| Class | Property | Value |
|-------|----------|-------|
| `pa-{n}` | `padding` | `n × 4px` |
| `pt-{n}` | `padding-top` | `n × 4px` |
| `pb-{n}` | `padding-bottom` | `n × 4px` |
| `pl-{n}` | `padding-left` | `n × 4px` |
| `pr-{n}` | `padding-right` | `n × 4px` |
| `px-{n}` | `padding-left` + `padding-right` | `n × 4px` |
| `py-{n}` | `padding-top` + `padding-bottom` | `n × 4px` |

## Gap

| Class | Property | Value |
|-------|----------|-------|
| `gap-{n}` | `gap` | `n × 4px` |
| `gap-x-{n}` | `column-gap` | `n × 4px` |
| `gap-y-{n}` | `row-gap` | `n × 4px` |

## Value table

| n | px |
|---|-----|
| 0 | 0px |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 7 | 28px |
| 8 | 32px |
| 9 | 36px |
| 10 | 40px |
| 11 | 44px |
| 12 | 48px |
| 13 | 52px |
| 14 | 56px |
| 15 | 60px |
| 16 | 64px |
| 17 | 68px |
| 18 | 72px |
| 19 | 76px |
| 20 | 80px |

## Responsive variants

Add a breakpoint prefix before the class:

```html
<div class="pa-2 sm:pa-4 md:pa-6 lg:pa-8">
  Responsive padding
</div>

<div class="d-flex gap-2 md:gap-6">
  Responsive gap
</div>
```

## Examples

```html
<!-- Margin -->
<div class="ma-4">margin: 16px on all sides</div>
<div class="mt-2 mb-6">margin-top: 8px; margin-bottom: 24px</div>
<div class="mx-auto">horizontally centered</div>

<!-- Padding -->
<div class="pa-6">padding: 24px on all sides</div>
<div class="px-4 py-2">padding: 8px top/bottom, 16px left/right</div>

<!-- Flex gap -->
<div class="d-flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="d-flex gap-x-4 gap-y-2 flex-wrap">
  <!-- gap-x between columns, gap-y between rows -->
</div>
```
