# CDateInput

`CDateInput` is a date form field: a [`CTextField`](/en/components/CTextField) with a [`CDatePicker`](/en/components/CDatePicker) calendar in a dropdown menu. It inherits normal field behavior (`label`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset`) and adds calendar selection, formatting, locale, typed input, and date bounds.

<script setup>
import BasicExample from '../../examples/CDateInput/BasicExample.vue'
import FormatExample from '../../examples/CDateInput/FormatExample.vue'
import TypeableExample from '../../examples/CDateInput/TypeableExample.vue'
import ValidationExample from '../../examples/CDateInput/ValidationExample.vue'
import SlotsPresetExample from '../../examples/CDateInput/SlotsPresetExample.vue'
</script>

## Basic usage

`v-model` holds `Date | null`. The menu opens on focus or `ArrowDown` and closes on `Escape`, `Tab`, outside click, or date pick. With an empty value the calendar opens around today, but today is current, not selected.

<BasicExample />

::: details Show code

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

## Format and locale

`format` controls the field text, while `locale` controls the picker language and textual format parts. Locale follows the same contract as [`CDatePicker`](/en/components/CDatePicker#localization): a BCP-47 tag or a partial dictionary override.

<FormatExample />

::: details Show code

```vue
<template>
  <c-date-input v-model="date" label="ISO" format="yyyy-MM-dd" />
  <c-date-input v-model="date" label="Russian" format="d MMMM yyyy" locale="ru" />
</template>
```

:::

## Typed input

The field is read-only by default: dates come from the menu. With `typeable`, users can type a date manually:

- the model updates only when the full string matches `format` and the date exists;
- partial input does not mutate the current `v-model`;
- typed dates pass the same `disabled-dates`, `min-date`, and `max-date` checks as the calendar;
- in `typeable` mode arrow keys remain text-editing keys, while mouse picking still works in the menu.

The parser supports numeric tokens: `dd`, `d`, `MM`, `M`, `yyyy`, `yy`.

<TypeableExample />

::: details Show code

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

## Validation and bounds

`rules` receive the model's `Date | null`, not the formatted string. `min-date`, `max-date`, `disabled-dates`, and `highlighted-dates` are forwarded to the picker inside the menu.

<ValidationExample />

::: details Show code

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

## Slots and presets

`prepend`, `append`, and `details` belong to the field. `date`, `week`, `dates`, `before-header`, `before-body`, and `footer` are forwarded to `CDatePicker`, so the menu can include legends, markers, and footers. An input preset can include a nested `datePicker` preset to make the field and calendar read as one component.

<SlotsPresetExample />

::: details Show code

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

## Keyboard

| Key                   | Action                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| `ArrowDown`           | Open the menu                                                                |
| `Escape` / `Tab`      | Close the menu and blur the field                                            |
| arrows, `Home`, `End` | Calendar navigation (see [picker keys](/en/components/CDatePicker#keyboard)) |
| `Enter` / `Space`     | Select the focused date                                                      |

Focus stays in the field: keys reach the calendar through the keyboard loop. In `typeable` mode navigation keys stay with text editing.

## API

### CDateInput props

| Prop                | Type                            | Default        | Description                                  |
| ------------------- | ------------------------------- | -------------- | -------------------------------------------- |
| `modelValue`        | `Date \| null`                  | —              | Selected date                                |
| `typeable`          | `boolean`                       | `false`        | Allow typing a date matching `format`        |
| `format`            | `string`                        | `'dd.MM.yyyy'` | Display and parsing format                   |
| `locale`            | `string \| Partial<DateLocale>` | `'en'`         | BCP-47 tag for Intl or a dictionary override |
| `monday-first`      | `boolean`                       | `false`        | Start the week on Monday                     |
| `disabled-dates`    | `DisabledDates`                 | —              | Disabled dates                               |
| `highlighted-dates` | `(Date \| string)[]`            | —              | Highlighted dates                            |
| `min-date`          | `Date \| string`                | —              | Lower range bound                            |
| `max-date`          | `Date \| string`                | —              | Upper range bound                            |

Inner field props are available too: `label`, `placeholder`, `details`, `no-details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset`, and the rest of [`CInput`](/en/components/CInput#props) / [`CTextField`](/en/components/CTextField#api).

### Events

| Event               | Arguments      | Description                |
| ------------------- | -------------- | -------------------------- |
| `update:modelValue` | `Date \| null` | Pick, typed input or clear |

### Slots

| Slot            | Props                                           | Description                                          |
| --------------- | ----------------------------------------------- | ---------------------------------------------------- |
| `prepend`       | —                                               | Content before the field; replaces the calendar icon |
| `append`        | —                                               | Content after the field                              |
| `details`       | `{ errorMessage?: string, details?: string }`   | Replaces the hint / error line                       |
| `date`          | `DatePickerDate & { isSelected, isToday }`      | Day cell content in the calendar                     |
| `week`          | `{ days: DatePickerWeekDay[] }`                 | Weekday row                                          |
| `dates`         | `{ dates: DatePickerEnrichedDate[], onSelect }` | Date grid                                            |
| `before-header` | `DatePickerSlotApi`                             | Content before the picker header                     |
| `before-body`   | `DatePickerSlotApi`                             | Content between header and grid                      |
| `footer`        | `DatePickerSlotApi`                             | Content below the grid                               |

### Presets

`preset` is passed to the inner `CInput`. If its `base` snapshot contains `datePicker`, the calendar inside the menu receives it through context.

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

### CSS classes

| Class                    | When it appears          |
| ------------------------ | ------------------------ |
| `c-date-input`           | Root `CInput`            |
| `c-date-input--typeable` | Manual typing is enabled |
