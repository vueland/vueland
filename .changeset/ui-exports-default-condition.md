---
'@vueland/ui': patch
---

Use the `default` export condition for JS subpaths

Subpath exports declared only the `import` condition, so CommonJS resolution (`require('@vueland/ui')` on Node ≥ 20.19 via `require(ESM)`) failed with "No exports main defined" — resolution never reached the module. All JS subpaths now use `default` (matching `@vueland/utils-jit` / `@vueland/eslint-script-setup`), which serves both `import` and `require` consumers. Caught by the new pack smoke test.
