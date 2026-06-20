# Курсор

Утилиты для управления CSS-свойством `cursor`.

## Базовые

| Класс | cursor |
|-------|--------|
| `cursor-default` | `default` |
| `cursor-pointer` | `pointer` |
| `cursor-wait` | `wait` |
| `cursor-text` | `text` |
| `cursor-move` | `move` |
| `cursor-help` | `help` |
| `cursor-not-allowed` | `not-allowed` |

## Захват и перетаскивание

| Класс | cursor |
|-------|--------|
| `cursor-grab` | `grab` |
| `cursor-grabbing` | `grabbing` |

## Специальные

| Класс | cursor |
|-------|--------|
| `cursor-copy` | `copy` |
| `cursor-alias` | `alias` |
| `cursor-no-drop` | `no-drop` |
| `cursor-cell` | `cell` |
| `cursor-crosshair` | `crosshair` |
| `cursor-zoom-in` | `zoom-in` |
| `cursor-zoom-out` | `zoom-out` |

## Изменение размера

| Класс | cursor |
|-------|--------|
| `cursor-n-resize` | `n-resize` |
| `cursor-e-resize` | `e-resize` |
| `cursor-s-resize` | `s-resize` |
| `cursor-w-resize` | `w-resize` |
| `cursor-ne-resize` | `ne-resize` |
| `cursor-nw-resize` | `nw-resize` |
| `cursor-se-resize` | `se-resize` |
| `cursor-sw-resize` | `sw-resize` |
| `cursor-ew-resize` | `ew-resize` |
| `cursor-ns-resize` | `ns-resize` |

## Примеры

```html
<!-- Кнопка -->
<button class="cursor-pointer">Нажми меня</button>

<!-- Недоступный элемент -->
<button class="cursor-not-allowed op-4" disabled>Недоступно</button>

<!-- Перетаскиваемый элемент -->
<div class="cursor-grab" @mousedown="startDrag">
  Перетащи меня
</div>

<!-- Изображение с масштабированием -->
<img class="cursor-zoom-in" @click="openLightbox" src="photo.jpg" />

<!-- Ссылка-псевдоним -->
<a class="cursor-alias" href="/alias">Псевдоним</a>
```
