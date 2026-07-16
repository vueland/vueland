# CTooltip

Лёгкий тултип на основе `CMenu`. Показывает вспомогательный текст рядом с элементом-активатором. Следует паттерну WAI-ARIA tooltip — активатор автоматически получает `aria-describedby`.

<script setup>
import BasicExample from '../../examples/CTooltip/BasicExample.vue'
import PositioningExample from '../../examples/CTooltip/PositioningExample.vue'
import DelayExample from '../../examples/CTooltip/DelayExample.vue'
</script>

## Базовое использование

<BasicExample />

::: details Показать код

```vue
<template>
  <c-tooltip open-on-hover close-on-leave align="bottom-center" :offset-y="6">
    <template #activator="{ on, activator }">
      <button v-bind="activator" v-on="on">Сохранить</button>
    </template>
    Сохранить изменения
  </c-tooltip>
</template>
```

:::

## Позиционирование

<PositioningExample />

::: details Показать код

```vue
<c-tooltip align="top-center" open-on-hover close-on-leave :offset-y="6">
  <template #activator="{ on, activator }">
    <button v-bind="activator" v-on="on">Сверху</button>
  </template>
  Тултип сверху
</c-tooltip>
```

:::

## Задержки

`open-delay` / `close-delay` предотвращают случайные срабатывания при быстром движении мыши.

<DelayExample />

::: details Показать код

```vue
<c-tooltip open-on-hover close-on-leave align="bottom-center" :offset-y="6" :open-delay="500">
  <template #activator="{ on, activator }">
    <button v-bind="activator" v-on="on">Наведи</button>
  </template>
  Появится через 500мс
</c-tooltip>
```

:::

## Кастомная ширина

По умолчанию тултип оборачивает контент (`width="auto"`). Передай `width` для фиксированной ширины.

```vue
<c-tooltip open-on-hover close-on-leave :width="240">
  <template #activator="{ on, activator }">
    <button v-bind="activator" v-on="on">?</button>
  </template>
  Длинное описание которому нужна фиксированная ширина
</c-tooltip>
```

## Доступность

`CTooltip` автоматически:

- Генерирует уникальный `id` для контейнера
- Устанавливает `role="tooltip"` на контейнер
- Добавляет `aria-describedby` с этим `id` на активатор

```html
<!-- Результирующий HTML -->
<button aria-describedby="c-tooltip-abc123">Наведи</button>
<div id="c-tooltip-abc123" role="tooltip" class="c-tooltip c-menu">Сохранить изменения</div>
```

---

## API

`CTooltip` принимает все props, slots и события `CMenu`.

### Props

| Prop           | Тип                | По умолчанию | Описание                                                              |
| -------------- | ------------------ | ------------ | --------------------------------------------------------------------- |
| `width`        | `number \| string` | `'auto'`     | Ширина тултипа                                                        |
| `openOnHover`  | `boolean`          | —            | Открыть при наведении                                                 |
| `closeOnLeave` | `boolean`          | —            | Закрыть при уходе курсора                                             |
| `openDelay`    | `number \| string` | —            | Задержка перед открытием (мс)                                         |
| `closeDelay`   | `number \| string` | —            | Задержка перед закрытием (мс)                                         |
| `align`        | `AlignValue`       | —            | Сторона и выравнивание (напр. `bottom-center`, `top`, `right-center`) |
| `offsetX`      | `number \| string` | —            | Горизонтальный отступ (px)                                            |
| `offsetY`      | `number \| string` | —            | Вертикальный отступ (px)                                              |

> Все остальные props `CMenu` также принимаются.

### CSS-переменные

| Переменная                  | По умолчанию                                |
| --------------------------- | ------------------------------------------- |
| `--c-tooltip-bg-color`      | `var(--c-sys-color-surface)`                |
| `--c-tooltip-text-color`    | `var(--c-sys-color-on-surface)`             |
| `--c-tooltip-padding`       | `var(--c-sys-space-1) var(--c-sys-space-3)` |
| `--c-tooltip-border-radius` | `var(--c-sys-shape-sm)`                     |
| `--c-tooltip-border-color`  | `var(--c-sys-color-outline-variant)`        |
| `--c-tooltip-border-width`  | `var(--c-sys-border-width-thin)`            |
| `--c-tooltip-elevation`     | `var(--c-sys-elevation-2)`                  |

`CTooltip` построен на `CMenu` и прокидывает фон, цвет текста, скругление и тень в соответствующие `--c-menu-*` переменные.

### Slots

| Slot        | Props               | Описание                          |
| ----------- | ------------------- | --------------------------------- |
| `activator` | `{ on, activator }` | Элемент который показывает тултип |
| `default`   | —                   | Контент тултипа                   |

### Events

Наследует все события `CMenu`: `open`, `close`, `update:modelValue`.
