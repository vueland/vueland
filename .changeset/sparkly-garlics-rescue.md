---
'@vueland/ui': minor
---

feat: CProgressCircular and CProgressLinear components

- `CProgressCircular` — circular progress indicator: determinate (`value`, clamped to 0–100) and `indeterminate` modes, `size` / `width` / `rotate` props, semantic `color` prop, default slot with the normalized value rendered in the center.
- `CProgressLinear` — linear progress bar: determinate, buffer (`buffer-value`) and `indeterminate` modes, `height` prop, semantic `color` prop.
- Preset system support for both: zones cover every colorable element (`root`/`underlay`/`overlay`/`info` for circular, `root`/`background`/`buffer`/`bar` for linear) with `indeterminate` and `complete` (`value` >= 100) states; new `CProgressCircularPreset` / `CProgressLinearPreset` types.
- Accessibility: `role="progressbar"` with `aria-valuemin/max/now`; `aria-valuenow` is omitted in indeterminate mode per the WAI-ARIA pattern.
- Track colors derive from the matching `*-container` theme token; all colors are overridable via `--c-progress-*` CSS variables.
- Guarded against invalid input: non-numeric `value`/`bufferValue` clamp to 0, non-numeric or non-positive `size`/`width`/`height` fall back to defaults, `width` is capped at half the diameter.
