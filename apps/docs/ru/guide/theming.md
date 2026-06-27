# Темификация

Vueland UI использует слоистую систему CSS-токенов. Reference-токены описывают сырые значения, system-токены описывают семантические роли интерфейса, а component-токены связывают конкретные компоненты с этими ролями.

## Определение тем

Передайте объект `themes` в `createVuelandUI`. Каждый ключ — имя темы, значение — объект `ThemeDefinition`:

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

## Переключение темы

Используйте метод `applyTheme` экземпляра плагина:

```ts
import { vueland } from './plugins/vueland'

vueland.applyTheme('dark')
```

Имя активной темы также записывается в `document.documentElement.dataset.theme`, поэтому `applyTheme('dark')` включает CSS-дефолты `[data-theme='dark']` до применения явных переопределений темы.

## Слои токенов

| Слой      | Формат CSS          | Назначение                                                                 |
| --------- | ------------------- | -------------------------------------------------------------------------- |
| Reference | `--c-ref-*`         | Сырые значения палитры и базовые шкалы Vueland                             |
| System    | `--c-sys-*`         | Семантические роли, которые используют компоненты и пользовательские стили |
| Component | `--c-{component}-*` | Настройки конкретного компонента, привязанные к system-токенам             |

## Токены `ThemeDefinition`

Используйте короткие camelCase-ключи. Цветовые роли мапятся в `--c-sys-color-*`, остальные группы — в свой system namespace:

| Группа             | Примеры                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| Цветовые роли      | `primary`, `onPrimary`, `surface`, `onSurface`, `outlineVariant`           |
| Состояния          | `stateHoverColor`, `stateFocusColor`, `stateDisabledOpacity`               |
| Типографика        | `typographyBodySize`, `typographyLabelWeight`, `typographyTitleLineHeight` |
| Отступы и контролы | `space1`, `space4`, `controlHeightMd`, `controlIconSize`                   |
| Форма и границы    | `shapeSm`, `shapeMd`, `shapePill`, `borderWidthThin`                       |
| Тени и движение    | `elevation1`, `motionDurationMedium`, `motionEasingStandard`               |
| Слои               | `zIndexDropdown`, `zIndexModal`, `zIndexTooltip`                           |

Все токены опциональны. Переопределяйте только роли, которые меняет ваша тема.

Интерактивные state-цвета по умолчанию выводятся из `primary`, а компоненты с собственной подложкой используют `surface` / `onSurface` как базу. Поэтому для типичной смены темы достаточно поменять `primary`, `surface` и `onSurface`: выбранные элементы, hover/focus-акценты и фон компонентов останутся согласованными.

## Пользовательские токены

Пользовательские токены темы должны быть явными CSS custom properties. Короткие произвольные ключи игнорируются, чтобы устаревшие токены не создавали сломанную тему молча.

```ts
themes: {
  light: {
    primary: '#4f6ef7',
    '--app-sidebar-bg': '#f0f2f5',
    '--app-header-height': '64px',
  },
}
```

## CSS-переменные

`primary` становится `--c-sys-color-primary`, `shapeMd` становится `--c-sys-shape-md` и так далее:

```css
:root {
  --c-sys-color-primary: #4f6ef7;
  --c-sys-color-background: #f5f7fa;
  --c-sys-color-on-surface: #1a1a2e;
}
```

Используйте system-токены в стилях приложения:

```scss
.my-card {
  background: var(--c-sys-color-surface);
  color: var(--c-sys-color-on-surface);
  border-color: var(--c-sys-color-outline-variant);
  border-radius: var(--c-sys-shape-md);
}
```
