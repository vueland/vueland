# Текст

Утилиты для выравнивания текста, трансформации, переноса строк и обрезки.

## Выравнивание

| Класс | text-align |
|-------|------------|
| `text-left` | `left` |
| `text-center` | `center` |
| `text-right` | `right` |
| `text-justify` | `justify` |
| `text-justify-all` | `justify-all` |

## Перенос строк

| Класс | Свойство | Значение |
|-------|----------|---------|
| `text-nowrap` | `white-space` | `nowrap` |

## Обрезка текста

| Класс | Эффект |
|-------|--------|
| `text-truncate` | Обрезает текст с `…` (требует `overflow: hidden; white-space: nowrap`) |

## Трансформация

| Класс | text-transform |
|-------|---------------|
| `text-uppercase` | `uppercase` |
| `text-lowercase` | `lowercase` |
| `text-capitalize` | `capitalize` |

## Адаптивные варианты

```html
<p class="text-left md:text-center lg:text-right">
  Адаптивное выравнивание
</p>

<span class="text-lowercase md:text-uppercase">
  Адаптивная трансформация
</span>
```

## Примеры

```html
<p class="text-center fw-bold">Заголовок по центру</p>
<p class="text-justify lh-relaxed">Текст по ширине</p>
<div class="text-truncate" style="width: 200px">
  Очень длинный текст который будет обрезан многоточием
</div>
<span class="text-uppercase ls-wider">ЗАГОЛОВОК С РАЗРЯДКОЙ</span>
```
