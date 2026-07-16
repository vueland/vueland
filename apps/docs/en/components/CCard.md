# CCard

`CCard` is a card component with a fixed structure. It consists of four independent components — `CCard`, `CCardHeader`, `CCardBody`, `CCardFooter` — each of which can be used on its own.

## Basic usage

```vue
<c-card>
  <c-card-header>Title</c-card-header>
  <c-card-body>Main card content</c-card-body>
  <c-card-footer>Footer</c-card-footer>
</c-card>
```

## Components

| Component     | Class            | Description         |
| ------------- | ---------------- | ------------------- |
| `CCard`       | `.c-card`        | Root card container |
| `CCardHeader` | `.c-card-header` | Card header         |
| `CCardBody`   | `.c-card-body`   | Main content area   |
| `CCardFooter` | `.c-card-footer` | Card footer         |

## Props

All four components accept the same props:

| Prop  | Type     | Default | Description                  |
| ----- | -------- | ------- | ---------------------------- |
| `tag` | `string` | `'div'` | HTML tag of the root element |

## Slots

| Slot      | Description       |
| --------- | ----------------- |
| `default` | Arbitrary content |

## CSS variables

| Variable                           | Default                                       | Description              |
| ---------------------------------- | --------------------------------------------- | ------------------------ |
| `--c-card-width`                   | `100%`                                        | Card width               |
| `--c-card-border-radius`           | `var(--c-sys-shape-lg)`                       | Border radius            |
| `--c-card-header-padding`          | `var(--c-sys-space-5)`                        | Header padding           |
| `--c-card-body-padding`            | `var(--c-sys-space-4)`                        | Body padding             |
| `--c-card-footer-padding`          | `var(--c-sys-space-4)`                        | Footer padding           |
| `--c-card-background-color`        | `var(--c-sys-color-surface-container-low)`    | Background color         |
| `--c-card-header-background-color` | `var(--c-sys-color-surface-container)`        | Header background color  |
| `--c-card-footer-background-color` | `var(--c-sys-color-surface-container-lowest)` | Footer background color  |
| `--c-card-text-color`              | `var(--c-sys-color-on-surface)`               | Text color               |
| `--c-card-muted-text-color`        | `var(--c-sys-color-on-surface-variant)`       | Header/footer text color |
| `--c-card-border-color`            | `var(--c-sys-color-outline)`                  | Border color             |
| `--c-card-border-width`            | `var(--c-sys-border-width-thin)`              | Border width             |
| `--c-card-elevation`               | `var(--c-sys-elevation-1)`                    | Box shadow               |

Variables can be overridden via CSS or inline styles:

```vue
<c-card style="--c-card-border-radius: 16px; --c-card-background-color: #f5f7fa">
  ...
</c-card>
```
