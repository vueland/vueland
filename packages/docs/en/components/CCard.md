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

| Component | Class | Description |
|---|---|---|
| `CCard` | `.c-card` | Root card container |
| `CCardHeader` | `.c-card-header` | Card header |
| `CCardBody` | `.c-card-body` | Main content area |
| `CCardFooter` | `.c-card-footer` | Card footer |

## Props

All four components accept the same props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `tag` | `string` | `'div'` | HTML tag of the root element |

## Slots

| Slot | Description |
|---|---|
| `default` | Arbitrary content |

## CSS variables

| Variable | Default | Description |
|---|---|---|
| `--card-width` | `100%` | Card width |
| `--card-border-radius` | `8px` | Border radius |
| `--card-header-padding` | `16px` | Header padding |
| `--card-body-padding` | `16px` | Body padding |
| `--card-footer-padding` | `16px` | Footer padding |
| `--card-background-color` | `var(--c-app-surface-color)` | Background color |
| `--card-text-color` | `var(--c-app-text-color)` | Text color |

Variables can be overridden via CSS or inline styles:

```vue
<CCard style="--card-border-radius: 16px; --card-background-color: #f5f7fa">
  ...
</CCard>
```
