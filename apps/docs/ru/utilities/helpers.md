# Помощники

Вспомогательные утилиты для видимости, доступности, взаимодействия и отображения контента.

## Видимость

| Класс | Свойство | Значение |
|-------|----------|---------|
| `visible` | `visibility` | `visible` |
| `invisible` | `visibility` | `hidden` |

> Отличие от `d-none`: `invisible` скрывает элемент, но сохраняет его в потоке документа.

## Доступность

| Класс | Эффект |
|-------|--------|
| `sr-only` | Элемент видим только скринридерам (position absolute, clip, size 1px) |

## Pointer events

| Класс | pointer-events |
|-------|---------------|
| `pointer-events-none` | `none` |
| `pointer-events-auto` | `auto` |

## Выделение текста (user-select)

| Класс | user-select |
|-------|------------|
| `select-none` | `none` |
| `select-text` | `text` |
| `select-all` | `all` |
| `select-auto` | `auto` |

## Object fit

| Класс | object-fit |
|-------|-----------|
| `object-contain` | `contain` |
| `object-cover` | `cover` |
| `object-fill` | `fill` |
| `object-none` | `none` |

## Соотношение сторон (aspect-ratio)

| Класс | aspect-ratio |
|-------|-------------|
| `aspect-square` | `1 / 1` |
| `aspect-video` | `16 / 9` |
| `aspect-auto` | `auto` |

## Ограничение строк (line-clamp)

| Класс | Эффект |
|-------|--------|
| `line-clamp-1` | Ограничить 1 строкой с `…` |
| `line-clamp-2` | Ограничить 2 строками |
| `line-clamp-3` | Ограничить 3 строками |
| `line-clamp-4` | Ограничить 4 строками |
| `line-clamp-5` | Ограничить 5 строками |

## Примеры

```html
<!-- Метка только для скринридеров -->
<button>
  <span aria-hidden="true">X</span>
  <span class="sr-only">Закрыть диалог</span>
</button>

<!-- Некликабельный оверлей -->
<div class="pointer-events-none absolute inset-0">
  Декоративный слой
</div>

<!-- Изображение с сохранением пропорций -->
<div class="aspect-video overflow-hidden radius-8">
  <img class="w-100 h-100 object-cover" src="thumbnail.jpg" />
</div>

<!-- Квадратная иконка -->
<div class="aspect-square d-flex items-center justify-center bg-blue radius-4" style="width: 48px">
  <i class="icon text-white"></i>
</div>

<!-- Обрезка описания -->
<p class="line-clamp-2">
  Очень длинное описание товара, которое будет обрезано после второй строки...
</p>

<!-- Запретить выделение текста -->
<div class="select-none">Этот текст нельзя выделить</div>
```
