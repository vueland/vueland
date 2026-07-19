---
'@vueland/ui': patch
---

Remove the untyped `$ui` global property

`createVuelandUI` no longer sets `app.config.globalProperties.$ui`. The property was undocumented, untyped (`any` in templates) and unused — the supported way to reach the library instance is the `useCore()` composable (or `app.runWithContext(() => useCore())` outside a component). The plugin's `app.use` options argument is now typed as `Partial<LibOptions>` instead of `any`.
