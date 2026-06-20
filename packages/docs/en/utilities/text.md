# Text

Utilities for text alignment, transformation, wrapping, and truncation.

## Alignment

| Class | text-align |
|-------|------------|
| `text-left` | `left` |
| `text-center` | `center` |
| `text-right` | `right` |
| `text-justify` | `justify` |
| `text-justify-all` | `justify-all` |

## Whitespace

| Class | Property | Value |
|-------|----------|-------|
| `text-nowrap` | `white-space` | `nowrap` |

## Overflow

| Class | Effect |
|-------|--------|
| `text-truncate` | Truncates text with `…` (requires `overflow: hidden; white-space: nowrap`) |

## Transform

| Class | text-transform |
|-------|---------------|
| `text-uppercase` | `uppercase` |
| `text-lowercase` | `lowercase` |
| `text-capitalize` | `capitalize` |

## Responsive variants

```html
<p class="text-left md:text-center lg:text-right">
  Responsive alignment
</p>

<span class="text-lowercase md:text-uppercase">
  Responsive transform
</span>
```

## Examples

```html
<p class="text-center fw-bold">Centered heading</p>
<p class="text-justify lh-relaxed">Justified paragraph text</p>
<div class="text-truncate" style="width: 200px">
  Very long text that will be truncated with an ellipsis
</div>
<span class="text-uppercase ls-wider">SPACED HEADING</span>
```
