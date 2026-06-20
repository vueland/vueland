# Рамки

Утилиты для управления CSS-свойствами `border` и `outline`.

## Толщина рамки

| Класс | Свойство | Значение |
|-------|----------|---------|
| `border-0` | `border-width` | `0` |
| `border` | `border` | `1px solid` |
| `border-2` | `border-width` | `2px` |

## Направленные рамки

| Класс | Свойство |
|-------|----------|
| `border-t` | `border-top: 1px solid` |
| `border-b` | `border-bottom: 1px solid` |
| `border-l` | `border-left: 1px solid` |
| `border-r` | `border-right: 1px solid` |
| `border-t-0` | `border-top-width: 0` |
| `border-b-0` | `border-bottom-width: 0` |
| `border-l-0` | `border-left-width: 0` |
| `border-r-0` | `border-right-width: 0` |

## Стиль рамки

| Класс | border-style |
|-------|-------------|
| `border-solid` | `solid` |
| `border-dashed` | `dashed` |
| `border-dotted` | `dotted` |
| `border-none` | `none` |

## Цвет рамки

| Класс | border-color |
|-------|-------------|
| `border-transparent` | `transparent` |
| `border-current` | `currentColor` |

## Outline

| Класс | Свойство | Значение |
|-------|----------|---------|
| `outline-none` | `outline` | `none` |
| `outline` | `outline` | `1px solid currentColor` |

## Примеры

```html
<!-- Обычная рамка -->
<div class="border radius-4 pa-4">С рамкой</div>

<!-- Только нижняя рамка -->
<div class="border-b pa-2">Подчёркнутый элемент</div>

<!-- Пунктирная рамка -->
<div class="border border-dashed border-current radius-4 pa-4 op-5">
  Зона перетаскивания
</div>

<!-- Убрать outline у кнопки -->
<button class="outline-none">Без outline</button>

<!-- Рамка только слева (для цитат) -->
<blockquote class="border-l border-2 pl-4">
  Цитата
</blockquote>
```
