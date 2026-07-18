---
'@vueland/eslint-script-setup': minor
'@vueland/utils-jit': minor
'@vueland/ui': minor
---

Ship ESM-only, drop the CommonJS build

All published packages now ship a single ESM build. The CJS `require` exports and the `.cjs` / `.d.cts` artifacts are removed; `main`/`types` point at the `.mjs` / `.d.mts` entries.

Modern Node (≥ 20.19 — the `engines` floor) can still `require()` these packages via native `require(ESM)`, and every real consumer is ESM-native anyway (Vite 7/8 for `utils-jit`, ESLint 9 flat config for `eslint-script-setup`, bundlers for `ui`). Going ESM-only also removes the dual-package hazard — relevant for `@vueland/ui`, whose provide/inject singletons rely on a single module identity — and cuts package size and build complexity.
