# CCard

`CCard` — компонент карточки с фиксированной структурой. Состоит из четырёх самостоятельных компонентов: `CCard`, `CCardHeader`, `CCardBody`, `CCardFooter` — каждый из которых можно использовать независимо.

## Базовое использование

```vue
<c-card>
  <c-card-header>Заголовок</c-card-header>
  <c-card-body>Основное содержимое карточки</c-card-body>
  <c-card-footer>Подвал</c-card-footer>
</c-card>
```

## Компоненты

| Компонент     | Класс            | Описание                    |
| ------------- | ---------------- | --------------------------- |
| `CCard`       | `.c-card`        | Корневой контейнер карточки |
| `CCardHeader` | `.c-card-header` | Шапка карточки              |
| `CCardBody`   | `.c-card-body`   | Основная область контента   |
| `CCardFooter` | `.c-card-footer` | Подвал карточки             |

## Props

Все четыре компонента принимают одинаковый набор props:

| Prop  | Тип      | По умолчанию | Описание                    |
| ----- | -------- | ------------ | --------------------------- |
| `tag` | `string` | `'div'`      | HTML-тег корневого элемента |

## Slots

| Slot      | Описание                |
| --------- | ----------------------- |
| `default` | Произвольное содержимое |

## CSS-переменные

| Переменная                         | Значение по умолчанию                         | Описание               |
| ---------------------------------- | --------------------------------------------- | ---------------------- |
| `--c-card-width`                   | `100%`                                        | Ширина карточки        |
| `--c-card-border-radius`           | `var(--c-sys-shape-lg)`                       | Скругление углов       |
| `--c-card-header-padding`          | `var(--c-sys-space-5)`                        | Отступ шапки           |
| `--c-card-body-padding`            | `var(--c-sys-space-4)`                        | Отступ тела            |
| `--c-card-footer-padding`          | `var(--c-sys-space-4)`                        | Отступ подвала         |
| `--c-card-background-color`        | `var(--c-sys-color-surface-container-low)`    | Цвет фона              |
| `--c-card-header-background-color` | `var(--c-sys-color-surface-container)`        | Цвет фона шапки        |
| `--c-card-footer-background-color` | `var(--c-sys-color-surface-container-lowest)` | Цвет фона подвала      |
| `--c-card-text-color`              | `var(--c-sys-color-on-surface)`               | Цвет текста            |
| `--c-card-muted-text-color`        | `var(--c-sys-color-on-surface-variant)`       | Цвет текста шапки/низа |
| `--c-card-border-color`            | `var(--c-sys-color-outline)`                  | Цвет рамки             |
| `--c-card-border-width`            | `var(--c-sys-border-width-thin)`              | Толщина рамки          |
| `--c-card-elevation`               | `var(--c-sys-elevation-1)`                    | Тень                   |

Переменные переопределяются через CSS или inline-стили:

```vue
<c-card style="--c-card-border-radius: 16px; --c-card-background-color: #f5f7fa">
  ...
</c-card>
```
