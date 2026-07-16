# CProgressCircular

Круговой индикатор прогресса. Показывает детерминированный прогресс от 0 до 100 или бесконечный спиннер в режиме `indeterminate`. Дефолтный слот рендерит контент в центре круга.

<script setup>
import BasicExample from '../../examples/CProgressCircular/BasicExample.vue'
import ColorsExample from '../../examples/CProgressCircular/ColorsExample.vue'
import IndeterminateExample from '../../examples/CProgressCircular/IndeterminateExample.vue'
import PresetExample from '../../examples/CProgressCircular/PresetExample.vue'
</script>

## Базовое использование

`value` задаёт процент прогресса и обрезается до диапазона 0–100. Дефолтный слот получает нормализованное значение.

<BasicExample />

::: details Показать код

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(65)
</script>

<template>
  <c-progress-circular :value="value" size="96" width="8">
    <template #default="{ value: shown }">{{ shown }}%</template>
  </c-progress-circular>

  <c-btn @click="value = Math.max(0, value - 10)">-10</c-btn>
  <c-btn @click="value = Math.min(100, value + 10)">+10</c-btn>
</template>
```

:::

## Цвета

`color` принимает палитровый токен (`teal`, `green-darken-1`) или сырой цвет (`#fa5a5a`, `rgb(...)`, `var(...)`) — предопределённого набора нет. Кольцо рисуется через `currentColor`, поэтому цвет ложится `text-*`/`text-[...]` классом на корень; подложка остаётся на токенах темы и перекрашивается через пресет (зона `underlay`).

<ColorsExample />

::: details Показать код

```html
<c-progress-circular value="70" size="48" width="5" color="indigo" />
<c-progress-circular value="70" size="48" width="5" color="teal" />
<c-progress-circular value="70" size="48" width="5" color="deep-purple-lighten-1" />
<c-progress-circular value="70" size="48" width="5" color="green-darken-1" />
<c-progress-circular value="70" size="48" width="5" color="#FFA726" />
<c-progress-circular value="70" size="48" width="5" color="#fa5a5a" />
```

:::

::: tip Сырой цвет должен быть литералом
Arbitrary-классы (`text-[#fa5a5a]`) генерирует [utils-jit](/ru/plugins/utils-jit/getting-started) статическим сканом исходников: `color="#fa5a5a"` сработает, `:color="someVar"` с сырым значением — нет. Палитровых токенов это не касается. Подробнее — в [Custom attrs](/ru/plugins/utils-jit/custom-attrs).
:::

## Indeterminate

Бесконечный спиннер для операций с неизвестной длительностью. `size` и `width` управляют диаметром и толщиной штриха.

<IndeterminateExample />

::: details Показать код

```html
<c-progress-circular indeterminate size="24" width="3" />
<c-progress-circular indeterminate color="green-darken-1" size="40" width="4" />
<c-progress-circular indeterminate color="#fa5a5a" size="64" width="6" />
```

:::

## Пресеты

`CProgressCircular` поддерживает [систему пресетов](/ru/guide/presets). Зоны маппятся 1:1 на DOM и покрывают все окрашиваемые элементы: `root` (контейнер), `underlay` (кольцо-подложка), `overlay` (кольцо прогресса) и `info` (контент в центре). Кольца — SVG-круги со `stroke: currentColor`, поэтому их перекрашивают `text-*` утилиты. Состояния: `indeterminate` и `complete` (`value` ≥ 100); `indeterminate` приоритетнее.

В демо ниже кольцо и счётчик — индиго/серые во время загрузки и становятся зелёными, когда `value` доходит до 100 — без условных классов в шаблоне, пресет сам резолвит состояние:

<PresetExample />

::: details Показать код

```ts
// main.ts — пресет регистрируется один раз
createVuelandUI({
  presets: {
    progress: {
      upload: {
        base: {
          underlay: ['text-grey'],
          overlay: ['text-indigo'],
          info: ['text-grey'],
        },
        complete: {
          overlay: ['text-green'],
          info: ['text-green'],
        },
      },
    },
  },
})
```

```vue
<template>
  <c-progress-circular preset="progress.upload" :value="value" size="96" width="8">
    <template #default="{ value: shown }">{{ shown }}%</template>
  </c-progress-circular>
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
| `value`         | `number \| string` | `0`          | Процент прогресса, обрезается до 0–100                                                                    |
| `size`          | `number \| string` | `32`         | Диаметр (px)                                                                                              |
| `width`         | `number \| string` | `4`          | Толщина штриха (px)                                                                                       |
| `rotate`        | `number \| string` | `0`          | Поворот начальной точки (deg)                                                                             |
| `indeterminate` | `boolean`          | `false`      | Режим бесконечного спиннера                                                                               |
| `color`         | `string`           | —            | Палитровый токен (`teal`) или сырой цвет (`#fa5a5a`, `rgb(...)`, `var(...)`); без пропа — primary из темы |
| `preset`        | `string`           | —            | Имя пресета (путь через точку) из реестра                                                                 |

### Слоты

| Слот      | Пропы               | Описание                                            |
| --------- | ------------------- | --------------------------------------------------- |
| `default` | `{ value: number }` | Контент в центре; получает нормализованное значение |

### CSS-переменные

| Переменная                             | По умолчанию                           |
| -------------------------------------- | -------------------------------------- |
| `--c-progress-circular-color`          | `var(--c-sys-color-primary)`           |
| `--c-progress-circular-underlay-color` | `var(--c-sys-color-primary-container)` |
