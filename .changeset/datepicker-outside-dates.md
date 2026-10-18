---
'@vueland/ui': minor
---

feat(CDatePicker): fill the dates grid with adjacent-month dates

The dates grid is now built from whole weeks: the first and last rows are filled with faded dates of the previous and next month instead of blank cells. Previously the trailing row could overflow into an extra one-cell row (Sunday-first) or stay incomplete (Monday-first).

**Breaking (slot contract):**

- `DatePickerEnrichedDate` is now flat — `DatePickerDate & { disabled, isOutside, isHighlighted, isSelected, isToday, isFocused }`. `dateObj`, `empty` and `highlighted` are removed: read `date.date` instead of `date.dateObj.date`, `isOutside` instead of `empty`, `isHighlighted` instead of `highlighted`.
- The `date` slot receives the same `DatePickerEnrichedDate`. `isHoliday` is replaced by `disabled`; `isHoliday` / `isHighlighted` are no longer part of `DatePickerDate`.
- The `.c-date-picker-dates__cell--empty` modifier is renamed to `.c-date-picker-dates__cell--outside`.

`onSelect` from the `dates` slot now rejects disabled dates the same way a click or Enter does.
