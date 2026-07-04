# CProgressLinear

Линейный индикатор прогресса. Показывает детерминированный прогресс от 0 до 100, опциональный буфер или бесконечную анимацию в режиме `indeterminate`.

<script setup>
import BasicExample from '../../examples/CProgressLinear/BasicExample.vue'
import ColorsExample from '../../examples/CProgressLinear/ColorsExample.vue'
import BufferExample from '../../examples/CProgressLinear/BufferExample.vue'
import IndeterminateExample from '../../examples/CProgressLinear/IndeterminateExample.vue'
import PresetExample from '../../examples/CProgressLinear/PresetExample.vue'
</script>

## Базовое использование

`value` задаёт ширину бара в процентах и обрезается до диапазона 0–100.

<BasicExample />

::: details Показать код

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <CProgressLinear :value="value" height="8" />

  <CBtn @click="value = Math.max(0, value - 10)">-10</CBtn>
  <CBtn @click="value = Math.min(100, value + 10)">+10</CBtn>
</template>
```

:::

## Цвета и высота

`color` принимает палитровый токен (`teal`, `green-darken-1`) или сырой цвет (`#fa5a5a`, `rgb(...)`, `var(...)`) — предопределённого набора нет. Класс `bg-*` ложится на бар и буфер; трек остаётся на токенах темы и при необходимости перекрашивается через пресет (зона `background`). `height` задаёт высоту бара в пикселях.

<ColorsExample />

::: details Показать код

```html
<CProgressLinear color="indigo" value="80" height="4" />
<CProgressLinear color="teal" value="65" height="6" />
<CProgressLinear color="deep-purple-lighten-1" value="50" height="8" />
<CProgressLinear color="green-darken-1" value="90" height="10" />
<CProgressLinear color="#FFA726" value="35" height="12" />
<CProgressLinear color="#fa5a5a" value="20" height="14" />
```

:::

::: tip Сырой цвет должен быть литералом
Arbitrary-классы (`bg-[#fa5a5a]`) генерирует [utils-jit](/ru/plugins/utils-jit/getting-started) статическим сканом исходников: `color="#fa5a5a"` сработает, `:color="someVar"` с сырым значением — нет. Палитровых токенов это не касается. Подробнее — в [`colorAttributes`](/ru/plugins/utils-jit/configuration#colorattributes).
:::

## Буфер

`buffer-value` рендерит полупрозрачный бар впереди основного — полезно для стриминга и предзагрузки.

<BufferExample />

::: details Показать код

```vue
<template>
  <CProgressLinear :value="value" :buffer-value="buffer" height="8" />
  <CProgressLinear color="green-darken-1" value="30" buffer-value="70" height="8" />
</template>
```

:::

## Indeterminate

Бесконечная анимация для операций с неизвестной длительностью.

<IndeterminateExample />

::: details Показать код

```html
<CProgressLinear indeterminate height="4" />
<CProgressLinear indeterminate color="teal" height="6" />
<CProgressLinear indeterminate color="#7C4DFF" height="8" />
```

:::

## Пресеты

`CProgressLinear` поддерживает [систему пресетов](/ru/guide/presets). Зоны маппятся 1:1 на DOM и покрывают все окрашиваемые элементы: `root`, `background` (трек), `buffer` и `bar` (в режиме `indeterminate` применяется к обоим барам) — трек, буфер и бар перекрашиваются `bg-*` утилитами. Состояния: `indeterminate` и `complete` (`value` ≥ 100); `indeterminate` приоритетнее.

В демо ниже бар индиго во время загрузки и становится зелёным, когда `value` доходит до 100 — без условных классов в шаблоне, пресет сам резолвит состояние:

<PresetExample />

::: details Показать код

```ts
// main.ts — пресет регистрируется один раз
createVuelandUI({
  presets: {
    progress: {
      download: {
        base: { bar: ['bg-indigo'] },
        complete: { bar: ['bg-green'] },
      },
    },
  },
})
```

```vue
<template>
  <CProgressLinear preset="progress.download" :value="value" height="8" />
</template>
```

:::

## Доступность

Корневой элемент получает `role="progressbar"` с `aria-valuemin="0"`, `aria-valuemax="100"` и `aria-valuenow` с текущим значением. В режиме `indeterminate` атрибут `aria-valuenow` снимается — это соответствует паттерну WAI-ARIA progressbar.

---

## API

### Пропы

| Проп            | Тип                | По умолчанию | Описание                                                                                                  |
| --------------- | ------------------ | ------------ | --------------------------------------------------------------------------------------------------------- |
| `value`         | `number \| string` | `0`          | Ширина бара в процентах, обрезается до 0–100                                                              |
| `bufferValue`   | `number \| string` | —            | Ширина буфера в процентах, обрезается до 0–100                                                            |
| `height`        | `number \| string` | `4`          | Высота бара (px)                                                                                          |
| `indeterminate` | `boolean`          | `false`      | Режим бесконечной анимации                                                                                |
| `color`         | `string`           | —            | Палитровый токен (`teal`) или сырой цвет (`#fa5a5a`, `rgb(...)`, `var(...)`); без пропа — primary из темы |
| `preset`        | `string`           | —            | Имя пресета (путь через точку) из реестра                                                                 |

### CSS-переменные

| Переменная                        | По умолчанию                           |
| --------------------------------- | -------------------------------------- |
| `--c-progress-linear-color`       | `var(--c-sys-color-primary)`           |
| `--c-progress-linear-track-color` | `var(--c-sys-color-primary-container)` |
