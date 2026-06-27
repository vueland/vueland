# CCard

`CCard` is a card component with a fixed structure. It consists of four independent components — `CCard`, `CCardHeader`, `CCardBody`, `CCardFooter` — each of which can be used on its own.

## Basic usage

```vue
<CCard>
  <CCardHeader>Title</CCardHeader>
  <CCardBody>Main card content</CCardBody>
  <CCardFooter>Footer</CCardFooter>
</CCard>
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

| Variable                    | Default                         | Description      |
| --------------------------- | ------------------------------- | ---------------- |
| `--c-card-width`            | `100%`                          | Card width       |
| `--c-card-border-radius`    | `var(--c-sys-shape-md)`         | Border radius    |
| `--c-card-header-padding`   | `var(--c-sys-space-4)`          | Header padding   |
| `--c-card-body-padding`     | `var(--c-sys-space-4)`          | Body padding     |
| `--c-card-footer-padding`   | `var(--c-sys-space-4)`          | Footer padding   |
| `--c-card-background-color` | `var(--c-sys-color-surface)`    | Background color |
| `--c-card-text-color`       | `var(--c-sys-color-on-surface)` | Text color       |

Variables can be overridden via CSS or inline styles:

```vue
<CCard style="--c-card-border-radius: 16px; --c-card-background-color: #f5f7fa">
  ...
</CCard>
```
