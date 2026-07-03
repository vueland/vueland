# Getting Started

`@vueland/eslint-script-setup` is an ESLint plugin for Vue 3 `<script setup>` code ordering.

Enforces a consistent order of declarations inside `<script setup>` blocks and provides autofix.

Default order: `import → type → macros → composable → reactive → variable → computed → function → watchEffect → watch → lifecycle`

## Installation

::: code-group

```bash [pnpm]
pnpm add -D @vueland/eslint-script-setup
```

```bash [npm]
npm install -D @vueland/eslint-script-setup
```

```bash [yarn]
yarn add -D @vueland/eslint-script-setup
```

:::

Requires ESLint `>=9.0.0` (flat config) and `vue-eslint-parser`.

## Setup

```js
// eslint.config.mjs
import vueScriptSetup from '@vueland/eslint-script-setup'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser },
    },
    plugins: { '@vueland': vueScriptSetup },
    rules: {
      '@vueland/script-setup-order': 'warn',
      '@vueland/script-attrs-order': 'warn',
      '@vueland/no-multi-declaration': 'error',
      '@vueland/no-inline-composable': 'error',
    },
  },
]
```

Or use the `recommended` preset — it applies all rules with their default severity:

```js
import vueScriptSetup from '@vueland/eslint-script-setup'

export default [vueScriptSetup.configs.recommended]
```
