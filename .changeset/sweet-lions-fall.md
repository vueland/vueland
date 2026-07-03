---
'@vueland/eslint-script-setup': major
---

fix: `script-setup-order` dependency detection hardened — dependencies through TS wrappers (`as`, `satisfies`, `!`) and destructured declarations are now tracked (prevents auto-sort from producing broken code), member properties and object keys are no longer treated as references, and autofix preserves node indentation after leading comments
