# CSS Variables

Vueland UI использует слоистую систему CSS custom properties:

- `--c-ref-*` - reference-токены с базовыми значениями палитры.
- `--c-sys-*` - глобальные system-токены темизации, которые используют компоненты и стили приложения.
- `--c-{component}-*` - компонентные токены. Они описаны на страницах компонентов.

Эта страница описывает глобальные reference и system токены. Старые `--global-*` переменные больше не используются.

## Переопределение темы

System-токены можно переопределять через `themes` в `createVuelandUI`. CamelCase-ключи мапятся в CSS-переменные: `primary` -> `--c-sys-color-primary`, `shapeMd` -> `--c-sys-shape-md`, `motionDurationFast` -> `--c-sys-motion-duration-fast`.

```ts
createVuelandUI({
  theme: 'light',
  themes: {
    light: {
      primary: '#4f6ef7',
      onPrimary: '#ffffff',
      surface: '#ffffff',
      onSurface: '#1f2937',
      shapeMd: '10px',
      motionDurationFast: '100ms',
    },
  },
})
```

Ключи, которые уже начинаются с `--`, передаются как есть. Используйте это только для точечных интеграций; для темы предпочтительнее короткие system-ключи.

## Reference Tokens

Reference-токены задаются в `:root` и служат сырой палитрой для system-ролей. У них нет коротких ключей `ThemeDefinition`; при необходимости их можно переопределить только как прямые CSS custom properties.

| Переменная                  | По умолчанию | Назначение              |
| --------------------------- | ------------ | ----------------------- |
| `--c-ref-color-white`       | `#ffffff`    | Белый цвет              |
| `--c-ref-color-black`       | `#000000`    | Черный цвет             |
| `--c-ref-color-neutral-0`   | `#ffffff`    | Нейтральная шкала       |
| `--c-ref-color-neutral-50`  | `#fafafa`    | Нейтральная шкала       |
| `--c-ref-color-neutral-100` | `#f5f5f5`    | Нейтральная шкала       |
| `--c-ref-color-neutral-200` | `#eeeeee`    | Нейтральная шкала       |
| `--c-ref-color-neutral-300` | `#e0e0e0`    | Нейтральная шкала       |
| `--c-ref-color-neutral-400` | `#bdbdbd`    | Нейтральная шкала       |
| `--c-ref-color-neutral-500` | `#9e9e9e`    | Нейтральная шкала       |
| `--c-ref-color-neutral-600` | `#757575`    | Нейтральная шкала       |
| `--c-ref-color-neutral-700` | `#616161`    | Нейтральная шкала       |
| `--c-ref-color-neutral-800` | `#424242`    | Нейтральная шкала       |
| `--c-ref-color-neutral-900` | `#212121`    | Нейтральная шкала       |
| `--c-ref-color-neutral-950` | `#000000`    | Нейтральная шкала       |
| `--c-ref-color-blue-40`     | `#1976d2`    | Синяя акцентная шкала   |
| `--c-ref-color-blue-50`     | `#1e88e5`    | Синяя акцентная шкала   |
| `--c-ref-color-blue-80`     | `#90caf9`    | Синяя акцентная шкала   |
| `--c-ref-color-blue-90`     | `#bbdefb`    | Синяя акцентная шкала   |
| `--c-ref-color-blue-95`     | `#e3f2fd`    | Синяя акцентная шкала   |
| `--c-ref-color-green-40`    | `#4caf50`    | Зеленая шкала success   |
| `--c-ref-color-green-80`    | `#81c784`    | Зеленая шкала success   |
| `--c-ref-color-green-95`    | `#e8f5e9`    | Зеленая шкала success   |
| `--c-ref-color-red-40`      | `#e53935`    | Красная шкала error     |
| `--c-ref-color-red-80`      | `#e57373`    | Красная шкала error     |
| `--c-ref-color-red-95`      | `#ffebee`    | Красная шкала error     |
| `--c-ref-color-orange-40`   | `#ff9800`    | Оранжевая шкала warning |
| `--c-ref-color-orange-80`   | `#ffb74d`    | Оранжевая шкала warning |
| `--c-ref-color-orange-95`   | `#fff3e0`    | Оранжевая шкала warning |
| `--c-ref-color-cyan-40`     | `#039be5`    | Голубая шкала info      |
| `--c-ref-color-cyan-80`     | `#4fc3f7`    | Голубая шкала info      |
| `--c-ref-color-cyan-95`     | `#e1f5fe`    | Голубая шкала info      |
| `--c-ref-color-lime-40`     | `#7cb342`    | Lime-шкала tertiary     |
| `--c-ref-color-lime-80`     | `#aed581`    | Lime-шкала tertiary     |
| `--c-ref-color-lime-95`     | `#f1f8e9`    | Lime-шкала tertiary     |

## System Color Tokens

| Переменная                                | Ключ темы                 | Light по умолчанию               | Dark по умолчанию                           | Назначение                               |
| ----------------------------------------- | ------------------------- | -------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `--c-sys-color-scheme`                    | `scheme`                  | `light`                          | `dark`                                      | Значение CSS `color-scheme`              |
| `--c-sys-color-primary`                   | `primary`                 | `var(--c-ref-color-blue-40)`     | `var(--c-ref-color-blue-80)`                | Основной акцент                          |
| `--c-sys-color-primary-rgb`               | `primaryRgb`              | `25, 118, 210`                   | `144, 202, 249`                             | RGB-каналы primary для rgba state layers |
| `--c-sys-color-on-primary`                | `onPrimary`               | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на primary                  |
| `--c-sys-color-primary-container`         | `primaryContainer`        | `var(--c-ref-color-blue-95)`     | `#1565c0`                                   | Контейнер primary                        |
| `--c-sys-color-on-primary-container`      | `onPrimaryContainer`      | `#0d47a1`                        | `var(--c-ref-color-blue-95)`                | Текст/иконки на primary container        |
| `--c-sys-color-secondary`                 | `secondary`               | `#1565c0`                        | `#64b5f6`                                   | Вторичный акцент                         |
| `--c-sys-color-on-secondary`              | `onSecondary`             | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на secondary                |
| `--c-sys-color-secondary-container`       | `secondaryContainer`      | `var(--c-ref-color-blue-90)`     | `#0d47a1`                                   | Контейнер secondary                      |
| `--c-sys-color-on-secondary-container`    | `onSecondaryContainer`    | `#0d47a1`                        | `var(--c-ref-color-blue-90)`                | Текст/иконки на secondary container      |
| `--c-sys-color-tertiary`                  | `tertiary`                | `var(--c-ref-color-lime-40)`     | `var(--c-ref-color-lime-80)`                | Третичный акцент                         |
| `--c-sys-color-on-tertiary`               | `onTertiary`              | `var(--c-ref-color-black)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на tertiary                 |
| `--c-sys-color-tertiary-container`        | `tertiaryContainer`       | `var(--c-ref-color-lime-95)`     | `#33691e`                                   | Контейнер tertiary                       |
| `--c-sys-color-on-tertiary-container`     | `onTertiaryContainer`     | `#33691e`                        | `var(--c-ref-color-lime-95)`                | Текст/иконки на tertiary container       |
| `--c-sys-color-success`                   | `success`                 | `var(--c-ref-color-green-40)`    | `var(--c-ref-color-green-80)`               | Успешное состояние                       |
| `--c-sys-color-on-success`                | `onSuccess`               | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на success                  |
| `--c-sys-color-success-container`         | `successContainer`        | `var(--c-ref-color-green-95)`    | `#1b5e20`                                   | Контейнер success                        |
| `--c-sys-color-on-success-container`      | `onSuccessContainer`      | `#1b5e20`                        | `var(--c-ref-color-green-95)`               | Текст/иконки на success container        |
| `--c-sys-color-error`                     | `error`                   | `var(--c-ref-color-red-40)`      | `var(--c-ref-color-red-80)`                 | Ошибки и опасные состояния               |
| `--c-sys-color-on-error`                  | `onError`                 | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на error                    |
| `--c-sys-color-error-container`           | `errorContainer`          | `var(--c-ref-color-red-95)`      | `#b71c1c`                                   | Контейнер error                          |
| `--c-sys-color-on-error-container`        | `onErrorContainer`        | `#b71c1c`                        | `var(--c-ref-color-red-95)`                 | Текст/иконки на error container          |
| `--c-sys-color-warning`                   | `warning`                 | `var(--c-ref-color-orange-40)`   | `var(--c-ref-color-orange-80)`              | Предупреждения                           |
| `--c-sys-color-on-warning`                | `onWarning`               | `var(--c-ref-color-black)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на warning                  |
| `--c-sys-color-warning-container`         | `warningContainer`        | `var(--c-ref-color-orange-95)`   | `#e65100`                                   | Контейнер warning                        |
| `--c-sys-color-on-warning-container`      | `onWarningContainer`      | `#e65100`                        | `var(--c-ref-color-orange-95)`              | Текст/иконки на warning container        |
| `--c-sys-color-info`                      | `info`                    | `var(--c-ref-color-cyan-40)`     | `var(--c-ref-color-cyan-80)`                | Информационное состояние                 |
| `--c-sys-color-on-info`                   | `onInfo`                  | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Текст/иконки на info                     |
| `--c-sys-color-info-container`            | `infoContainer`           | `var(--c-ref-color-cyan-95)`     | `#01579b`                                   | Контейнер info                           |
| `--c-sys-color-on-info-container`         | `onInfoContainer`         | `#01579b`                        | `var(--c-ref-color-cyan-95)`                | Текст/иконки на info container           |
| `--c-sys-color-background`                | `background`              | `var(--c-ref-color-neutral-100)` | `#121212`                                   | Фон приложения                           |
| `--c-sys-color-on-background`             | `onBackground`            | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Текст на фоне приложения                 |
| `--c-sys-color-surface`                   | `surface`                 | `var(--c-ref-color-neutral-0)`   | `#1e1e1e`                                   | Базовая поверхность компонентов          |
| `--c-sys-color-surface-dim`               | `surfaceDim`              | `var(--c-ref-color-neutral-100)` | `#121212`                                   | Приглушенная поверхность                 |
| `--c-sys-color-surface-bright`            | `surfaceBright`           | `var(--c-ref-color-white)`       | `#2f2f2f`                                   | Яркая поверхность                        |
| `--c-sys-color-surface-container-lowest`  | `surfaceContainerLowest`  | `var(--c-ref-color-white)`       | `#161616`                                   | Самый низкий контейнер поверхности       |
| `--c-sys-color-surface-container-low`     | `surfaceContainerLow`     | `var(--c-ref-color-neutral-50)`  | `#202020`                                   | Низкий контейнер поверхности             |
| `--c-sys-color-surface-container`         | `surfaceContainer`        | `var(--c-ref-color-neutral-100)` | `#242424`                                   | Контейнер поверхности                    |
| `--c-sys-color-surface-container-high`    | `surfaceContainerHigh`    | `var(--c-ref-color-neutral-200)` | `#2a2a2a`                                   | Высокий контейнер поверхности            |
| `--c-sys-color-surface-container-highest` | `surfaceContainerHighest` | `var(--c-ref-color-neutral-300)` | `#333333`                                   | Самый высокий контейнер поверхности      |
| `--c-sys-color-surface-variant`           | `surfaceVariant`          | `var(--c-ref-color-neutral-200)` | `#2f2f2f`                                   | Вариант поверхности                      |
| `--c-sys-color-on-surface`                | `onSurface`               | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Текст на surface                         |
| `--c-sys-color-on-surface-variant`        | `onSurfaceVariant`        | `var(--c-ref-color-neutral-700)` | `var(--c-ref-color-neutral-400)`            | Вторичный текст на surface               |
| `--c-sys-color-inverse-surface`           | `inverseSurface`          | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Инверсная поверхность                    |
| `--c-sys-color-inverse-on-surface`        | `inverseOnSurface`        | `var(--c-ref-color-neutral-100)` | `var(--c-ref-color-neutral-900)`            | Текст на инверсной поверхности           |
| `--c-sys-color-outline`                   | `outline`                 | `var(--c-ref-color-neutral-600)` | `var(--c-ref-color-neutral-500)`            | Основная обводка                         |
| `--c-sys-color-outline-variant`           | `outlineVariant`          | `var(--c-ref-color-neutral-300)` | `var(--c-ref-color-neutral-800)`            | Вторичная обводка                        |
| `--c-sys-color-placeholder`               | `placeholder`             | `var(--c-ref-color-neutral-500)` | `var(--c-ref-color-neutral-600)`            | Placeholder в полях                      |
| `--c-sys-color-disabled`                  | `disabled`                | `var(--c-ref-color-neutral-500)` | `var(--c-ref-color-neutral-700)`            | Текст/иконки disabled                    |
| `--c-sys-color-disabled-container`        | `disabledContainer`       | `var(--c-ref-color-neutral-200)` | `var(--c-sys-color-surface-container-high)` | Контейнер disabled                       |
| `--c-sys-color-readonly`                  | `readonly`                | `var(--c-sys-color-primary)`     | `var(--c-sys-color-primary)`                | Акцент readonly                          |
| `--c-sys-color-readonly-container`        | `readonlyContainer`       | `var(--c-ref-color-neutral-100)` | `var(--c-sys-color-surface-container-high)` | Контейнер readonly                       |
| `--c-sys-color-focus-ring`                | `focusRing`               | `var(--c-sys-color-primary)`     | `var(--c-sys-color-primary)`                | Цвет focus ring                          |
| `--c-sys-color-scrim`                     | `scrim`                   | `rgba(0, 0, 0, 0.5)`             | `rgba(0, 0, 0, 0.7)`                        | Затемнение оверлеев                      |
| `--c-sys-color-shadow`                    | `shadow`                  | `rgba(0, 0, 0, 0.15)`            | `rgba(0, 0, 0, 0.4)`                        | Базовый цвет тени                        |

## System State Tokens

| Переменная                                 | Ключ темы                       | По умолчанию                                                               | Dark   | Назначение                  |
| ------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------- | ------ | --------------------------- |
| `--c-sys-state-hover-opacity`              | `stateHoverOpacity`             | `0.08`                                                                     | -      | Opacity hover state layer   |
| `--c-sys-state-focus-opacity`              | `stateFocusOpacity`             | `0.16`                                                                     | -      | Opacity focus state layer   |
| `--c-sys-state-pressed-opacity`            | `statePressedOpacity`           | `0.12`                                                                     | -      | Opacity pressed state layer |
| `--c-sys-state-dragged-opacity`            | `stateDraggedOpacity`           | `0.16`                                                                     | -      | Opacity dragged state layer |
| `--c-sys-state-disabled-opacity`           | `stateDisabledOpacity`          | `0.5`                                                                      | `0.4`  | Opacity disabled элемента   |
| `--c-sys-state-disabled-container-opacity` | `stateDisabledContainerOpacity` | `0.12`                                                                     | `0.16` | Opacity disabled container  |
| `--c-sys-state-hover-color`                | `stateHoverColor`               | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-hover-opacity))`   | -      | Цвет hover state layer      |
| `--c-sys-state-focus-color`                | `stateFocusColor`               | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-focus-opacity))`   | -      | Цвет focus state layer      |
| `--c-sys-state-pressed-color`              | `statePressedColor`             | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-pressed-opacity))` | -      | Цвет pressed state layer    |
| `--c-sys-state-selected-color`             | `stateSelectedColor`            | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-pressed-opacity))` | -      | Цвет selected state layer   |

## System Typography Tokens

| Переменная                             | Ключ темы                   | По умолчанию                                                       | Назначение               |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------ | ------------------------ |
| `--c-sys-typography-font-family-base`  | `typographyFontFamilyBase`  | `inherit`                                                          | Базовый шрифт            |
| `--c-sys-typography-font-family-mono`  | `typographyFontFamilyMono`  | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` | Моноширинный шрифт       |
| `--c-sys-typography-body-size`         | `typographyBodySize`        | `1rem`                                                             | Размер body-текста       |
| `--c-sys-typography-body-line-height`  | `typographyBodyLineHeight`  | `1.5`                                                              | Line-height body-текста  |
| `--c-sys-typography-label-size`        | `typographyLabelSize`       | `0.875rem`                                                         | Размер label-текста      |
| `--c-sys-typography-label-line-height` | `typographyLabelLineHeight` | `1.25rem`                                                          | Line-height label-текста |
| `--c-sys-typography-label-weight`      | `typographyLabelWeight`     | `500`                                                              | Font-weight label-текста |
| `--c-sys-typography-title-size`        | `typographyTitleSize`       | `1.125rem`                                                         | Размер title-текста      |
| `--c-sys-typography-title-line-height` | `typographyTitleLineHeight` | `1.5rem`                                                           | Line-height title-текста |
| `--c-sys-typography-title-weight`      | `typographyTitleWeight`     | `600`                                                              | Font-weight title-текста |

## System Spacing And Control Tokens

| Переменная                       | Ключ темы              | По умолчанию           | Назначение                       |
| -------------------------------- | ---------------------- | ---------------------- | -------------------------------- |
| `--c-sys-space-0`                | `space0`               | `0`                    | Шаг отступов 0                   |
| `--c-sys-space-1`                | `space1`               | `4px`                  | Шаг отступов 1                   |
| `--c-sys-space-2`                | `space2`               | `8px`                  | Шаг отступов 2                   |
| `--c-sys-space-3`                | `space3`               | `12px`                 | Шаг отступов 3                   |
| `--c-sys-space-4`                | `space4`               | `16px`                 | Шаг отступов 4                   |
| `--c-sys-space-5`                | `space5`               | `20px`                 | Шаг отступов 5                   |
| `--c-sys-space-6`                | `space6`               | `24px`                 | Шаг отступов 6                   |
| `--c-sys-space-8`                | `space8`               | `32px`                 | Шаг отступов 8                   |
| `--c-sys-space-10`               | `space10`              | `40px`                 | Шаг отступов 10                  |
| `--c-sys-density-scale`          | `densityScale`         | `0px`                  | Добавка к плотности контролов    |
| `--c-sys-control-height-sm`      | `controlHeightSm`      | `32px`                 | Высота маленького контрола       |
| `--c-sys-control-height-md`      | `controlHeightMd`      | `42px`                 | Высота среднего контрола         |
| `--c-sys-control-height-lg`      | `controlHeightLg`      | `48px`                 | Высота большого контрола         |
| `--c-sys-control-padding-inline` | `controlPaddingInline` | `var(--c-sys-space-3)` | Горизонтальный padding контролов |
| `--c-sys-control-icon-size`      | `controlIconSize`      | `24px`                 | Размер иконки в контролах        |

## System Shape And Border Tokens

| Переменная                    | Ключ темы           | По умолчанию | Назначение               |
| ----------------------------- | ------------------- | ------------ | ------------------------ |
| `--c-sys-shape-none`          | `shapeNone`         | `0`          | Без скругления           |
| `--c-sys-shape-xs`            | `shapeXs`           | `2px`        | Очень малое скругление   |
| `--c-sys-shape-sm`            | `shapeSm`           | `4px`        | Малое скругление         |
| `--c-sys-shape-md`            | `shapeMd`           | `8px`        | Среднее скругление       |
| `--c-sys-shape-lg`            | `shapeLg`           | `12px`       | Большое скругление       |
| `--c-sys-shape-xl`            | `shapeXl`           | `16px`       | Очень большое скругление |
| `--c-sys-shape-pill`          | `shapePill`         | `9999px`     | Pill-скругление          |
| `--c-sys-border-width-thin`   | `borderWidthThin`   | `1px`        | Тонкая рамка             |
| `--c-sys-border-width-medium` | `borderWidthMedium` | `1.5px`      | Средняя рамка            |
| `--c-sys-border-width-thick`  | `borderWidthThick`  | `2px`        | Толстая рамка            |

## System Elevation And Motion Tokens

| Переменная                         | Ключ темы                | По умолчанию                      | Назначение                 |
| ---------------------------------- | ------------------------ | --------------------------------- | -------------------------- |
| `--c-sys-elevation-0`              | `elevation0`             | `none`                            | Без тени                   |
| `--c-sys-elevation-1`              | `elevation1`             | Material shadow level 1           | Низкая тень                |
| `--c-sys-elevation-2`              | `elevation2`             | Material shadow level 2           | Тень всплывающих элементов |
| `--c-sys-elevation-3`              | `elevation3`             | Material shadow level 3           | Средняя тень               |
| `--c-sys-elevation-4`              | `elevation4`             | Material shadow level 4           | Высокая тень               |
| `--c-sys-elevation-5`              | `elevation5`             | Material shadow level 5           | Очень высокая тень         |
| `--c-sys-motion-duration-instant`  | `motionDurationInstant`  | `0ms`                             | Мгновенный переход         |
| `--c-sys-motion-duration-fast`     | `motionDurationFast`     | `120ms`                           | Быстрый переход            |
| `--c-sys-motion-duration-medium`   | `motionDurationMedium`   | `200ms`                           | Средний переход            |
| `--c-sys-motion-duration-slow`     | `motionDurationSlow`     | `320ms`                           | Медленный переход          |
| `--c-sys-motion-easing-linear`     | `motionEasingLinear`     | `linear`                          | Линейная easing-функция    |
| `--c-sys-motion-easing-standard`   | `motionEasingStandard`   | `cubic-bezier(0.25, 0.8, 0.5, 1)` | Стандартная easing-функция |
| `--c-sys-motion-easing-emphasized` | `motionEasingEmphasized` | `cubic-bezier(0.2, 0, 0, 1)`      | Акцентная easing-функция   |
