# Overflow

Utilities for controlling the CSS `overflow` property.

## All axes

| Class | overflow |
|-------|---------|
| `overflow-hidden` | `hidden` |
| `overflow-auto` | `auto` |
| `overflow-visible` | `visible` |
| `overflow-scroll` | `scroll` |
| `overflow-clip` | `clip` |

## Horizontal (overflow-x)

| Class | overflow-x |
|-------|-----------|
| `overflow-x-auto` | `auto` |
| `overflow-x-hidden` | `hidden` |
| `overflow-x-scroll` | `scroll` |
| `overflow-x-clip` | `clip` |

## Vertical (overflow-y)

| Class | overflow-y |
|-------|-----------|
| `overflow-y-auto` | `auto` |
| `overflow-y-hidden` | `hidden` |
| `overflow-y-scroll` | `scroll` |
| `overflow-y-clip` | `clip` |

## Examples

```html
<!-- Scrollable area -->
<div class="overflow-auto" style="max-height: 300px">
  <!-- Long content -->
</div>

<!-- Hide overflowing content (useful for rounded images) -->
<div class="overflow-hidden radius-8">
  <img src="image.jpg" />
</div>

<!-- Horizontal scroll for wide tables -->
<div class="overflow-x-auto">
  <table>...</table>
</div>

<!-- Vertical scroll with fixed height -->
<div class="overflow-y-scroll" style="height: 400px">
  <!-- Content -->
</div>
```
