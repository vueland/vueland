# Отступы

Утилиты для управления `margin`, `padding` и `gap`. Шаг кратен 4px: значение `N` → `N × 4px`.

## Сокращения сторон

| Суффикс | Стороны |
|---------|---------|
| (нет)   | все стороны |
| `t`     | top     |
| `b`     | bottom  |
| `l`     | left    |
| `r`     | right   |
| `x`     | left + right |
| `y`     | top + bottom |

## Margin

| Класс | Свойство | Значение |
|-------|----------|---------|
| `ma-{n}` | `margin` | `n × 4px` |
| `mt-{n}` | `margin-top` | `n × 4px` |
| `mb-{n}` | `margin-bottom` | `n × 4px` |
| `ml-{n}` | `margin-left` | `n × 4px` |
| `mr-{n}` | `margin-right` | `n × 4px` |
| `mx-{n}` | `margin-left` + `margin-right` | `n × 4px` |
| `my-{n}` | `margin-top` + `margin-bottom` | `n × 4px` |
| `ma-auto` | `margin` | `auto` |
| `mx-auto` | `margin-left` + `margin-right` | `auto` |

## Padding

| Класс | Свойство | Значение |
|-------|----------|---------|
| `pa-{n}` | `padding` | `n × 4px` |
| `pt-{n}` | `padding-top` | `n × 4px` |
| `pb-{n}` | `padding-bottom` | `n × 4px` |
| `pl-{n}` | `padding-left` | `n × 4px` |
| `pr-{n}` | `padding-right` | `n × 4px` |
| `px-{n}` | `padding-left` + `padding-right` | `n × 4px` |
| `py-{n}` | `padding-top` + `padding-bottom` | `n × 4px` |

## Gap

| Класс | Свойство | Значение |
|-------|----------|---------|
| `gap-{n}` | `gap` | `n × 4px` |
| `gap-x-{n}` | `column-gap` | `n × 4px` |
| `gap-y-{n}` | `row-gap` | `n × 4px` |

## Таблица значений

| n | px |
|---|-----|
| 0 | 0px |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 7 | 28px |
| 8 | 32px |
| 9 | 36px |
| 10 | 40px |
| 11 | 44px |
| 12 | 48px |
| 13 | 52px |
| 14 | 56px |
| 15 | 60px |
| 16 | 64px |
| 17 | 68px |
| 18 | 72px |
| 19 | 76px |
| 20 | 80px |

## Адаптивные варианты

Добавьте префикс контрольной точки перед классом:

```html
<div class="pa-2 sm:pa-4 md:pa-6 lg:pa-8">
  Адаптивный padding
</div>

<div class="d-flex gap-2 md:gap-6">
  Адаптивный gap
</div>
```

## Примеры

```html
<!-- Отступы снаружи -->
<div class="ma-4">margin: 16px со всех сторон</div>
<div class="mt-2 mb-6">margin-top: 8px; margin-bottom: 24px</div>
<div class="mx-auto">центрирование по горизонтали</div>

<!-- Отступы внутри -->
<div class="pa-6">padding: 24px со всех сторон</div>
<div class="px-4 py-2">padding: 8px сверху/снизу, 16px слева/справа</div>

<!-- Флекс-разрывы -->
<div class="d-flex gap-4">
  <div>Элемент 1</div>
  <div>Элемент 2</div>
</div>

<div class="d-flex gap-x-4 gap-y-2 flex-wrap">
  <!-- gap-x между колонками, gap-y между строками -->
</div>
```
