# CSS Grid

Utilities for building two-dimensional layouts with CSS Grid. All classes support responsive prefixes.

## Enable grid

Use `d-grid` or `d-inline-grid` from the [Display](/en/utilities/display) utilities to activate a grid context.

```html
<div class="d-grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## grid-template-columns

Define the number of equal columns using fractional units.

| Class            | CSS                                                 |
| ---------------- | --------------------------------------------------- |
| `grid-cols-1`    | `grid-template-columns: repeat(1, minmax(0, 1fr))`  |
| `grid-cols-2`    | `grid-template-columns: repeat(2, minmax(0, 1fr))`  |
| `grid-cols-3`    | `grid-template-columns: repeat(3, minmax(0, 1fr))`  |
| `grid-cols-4`    | `grid-template-columns: repeat(4, minmax(0, 1fr))`  |
| `grid-cols-6`    | `grid-template-columns: repeat(6, minmax(0, 1fr))`  |
| `grid-cols-12`   | `grid-template-columns: repeat(12, minmax(0, 1fr))` |
| `grid-cols-none` | `grid-template-columns: none`                       |

Classes are generated for 1 through 12.

## grid-template-rows

| Class            | CSS                                             |
| ---------------- | ----------------------------------------------- |
| `grid-rows-1`    | `grid-template-rows: repeat(1, minmax(0, 1fr))` |
| `grid-rows-2`    | `grid-template-rows: repeat(2, minmax(0, 1fr))` |
| `grid-rows-3`    | `grid-template-rows: repeat(3, minmax(0, 1fr))` |
| `grid-rows-6`    | `grid-template-rows: repeat(6, minmax(0, 1fr))` |
| `grid-rows-none` | `grid-template-rows: none`                      |

Classes are generated for 1 through 6.

## Column span

Control how many columns an item spans.

| Class           | CSS                              |
| --------------- | -------------------------------- |
| `col-span-1`    | `grid-column: span 1 / span 1`   |
| `col-span-2`    | `grid-column: span 2 / span 2`   |
| `col-span-6`    | `grid-column: span 6 / span 6`   |
| `col-span-12`   | `grid-column: span 12 / span 12` |
| `col-span-full` | `grid-column: 1 / -1`            |

```html
<div class="d-grid grid-cols-12 gap-4">
  <div class="col-span-8">Main content</div>
  <div class="col-span-4">Sidebar</div>
</div>
```

## Row span

| Class           | CSS                         |
| --------------- | --------------------------- |
| `row-span-1`    | `grid-row: span 1 / span 1` |
| `row-span-2`    | `grid-row: span 2 / span 2` |
| `row-span-full` | `grid-row: 1 / -1`          |

Classes are generated for 1 through 6.

## Column start / end

Explicitly place items by line number.

| Class                          | CSS                       |
| ------------------------------ | ------------------------- |
| `col-start-1` … `col-start-13` | `grid-column-start: N`    |
| `col-end-1` … `col-end-13`     | `grid-column-end: N`      |
| `col-start-auto`               | `grid-column-start: auto` |
| `col-end-auto`                 | `grid-column-end: auto`   |

## Row start / end

| Class                         | CSS                    |
| ----------------------------- | ---------------------- |
| `row-start-1` … `row-start-7` | `grid-row-start: N`    |
| `row-end-1` … `row-end-7`     | `grid-row-end: N`      |
| `row-start-auto`              | `grid-row-start: auto` |
| `row-end-auto`                | `grid-row-end: auto`   |

## grid-auto-flow

Control how auto-placed items fill the grid.

| Class                 | CSS                            |
| --------------------- | ------------------------------ |
| `grid-flow-row`       | `grid-auto-flow: row`          |
| `grid-flow-col`       | `grid-auto-flow: column`       |
| `grid-flow-dense`     | `grid-auto-flow: dense`        |
| `grid-flow-row-dense` | `grid-auto-flow: row dense`    |
| `grid-flow-col-dense` | `grid-auto-flow: column dense` |

## grid-auto-columns / grid-auto-rows

Size implicitly created tracks.

| Class            | CSS                                 |
| ---------------- | ----------------------------------- |
| `auto-cols-auto` | `grid-auto-columns: auto`           |
| `auto-cols-min`  | `grid-auto-columns: min-content`    |
| `auto-cols-max`  | `grid-auto-columns: max-content`    |
| `auto-cols-fr`   | `grid-auto-columns: minmax(0, 1fr)` |
| `auto-rows-auto` | `grid-auto-rows: auto`              |
| `auto-rows-min`  | `grid-auto-rows: min-content`       |
| `auto-rows-max`  | `grid-auto-rows: max-content`       |
| `auto-rows-fr`   | `grid-auto-rows: minmax(0, 1fr)`    |

## place-items

Shorthand for `align-items` + `justify-items`.

| Class                  | Value      |
| ---------------------- | ---------- |
| `place-items-start`    | `start`    |
| `place-items-end`      | `end`      |
| `place-items-center`   | `center`   |
| `place-items-stretch`  | `stretch`  |
| `place-items-baseline` | `baseline` |

## place-content

Shorthand for `align-content` + `justify-content`.

| Class                   | Value           |
| ----------------------- | --------------- |
| `place-content-start`   | `start`         |
| `place-content-end`     | `end`           |
| `place-content-center`  | `center`        |
| `place-content-stretch` | `stretch`       |
| `place-content-between` | `space-between` |
| `place-content-around`  | `space-around`  |
| `place-content-evenly`  | `space-evenly`  |

## place-self

Shorthand for `align-self` + `justify-self` on a single item.

| Class                | Value     |
| -------------------- | --------- |
| `place-self-auto`    | `auto`    |
| `place-self-start`   | `start`   |
| `place-self-end`     | `end`     |
| `place-self-center`  | `center`  |
| `place-self-stretch` | `stretch` |

## Responsive variants

All grid utilities support breakpoint prefixes. Apply from a breakpoint upward (mobile-first):

```html
<!-- 1 col on mobile → 2 on sm → 3 on md → 4 on lg -->
<div class="d-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>
```

Responsive column span:

```html
<div class="d-grid grid-cols-12 gap-4">
  <!-- full width on mobile, 8/12 on md+ -->
  <div class="col-span-12 md:col-span-8">Main</div>
  <div class="col-span-12 md:col-span-4">Aside</div>
</div>
```

## Examples

**Dashboard layout — 12-column grid:**

```html
<div class="d-grid grid-cols-12 gap-4">
  <div class="col-span-12 md:col-span-3">Sidebar</div>
  <div class="col-span-12 md:col-span-6">Content</div>
  <div class="col-span-12 md:col-span-3">Widgets</div>
</div>
```

**Card grid — auto-responsive:**

```html
<div class="d-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="col-span-1 sm:col-span-2 lg:col-span-1">Featured card</div>
  <div>Card</div>
  <div>Card</div>
</div>
```

**Centered item:**

```html
<div class="d-grid grid-cols-3 grid-rows-3 place-items-center" style="height: 300px">
  <div class="col-start-2 row-start-2">Centered</div>
</div>
```

> For uncommon grid templates such as `grid-template-columns: repeat(5, 120px)`, add a project rule with `@vueland/utils-jit` [`defineRule`](/en/plugins/utils-jit/custom-rules), for example a `grid-cols-[...]` or `grid-template-[...]` utility.
