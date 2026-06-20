# Cursor

Utilities for controlling the CSS `cursor` property.

## Basic

| Class | cursor |
|-------|--------|
| `cursor-default` | `default` |
| `cursor-pointer` | `pointer` |
| `cursor-wait` | `wait` |
| `cursor-text` | `text` |
| `cursor-move` | `move` |
| `cursor-help` | `help` |
| `cursor-not-allowed` | `not-allowed` |

## Grab and drag

| Class | cursor |
|-------|--------|
| `cursor-grab` | `grab` |
| `cursor-grabbing` | `grabbing` |

## Special

| Class | cursor |
|-------|--------|
| `cursor-copy` | `copy` |
| `cursor-alias` | `alias` |
| `cursor-no-drop` | `no-drop` |
| `cursor-cell` | `cell` |
| `cursor-crosshair` | `crosshair` |
| `cursor-zoom-in` | `zoom-in` |
| `cursor-zoom-out` | `zoom-out` |

## Resize

| Class | cursor |
|-------|--------|
| `cursor-n-resize` | `n-resize` |
| `cursor-e-resize` | `e-resize` |
| `cursor-s-resize` | `s-resize` |
| `cursor-w-resize` | `w-resize` |
| `cursor-ne-resize` | `ne-resize` |
| `cursor-nw-resize` | `nw-resize` |
| `cursor-se-resize` | `se-resize` |
| `cursor-sw-resize` | `sw-resize` |
| `cursor-ew-resize` | `ew-resize` |
| `cursor-ns-resize` | `ns-resize` |

## Examples

```html
<!-- Clickable button -->
<button class="cursor-pointer">Click me</button>

<!-- Disabled element -->
<button class="cursor-not-allowed op-4" disabled>Unavailable</button>

<!-- Draggable item -->
<div class="cursor-grab" @mousedown="startDrag">
  Drag me
</div>

<!-- Zoomable image -->
<img class="cursor-zoom-in" @click="openLightbox" src="photo.jpg" />

<!-- Alias link -->
<a class="cursor-alias" href="/alias">Alias link</a>
```
