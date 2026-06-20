# Positioning

Utilities for controlling position type, inset coordinates, and z-index.

## Position type

| Class | position |
|-------|----------|
| `static` | `static` |
| `relative` | `relative` |
| `absolute` | `absolute` |
| `fixed` | `fixed` |
| `sticky` | `sticky` |

## Inset (all sides)

| Class | inset |
|-------|-------|
| `inset-0` | `0` |
| `inset-auto` | `auto` |

## Offsets

| Class | Property | Value |
|-------|----------|-------|
| `top-0` | `top` | `0` |
| `top-50` | `top` | `50%` |
| `top-100` | `top` | `100%` |
| `top-auto` | `top` | `auto` |
| `bottom-0` | `bottom` | `0` |
| `bottom-50` | `bottom` | `50%` |
| `bottom-100` | `bottom` | `100%` |
| `bottom-auto` | `bottom` | `auto` |
| `left-0` | `left` | `0` |
| `left-50` | `left` | `50%` |
| `left-100` | `left` | `100%` |
| `left-auto` | `left` | `auto` |
| `right-0` | `right` | `0` |
| `right-50` | `right` | `50%` |
| `right-100` | `right` | `100%` |
| `right-auto` | `right` | `auto` |

## Z-index

| Class | z-index |
|-------|---------|
| `z-0` | `0` |
| `z-1` | `1` |
| `z-2` | `2` |
| `z-3` | `3` |
| `z-4` | `4` |
| `z-5` | `5` |
| `z-10` | `10` |
| `z-50` | `50` |
| `z-auto` | `auto` |

## Arbitrary values (JIT)

```html
<div class="z-[100]">z-index: 100</div>
<div class="top-[50%]">top: 50%</div>
<div class="left-[calc(50%-8px)]">arbitrary offset</div>
```

## Examples

```html
<!-- Full-screen overlay -->
<div class="fixed inset-0 z-50 bg-black">
  Overlay
</div>

<!-- Absolute centering -->
<div class="relative" style="height: 200px">
  <div class="absolute top-50 left-50" style="transform: translate(-50%, -50%)">
    Centered in parent
  </div>
</div>

<!-- Sticky header -->
<header class="sticky top-0 z-10 bg-white elevation-4">
  Fixed header
</header>

<!-- Badge in corner -->
<div class="relative d-inline-block">
  <img src="avatar.jpg" />
  <span class="absolute top-0 right-0 bg-red text-white radius-pill pa-1">
    3
  </span>
</div>
```
