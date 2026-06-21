# Утилитарные классы

Эта страница описывает встроенные utility-классы `@vueland/utils-jit` и допустимые значения.

## Поддерживаемые по умолчанию утилитарные классы

| Utility | CSS-свойства | Пример |
| --- | --- | --- |
| `w-[value]` | `width` | `w-[320px]` |
| `h-[value]` | `height` | `h-[200px]` |
| `min-w-[value]` | `min-width` | `min-w-[240px]` |
| `max-w-[value]` | `max-width` | `max-w-[1200px]` |
| `min-h-[value]` | `min-height` | `min-h-[100vh]` |
| `max-h-[value]` | `max-height` | `max-h-[600px]` |
| `ma-[value]` | `margin` | `ma-[16px]` |
| `mx-[value]` | `margin-left`, `margin-right` | `mx-[auto]` |
| `my-[value]` | `margin-top`, `margin-bottom` | `my-[24px]` |
| `mt-[value]` | `margin-top` | `mt-[16px]` |
| `mr-[value]` | `margin-right` | `mr-[12px]` |
| `mb-[value]` | `margin-bottom` | `mb-[24px]` |
| `ml-[value]` | `margin-left` | `ml-[12px]` |
| `pa-[value]` | `padding` | `pa-[20px]` |
| `px-[value]` | `padding-left`, `padding-right` | `px-[16px]` |
| `py-[value]` | `padding-top`, `padding-bottom` | `py-[12px]` |
| `pt-[value]` | `padding-top` | `pt-[10px]` |
| `pr-[value]` | `padding-right` | `pr-[8px]` |
| `pb-[value]` | `padding-bottom` | `pb-[20px]` |
| `pl-[value]` | `padding-left` | `pl-[16px]` |
| `left-[value]` | `left` | `left-[12px]` |
| `right-[value]` | `right` | `right-[12px]` |
| `top-[value]` | `top` | `top-[12px]` |
| `bottom-[value]` | `bottom` | `bottom-[12px]` |
| `inset-[value]` | `inset` | `inset-[0px]` |
| `radius-[value]` | `border-radius` | `radius-[12px]` |
| `radius-tl-[value]` | `border-top-left-radius` | `radius-tl-[8px]` |
| `radius-tr-[value]` | `border-top-right-radius` | `radius-tr-[8px]` |
| `radius-bl-[value]` | `border-bottom-left-radius` | `radius-bl-[8px]` |
| `radius-br-[value]` | `border-bottom-right-radius` | `radius-br-[8px]` |
| `z-[value]` | `z-index` | `z-[100]` |
| `opacity-[value]` | `opacity` | `opacity-[0.64]` |
| `color-[value]` | `color` | `color-[#111]` |
| `bg-[value]` | `background-color` | `bg-[#fff]` |

Все встроенные правила генерируются с `!important`.

## Допустимые значения

Значения проходят валидацию перед генерацией CSS. Если значение не проходит проверку, CSS-правило не создаётся.

## Size, padding, radius и position

Для `w`, `h`, `min-w`, `max-w`, `min-h`, `max-h`, `pa`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `radius`, `left`, `right`, `top`, `bottom`, `inset` поддерживаются CSS length-like значения:

```html
<div class="w-[320px]"></div>
<div class="h-[50%]"></div>
<div class="px-[1rem]"></div>
<div class="radius-[12px]"></div>
<div class="left-[10vw]"></div>
<div class="w-[calc(100%-32px)]"></div>
<div class="max-w-[clamp(320px,50vw,960px)]"></div>
<div class="h-[var(--panel-height)]"></div>
```

Поддерживаемые единицы:

```txt
px, em, rem, %, vw, vh, svw, svh, lvw, lvh, dvw, dvh, vmin, vmax, ch, ex, cm, mm, in, pt, pc
```

Также поддерживаются функции:

```txt
calc(), min(), max(), clamp(), var()
```

## Margin

Для margin-утилит поддерживаются length-like значения и `auto`:

```html
<div class="ma-[16px]"></div>
<div class="mx-[auto]"></div>
<div class="mt-[2rem]"></div>
<div class="mb-[calc(100%-20px)]"></div>
<div class="ma-[10px 20px]"></div>
```

## Padding

Для padding-утилит поддерживаются length-like значения:

```html
<div class="pa-[16px]"></div>
<div class="px-[12px]"></div>
<div class="py-[8px 12px]"></div>
```

## Radius

Для radius-утилит поддерживаются length-like значения:

```html
<div class="radius-[8px]"></div>
<div class="radius-[8px 12px]"></div>
<div class="radius-tl-[16px]"></div>
```

## Z-index

Для `z-[value]` поддерживаются числа, `auto` и CSS-переменные:

```html
<div class="z-[1]"></div>
<div class="z-[999]"></div>
<div class="z-[auto]"></div>
<div class="z-[var(--z-modal)]"></div>
```

## Opacity

Для `opacity-[value]` поддерживаются значения от `0` до `1`:

```html
<div class="opacity-[0]"></div>
<div class="opacity-[0.64]"></div>
<div class="opacity-[1]"></div>
<div class="opacity-[var(--opacity)]"></div>
```

## Color и background-color

Для `color-[value]` и `bg-[value]` поддерживаются hex, CSS color functions, CSS-переменные и некоторые ключевые значения:

```html
<div class="color-[#111]"></div>
<div class="bg-[#fff]"></div>
<div class="bg-[rgb(255,255,255)]"></div>
<div class="color-[oklch(60% 0.2 20)]"></div>
<div class="bg-[var(--vl-surface)]"></div>
<div class="color-[currentColor]"></div>
```

Некорректные значения игнорируются:

```html
<div class="w-[;]"></div>
<div class="radius-[.]"></div>
<div class="px-[auto]"></div>
<div class="z-[10px]"></div>
<div class="opacity-[2]"></div>
```
