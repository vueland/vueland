# CApp

`CApp` is the root layout component of Vueland UI. It must wrap your entire application. It sets up the scroll management API for overlays (dialogs, menus, tooltips) and provides the `role="application"` landmark for accessibility.

## Basic usage

```vue
<template>
  <CApp>
    <CMain>
      <!-- your page content -->
    </CMain>
  </CApp>
</template>
```

## Scroll management

`CApp` provides `ApplicationApi` via inject, consumed internally by `CDialog`, `CMenu`, and `COverlay` to block and restore page scroll when overlays are open. You can also access it directly with composable `useApplication`.

```ts
import { useApplication } from '@vueland/ui/composables'

const app = useApplication()

app?.lockScroll()    // lock scroll
app?.unlockScroll()  // restore scroll
app?.getScrollTop()   // current scroll Y
app?.getScrollLeft()  // current scroll X
```

---

## API

### Props

`CApp` has no props.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Application content |

### Events

`CApp` emits no events.

### Expose

`CApp` exposes nothing directly. Use `inject($APP_API_KEY)` to access the scroll API.

### CSS classes

| Class | Description |
|-------|-------------|
| `c-app` | Root element |
| `c-app__wrapper` | Inner wrapper for scroll content |

### Accessibility

The root element carries `role="application"`, which marks the area as an interactive web application for screen readers.
