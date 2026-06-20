# Radius

Utilities for controlling the CSS `border-radius` property.

## All corners

| Class | border-radius |
|-------|--------------|
| `radius-0` | `0` |
| `radius-2` | `2px` |
| `radius-4` | `4px` |
| `radius-6` | `6px` |
| `radius-8` | `8px` |
| `radius-12` | `12px` |
| `radius-16` | `16px` |
| `radius-24` | `24px` |
| `radius-32` | `32px` |
| `radius-pill` | `9999px` (pill shape) |
| `radius-circle` | `50%` (circle) |

## Individual corners

| Class | Property |
|-------|----------|
| `radius-top-left-{n}` | `border-top-left-radius` |
| `radius-top-right-{n}` | `border-top-right-radius` |
| `radius-bottom-left-{n}` | `border-bottom-left-radius` |
| `radius-bottom-right-{n}` | `border-bottom-right-radius` |

Valid `{n}` values: `0`, `2`, `4`, `6`, `8`, `12`, `16`, `24`, `32`.

## Examples

```html
<!-- Rounded card -->
<div class="radius-8 elevation-2 pa-4">Card</div>

<!-- Pill button -->
<button class="radius-pill pa-3 px-6 bg-blue text-white">Button</button>

<!-- Avatar circle -->
<img class="radius-circle" style="width: 48px; height: 48px" src="avatar.jpg" />

<!-- Rounded top only -->
<div class="radius-top-left-8 radius-top-right-8">
  Card header
</div>

<!-- Asymmetric corners -->
<div class="radius-top-left-16 radius-bottom-right-16">
  Asymmetric design
</div>
```
