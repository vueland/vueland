# Typography

Utilities for controlling font size, weight, style, line height, and letter spacing.

## Font size

| Class | font-size |
|-------|-----------|
| `fs-xs` | 12px |
| `fs-sm` | 14px |
| `fs-base` | 16px |
| `fs-lg` | 18px |
| `fs-xl` | 20px |
| `fs-2xl` | 24px |
| `fs-3xl` | 32px |
| `fs-4xl` | 40px |

## Font weight

| Class | font-weight |
|-------|-------------|
| `fw-thin` | 100 |
| `fw-light` | 300 |
| `fw-regular` | 400 |
| `fw-medium` | 500 |
| `fw-semi-bold` | 600 |
| `fw-bold` | 700 |
| `fw-heavy` | 900 |

## Line height

| Class | line-height |
|-------|-------------|
| `lh-none` | 1 |
| `lh-tight` | 1.25 |
| `lh-snug` | 1.375 |
| `lh-normal` | 1.5 |
| `lh-relaxed` | 1.625 |
| `lh-loose` | 2 |

## Letter spacing

| Class | letter-spacing |
|-------|----------------|
| `ls-tighter` | -0.05em |
| `ls-tight` | -0.025em |
| `ls-normal` | 0 |
| `ls-wide` | 0.025em |
| `ls-wider` | 0.05em |
| `ls-widest` | 0.1em |

## Font style

| Class | CSS |
|-------|-----|
| `italic` | `font-style: italic` |
| `not-italic` | `font-style: normal` |

## font-weight shortcuts

In addition to `fw-*` classes there is a longer `font-weight-*` form — handy when composing class names in templates or alongside `text-*` color classes:

| Class | font-weight |
|-------|-------------|
| `font-weight-thin` | 100 |
| `font-weight-light` | 300 |
| `font-weight-regular` | 400 |
| `font-weight-medium` | 500 |
| `font-weight-semi-bold` | 600 |
| `font-weight-bold` | 700 |
| `font-weight-heavy` | 900 |

Both `fw-bold` and `font-weight-bold` produce the same result.

## Responsive variants

All classes support responsive prefixes:

```html
<p class="fs-sm md:fs-base lg:fs-lg">
  Responsive font size
</p>

<h1 class="fw-regular md:fw-bold">
  Responsive weight
</h1>
```

## Examples

```html
<p class="fs-xs fw-light lh-loose ls-widest">Small light text</p>
<h2 class="fs-3xl fw-bold lh-tight ls-tight">Large heading</h2>
<span class="fs-base fw-medium lh-normal">Regular body text</span>
<em class="italic fs-lg text-grey">Italicized caption</em>
<strong class="font-weight-bold fs-xl">Highlighted value</strong>
```
