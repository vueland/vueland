---
'@vueland/eslint-script-setup': patch
'@vueland/ui': patch
---

Correctness fixes from code review

- **eslint-script-setup**: the `script-setup-order` autofix no longer rewrites unsafe functions into a function declaration. Arrow/function expressions that are `async`, generators, named function expressions, have a typed variable, or reference `this` / `arguments` / `super` / `new.target` are now report-only — previously the fixer could silently drop `async`/generator or change `this`/`arguments` semantics (even producing invalid syntax).
- **CInput**: a user-provided `style` attribute is now applied to the root element instead of being dropped.
- **CInput**: the combobox aria attributes are built via the pure `ariaExpandable` helper instead of creating a new `computed` on every recompute.
- **useValidate**: async validation is race-safe — only the latest run writes to the error state, so a slow stale rule can no longer overwrite a fresh result. Watchers are now always registered, so rules added dynamically after setup enable auto-validation.
- **@vueland/ui**: the `./types` subpath export no longer exposes a runtime `import` branch that resolved to a `.d.ts` file (type-only now).
