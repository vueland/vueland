# CCard

`CCard` — компонент карточки с фиксированной структурой. Состоит из четырёх самостоятельных компонентов: `CCard`, `CCardHeader`, `CCardBody`, `CCardFooter` — каждый из которых можно использовать независимо.

## Базовое использование

```vue
<CCard>
  <CCardHeader>Заголовок</CCardHeader>
  <CCardBody>Основное содержимое карточки</CCardBody>
  <CCardFooter>Подвал</CCardFooter>
</CCard>
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

| Переменная                  | Значение по умолчанию           | Описание         |
| --------------------------- | ------------------------------- | ---------------- |
| `--c-card-width`            | `100%`                          | Ширина карточки  |
| `--c-card-border-radius`    | `var(--c-sys-shape-md)`         | Скругление углов |
| `--c-card-header-padding`   | `var(--c-sys-space-4)`          | Отступ шапки     |
| `--c-card-body-padding`     | `var(--c-sys-space-4)`          | Отступ тела      |
| `--c-card-footer-padding`   | `var(--c-sys-space-4)`          | Отступ подвала   |
| `--c-card-background-color` | `var(--c-sys-color-surface)`    | Цвет фона        |
| `--c-card-text-color`       | `var(--c-sys-color-on-surface)` | Цвет текста      |

Переменные переопределяются через CSS или inline-стили:

```vue
<CCard style="--c-card-border-radius: 16px; --c-card-background-color: #f5f7fa">
  ...
</CCard>
```
