<div align="center">
  <img src="https://raw.githubusercontent.com/vueland/vueland/master/logo.png" style="max-width: 100%;">
</div>

<div align="center">
  <h1>@vueland/eslint-script-setup</h1>
  <p>ESLint plugin for Vue 3 <code>&lt;script setup&gt;</code> code ordering</p>
  <p>
    <a href="https://vueland.github.io/vueland/en/plugins/eslint-script-setup/getting-started">
      <img src="https://img.shields.io/badge/docs-vueland-blue?style=flat" alt="Documentation">
    </a>
    &nbsp;
    <a href="https://github.com/vueland/vueland">
      <img src="https://img.shields.io/github/stars/vueland/vueland?style=flat&logo=github&label=Star%20us%20on%20GitHub" alt="GitHub Stars">
    </a>
  </p>
</div>

---

Enforces a consistent order of declarations inside `<script setup>` blocks and provides autofix.

Default order: `import → type → macros → class → composable → inject → reactive → variable → computed → function → watchEffect → watch → provide → lifecycle → defineExpose`

## Installation

```bash
# pnpm
pnpm add -D @vueland/eslint-script-setup

# npm
npm install -D @vueland/eslint-script-setup

# yarn
yarn add -D @vueland/eslint-script-setup
```

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

Or use the `recommended` preset:

```js
import vueScriptSetup from '@vueland/eslint-script-setup'

export default [vueScriptSetup.configs.recommended]
```

## Rules

### `script-setup-order`

Enforces declaration order inside `<script setup>`. Provides autofix — runs a single `eslint --fix` to sort the entire block.

```vue
<script setup lang="ts">
// ✓ correct order
import { ref, computed } from 'vue'

type Status = 'idle' | 'done'

const props = defineProps<{ label: string }>()

const router = useRouter()

const count = ref(0)

const MAX = 100

const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

watchEffect(() => {
  /* ... */
})

watch(count, () => {
  /* ... */
})

onMounted(() => {
  /* ... */
})
</script>
```

**Options:**

```js
'@vueland/script-setup-order': ['warn', {
  // Override the full order (all categories you want enforced must be listed).
  // Individual macros (defineProps, defineEmits, defineSlots, defineModel,
  // defineOptions) may be listed instead of the whole 'macros' group.
  order: ['import', 'type', 'macros', 'class', 'composable', 'inject',
          'reactive', 'variable', 'computed', 'function', 'watchEffect',
          'watch', 'provide', 'lifecycle', 'defineExpose'],

  // Regex pattern to detect composables (default: /^use[A-Z]/)
  composablePattern: '^use[A-Z]',

  // Extra APIs appended to each built-in category set
  reactiveApis: ['customRef'],
  computedApis: ['asyncComputed'],
  watchEffectApis: ['watchDebounced'],
  watchApis: ['watchThrottled'],
  lifecycleApis: ['onIdle'],

  // Hook order inside the lifecycle group (default: lifecycle firing order).
  // Pass [] to disable hook sorting. Applies when 'lifecycle' is listed in order.
  lifecycleOrder: ['onBeforeMount', 'onMounted', /* ... */],

  // Own categories matched by AST (declared name and/or callee name).
  // Each custom category must also be listed in `order`.
  customCategories: [
    { name: 'handlers', namePattern: '^on[A-Z]' },
    { name: 'stores', calleePattern: '^storeToRefs$' },
  ],
}]
```

**Pinning a declaration:**

A `// eslint-script-setup:keep` comment directly before a declaration (or at the end of its line) pins it in place — the rest of the block is sorted into the free slots around it. A blank line between the comment and the declaration breaks the pin.

```ts
const emit = defineEmits(['update'])

// eslint-script-setup:keep
const count = ref(0)
```

**Dependency conflict handling:**

If reordering would place a `const` before the value it depends on, the rule reports a `depConflict` instead of applying a broken fix. When the conflicting declaration is an arrow function (e.g. `const useFoo = () => {}`), the rule automatically converts it to a `function` declaration (which is hoisted) and sorts the block.

---

### `script-attrs-order`

Enforces attribute order on the `<script>` tag. Provides autofix.

```vue
<!-- ✗ -->
<script lang="ts" setup>

<!-- ✓ -->
<script setup lang="ts">
<script setup lang="ts" generic="T">
```

**Options:**

```js
'@vueland/script-attrs-order': ['warn', {
  // Attribute order (default). Attributes not listed keep their
  // relative order after the listed ones.
  order: ['setup', 'lang', 'generic'],
}]
```

---

### `no-multi-declaration`

Forbids multiple declarators in a single `const`/`let` statement.

```ts
// ✗
const a = ref(1),
  b = ref(2)

// ✓
const a = ref(1)
const b = ref(2)
```

---

### `no-inline-composable`

Forbids calling a composable inline as a function argument.

```ts
// ✗
doSomething(useRouter())

// ✓
const router = useRouter()
doSomething(router)
```

## Part of the Vueland platform

- [`@vueland/ui`](https://www.npmjs.com/package/@vueland/ui) — UI component library
- [`@vueland/utils-jit`](https://www.npmjs.com/package/@vueland/utils-jit) — JIT utility class generation for Vite

## ⭐ Support the project

**[Star on GitHub →](https://github.com/vueland/vueland)**

## License

MIT
