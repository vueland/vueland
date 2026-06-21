# Helpers

Miscellaneous utilities for visibility, accessibility, interaction, and content display.

## Visibility

| Class | Property | Value |
|-------|----------|-------|
| `visible` | `visibility` | `visible` |
| `invisible` | `visibility` | `hidden` |

> Unlike `d-none`, `invisible` hides the element but keeps its space in the document flow.

## Accessibility

| Class | Effect |
|-------|--------|
| `sr-only` | Visually hidden but readable by screen readers (absolute position, 1px clipped size) |

## Pointer events

| Class | pointer-events |
|-------|---------------|
| `pointer-events-none` | `none` |
| `pointer-events-auto` | `auto` |

## User select

| Class | user-select |
|-------|------------|
| `select-none` | `none` |
| `select-text` | `text` |
| `select-all` | `all` |
| `select-auto` | `auto` |

## Object fit

| Class | object-fit |
|-------|-----------|
| `object-contain` | `contain` |
| `object-cover` | `cover` |
| `object-fill` | `fill` |
| `object-none` | `none` |

## Aspect ratio

| Class | aspect-ratio |
|-------|-------------|
| `aspect-square` | `1 / 1` |
| `aspect-video` | `16 / 9` |
| `aspect-auto` | `auto` |

## Line clamp

| Class | Effect |
|-------|--------|
| `line-clamp-1` | Clamp to 1 line with `…` |
| `line-clamp-2` | Clamp to 2 lines |
| `line-clamp-3` | Clamp to 3 lines |
| `line-clamp-4` | Clamp to 4 lines |
| `line-clamp-5` | Clamp to 5 lines |

## Examples

```html
<!-- Screen-reader only label -->
<button>
  <span aria-hidden="true">X</span>
  <span class="sr-only">Close dialog</span>
</button>

<!-- Non-clickable decorative overlay -->
<div class="pointer-events-none absolute inset-0">
  Decorative layer
</div>

<!-- Responsive video thumbnail -->
<div class="aspect-video overflow-hidden radius-8">
  <img class="w-100 h-100 object-cover" src="thumbnail.jpg" />
</div>

<!-- Square icon box -->
<div class="aspect-square d-flex items-center justify-center bg-blue radius-4" style="width: 48px">
  <i class="icon text-white"></i>
</div>

<!-- Truncated description -->
<p class="line-clamp-2">
  A very long product description that will be clamped after the second line...
</p>

<!-- Prevent text selection -->
<div class="select-none">This text cannot be selected</div>
```
