# Opacity

Utilities for controlling the CSS `opacity` property.

## Classes

| Class | opacity |
|-------|---------|
| `op-0` | `0` (fully transparent) |
| `op-1` | `0.1` |
| `op-2` | `0.2` |
| `op-3` | `0.3` |
| `op-4` | `0.4` |
| `op-5` | `0.5` (semi-transparent) |
| `op-6` | `0.6` |
| `op-7` | `0.7` |
| `op-8` | `0.8` |
| `op-9` | `0.9` |
| `op-10` | `1.0` (fully opaque) |

## Hover states

| Class | Effect |
|-------|--------|
| `hover:op-0` | `opacity: 0` on hover |
| `hover:op-1` | `opacity: 0.1` on hover |
| … | … |
| `hover:op-10` | `opacity: 1` on hover |

## Examples

```html
<!-- Semi-transparent overlay -->
<div class="op-5 bg-black">Semi-transparent background</div>

<!-- Disabled appearance -->
<button class="op-4" disabled>Unavailable</button>

<!-- Hover effect -->
<img class="op-10 hover:op-7" src="photo.jpg" alt="photo" />

<!-- Fade in on hover -->
<div class="op-0 hover:op-10" style="transition: opacity 0.3s">
  Appears on hover
</div>
```
