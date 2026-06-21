# Theming

Vueland UI has a CSS-variable-based theming system. You define tokens in the plugin config — the library applies them to `:root` on startup and whenever you switch the active theme.

## Defining themes

Pass a `themes` object to `createVuelandUI`. Each key is a theme name; the value is a `ThemeDefinition` object:

```ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css'
import '@vueland/ui/css/lib.css'

export const vueland = createVuelandUI({
  components,
  theme: 'light',       // theme active on startup
  themes: {
    light: {
      primary: '#4f6ef7',
      onPrimary: '#ffffff',
      background: '#f5f7fa',
      surface: '#ffffff',
      text: '#1a1a2e',
      error: '#e53935',
    },
    dark: {
      primary: '#7b93ff',
      onPrimary: '#ffffff',
      background: '#121212',
      surface: '#1e1e2e',
      text: '#e0e0e0',
      error: '#ef5350',
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

Or via `useCore` inside a component:

```ts
import { useCore } from '@vueland/ui/composables'

const core = useCore()

function toggleTheme() {
  core?.applyTheme(core.theme === 'light' ? 'dark' : 'light')
}
```

## `ThemeDefinition` tokens

| Token | Description |
|---|---|
| `primary` | Brand primary color |
| `onPrimary` | Text color on top of `primary` |
| `secondary` | Secondary color |
| `success` / `error` / `warning` / `info` | Semantic colors |
| `background` | Page background |
| `surface` | Card and panel background |
| `surfaceVariant` | Alternative surface background |
| `text` | Main text color |
| `textSecondary` | Secondary text |
| `placeholder` | Placeholder color |
| `border` | Border color |
| `radius` | Default border radius |
| `disabled` / `disabledBg` | Disabled state colors |
| `readonly` / `readonlyBg` | Read-only state colors |
| `focus` | Focus ring color |
| `error` / `errorBg` | Error color and its background |
| `hover` / `overlay` | Interactive overlay colors |

All tokens are optional — override only the ones you need.

## Custom tokens

You can add any custom key — it will also become a CSS variable:

```ts
themes: {
  light: {
    primary: '#4f6ef7',
    'sidebar-bg': '#f0f2f5',      // → var(--c-sidebar-bg)
    'header-height': '64px',      // → var(--c-header-height)
  },
}
```

## CSS variables

Every token is converted to a CSS variable in the format `--c-{token}` and set on `:root`:

```css
:root {
  --c-primary: #4f6ef7;
  --c-background: #f5f7fa;
  --c-text: #1a1a2e;
}
```

Use them in your own styles to automatically adapt to theme changes:

```scss
.my-card {
  background: var(--c-surface);
  color: var(--c-text);
  border-color: var(--c-border);
}
```
