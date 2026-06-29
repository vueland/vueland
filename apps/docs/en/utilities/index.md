# Utility Classes

Vueland UI provides two complementary layers of CSS utilities:

- **Predefined utilities** — a set of ready-made classes for spacing, colors, typography, layout and more. Compiled from SCSS and shipped with the library.
- **JIT utilities** — arbitrary-value classes and custom generated utilities from the `@vueland/utils-jit` Vite plugin, based on classes actually used in your source files.

Both layers support **responsive variants** and share the same breakpoint configuration when `@vueland/utils-jit` is used.

The same breakpoints also drive the [Grid system components](/en/components/CRow) — `CRow`, `CCol`, and `CSpacer` — so column widths and alignment respond to the same values as utility classes. Built-in breakpoint names are available as props; custom names configured through `utilsJIT` are used as generated classes such as `tablet-6`.

## Predefined utilities

Simply add the needed class to any HTML element or component:

```html
<div class="pa-4 text-center bg-blue text-white">Hello, world!</div>
```

### Responsive variants

Most utilities support responsive prefixes that apply styles from the given breakpoint upward (mobile-first):

| Prefix | Default min-width |
| ------ | ----------------- |
| (none) | all sizes         |
| `sm:`  | 600px             |
| `md:`  | 960px             |
| `lg:`  | 1280px            |
| `xl:`  | 1920px            |
| `xxl:` | 2560px            |

```html
<div class="pa-2 md:pa-6 lg:pa-10">Responsive padding</div>
```

## JIT utilities

The `@vueland/utils-jit` Vite plugin extends the utility layer with arbitrary values in square brackets:

```html
<div class="w-[320px] h-[200px] bg-[#42b883] z-[100]">Arbitrary values</div>
```

JIT classes are generated on demand — only the classes actually used in your source files end up in the CSS bundle. Nothing is shipped upfront.

It can also generate project-specific static or parameterized utilities such as `flex-center` or `grid-cols-3` through [`defineRule`](/en/plugins/utils-jit/custom-rules).

### Setup

```ts
// vite.config.ts
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [utilsJIT()],
})
```

```ts
// Import the generated CSS in your entry
import 'virtual:utils-jit.css'
```

### Responsive JIT classes

JIT classes support the same responsive prefixes as predefined utilities:

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px]">Responsive widths</div>
```

### Hover and focus variants

```html
<button class="bg-[#42b883] hover:bg-[#33a06f] focus:px-[24px]">Button</button>
```

## Syncing breakpoints across both layers

When you configure `breakpoints` in `utilsJIT()`, they are automatically applied to **both** layers — predefined SCSS utilities and JIT classes — without any extra configuration:

```ts
// vite.config.ts
utilsJIT({
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
  },
})
```

After this, `sm:d-flex` (predefined) and `sm:w-[960px]` (JIT) both activate at exactly `600px`. The reactive `useBreakpoints` composable in JS uses the same values as well. See [Breakpoints](/en/guide/breakpoints) for details.

## Sections

| Section                    | Description                                     |
| -------------------------- | ----------------------------------------------- |
| [Colors](./colors)         | Background, text color, hover/active states     |
| [Spacing](./spacing)       | margin, padding, gap                            |
| [Typography](./typography) | Font size, weight, line height                  |
| [Text](./text)             | Alignment, transform, wrap                      |
| [Flex](./flex)             | Flexbox utilities                               |
| [Display](./display)       | display values                                  |
| [Sizing](./sizing)         | width, height, min/max                          |
| [Positioning](./position)  | position, inset, z-index                        |
| [Borders](./borders)       | border-width, style, color                      |
| [Radius](./radius)         | border-radius                                   |
| [Elevation](./elevation)   | box-shadow (Material Design)                    |
| [Opacity](./opacity)       | opacity                                         |
| [Overflow](./overflow)     | overflow                                        |
| [Helpers](./helpers)       | visibility, pointer-events, object-fit and more |
| [Cursor](./cursor)         | cursor                                          |
