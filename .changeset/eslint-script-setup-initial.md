---
"@vueland/eslint-script-setup": minor
---

Initial release of `@vueland/eslint-script-setup` — an ESLint plugin that enforces consistent code ordering in Vue 3 `<script setup>` blocks.

Rules:
- `script-setup-order` — enforces `import → type → macros → composable → reactive → variable → computed → function → watchEffect → watch → lifecycle` order with autofix
- `no-multi-declaration` — forbids multiple declarators in a single statement
- `no-inline-composable` — forbids calling composables inline as arguments
