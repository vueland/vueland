# Borders

Utilities for controlling `border` and `outline` CSS properties.

## Border width

| Class | Property | Value |
|-------|----------|-------|
| `border-0` | `border-width` | `0` |
| `border` | `border` | `1px solid` |
| `border-2` | `border-width` | `2px` |

## Directional borders

| Class | Property |
|-------|----------|
| `border-t` | `border-top: 1px solid` |
| `border-b` | `border-bottom: 1px solid` |
| `border-l` | `border-left: 1px solid` |
| `border-r` | `border-right: 1px solid` |
| `border-t-0` | `border-top-width: 0` |
| `border-b-0` | `border-bottom-width: 0` |
| `border-l-0` | `border-left-width: 0` |
| `border-r-0` | `border-right-width: 0` |

## Border style

| Class | border-style |
|-------|-------------|
| `border-solid` | `solid` |
| `border-dashed` | `dashed` |
| `border-dotted` | `dotted` |
| `border-none` | `none` |

## Border color

| Class | border-color |
|-------|-------------|
| `border-transparent` | `transparent` |
| `border-current` | `currentColor` |

## Outline

| Class | Property | Value |
|-------|----------|-------|
| `outline-none` | `outline` | `none` |
| `outline` | `outline` | `1px solid currentColor` |

## Examples

```html
<!-- Basic border -->
<div class="border radius-4 pa-4">With border</div>

<!-- Bottom border only -->
<div class="border-b pa-2">Underlined element</div>

<!-- Dashed border for drop zone -->
<div class="border border-dashed border-current radius-4 pa-4 op-5">
  Drop zone
</div>

<!-- Remove button outline -->
<button class="outline-none">No outline</button>

<!-- Left border (blockquote style) -->
<blockquote class="border-l border-2 pl-4">
  A quote
</blockquote>
```
