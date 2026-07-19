---
'@vueland/ui': patch
---

Type all injection keys with concrete contracts

- `$MENU_API_KEY` → `InjectionKey<MenuAPI>`, `$SELECT_CONTROL_API_KEY` → `InjectionKey<SelectControlAPI>` (new interfaces exported from the component types), `$VUELAND_UI_KEY` → `InjectionKey<VuelandUI>`, `$PRESET_KEY` → `InjectionKey<ComputedRef<Maybe<StatePresets<string, string>>>>` — no more `InjectionKey<any>` in the public keys.
- `useCore()` now honestly returns `Maybe<VuelandUI>` instead of promising a `VuelandUI` it could not guarantee; internal preset consumers use `inject(key, undefined)` to match the `Maybe` convention.
