# Отображение

Утилиты для управления CSS-свойством `display`.

## Классы

| Класс | display |
|-------|---------|
| `d-none` | `none` |
| `d-block` | `block` |
| `d-inline` | `inline` |
| `d-inline-block` | `inline-block` |
| `d-flex` | `flex` |
| `d-inline-flex` | `inline-flex` |
| `d-grid` | `grid` |
| `d-inline-grid` | `inline-grid` |
| `d-table` | `table` |
| `d-table-row` | `table-row` |
| `d-table-cell` | `table-cell` |
| `d-contents` | `contents` |

## Адаптивные варианты

Все классы поддерживают адаптивные префиксы — удобно для скрытия или изменения типа отображения на разных экранах:

| Пример | Результат |
|--------|-----------|
| `d-none md:d-block` | Скрыт на мобильных, блок на планшетах |
| `d-block md:d-none` | Блок на мобильных, скрыт на планшетах |
| `d-block md:d-flex` | Блок на мобильных, флекс на планшетах |

## Примеры

```html
<!-- Скрыть на мобильных -->
<div class="d-none md:d-block">
  Видно только на планшетах и шире
</div>

<!-- Показать только на мобильных -->
<div class="d-block md:d-none">
  Видно только на мобильных
</div>

<!-- Инлайн-флекс для иконки с текстом -->
<span class="d-inline-flex items-center gap-2">
  <i class="icon"></i>
  Текст
</span>

<!-- Грид-контейнер -->
<div class="d-grid gap-4">
  <div>Ячейка 1</div>
  <div>Ячейка 2</div>
</div>
```
