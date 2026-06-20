# Display

Utilities for controlling the CSS `display` property.

## Classes

| Class | display |
|-------|---------|
| `d-none` | `none` |
| `d-block` | `block` |
| `d-inline` | `inline` |
| `d-inline-block` | `inline-block` |
| `d-flex` | `flex` |
| `d-inline-flex` | `inline-flex` |
| `d-grid` | `grid` |
| `d-inline-grid` | `inline-grid` |
| `d-table` | `table` |
| `d-table-row` | `table-row` |
| `d-table-cell` | `table-cell` |
| `d-contents` | `contents` |

## Responsive variants

All classes support responsive prefixes — useful for showing/hiding or changing display type at different breakpoints:

| Example | Result |
|---------|--------|
| `d-none md:d-block` | Hidden on mobile, block on tablet+ |
| `d-block md:d-none` | Block on mobile, hidden on tablet+ |
| `d-block md:d-flex` | Block on mobile, flex on tablet+ |

## Examples

```html
<!-- Hide on mobile -->
<div class="d-none md:d-block">
  Visible on tablet and wider only
</div>

<!-- Show only on mobile -->
<div class="d-block md:d-none">
  Visible on mobile only
</div>

<!-- Inline flex for icon + label -->
<span class="d-inline-flex items-center gap-2">
  <i class="icon"></i>
  Label
</span>

<!-- Grid container -->
<div class="d-grid gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
</div>
```
