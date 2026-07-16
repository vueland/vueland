# @vueland/ui

## 0.4.1

### Patch Changes

- [#109](https://github.com/vueland/vueland/pull/109) [`e15e5a4`](https://github.com/vueland/vueland/commit/e15e5a4667157d0f2344cb95c53d6f3d093e9e01) Thanks [@wiseadme](https://github.com/wiseadme)! - Polish date input and date picker production behavior.

  Fixed `CDatePicker` selection and navigation states so selected day, month, and year use consistent styling, and current dates are no longer shown as selected when no value is chosen. Improved dark theme contrast for picker headers, navigation controls, disabled dates, custom day slots, and date input examples.

  Improved `CDateInput` value handling and validation around nullable dates, min/max bounds, formatted input, presets, slots, and exposed input methods. Expanded public API test coverage for `CDatePicker` and `CDateInput`.

  Updated component documentation examples for `CDatePicker`, `CDateInput`, `CInput`, `CTextField`, and `CSpacer` with cleaner responsive utility layouts and Font Awesome `CIcon` usage.

## 0.4.0

### Minor Changes

- [#105](https://github.com/vueland/vueland/pull/105) [`e43952c`](https://github.com/vueland/vueland/commit/e43952c1d418905a987fb4917eb5765754a2a59e) Thanks [@wiseadme](https://github.com/wiseadme)! - Добавлен новый компонент `CAutocomplete`: поле выбора с поиском, фильтрацией опций, одиночным и множественным выбором, чипами, кастомным меню, сообщением пустого списка и событием `update:search`.

  Добавлен `CKeyboardProvider` для общего контура клавиатурной навигации и передачи `KeyboardAPI` в слоты комбобоксов.

  Обновлены `CSelect` и `CAutocomplete`: клавиатурное управление теперь работает через провайдер, меню не открывается в `readonly`, пустой список отображает `no-items-message`, а выбранные значения рендерятся через общий механизм чипов.

  Расширена система пресетов для input-based компонентов: вложенные пресеты `field`, `menu` и `list` теперь прокидываются через контекст и могут переопределяться локальным `preset`.

## 0.3.0

### Minor Changes

- [#101](https://github.com/vueland/vueland/pull/101) [`542dd4b`](https://github.com/vueland/vueland/commit/542dd4b6f5d7d738adb07f3133d83b66387b959e) Thanks [@wiseadme](https://github.com/wiseadme)! - Проп `color` без предопределённых наборов + сканирование color-пропов в utils-jit.

  **@vueland/ui**

  - `CBtn`, `CChip`, `CProgressLinear`, `CProgressCircular`: `color` теперь принимает любой цвет платформы — палитровый токен (`red-lighten-2`) или сырое CSS-значение (`#fa5a5a`, `rgb(...)`, `var(...)`). Наборы `primary | secondary | ...` удалены (breaking для этих значений — используйте палитру или `var(--c-sys-color-*)`).
  - Новый глобальный хелпер `toColorClass(prefix, color)` — строит утилитарный класс из значения цвета.
  - `CBtn`: рамка и hover/pressed-оверлеи через `currentColor`; лоадер outlined-кнопки следует за цветом текста; дефолтный `type="button"` (переопределяется атрибутом).
  - `CProgressLinear`: цвет ложится на бар и буфер, а не на корень.

  **@vueland/utils-jit**

  - Новый API `attrs`/`defineAttr`: пользователи могут описывать атрибут, валидатор и utility-префиксы для генерации arbitrary-кандидатов. Для проектов с `@vueland/ui` проп `color` сканируется внутренне автоматически и генерирует `bg-[...]`/`text-[...]`.
  - Правило `bg-[...]` теперь ставит и `border-color` — как статические `.bg-*` утилиты.

## 0.2.0

### Minor Changes

- [#99](https://github.com/vueland/vueland/pull/99) [`d2ac736`](https://github.com/vueland/vueland/commit/d2ac7360e6690ce6ce256e8d04bd10ecd246e655) Thanks [@wiseadme](https://github.com/wiseadme)! - feat: CProgressCircular and CProgressLinear components

  - `CProgressCircular` — circular progress indicator: determinate (`value`, clamped to 0–100) and `indeterminate` modes, `size` / `width` / `rotate` props, semantic `color` prop, default slot with the normalized value rendered in the center.
  - `CProgressLinear` — linear progress bar: determinate, buffer (`buffer-value`) and `indeterminate` modes, `height` prop, semantic `color` prop.
  - Preset system support for both: zones cover every colorable element (`root`/`underlay`/`overlay`/`info` for circular, `root`/`background`/`buffer`/`bar` for linear) with `indeterminate` and `complete` (`value` >= 100) states; new `CProgressCircularPreset` / `CProgressLinearPreset` types.
  - Accessibility: `role="progressbar"` with `aria-valuemin/max/now`; `aria-valuenow` is omitted in indeterminate mode per the WAI-ARIA pattern.
  - Track colors derive from the matching `*-container` theme token; all colors are overridable via `--c-progress-*` CSS variables.
  - Guarded against invalid input: non-numeric `value`/`bufferValue` clamp to 0, non-numeric or non-positive `size`/`width`/`height` fall back to defaults, `width` is capped at half the diameter.

## 0.1.4

### Patch Changes

- [#92](https://github.com/vueland/vueland/pull/92) [`247f9e8`](https://github.com/vueland/vueland/commit/247f9e8198aee001aa932414fe195fccea56b127) Thanks [@wiseadme](https://github.com/wiseadme)! - fix: `CMenu` with `strategy="reverse"` no longer overflows the viewport when the content doesn't fit on either side — the reversed position is now clamped to the screen edge

## 0.1.3

### Patch Changes

- [#90](https://github.com/vueland/vueland/pull/90) [`f627be9`](https://github.com/vueland/vueland/commit/f627be9dda3f6ffa06ffc4ebf4a993f748c1f77b) Thanks [@wiseadme](https://github.com/wiseadme)! - useValidate`(and every`CInput`-based component) now accepts a `validationValue`prop. When set, validation rules receive it instead of`modelValue`; when nullish, rules fall back to `modelValue`as before. The`validateOn: 'input'`watcher reacts to changes of both values, and the`validateOn: 'blur'` semantics are unchanged — input changes are skipped while the effective value stays non-empty.

## 0.1.2

### Patch Changes

- [#88](https://github.com/vueland/vueland/pull/88) [`8196010`](https://github.com/vueland/vueland/commit/819601058f425e938481df1f9e5833f4a64758fd) Thanks [@wiseadme](https://github.com/wiseadme)! - field label layering on prepend slot

## 0.1.1

### Patch Changes

- [`9c473b6`](https://github.com/vueland/vueland/commit/9c473b64e9f6bfe3a1ed927c53d4cfa31f41a153) - c-select v-model fixing

## 0.1.0

### Minor Changes

- [#85](https://github.com/vueland/vueland/pull/85) [`2617a04`](https://github.com/vueland/vueland/commit/2617a04a59cbc2b5966e757fff7f38dd660b222f) Thanks [@wiseadme](https://github.com/wiseadme)! - c-select component

## 0.0.8

### Patch Changes

- [#83](https://github.com/vueland/vueland/pull/83) [`4510df8`](https://github.com/vueland/vueland/commit/4510df8d2285067a40db22c57acd6fbeaf0a572d) Thanks [@wiseadme](https://github.com/wiseadme)! - c-list component api updated

## 0.0.7

### Patch Changes

- [`31116a2`](https://github.com/vueland/vueland/commit/31116a284d290e46218fdd945b3e5c6f97b6cb61) - global css tokens updated

## 0.0.6

### Patch Changes

- [#70](https://github.com/vueland/vueland/pull/70) [`962663a`](https://github.com/vueland/vueland/commit/962663af37b19f937e58c0f00699c589b97bdc78) Thanks [@wiseadme](https://github.com/wiseadme)! - c-select and c-menu components refactor

## 0.0.5

### Patch Changes

- [#61](https://github.com/vueland/vueland/pull/61) [`cb57694`](https://github.com/vueland/vueland/commit/cb576946698fe0ac6626c6b8447f5ae3e07d0f22) Thanks [@wiseadme](https://github.com/wiseadme)! - fully breakpoints synchronization between ui and utils-jit

## 0.0.4

### Patch Changes

- [#52](https://github.com/vueland/vueland/pull/52) [`dd62251`](https://github.com/vueland/vueland/commit/dd62251823e7d7f6b51c70f0e2467fa021892fdb) Thanks [@wiseadme](https://github.com/wiseadme)! - fix scss file imports

## 0.0.3

### Patch Changes

- [#40](https://github.com/vueland/vueland/pull/40) [`1f25263`](https://github.com/vueland/vueland/commit/1f252633b157d324875728830ccf3890e0f49a64) Thanks [@wiseadme](https://github.com/wiseadme)! - updates

## 0.0.2

### Patch Changes

- [#36](https://github.com/vueland/vueland/pull/36) [`0a72c85`](https://github.com/vueland/vueland/commit/0a72c8536665106e643b0b4c55b91cbee9de23fb) Thanks [@wiseadme](https://github.com/wiseadme)! - grid system components
