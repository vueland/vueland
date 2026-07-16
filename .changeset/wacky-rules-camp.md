---
'@vueland/ui': patch
---

Polish date input and date picker production behavior.

Fixed `CDatePicker` selection and navigation states so selected day, month, and year use consistent styling, and current dates are no longer shown as selected when no value is chosen. Improved dark theme contrast for picker headers, navigation controls, disabled dates, custom day slots, and date input examples.

Improved `CDateInput` value handling and validation around nullable dates, min/max bounds, formatted input, presets, slots, and exposed input methods. Expanded public API test coverage for `CDatePicker` and `CDateInput`.

Updated component documentation examples for `CDatePicker`, `CDateInput`, `CInput`, `CTextField`, and `CSpacer` with cleaner responsive utility layouts and Font Awesome `CIcon` usage.
