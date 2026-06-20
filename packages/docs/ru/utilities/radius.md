# Радиусы

Утилиты для управления CSS-свойством `border-radius`.

## Все углы

| Класс | border-radius |
|-------|--------------|
| `radius-0` | `0` |
| `radius-2` | `2px` |
| `radius-4` | `4px` |
| `radius-6` | `6px` |
| `radius-8` | `8px` |
| `radius-12` | `12px` |
| `radius-16` | `16px` |
| `radius-24` | `24px` |
| `radius-32` | `32px` |
| `radius-pill` | `9999px` (таблетка) |
| `radius-circle` | `50%` (круг) |

## Отдельные углы

| Класс | Свойство |
|-------|----------|
| `radius-top-left-{n}` | `border-top-left-radius` |
| `radius-top-right-{n}` | `border-top-right-radius` |
| `radius-bottom-left-{n}` | `border-bottom-left-radius` |
| `radius-bottom-right-{n}` | `border-bottom-right-radius` |

Допустимые значения `{n}`: `0`, `2`, `4`, `6`, `8`, `12`, `16`, `24`, `32`.

## Примеры

```html
<!-- Скруглённая карточка -->
<div class="radius-8 elevation-2 pa-4">Карточка</div>

<!-- Кнопка-таблетка -->
<button class="radius-pill pa-3 px-6 bg-blue text-white">Кнопка</button>

<!-- Аватар (круг) -->
<img class="radius-circle" style="width: 48px; height: 48px" src="avatar.jpg" />

<!-- Скруглён только сверху -->
<div class="radius-top-left-8 radius-top-right-8">
  Шапка карточки
</div>

<!-- Разные радиусы -->
<div class="radius-top-left-16 radius-bottom-right-16">
  Асимметричные углы
</div>
```
