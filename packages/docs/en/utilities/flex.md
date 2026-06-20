# Flex

Flexbox utilities. Activate with `d-flex` or `d-inline-flex`.

## Direction

| Class | flex-direction |
|-------|---------------|
| `flex-row` | `row` |
| `flex-col` | `column` |

## Wrap

| Class | flex-wrap |
|-------|----------|
| `flex-wrap` | `wrap` |
| `flex-nowrap` | `nowrap` |
| `flex-wrap-reverse` | `wrap-reverse` |

## Justify content

| Class | justify-content |
|-------|----------------|
| `justify-start` | `flex-start` |
| `justify-end` | `flex-end` |
| `justify-center` | `center` |
| `justify-between` | `space-between` |
| `justify-around` | `space-around` |
| `justify-evenly` | `space-evenly` |

## Align items

| Class | align-items |
|-------|------------|
| `items-start` | `flex-start` |
| `items-end` | `flex-end` |
| `items-center` | `center` |
| `items-baseline` | `baseline` |
| `items-stretch` | `stretch` |

### Legacy aliases (align-items)

These classes work but `items-*` is preferred:

| Class | align-items |
|-------|------------|
| `align-start` | `flex-start` |
| `align-center` | `center` |
| `align-end` | `flex-end` |
| `align-baseline` | `baseline` |
| `align-stretch` | `stretch` |

## Align self

| Class | align-self |
|-------|-----------|
| `self-start` | `flex-start` |
| `self-end` | `flex-end` |
| `self-center` | `center` |
| `self-baseline` | `baseline` |
| `self-stretch` | `stretch` |

## Align content

| Class | align-content |
|-------|--------------|
| `content-start` | `flex-start` |
| `content-end` | `flex-end` |
| `content-center` | `center` |
| `content-between` | `space-between` |
| `content-around` | `space-around` |

## Order

| Class | order |
|-------|-------|
| `order-1` … `order-12` | `1` … `12` |

## Grow and shrink

| Class | Property | Value |
|-------|----------|-------|
| `grow-0` | `flex-grow` | `0` |
| `grow-1` | `flex-grow` | `1` |
| `shrink-0` | `flex-shrink` | `0` |
| `shrink-1` | `flex-shrink` | `1` |

## Responsive variants

All classes support responsive prefixes:

```html
<div class="d-flex flex-col md:flex-row">
  Column on mobile, row on tablet
</div>
```

## Examples

```html
<!-- Center content -->
<div class="d-flex justify-center items-center" style="height: 100px">
  Centered
</div>

<!-- Space between nav items -->
<nav class="d-flex justify-between items-center pa-4">
  <span>Logo</span>
  <span>Menu</span>
</nav>

<!-- Wrapping columns -->
<div class="d-flex flex-wrap gap-4">
  <div class="grow-1">Column 1</div>
  <div class="grow-1">Column 2</div>
  <div class="grow-1">Column 3</div>
</div>

<!-- Fixed sidebar, flexible content -->
<div class="d-flex">
  <div class="shrink-0" style="width: 200px">Sidebar</div>
  <div class="grow-1">Content</div>
</div>
```
