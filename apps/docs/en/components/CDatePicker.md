# CDatePicker

`CDatePicker` is a standalone single-date calendar. Its three views (dates, months, years) toggle by clicking the header, it is fully keyboard-driven, localized through `Intl` with zero bundled dictionaries, and styled with presets. For a form field with this calendar in a dropdown see [`CDateInput`](/en/components/CDateInput).

<script setup>
import BasicExample from '../../examples/CDatePicker/BasicExample.vue'
import DisabledDatesExample from '../../examples/CDatePicker/DisabledDatesExample.vue'
import LocaleExample from '../../examples/CDatePicker/LocaleExample.vue'
import DaySlotExample from '../../examples/CDatePicker/DaySlotExample.vue'
import PresetsExample from '../../examples/CDatePicker/PresetsExample.vue'
</script>

## Basic usage

Bind the selected date with `v-model` — the model always emits a `Date`. With an empty value the calendar opens around today, but today is only marked as current, not selected. Clicking the header climbs a view up: dates → months → years; picking a year and a month walks back down.

<BasicExample />

::: details Show code

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

## Disabled and highlighted dates

`disabled-dates` gathers restrictions in one object — every field is optional, all of them add up:

```ts
type DisabledDates = {
  from?: Date | string // everything after from
  to?: Date | string // everything before to
  dates?: (Date | string)[] // specific dates
  days?: number[] // weekdays, 0 is Sunday
  daysOfMonth?: number[]
  ranges?: { from: Date | string; to: Date | string }[]
  custom?: (date: DatePickerDate) => boolean
}
```

`min-date` / `max-date` clamp the whole range — including the months and years views and the header arrows. `highlighted-dates` marks dates without disabling them. A custom `date` slot can render its own markers and icons on top of those states.

The years view defaults to a range around the current year and automatically expands to include the selected year. When set, `min-date` and `max-date` become the years-view navigation bounds.

<DisabledDatesExample />

::: tip String dates
A string like `'2026-05-10'` is parsed as a local calendar date without a timezone shift. Date-time strings (`'2026-05-10T00:00:00Z'`) still go through the browser `Date` parser and remain timezone-sensitive.
:::

## Localization

Month and weekday names come from `Intl.DateTimeFormat` — any BCP-47 tag works, nothing is bundled. The `locale` prop takes either a tag string or a `Partial<DateLocale>` object that overrides the dictionary (based on `en`). Unknown tags safely fall back to `en`. `monday-first` starts the week on Monday.

<LocaleExample />

Combining a different tag with an override goes through `resolveLocale`:

```ts
import { resolveLocale } from '@vueland/ui/components'

const locale = { ...resolveLocale('uz'), week: ['Ya', 'Du', 'Se', 'Ch', 'Psh', 'Ju', 'Sh'] }
```

## Custom cells

The `date` slot replaces a day cell and receives the parsed date with state flags. `month` / `year` do the same for their views; `week`, `dates`, `months`, `years` replace whole blocks. `before-header`, `before-body`, and `footer` are useful for toolbars, legends, and quick actions.

<DaySlotExample />

## Visual Presets

`preset` resolves class sets from the `createVuelandUI` registry. Picker zones (`root`, `display`, `header`, `week`, `cell`) compose well with CSS variables, so the same component can become either a quiet agenda calendar or a punchy campaign widget.

<PresetsExample />

::: details Show code

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

## Keyboard

A standalone calendar is focusable as a whole (`tabindex="0"`); inside [`CDateInput`](/en/components/CDateInput) focus stays in the field and keys arrive through the keyboard loop.

| Key               | Dates                | Months             | Years       |
| ----------------- | -------------------- | ------------------ | ----------- |
| `←` / `→`         | ±1 day               | ±1 month           | ±1 year     |
| `↑` / `↓`         | ±week                | ±row (3)           | ±row (4)    |
| `Home` / `End`    | start / end of month | January / December | page edge   |
| `Enter` / `Space` | select date          | select month       | select year |

The cursor appears on the first arrow press — on the selected date or today. Crossing a month boundary flips the table, crossing a years page flips the page; the cursor walks over disabled dates but `Enter` won't select them.

## API

### Props

| Prop                | Type                            | Default | Description                                  |
| ------------------- | ------------------------------- | ------- | -------------------------------------------- |
| `modelValue`        | `Date \| string \| null`        | —       | Selected date; always emitted as `Date`      |
| `locale`            | `string \| Partial<DateLocale>` | `'en'`  | BCP-47 tag for Intl or a dictionary override |
| `monday-first`      | `boolean`                       | `false` | Start the week on Monday                     |
| `disabled-dates`    | `DisabledDates`                 | —       | Disabled dates                               |
| `highlighted-dates` | `(Date \| string)[]`            | —       | Highlighted dates                            |
| `min-date`          | `Date \| string`                | —       | Lower range bound                            |
| `max-date`          | `Date \| string`                | —       | Upper range bound                            |
| `preset`            | `string`                        | —       | Registry preset path, e.g. `datePicker.soft` |

### Events

| Event               | Arguments | Description                 |
| ------------------- | --------- | --------------------------- |
| `update:modelValue` | `Date`    | Fires when a date is picked |

### Slots

`before-header`, `before-body` and `footer` receive the shared slot api — the same methods the internal render uses:

```ts
type DatePickerSlotApi = {
  view: 'dates' | 'months' | 'years'
  value: string
  selected: DatePickerDate | null
  disablePrev: boolean
  disableNext: boolean
  preset: Record<CDatePickerZone, string[]>
  showNextPage(): void
  showPreviousPage(): void
  toggleView(): void
  showToday(): void
}
```

| Slot            | Props                                           | Description               |
| --------------- | ----------------------------------------------- | ------------------------- |
| `before-header` | `DatePickerSlotApi`                             | Content before the header |
| `before-body`   | `DatePickerSlotApi`                             | Content above the grid    |
| `footer`        | `DatePickerSlotApi`                             | Content below the grid    |
| `week`          | `{ days: DatePickerWeekDay[] }`                 | Replaces the weekday row  |
| `dates`         | `{ dates: DatePickerEnrichedDate[], onSelect }` | Replaces the dates grid   |
| `date`          | `DatePickerDate & { isSelected, isToday }`      | Replaces a day cell       |
| `months`        | `{ months: DatePickerEnrichedMonth[] }`         | Replaces the months grid  |
| `month`         | `DatePickerEnrichedMonth`                       | Replaces a month cell     |
| `years`         | `{ years: DatePickerEnrichedYear[] }`           | Replaces the years grid   |
| `year`          | `DatePickerEnrichedYear`                        | Replaces a year cell      |

### Presets

Picker zones: `root`, `display`, `header`, `week`, `cell`. States are the active view: `dates`, `months`, `years`. A preset works standalone via a registry path and nests into an input preset as the `datePicker` field — [`CDateInput`](/en/components/CDateInput) picks it up through context.

### Helpers

```ts
import { dateToFormatString, resolveLocale } from '@vueland/ui/components'

resolveLocale('de') // DateLocale built from Intl, cached
dateToFormatString(date, 'dd.MM.yyyy', 'ru')
```

Format tokens: `yyyy`, `yy`, `MMMM`, `MMM`, `MM`, `M`, `dd`, `d`, `D` (weekday).

### CSS Variables

| Variable                               | Default                                   |
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
