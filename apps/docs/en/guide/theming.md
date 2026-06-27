# Theming

Vueland UI uses layered CSS tokens. Reference tokens describe raw values, system tokens describe semantic UI roles, and component tokens map each component to those roles.

## Defining themes

Pass a `themes` object to `createVuelandUI`. Each key is a theme name; the value is a `ThemeDefinition` object:

```ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css'
import '@vueland/ui/css/lib.css'

export const vueland = createVuelandUI({
  components,
  theme: 'light',
  themes: {
    light: {
      primary: '#4f6ef7',
      onPrimary: '#ffffff',
      background: '#f5f7fa',
      surface: '#ffffff',
      onSurface: '#1a1a2e',
      error: '#e53935',
      shapeMd: '8px',
    },
    dark: {
      scheme: 'dark',
      primary: '#9db2ff',
      onPrimary: '#0b1020',
      background: '#121212',
      surface: '#1e1e2e',
      onSurface: '#e8e8f0',
      error: '#ffb4ab',
    },
  },
})
```

## Switching themes

Use `applyTheme` on the plugin instance:

```ts
import { vueland } from './plugins/vueland'

vueland.applyTheme('dark')
```

The active theme name is also written to `document.documentElement.dataset.theme`, so `applyTheme('dark')` enables `[data-theme='dark']` CSS defaults before applying explicit theme overrides.

## Token Layers

| Layer     | CSS format          | Purpose                                                    |
| --------- | ------------------- | ---------------------------------------------------------- |
| Reference | `--c-ref-*`         | Raw palette values and primitive scales shipped by Vueland |
| System    | `--c-sys-*`         | Semantic roles used by components and user styles          |
| Component | `--c-{component}-*` | Component-level knobs mapped to system tokens              |

## `ThemeDefinition` tokens

Use concise camelCase keys. Color roles map to `--c-sys-color-*`; other groups map to their system namespace:

| Group                | Examples                                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| Color roles          | `primary`, `onPrimary`, `surface`, `onSurface`, `outlineVariant`           |
| State layers         | `stateHoverColor`, `stateFocusColor`, `stateDisabledOpacity`               |
| Typography           | `typographyBodySize`, `typographyLabelWeight`, `typographyTitleLineHeight` |
| Spacing and controls | `space1`, `space4`, `controlHeightMd`, `controlIconSize`                   |
| Shape and borders    | `shapeSm`, `shapeMd`, `shapePill`, `borderWidthThin`                       |
| Elevation and motion | `elevation1`, `motionDurationMedium`, `motionEasingStandard`               |
| Stacking             | `zIndexDropdown`, `zIndexModal`, `zIndexTooltip`                           |

All tokens are optional. Override only the roles your theme changes.

Interactive state colors derive from `primary` by default, and surface-like components use `surface` / `onSurface` as their baseline. That keeps common theme changes small: changing `primary`, `surface` and `onSurface` is enough to recolor selected items, hover/focus accents and component backplates.

## Custom Tokens

Custom theme tokens must be explicit CSS custom properties. Short arbitrary keys are ignored, so accidental stale tokens do not silently create a broken theme.

```ts
themes: {
  light: {
    primary: '#4f6ef7',
    '--app-sidebar-bg': '#f0f2f5',
    '--app-header-height': '64px',
  },
}
```

## CSS Variables

`primary` becomes `--c-sys-color-primary`, `shapeMd` becomes `--c-sys-shape-md`, and so on:

```css
:root {
  --c-sys-color-primary: #4f6ef7;
  --c-sys-color-background: #f5f7fa;
  --c-sys-color-on-surface: #1a1a2e;
}
```

Use system tokens in application styles:

```scss
.my-card {
  background: var(--c-sys-color-surface);
  color: var(--c-sys-color-on-surface);
  border-color: var(--c-sys-color-outline-variant);
  border-radius: var(--c-sys-shape-md);
}
```
