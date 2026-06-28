# CSS Variables

Vueland UI uses layered CSS custom properties:

- `--c-ref-*` - reference tokens with base palette values.
- `--c-sys-*` - global system theming tokens used by components and application styles.
- `--c-{component}-*` - component tokens. They are documented on component pages.

This page documents global reference and system tokens. The old `--global-*` variables are no longer used.

## Theme Overrides

System tokens can be overridden through `themes` in `createVuelandUI`. CamelCase keys map to CSS variables: `primary` -> `--c-sys-color-primary`, `shapeMd` -> `--c-sys-shape-md`, `motionDurationFast` -> `--c-sys-motion-duration-fast`.

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

Keys that already start with `--` are passed through as-is. Use that only for targeted integrations; short system keys are preferred for themes.

## Reference Tokens

Reference tokens are defined on `:root` and provide the raw palette for system roles. They do not have short `ThemeDefinition` keys; override them only through direct CSS custom property names when needed.

| Variable                    | Default   | Purpose              |
| --------------------------- | --------- | -------------------- |
| `--c-ref-color-white`       | `#ffffff` | White                |
| `--c-ref-color-black`       | `#000000` | Black                |
| `--c-ref-color-neutral-0`   | `#ffffff` | Neutral scale        |
| `--c-ref-color-neutral-50`  | `#fafafa` | Neutral scale        |
| `--c-ref-color-neutral-100` | `#f5f5f5` | Neutral scale        |
| `--c-ref-color-neutral-200` | `#eeeeee` | Neutral scale        |
| `--c-ref-color-neutral-300` | `#e0e0e0` | Neutral scale        |
| `--c-ref-color-neutral-400` | `#bdbdbd` | Neutral scale        |
| `--c-ref-color-neutral-500` | `#9e9e9e` | Neutral scale        |
| `--c-ref-color-neutral-600` | `#757575` | Neutral scale        |
| `--c-ref-color-neutral-700` | `#616161` | Neutral scale        |
| `--c-ref-color-neutral-800` | `#424242` | Neutral scale        |
| `--c-ref-color-neutral-900` | `#212121` | Neutral scale        |
| `--c-ref-color-neutral-950` | `#000000` | Neutral scale        |
| `--c-ref-color-blue-40`     | `#1976d2` | Blue accent scale    |
| `--c-ref-color-blue-50`     | `#1e88e5` | Blue accent scale    |
| `--c-ref-color-blue-80`     | `#90caf9` | Blue accent scale    |
| `--c-ref-color-blue-90`     | `#bbdefb` | Blue accent scale    |
| `--c-ref-color-blue-95`     | `#e3f2fd` | Blue accent scale    |
| `--c-ref-color-green-40`    | `#4caf50` | Green success scale  |
| `--c-ref-color-green-80`    | `#81c784` | Green success scale  |
| `--c-ref-color-green-95`    | `#e8f5e9` | Green success scale  |
| `--c-ref-color-red-40`      | `#e53935` | Red error scale      |
| `--c-ref-color-red-80`      | `#e57373` | Red error scale      |
| `--c-ref-color-red-95`      | `#ffebee` | Red error scale      |
| `--c-ref-color-orange-40`   | `#ff9800` | Orange warning scale |
| `--c-ref-color-orange-80`   | `#ffb74d` | Orange warning scale |
| `--c-ref-color-orange-95`   | `#fff3e0` | Orange warning scale |
| `--c-ref-color-cyan-40`     | `#039be5` | Cyan info scale      |
| `--c-ref-color-cyan-80`     | `#4fc3f7` | Cyan info scale      |
| `--c-ref-color-cyan-95`     | `#e1f5fe` | Cyan info scale      |
| `--c-ref-color-lime-40`     | `#7cb342` | Lime tertiary scale  |
| `--c-ref-color-lime-80`     | `#aed581` | Lime tertiary scale  |
| `--c-ref-color-lime-95`     | `#f1f8e9` | Lime tertiary scale  |

## System Color Tokens

| Variable                                  | Theme key                 | Light default                    | Dark default                                | Purpose                                    |
| ----------------------------------------- | ------------------------- | -------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `--c-sys-color-scheme`                    | `scheme`                  | `light`                          | `dark`                                      | CSS `color-scheme` value                   |
| `--c-sys-color-primary`                   | `primary`                 | `var(--c-ref-color-blue-40)`     | `var(--c-ref-color-blue-80)`                | Main accent                                |
| `--c-sys-color-primary-rgb`               | `primaryRgb`              | `25, 118, 210`                   | `144, 202, 249`                             | Primary RGB channels for rgba state layers |
| `--c-sys-color-on-primary`                | `onPrimary`               | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on primary                      |
| `--c-sys-color-primary-container`         | `primaryContainer`        | `var(--c-ref-color-blue-95)`     | `#1565c0`                                   | Primary container                          |
| `--c-sys-color-on-primary-container`      | `onPrimaryContainer`      | `#0d47a1`                        | `var(--c-ref-color-blue-95)`                | Text/icons on primary container            |
| `--c-sys-color-secondary`                 | `secondary`               | `#1565c0`                        | `#64b5f6`                                   | Secondary accent                           |
| `--c-sys-color-on-secondary`              | `onSecondary`             | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on secondary                    |
| `--c-sys-color-secondary-container`       | `secondaryContainer`      | `var(--c-ref-color-blue-90)`     | `#0d47a1`                                   | Secondary container                        |
| `--c-sys-color-on-secondary-container`    | `onSecondaryContainer`    | `#0d47a1`                        | `var(--c-ref-color-blue-90)`                | Text/icons on secondary container          |
| `--c-sys-color-tertiary`                  | `tertiary`                | `var(--c-ref-color-lime-40)`     | `var(--c-ref-color-lime-80)`                | Tertiary accent                            |
| `--c-sys-color-on-tertiary`               | `onTertiary`              | `var(--c-ref-color-black)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on tertiary                     |
| `--c-sys-color-tertiary-container`        | `tertiaryContainer`       | `var(--c-ref-color-lime-95)`     | `#33691e`                                   | Tertiary container                         |
| `--c-sys-color-on-tertiary-container`     | `onTertiaryContainer`     | `#33691e`                        | `var(--c-ref-color-lime-95)`                | Text/icons on tertiary container           |
| `--c-sys-color-success`                   | `success`                 | `var(--c-ref-color-green-40)`    | `var(--c-ref-color-green-80)`               | Success state                              |
| `--c-sys-color-on-success`                | `onSuccess`               | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on success                      |
| `--c-sys-color-success-container`         | `successContainer`        | `var(--c-ref-color-green-95)`    | `#1b5e20`                                   | Success container                          |
| `--c-sys-color-on-success-container`      | `onSuccessContainer`      | `#1b5e20`                        | `var(--c-ref-color-green-95)`               | Text/icons on success container            |
| `--c-sys-color-error`                     | `error`                   | `var(--c-ref-color-red-40)`      | `var(--c-ref-color-red-80)`                 | Error and danger states                    |
| `--c-sys-color-on-error`                  | `onError`                 | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on error                        |
| `--c-sys-color-error-container`           | `errorContainer`          | `var(--c-ref-color-red-95)`      | `#b71c1c`                                   | Error container                            |
| `--c-sys-color-on-error-container`        | `onErrorContainer`        | `#b71c1c`                        | `var(--c-ref-color-red-95)`                 | Text/icons on error container              |
| `--c-sys-color-warning`                   | `warning`                 | `var(--c-ref-color-orange-40)`   | `var(--c-ref-color-orange-80)`              | Warning state                              |
| `--c-sys-color-on-warning`                | `onWarning`               | `var(--c-ref-color-black)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on warning                      |
| `--c-sys-color-warning-container`         | `warningContainer`        | `var(--c-ref-color-orange-95)`   | `#e65100`                                   | Warning container                          |
| `--c-sys-color-on-warning-container`      | `onWarningContainer`      | `#e65100`                        | `var(--c-ref-color-orange-95)`              | Text/icons on warning container            |
| `--c-sys-color-info`                      | `info`                    | `var(--c-ref-color-cyan-40)`     | `var(--c-ref-color-cyan-80)`                | Info state                                 |
| `--c-sys-color-on-info`                   | `onInfo`                  | `var(--c-ref-color-white)`       | `var(--c-ref-color-neutral-950)`            | Text/icons on info                         |
| `--c-sys-color-info-container`            | `infoContainer`           | `var(--c-ref-color-cyan-95)`     | `#01579b`                                   | Info container                             |
| `--c-sys-color-on-info-container`         | `onInfoContainer`         | `#01579b`                        | `var(--c-ref-color-cyan-95)`                | Text/icons on info container               |
| `--c-sys-color-background`                | `background`              | `var(--c-ref-color-neutral-100)` | `#121212`                                   | Application background                     |
| `--c-sys-color-on-background`             | `onBackground`            | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Text on application background             |
| `--c-sys-color-surface`                   | `surface`                 | `var(--c-ref-color-neutral-0)`   | `#1e1e1e`                                   | Base component surface                     |
| `--c-sys-color-surface-dim`               | `surfaceDim`              | `var(--c-ref-color-neutral-100)` | `#121212`                                   | Dim surface                                |
| `--c-sys-color-surface-bright`            | `surfaceBright`           | `var(--c-ref-color-white)`       | `#2f2f2f`                                   | Bright surface                             |
| `--c-sys-color-surface-container-lowest`  | `surfaceContainerLowest`  | `var(--c-ref-color-white)`       | `#161616`                                   | Lowest surface container                   |
| `--c-sys-color-surface-container-low`     | `surfaceContainerLow`     | `var(--c-ref-color-neutral-50)`  | `#202020`                                   | Low surface container                      |
| `--c-sys-color-surface-container`         | `surfaceContainer`        | `var(--c-ref-color-neutral-100)` | `#242424`                                   | Surface container                          |
| `--c-sys-color-surface-container-high`    | `surfaceContainerHigh`    | `var(--c-ref-color-neutral-200)` | `#2a2a2a`                                   | High surface container                     |
| `--c-sys-color-surface-container-highest` | `surfaceContainerHighest` | `var(--c-ref-color-neutral-300)` | `#333333`                                   | Highest surface container                  |
| `--c-sys-color-surface-variant`           | `surfaceVariant`          | `var(--c-ref-color-neutral-200)` | `#2f2f2f`                                   | Surface variant                            |
| `--c-sys-color-on-surface`                | `onSurface`               | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Text on surface                            |
| `--c-sys-color-on-surface-variant`        | `onSurfaceVariant`        | `var(--c-ref-color-neutral-700)` | `var(--c-ref-color-neutral-400)`            | Secondary text on surface                  |
| `--c-sys-color-inverse-surface`           | `inverseSurface`          | `var(--c-ref-color-neutral-900)` | `var(--c-ref-color-neutral-300)`            | Inverse surface                            |
| `--c-sys-color-inverse-on-surface`        | `inverseOnSurface`        | `var(--c-ref-color-neutral-100)` | `var(--c-ref-color-neutral-900)`            | Text on inverse surface                    |
| `--c-sys-color-outline`                   | `outline`                 | `var(--c-ref-color-neutral-600)` | `var(--c-ref-color-neutral-500)`            | Main outline                               |
| `--c-sys-color-outline-variant`           | `outlineVariant`          | `var(--c-ref-color-neutral-300)` | `var(--c-ref-color-neutral-800)`            | Secondary outline                          |
| `--c-sys-color-placeholder`               | `placeholder`             | `var(--c-ref-color-neutral-500)` | `var(--c-ref-color-neutral-600)`            | Field placeholder                          |
| `--c-sys-color-disabled`                  | `disabled`                | `var(--c-ref-color-neutral-500)` | `var(--c-ref-color-neutral-700)`            | Disabled text/icons                        |
| `--c-sys-color-disabled-container`        | `disabledContainer`       | `var(--c-ref-color-neutral-200)` | `var(--c-sys-color-surface-container-high)` | Disabled container                         |
| `--c-sys-color-readonly`                  | `readonly`                | `var(--c-sys-color-primary)`     | `var(--c-sys-color-primary)`                | Readonly accent                            |
| `--c-sys-color-readonly-container`        | `readonlyContainer`       | `var(--c-ref-color-neutral-100)` | `var(--c-sys-color-surface-container-high)` | Readonly container                         |
| `--c-sys-color-focus-ring`                | `focusRing`               | `var(--c-sys-color-primary)`     | `var(--c-sys-color-primary)`                | Focus ring color                           |
| `--c-sys-color-scrim`                     | `scrim`                   | `rgba(0, 0, 0, 0.5)`             | `rgba(0, 0, 0, 0.7)`                        | Overlay scrim                              |
| `--c-sys-color-shadow`                    | `shadow`                  | `rgba(0, 0, 0, 0.15)`            | `rgba(0, 0, 0, 0.4)`                        | Base shadow color                          |

## System State Tokens

| Variable                                   | Theme key                       | Default                                                                    | Dark   | Purpose                     |
| ------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------- | ------ | --------------------------- |
| `--c-sys-state-hover-opacity`              | `stateHoverOpacity`             | `0.08`                                                                     | -      | Hover state layer opacity   |
| `--c-sys-state-focus-opacity`              | `stateFocusOpacity`             | `0.16`                                                                     | -      | Focus state layer opacity   |
| `--c-sys-state-pressed-opacity`            | `statePressedOpacity`           | `0.12`                                                                     | -      | Pressed state layer opacity |
| `--c-sys-state-dragged-opacity`            | `stateDraggedOpacity`           | `0.16`                                                                     | -      | Dragged state layer opacity |
| `--c-sys-state-disabled-opacity`           | `stateDisabledOpacity`          | `0.5`                                                                      | `0.4`  | Disabled element opacity    |
| `--c-sys-state-disabled-container-opacity` | `stateDisabledContainerOpacity` | `0.12`                                                                     | `0.16` | Disabled container opacity  |
| `--c-sys-state-hover-color`                | `stateHoverColor`               | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-hover-opacity))`   | -      | Hover state layer color     |
| `--c-sys-state-focus-color`                | `stateFocusColor`               | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-focus-opacity))`   | -      | Focus state layer color     |
| `--c-sys-state-pressed-color`              | `statePressedColor`             | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-pressed-opacity))` | -      | Pressed state layer color   |
| `--c-sys-state-selected-color`             | `stateSelectedColor`            | `rgba(var(--c-sys-color-primary-rgb), var(--c-sys-state-pressed-opacity))` | -      | Selected state layer color  |

## System Typography Tokens

| Variable                               | Theme key                   | Default                                                            | Purpose               |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------ | --------------------- |
| `--c-sys-typography-font-family-base`  | `typographyFontFamilyBase`  | `inherit`                                                          | Base font family      |
| `--c-sys-typography-font-family-mono`  | `typographyFontFamilyMono`  | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` | Monospace font family |
| `--c-sys-typography-body-size`         | `typographyBodySize`        | `1rem`                                                             | Body text size        |
| `--c-sys-typography-body-line-height`  | `typographyBodyLineHeight`  | `1.5`                                                              | Body line height      |
| `--c-sys-typography-label-size`        | `typographyLabelSize`       | `0.875rem`                                                         | Label text size       |
| `--c-sys-typography-label-line-height` | `typographyLabelLineHeight` | `1.25rem`                                                          | Label line height     |
| `--c-sys-typography-label-weight`      | `typographyLabelWeight`     | `500`                                                              | Label font weight     |
| `--c-sys-typography-title-size`        | `typographyTitleSize`       | `1.125rem`                                                         | Title text size       |
| `--c-sys-typography-title-line-height` | `typographyTitleLineHeight` | `1.5rem`                                                           | Title line height     |
| `--c-sys-typography-title-weight`      | `typographyTitleWeight`     | `600`                                                              | Title font weight     |

## System Spacing And Control Tokens

| Variable                         | Theme key              | Default                | Purpose                    |
| -------------------------------- | ---------------------- | ---------------------- | -------------------------- |
| `--c-sys-space-0`                | `space0`               | `0`                    | Spacing step 0             |
| `--c-sys-space-1`                | `space1`               | `4px`                  | Spacing step 1             |
| `--c-sys-space-2`                | `space2`               | `8px`                  | Spacing step 2             |
| `--c-sys-space-3`                | `space3`               | `12px`                 | Spacing step 3             |
| `--c-sys-space-4`                | `space4`               | `16px`                 | Spacing step 4             |
| `--c-sys-space-5`                | `space5`               | `20px`                 | Spacing step 5             |
| `--c-sys-space-6`                | `space6`               | `24px`                 | Spacing step 6             |
| `--c-sys-space-8`                | `space8`               | `32px`                 | Spacing step 8             |
| `--c-sys-space-10`               | `space10`              | `40px`                 | Spacing step 10            |
| `--c-sys-density-scale`          | `densityScale`         | `0px`                  | Control density offset     |
| `--c-sys-control-height-sm`      | `controlHeightSm`      | `32px`                 | Small control height       |
| `--c-sys-control-height-md`      | `controlHeightMd`      | `42px`                 | Medium control height      |
| `--c-sys-control-height-lg`      | `controlHeightLg`      | `48px`                 | Large control height       |
| `--c-sys-control-padding-inline` | `controlPaddingInline` | `var(--c-sys-space-3)` | Control horizontal padding |
| `--c-sys-control-icon-size`      | `controlIconSize`      | `24px`                 | Control icon size          |

## System Shape And Border Tokens

| Variable                      | Theme key           | Default  | Purpose            |
| ----------------------------- | ------------------- | -------- | ------------------ |
| `--c-sys-shape-none`          | `shapeNone`         | `0`      | No radius          |
| `--c-sys-shape-xs`            | `shapeXs`           | `2px`    | Extra small radius |
| `--c-sys-shape-sm`            | `shapeSm`           | `4px`    | Small radius       |
| `--c-sys-shape-md`            | `shapeMd`           | `8px`    | Medium radius      |
| `--c-sys-shape-lg`            | `shapeLg`           | `12px`   | Large radius       |
| `--c-sys-shape-xl`            | `shapeXl`           | `16px`   | Extra large radius |
| `--c-sys-shape-pill`          | `shapePill`         | `9999px` | Pill radius        |
| `--c-sys-border-width-thin`   | `borderWidthThin`   | `1px`    | Thin border        |
| `--c-sys-border-width-medium` | `borderWidthMedium` | `1.5px`  | Medium border      |
| `--c-sys-border-width-thick`  | `borderWidthThick`  | `2px`    | Thick border       |

## System Elevation And Motion Tokens

| Variable                           | Theme key                | Default                           | Purpose                 |
| ---------------------------------- | ------------------------ | --------------------------------- | ----------------------- |
| `--c-sys-elevation-0`              | `elevation0`             | `none`                            | No shadow               |
| `--c-sys-elevation-1`              | `elevation1`             | Material shadow level 1           | Low shadow              |
| `--c-sys-elevation-2`              | `elevation2`             | Material shadow level 2           | Floating element shadow |
| `--c-sys-elevation-3`              | `elevation3`             | Material shadow level 3           | Medium shadow           |
| `--c-sys-elevation-4`              | `elevation4`             | Material shadow level 4           | High shadow             |
| `--c-sys-elevation-5`              | `elevation5`             | Material shadow level 5           | Extra high shadow       |
| `--c-sys-motion-duration-instant`  | `motionDurationInstant`  | `0ms`                             | Instant transition      |
| `--c-sys-motion-duration-fast`     | `motionDurationFast`     | `120ms`                           | Fast transition         |
| `--c-sys-motion-duration-medium`   | `motionDurationMedium`   | `200ms`                           | Medium transition       |
| `--c-sys-motion-duration-slow`     | `motionDurationSlow`     | `320ms`                           | Slow transition         |
| `--c-sys-motion-easing-linear`     | `motionEasingLinear`     | `linear`                          | Linear easing           |
| `--c-sys-motion-easing-standard`   | `motionEasingStandard`   | `cubic-bezier(0.25, 0.8, 0.5, 1)` | Standard easing         |
| `--c-sys-motion-easing-emphasized` | `motionEasingEmphasized` | `cubic-bezier(0.2, 0, 0, 1)`      | Emphasized easing       |
