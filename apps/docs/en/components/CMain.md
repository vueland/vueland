# CMain

`CMain` is the main content area of the application. It stretches to fill all available space inside [`CApp`](/en/components/CApp) and serves as the semantic container for page content.

## Basic usage

```html
<CApp>
  <CMain>
    <!-- page content -->
  </CMain>
</CApp>
```

## Props

| Prop  | Type     | Default | Description                  |
| ----- | -------- | ------- | ---------------------------- |
| `tag` | `string` | `'div'` | HTML tag of the root element |

## Slots

| Slot      | Description  |
| --------- | ------------ |
| `default` | Page content |

## CSS variables

`CMain` does not define its own CSS variables. Style it with utility classes or directly via the `.c-main` selector.

```scss
.c-main {
  flex: 1 0 auto;
  max-width: 100%;
}
```
