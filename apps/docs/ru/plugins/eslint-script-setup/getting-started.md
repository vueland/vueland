# Быстрый старт

`@vueland/eslint-script-setup` — ESLint плагин для упорядочивания кода в блоках `<script setup>` Vue 3.

Обеспечивает единообразный порядок объявлений внутри `<script setup>` и автоматически исправляет нарушения.

Порядок по умолчанию: `import → type → macros → composable → reactive → variable → computed → function → watchEffect → watch → lifecycle`

## Установка

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

Требует ESLint `>=9.0.0` (flat config) и `vue-eslint-parser`.

## Настройка

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

Или используйте пресет `recommended`, который применяет все правила с дефолтными уровнями:

```js
import vueScriptSetup from '@vueland/eslint-script-setup'

export default [vueScriptSetup.configs.recommended]
```
