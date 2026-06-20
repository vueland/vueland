# Переполнение

Утилиты для управления CSS-свойством `overflow`.

## Все стороны

| Класс | overflow |
|-------|---------|
| `overflow-hidden` | `hidden` |
| `overflow-auto` | `auto` |
| `overflow-visible` | `visible` |
| `overflow-scroll` | `scroll` |
| `overflow-clip` | `clip` |

## По горизонтали (overflow-x)

| Класс | overflow-x |
|-------|-----------|
| `overflow-x-auto` | `auto` |
| `overflow-x-hidden` | `hidden` |
| `overflow-x-scroll` | `scroll` |
| `overflow-x-clip` | `clip` |

## По вертикали (overflow-y)

| Класс | overflow-y |
|-------|-----------|
| `overflow-y-auto` | `auto` |
| `overflow-y-hidden` | `hidden` |
| `overflow-y-scroll` | `scroll` |
| `overflow-y-clip` | `clip` |

## Примеры

```html
<!-- Прокручиваемая область -->
<div class="overflow-auto" style="max-height: 300px">
  <!-- Длинный контент -->
</div>

<!-- Скрыть выходящий контент -->
<div class="overflow-hidden radius-8">
  <img src="image.jpg" />
</div>

<!-- Горизонтальная прокрутка таблицы -->
<div class="overflow-x-auto">
  <table>...</table>
</div>

<!-- Вертикальная прокрутка с фиксированной высотой -->
<div class="overflow-y-scroll" style="height: 400px">
  <!-- Контент -->
</div>
```
