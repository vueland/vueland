# Флекс

Утилиты для работы с Flexbox. Для активации используйте `d-flex` или `d-inline-flex`.

## Направление

| Класс | flex-direction |
|-------|---------------|
| `flex-row` | `row` |
| `flex-col` | `column` |

## Перенос

| Класс | flex-wrap |
|-------|----------|
| `flex-wrap` | `wrap` |
| `flex-nowrap` | `nowrap` |
| `flex-wrap-reverse` | `wrap-reverse` |

## Выравнивание по главной оси (justify-content)

| Класс | justify-content |
|-------|----------------|
| `justify-start` | `flex-start` |
| `justify-end` | `flex-end` |
| `justify-center` | `center` |
| `justify-between` | `space-between` |
| `justify-around` | `space-around` |
| `justify-evenly` | `space-evenly` |

## Выравнивание элементов (align-items)

| Класс | align-items |
|-------|------------|
| `items-start` | `flex-start` |
| `items-end` | `flex-end` |
| `items-center` | `center` |
| `items-baseline` | `baseline` |
| `items-stretch` | `stretch` |

### Устаревшие псевдонимы (align-items)

Эти классы работают, но предпочтительнее использовать `items-*`:

| Класс | align-items |
|-------|------------|
| `align-start` | `flex-start` |
| `align-center` | `center` |
| `align-end` | `flex-end` |
| `align-baseline` | `baseline` |
| `align-stretch` | `stretch` |

## Выравнивание отдельного элемента (align-self)

| Класс | align-self |
|-------|-----------|
| `self-start` | `flex-start` |
| `self-end` | `flex-end` |
| `self-center` | `center` |
| `self-baseline` | `baseline` |
| `self-stretch` | `stretch` |

## Выравнивание строк (align-content)

| Класс | align-content |
|-------|--------------|
| `content-start` | `flex-start` |
| `content-end` | `flex-end` |
| `content-center` | `center` |
| `content-between` | `space-between` |
| `content-around` | `space-around` |

## Порядок

| Класс | order |
|-------|-------|
| `order-1` … `order-12` | `1` … `12` |

## Рост и сжатие

| Класс | Свойство | Значение |
|-------|----------|---------|
| `grow-0` | `flex-grow` | `0` |
| `grow-1` | `flex-grow` | `1` |
| `shrink-0` | `flex-shrink` | `0` |
| `shrink-1` | `flex-shrink` | `1` |

## Адаптивные варианты

Все классы поддерживают адаптивные префиксы:

```html
<div class="d-flex flex-col md:flex-row">
  Колонка на мобильных, строка на планшетах
</div>
```

## Примеры

```html
<!-- Горизонтальное центрирование -->
<div class="d-flex justify-center items-center" style="height: 100px">
  По центру
</div>

<!-- Пространство между элементами -->
<nav class="d-flex justify-between items-center pa-4">
  <span>Лого</span>
  <span>Меню</span>
</nav>

<!-- Колонки с переносом -->
<div class="d-flex flex-wrap gap-4">
  <div class="grow-1">Колонка 1</div>
  <div class="grow-1">Колонка 2</div>
  <div class="grow-1">Колонка 3</div>
</div>

<!-- Элемент не сжимается -->
<div class="d-flex">
  <div class="shrink-0" style="width: 200px">Сайдбар</div>
  <div class="grow-1">Контент</div>
</div>
```
