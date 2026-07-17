# CDateInput

`CDateInput` — поле выбора даты: [`CTextField`](/ru/components/CTextField) с [`CDatePicker`](/ru/components/CDatePicker) в выпадающем меню. Оно наследует поведение обычного поля (`label`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset`) и добавляет календарь, форматирование, локаль, ручной ввод и ограничения дат.

<script setup>
import BasicExample from '../../examples/CDateInput/BasicExample.vue'
import FormatExample from '../../examples/CDateInput/FormatExample.vue'
import TypeableExample from '../../examples/CDateInput/TypeableExample.vue'
import ValidationExample from '../../examples/CDateInput/ValidationExample.vue'
import SlotsPresetExample from '../../examples/CDateInput/SlotsPresetExample.vue'
</script>

## Базовое использование

`v-model` держит `Date | null`. Меню открывается по фокусу или `ArrowDown`, закрывается по `Escape`, `Tab`, клику вне меню или выбору даты. Если значение пустое, календарь открывается на текущем месяце, но сегодняшняя дата не считается выбранной.

<BasicExample />

::: details Показать код

```vue
<template>
  <c-date-input
    v-model="date"
    label="Delivery date"
    details="Pick a date from the calendar"
    preset="input.dateBooking"
    clearable
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef<Date | null>(null)
</script>
```

:::

## Формат и локаль

`format` управляет строкой в поле, `locale` управляет языком календаря и текстовых частей формата. Контракт локали такой же, как у [`CDatePicker`](/ru/components/CDatePicker#локализация): BCP-47 тег или частичное переопределение словаря.

<FormatExample />

::: details Показать код

```vue
<template>
  <c-date-input v-model="date" label="ISO" format="yyyy-MM-dd" />
  <c-date-input v-model="date" label="Русский" format="d MMMM yyyy" locale="ru" />
</template>
```

:::

## Ручной ввод

По умолчанию поле не редактируется: дату выбирают из меню. С `typeable` пользователь может набрать дату вручную:

- модель обновляется только когда строка целиком совпала с `format` и дата существует;
- частичный ввод не портит текущее `v-model`;
- ручной ввод проходит те же `disabled-dates`, `min-date` и `max-date`, что и календарь;
- при `typeable` стрелки остаются редактированию текста, а выбор в календаре работает мышью.

Парсер поддерживает числовые токены `dd`, `d`, `MM`, `M`, `yyyy`, `yy`.

<TypeableExample />

::: details Показать код

```vue
<template>
  <c-date-input
    v-model="date"
    label="Departure"
    format="dd.MM.yyyy"
    details="Use dd.MM.yyyy, weekdays only"
    typeable
    clearable
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="{ days: [0, 6] }"
  />
</template>
```

:::

## Валидация и ограничения

`rules` получают `Date | null` из модели, а не отформатированную строку. Ограничения `min-date`, `max-date`, `disabled-dates` и `highlighted-dates` прокидываются в пикер внутри меню.

<ValidationExample />

::: details Показать код

```vue
<template>
  <c-date-input
    v-model="date"
    label="Shipping date"
    :rules="rules"
    validate-on="input"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    clearable
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef<Date | null>(null)
const minDate = new Date()
const maxDate = new Date(2026, 7, 15)
const disabledDates = { days: [5] }
const rules = [(value?: Date | null) => ({ valid: !!value, message: 'Pick a shipping date' })]
</script>
```

:::

## Слоты и пресеты

`prepend`, `append` и `details` принадлежат полю. Слоты `date`, `week`, `dates`, `before-header`, `before-body`, `footer` форвардятся в `CDatePicker`, поэтому меню можно дополнить легендами, маркерами и футером. Пресет инпута может содержать вложенный `datePicker`, чтобы поле и календарь выглядели как один компонент.

<SlotsPresetExample />

::: details Показать код

```vue
<template>
  <c-date-input
    v-model="launch"
    label="Launch date"
    format="d MMM yyyy"
    preset="input.dateCampaign"
    :highlighted-dates="highlightedDates"
    clearable
  >
    <template #prepend>
      <c-icon name="fas:bell" source="fa" />
    </template>

    <template #before-body>
      <div>Editorial milestones</div>
    </template>

    <template #date="{ date, isHighlighted }">
      <span>{{ date }} <c-icon v-if="isHighlighted" name="fas:star" source="fa" /></span>
    </template>
  </c-date-input>
</template>
```

```ts
const dateInputCampaign: CInputPreset = {
  base: {
    field: campaignField,
    datePicker: campaignDatePicker,
  },
}
```

:::

## Клавиатура

| Клавиша                | Действие                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `ArrowDown`            | Открыть меню                                                                         |
| `Escape` / `Tab`       | Закрыть меню и снять фокус                                                           |
| стрелки, `Home`, `End` | Навигация по календарю (см. [клавиши пикера](/ru/components/CDatePicker#клавиатура)) |
| `Enter` / `Space`      | Выбрать дату под курсором                                                            |

Фокус остаётся в поле: клавиши доезжают до календаря через клавиатурный контур. В `typeable` режиме навигационные клавиши остаются текстовому вводу.

## API

### Пропы CDateInput

| Проп                | Тип                             | По умолчанию   | Описание                                         |
| ------------------- | ------------------------------- | -------------- | ------------------------------------------------ |
| `modelValue`        | `Date \| null`                  | —              | Выбранная дата                                   |
| `typeable`          | `boolean`                       | `false`        | Разрешить ручной ввод по маске `format`          |
| `format`            | `string`                        | `'dd.MM.yyyy'` | Формат отображения и разбора                     |
| `locale`            | `string \| Partial<DateLocale>` | `'en'`         | BCP-47 тег для Intl либо переопределение словаря |
| `monday-first`      | `boolean`                       | `false`        | Неделя начинается с понедельника                 |
| `disabled-dates`    | `DisabledDates`                 | —              | Запрещённые даты                                 |
| `highlighted-dates` | `(Date \| string)[]`            | —              | Подсвеченные даты                                |
| `min-date`          | `Date \| string`                | —              | Нижняя граница диапазона                         |
| `max-date`          | `Date \| string`                | —              | Верхняя граница диапазона                        |

Также доступны пропсы внутреннего поля: `label`, `placeholder`, `details`, `no-details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset` и остальные пропсы [`CInput`](/ru/components/CInput#props) / [`CTextField`](/ru/components/CTextField#api).

### Events

| Событие             | Аргументы      | Описание                       |
| ------------------- | -------------- | ------------------------------ |
| `update:modelValue` | `Date \| null` | Выбор, ручной ввод или очистка |

### Slots

| Слот            | Пропы                                           | Описание                                       |
| --------------- | ----------------------------------------------- | ---------------------------------------------- |
| `prepend`       | —                                               | Контент перед полем; заменяет иконку календаря |
| `append`        | —                                               | Контент после поля                             |
| `details`       | `{ errorMessage?: string, details?: string }`   | Заменяет строку подсказки или ошибки           |
| `date`          | `DatePickerDate & { isSelected, isToday }`      | Содержимое ячейки дня в календаре              |
| `week`          | `{ days: DatePickerWeekDay[] }`                 | Строка дней недели                             |
| `dates`         | `{ dates: DatePickerEnrichedDate[], onSelect }` | Сетка дней                                     |
| `before-header` | `DatePickerSlotApi`                             | Контент перед заголовком пикера                |
| `before-body`   | `DatePickerSlotApi`                             | Контент между заголовком и сеткой              |
| `footer`        | `DatePickerSlotApi`                             | Контент под сеткой                             |

### Пресеты

`preset` передаётся во внутренний `CInput`. Если в `base`-снимке лежит `datePicker`, календарь внутри меню получит его через контекст.

```ts
const booking: CInputPreset = {
  base: {
    field: bookingField,
    menu: bookingMenu,
    datePicker: bookingDatePicker,
  },
  error: {
    details: ['text-red'],
  },
}
```

### CSS-классы

| Класс                    | Когда появляется                     |
| ------------------------ | ------------------------------------ |
| `c-date-input`           | Корневой `CInput`                    |
| `c-date-input--typeable` | Включён ручной ввод через `typeable` |
