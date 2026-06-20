# Темификация

Vueland UI поддерживает систему тем на основе CSS-переменных. Вы описываете токены в конфигурации — библиотека применяет их к `:root` при старте и при переключении темы.

## Определение тем

Передайте объект `themes` в `createVuelandUI`. Каждый ключ — имя темы, значение — объект `ThemeDefinition`:

```ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css'
import '@vueland/ui/css/lib.css'

export const vueland = createVuelandUI({
  components,
  theme: 'light',       // тема, активная при старте
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

## Переключение темы

Используйте метод `applyTheme` экземпляра плагина:

```ts
import { vueland } from './plugins/vueland'

vueland.applyTheme('dark')
```

Или через `useCore` внутри компонента:

```ts
import { useCore } from '@vueland/ui/composables'

const core = useCore()

function toggleTheme() {
  core?.applyTheme(core.theme === 'light' ? 'dark' : 'light')
}
```

## Токены `ThemeDefinition`

| Токен | Описание |
|---|---|
| `primary` | Основной цвет бренда |
| `onPrimary` | Цвет текста поверх `primary` |
| `secondary` | Вторичный цвет |
| `success` / `error` / `warning` / `info` | Семантические цвета |
| `background` | Фон страницы |
| `surface` | Фон карточек и панелей |
| `surfaceVariant` | Альтернативный фон поверхностей |
| `text` | Основной цвет текста |
| `textSecondary` | Второстепенный текст |
| `placeholder` | Цвет плейсхолдера |
| `border` | Цвет границ |
| `radius` | Скругление по умолчанию |
| `disabled` / `disabledBg` | Цвета отключённого состояния |
| `readonly` / `readonlyBg` | Цвета состояния только для чтения |
| `focus` | Цвет фокуса |
| `error` / `errorBg` | Цвет ошибки и его фон |
| `hover` / `overlay` | Интерактивные наложения |

Все токены опциональны — переопределяйте только нужные.

## Пользовательские токены

Вы можете добавлять собственные ключи — они тоже попадут в CSS-переменные:

```ts
themes: {
  light: {
    primary: '#4f6ef7',
    'sidebar-bg': '#f0f2f5',      // → var(--c-sidebar-bg)
    'header-height': '64px',      // → var(--c-header-height)
  },
}
```

## CSS-переменные

Каждый токен преобразуется в CSS-переменную формата `--c-{token}` и выставляется на `:root`:

```css
:root {
  --c-primary: #4f6ef7;
  --c-background: #f5f7fa;
  --c-text: #1a1a2e;
}
```

Используйте их в своих стилях для автоматической адаптации к смене темы:

```scss
.my-card {
  background: var(--c-surface);
  color: var(--c-text);
  border-color: var(--c-border);
}
```
