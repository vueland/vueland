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

| Компонент | Класс | Описание |
|---|---|---|
| `CCard` | `.c-card` | Корневой контейнер карточки |
| `CCardHeader` | `.c-card-header` | Шапка карточки |
| `CCardBody` | `.c-card-body` | Основная область контента |
| `CCardFooter` | `.c-card-footer` | Подвал карточки |

## Props

Все четыре компонента принимают одинаковый набор props:

| Prop | Тип | По умолчанию | Описание |
|---|---|---|---|
| `tag` | `string` | `'div'` | HTML-тег корневого элемента |

## Slots

| Slot | Описание |
|---|---|
| `default` | Произвольное содержимое |

## CSS-переменные

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `--card-width` | `100%` | Ширина карточки |
| `--card-border-radius` | `8px` | Скругление углов |
| `--card-header-padding` | `16px` | Отступ шапки |
| `--card-body-padding` | `16px` | Отступ тела |
| `--card-footer-padding` | `16px` | Отступ подвала |
| `--card-background-color` | `var(--c-app-surface-color)` | Цвет фона |
| `--card-text-color` | `var(--c-app-text-color)` | Цвет текста |

Переменные переопределяются через CSS или inline-стили:

```vue
<CCard style="--card-border-radius: 16px; --card-background-color: #f5f7fa">
  ...
</CCard>
```
