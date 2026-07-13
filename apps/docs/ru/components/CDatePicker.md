# CDatePicker

`CDatePicker` — автономный календарь для выбора одной даты. Три вьюхи (дни, месяцы, годы) переключаются кликом по заголовку, полностью управляются с клавиатуры, локализуются через `Intl` без словарей в бандле и стилизуются пресетами. Для поля формы с этим календарём в меню есть [`CDateInput`](/ru/components/CDateInput).

<script setup>
import BasicExample from '../../examples/CDatePicker/BasicExample.vue'
import DisabledDatesExample from '../../examples/CDatePicker/DisabledDatesExample.vue'
import LocaleExample from '../../examples/CDatePicker/LocaleExample.vue'
import DaySlotExample from '../../examples/CDatePicker/DaySlotExample.vue'
import PresetsExample from '../../examples/CDatePicker/PresetsExample.vue'
</script>

## Базовое использование

Свяжите выбранную дату через `v-model` — наружу приходит `Date`. Если значение пустое, календарь открывается на сегодняшнем месяце, но сегодняшняя дата не считается выбранной. Клик по заголовку поднимает вьюху крупнее: дни → месяцы → годы; выбор года и месяца спускает обратно к дням.

<BasicExample />

::: details Показать код

```vue
<template>
  <CDatePicker v-model="date" />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef<Date | null>(null)
</script>
```

:::

## Запрещённые и подсвеченные даты

`disabled-dates` собирает ограничения в одном объекте — все поля опциональны и складываются:

```ts
type DisabledDates = {
  from?: Date | string // всё, что позже from
  to?: Date | string // всё, что раньше to
  dates?: (Date | string)[] // конкретные даты
  days?: number[] // дни недели, 0 — воскресенье
  daysOfMonth?: number[] // числа месяца
  ranges?: { from: Date | string; to: Date | string }[]
  custom?: (date: DatePickerDate) => boolean
}
```

`min-date` / `max-date` дополнительно ограничивают диапазон целиком — включая вьюхи месяцев и годов и стрелки заголовка. `highlighted-dates` помечает даты классом подсветки, не запрещая выбор. Кастомный слот `date` может отрисовать поверх этих состояний свои маркеры и иконки.

Вьюха годов по умолчанию показывает диапазон около текущего года и автоматически расширяет его до выбранного года. `min-date` и `max-date`, если заданы, становятся границами навигации по годам.

<DisabledDatesExample />

::: details Показать код

```vue
<template>
  <CDatePicker
    v-model="date"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :highlighted-dates="highlightedDates"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef<Date>()

const today = new Date()
const shift = (days: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

const minDate = shift(0)
const maxDate = shift(42)
const disabledDates = {
  days: [0, 6],
  ranges: [{ from: shift(12), to: shift(15) }],
}
const highlightedDates = [shift(3), shift(9), shift(18)]
</script>
```

:::

::: tip Строковые даты
Строка вида `'2026-05-10'` парсится как локальная календарная дата без сдвига таймзоны. Date-time строки (`'2026-05-10T00:00:00Z'`) идут через браузерный `Date` и остаются timezone-sensitive.
:::

## Локализация

Названия месяцев и дней недели строятся через `Intl.DateTimeFormat` — словари в бандл не входят, работает любой BCP-47 тег. Проп `locale` принимает либо строку-тег, либо объект `Partial<DateLocale>`, точечно перекрывающий словарь (база — `en`). Неизвестный тег безопасно падает на `en`. `monday-first` начинает неделю с понедельника.

<LocaleExample />

::: details Показать код

```vue
<template>
  <CDatePicker :locale="locale" :monday-first="locale !== 'en'" />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const locale = shallowRef('ru')
</script>
```

:::

Объектная форма перекрывает только указанные поля:

```vue
<!-- en-месяцы, но своя неделя -->
<CDatePicker :locale="{ week: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] }" />
```

Комбинация «другой тег + своё переопределение» собирается через `resolveLocale`:

```ts
import { resolveLocale } from '@vueland/ui/components'

const locale = { ...resolveLocale('uz'), week: ['Ya', 'Du', 'Se', 'Ch', 'Psh', 'Ju', 'Sh'] }
```

## Кастомные слоты

Слот `date` заменяет содержимое ячейки дня и получает разобранную дату вместе с флагами состояния. Слоты `month` / `year` делают то же для своих вьюх, а `week`, `dates`, `months`, `years` заменяют целые блоки. Слоты `before-header`, `before-body` и `footer` подходят для тулбаров, легенд и быстрых действий.

<DaySlotExample />

::: details Показать код

```vue
<template>
  <CDatePicker v-model="date" :highlighted-dates="highlightedDates">
    <template #date="{ date: day, isHighlighted }">
      <div class="d-flex flex-column items-center">
        <span>{{ day }}</span>
        <span
          v-if="isHighlighted"
          class="bg-orange radius-pill"
          style="width: 4px; height: 4px"
        ></span>
      </div>
    </template>
  </CDatePicker>
</template>
```

:::

## Визуальные пресеты

`preset` берёт набор классов из реестра `createVuelandUI`. Зоны пикера (`root`, `display`, `header`, `week`, `cell`) работают вместе с CSS-переменными, поэтому один и тот же компонент можно быстро превратить в спокойный agenda-календарь или яркий промо-виджет.

<PresetsExample />

::: details Показать код

```vue
<template>
  <CDatePicker v-model="date" preset="datePicker.neon" :highlighted-dates="highlightedDates" />
</template>
```

```ts
const datePickerNeon = {
  base: {
    root: ['radius-12'],
    display: ['bg-indigo', 'text-white'],
    header: ['bg-grey-lighten-4'],
    week: ['text-indigo'],
    cell: ['radius-8'],
  },
  months: { cell: ['radius-10'] },
  years: { cell: ['radius-10'] },
}
```

:::

## Клавиатура

Standalone-календарь фокусируется целиком (`tabindex="0"`), внутри [`CDateInput`](/ru/components/CDateInput) фокус остаётся в поле, а клавиши доезжают через клавиатурный контур.

| Клавиша           | Дни                   | Месяцы           | Годы          |
| ----------------- | --------------------- | ---------------- | ------------- |
| `←` / `→`         | ±1 день               | ±1 месяц         | ±1 год        |
| `↑` / `↓`         | ±неделя               | ±ряд (3)         | ±ряд (4)      |
| `Home` / `End`    | начало / конец месяца | январь / декабрь | край страницы |
| `Enter` / `Space` | выбрать дату          | выбрать месяц    | выбрать год   |

Курсор появляется с первого нажатия стрелки — на выбранной дате или сегодня. Переход за границу месяца перелистывает таблицу, за границу страницы годов — страницу; запрещённые даты курсор проходит, но `Enter` их не выбирает.

## API

### Пропы

| Проп                | Тип                             | По умолчанию | Описание                                             |
| ------------------- | ------------------------------- | ------------ | ---------------------------------------------------- |
| `modelValue`        | `Date \| string \| null`        | —            | Выбранная дата; наружу всегда эмитится `Date`        |
| `locale`            | `string \| Partial<DateLocale>` | `'en'`       | BCP-47 тег для Intl либо переопределение словаря     |
| `monday-first`      | `boolean`                       | `false`      | Неделя начинается с понедельника                     |
| `disabled-dates`    | `DisabledDates`                 | —            | Запрещённые даты                                     |
| `highlighted-dates` | `(Date \| string)[]`            | —            | Подсвеченные даты                                    |
| `min-date`          | `Date \| string`                | —            | Нижняя граница диапазона                             |
| `max-date`          | `Date \| string`                | —            | Верхняя граница диапазона                            |
| `preset`            | `string`                        | —            | Путь к пресету в реестре, например `datePicker.soft` |

### События

| Событие             | Аргументы | Описание                    |
| ------------------- | --------- | --------------------------- |
| `update:modelValue` | `Date`    | Срабатывает при выборе даты |

### Слоты

Слоты `before-header`, `before-body` и `footer` получают общий слот-апи — те же методы, что использует внутренний рендер:

```ts
type DatePickerSlotApi = {
  view: 'dates' | 'months' | 'years'
  value: string // текст заголовка
  selected: DatePickerDate | null
  disablePrev: boolean
  disableNext: boolean
  preset: Record<CDatePickerZone, string[]>
  onNext(): void
  onPrev(): void
  onTable(): void // переключить вьюху
  onToday(): void // вернуться к сегодня
}
```

| Слот            | Пропы                                           | Описание                          |
| --------------- | ----------------------------------------------- | --------------------------------- |
| `before-header` | `DatePickerSlotApi`                             | Контент перед заголовком          |
| `before-body`   | `DatePickerSlotApi`                             | Контент между заголовком и сеткой |
| `footer`        | `DatePickerSlotApi`                             | Контент под сеткой                |
| `week`          | `{ days: DatePickerWeekDay[] }`                 | Заменяет строку дней недели       |
| `dates`         | `{ dates: DatePickerEnrichedDate[], onSelect }` | Заменяет сетку дней               |
| `date`          | `DatePickerDate & { isSelected, isToday }`      | Заменяет содержимое ячейки дня    |
| `months`        | `{ months: DatePickerEnrichedMonth[] }`         | Заменяет сетку месяцев            |
| `month`         | `DatePickerEnrichedMonth`                       | Заменяет ячейку месяца            |
| `years`         | `{ years: DatePickerEnrichedYear[] }`           | Заменяет сетку годов              |
| `year`          | `DatePickerEnrichedYear`                        | Заменяет ячейку года              |

### Пресеты

Зоны пикера: `root`, `display` (верхний блок с датой), `header`, `week`, `cell` (ячейка любой вьюхи). Состояния — активная вьюха: `dates`, `months`, `years`. Пресет работает standalone по пути из реестра и вкладывается в пресет инпута полем `datePicker` — [`CDateInput`](/ru/components/CDateInput) подхватит его через контекст.

```ts
const soft: CDatePickerPreset = {
  base: {
    root: ['radius-12'],
    display: ['bg-grey-darken-2'],
    cell: ['radius-8'],
  },
  years: {
    cell: ['radius-8', 'text-blue-grey-darken-1'],
  },
}
```

### Хелперы

```ts
import { dateToFormatString, resolveLocale } from '@vueland/ui/components'

resolveLocale('de') // DateLocale из Intl, с кэшем
dateToFormatString(date, 'dd.MM.yyyy', 'ru')
```

Токены формата: `yyyy`, `yy`, `MMMM`, `MMM`, `MM`, `M`, `dd`, `d`, `D` (день недели).

### CSS-переменные

| Переменная                             | По умолчанию                              |
| -------------------------------------- | ----------------------------------------- |
| `--c-date-picker-width`                | `320px`                                   |
| `--c-date-picker-display-bg`           | `var(--c-sys-color-primary)`              |
| `--c-date-picker-header-bg`            | `var(--c-sys-color-surface-container)`    |
| `--c-date-picker-body-bg`              | `var(--c-sys-color-surface)`              |
| `--c-date-picker-cell-size`            | `var(--c-sys-control-height-md)`          |
| `--c-date-picker-selected-bg`          | `var(--c-sys-color-primary-container)`    |
| `--c-date-picker-selected-color`       | `var(--c-sys-color-on-primary-container)` |
| `--c-date-picker-today-color`          | `var(--c-sys-color-primary)`              |
| `--c-date-picker-current-border-color` | `var(--c-sys-color-primary)`              |
| `--c-date-picker-highlighted-bg`       | `var(--c-sys-state-selected-color)`       |
| `--c-date-picker-highlighted-color`    | `var(--c-sys-color-primary)`              |
| `--c-date-picker-disabled-color`       | `var(--c-sys-color-disabled)`             |
| `--c-date-picker-focus-ring-color`     | `var(--c-sys-color-primary)`              |
