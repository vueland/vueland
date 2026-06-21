# Global CSS Variables

Vueland UI использует глобальные CSS-переменные для управления цветами, радиусами и базовыми параметрами интерфейса.

## Доступные переменные

| Переменная | По умолчанию | Описание |
| --- | --- | --- |
| `--global-border-radius` | `8px` | Базовый радиус скругления элементов |
| `--global-error-color` | `#ef231f` | Цвет ошибок |
| `--global-success-color` | `#43d31b` | Цвет успешных состояний |
| `--global-primary-color` | `#1f77c4` | Основной цвет интерфейса |
| `--global-secondary-color` | `#39638c` | Вторичный цвет |
| `--global-base-color` | `#ffffff` | Базовый цвет фона |
| `--global-text-color` | `#3d3d3d` | Основной цвет текста |

## Пример объявления

```css
:root {
  --global-border-radius: 8px;
  --global-primary-color: #1f77c4;
  --global-base-color: #ffffff;
  --global-text-color: #3d3d3d;
}
```

## Кастомизация темы

```css
:root {
  --global-primary-color: #673ab7;
  --global-border-radius: 10px;
}
```

После изменения переменных компоненты автоматически используют новые значения.
