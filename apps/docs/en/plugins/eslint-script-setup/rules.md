# Rules

## `script-setup-order`

Enforces declaration order inside `<script setup>`. Provides autofix — runs a single `eslint --fix` to sort the entire block.

**Correct order:**

```vue
<script setup lang="ts">
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

### Dependency conflict handling

If reordering would place a `const` before the value it depends on, the rule reports a `depConflict` instead of applying a broken fix.

When the conflicting declaration is an arrow function (e.g. `const useFoo = () => {}`), the rule automatically converts it to a `function` declaration (which is hoisted by JavaScript) and then sorts the block:

```ts
// Before fix
const count = useCounter() // ✗ used before declaration
const useCounter = () => {
  return ref(0)
}

// After fix — converted and sorted
function useCounter() {
  return ref(0)
}
const count = useCounter()
```

### Options

```js
'@vueland/script-setup-order': ['warn', {
  // Override the full category order
  order: [
    'import', 'type', 'macros', 'class', 'composable', 'inject',
    'reactive', 'variable', 'computed', 'function', 'watchEffect',
    'watch', 'provide', 'lifecycle', 'defineExpose'
  ],

  // Regex to detect composables (default: /^use[A-Z]/)
  composablePattern: '^use[A-Z]',

  // Extra APIs added to each built-in category
  reactiveApis: ['customRef'],
  computedApis: ['asyncComputed'],
  watchEffectApis: ['watchDebounced'],
  watchApis: ['watchThrottled'],
  lifecycleApis: ['onIdle'],

  // Hook order inside the lifecycle group (default: lifecycle firing order)
  lifecycleOrder: ['onBeforeMount', 'onMounted' /* ... */],

  // Own categories matched by AST
  customCategories: [
    { name: 'handlers', namePattern: '^on[A-Z]' },
  ],
}]
```

Unknown entries in `order`, `lifecycleOrder`, or invalid `customCategories` throw a configuration error instead of being silently ignored.

### Pinning a declaration

A `// eslint-script-setup:keep` comment pins a declaration in place — the rest of the block is sorted into the free slots around it. The comment must be directly adjacent: on the line right before the declaration or at the end of its line. A blank line between the comment and the declaration breaks the pin.

```ts
const emit = defineEmits(['update'])

// eslint-script-setup:keep
const count = ref(0)

const props = defineProps<{ label: string }>() // stays below the pinned node
```

### Lifecycle hook order

Hooks inside the `lifecycle` group are sorted by the moment they fire: `onBeforeMount` → `onMounted` → `onBeforeUpdate` → `onUpdated` → `onBeforeUnmount` → `onUnmounted` → the rest. Multiple calls of the same hook keep their source order.

The `lifecycleOrder` option overrides this order; pass an empty array to disable hook sorting. Hook sorting only applies when `lifecycle` is listed in `order` — with a partial `order` that omits it, hooks are left as-is.

### Individual macros in `order`

Instead of the whole `macros` group, specific macros can be listed to enforce order between them. Macros not listed fall back to the position of the `macros` group. `withDefaults(defineProps(...))` counts as `defineProps`.

```js
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'defineOptions', 'defineProps', 'defineEmits', 'macros'],
}]
```

### Custom categories

The `customCategories` option defines your own groups, matched against the AST — by the declared identifier name (`namePattern`) and/or the callee name of the initializer (`calleePattern`). Custom matching runs before the built-in classification, and each custom category must also be listed in `order`:

```js
'@vueland/script-setup-order': ['warn', {
  order: ['macros', 'composable', 'stores', 'reactive', 'computed', 'handlers', 'lifecycle'],
  customCategories: [
    // const { items } = storeToRefs(store) → stores
    { name: 'stores', calleePattern: '^storeToRefs$' },
    // function onClick() {} / const onSubmit = () => {} → handlers
    { name: 'handlers', namePattern: '^on[A-Z]' },
  ],
}]
```

### Adapting to an existing project

The full order can feel too strict for a large established codebase. The `order` option accepts **any subset** of categories — only the listed ones are enforced relative to each other; everything else is ignored.

**Minimal preset — macros only:**

```js
// Ensures defineProps / defineEmits always come before composables
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'macros'],
}]
```

**Medium preset — add composables:**

```js
// Also enforces that composables follow macros
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'macros', 'composable'],
}]
```

**Full preset (default `recommended`):**

```js
'@vueland/script-setup-order': ['error', {
  order: [
    'import', 'type', 'macros', 'class', 'composable', 'inject',
    'reactive', 'variable', 'computed', 'function', 'watchEffect',
    'watch', 'provide', 'lifecycle', 'defineExpose'
  ],
}]
```

> **Tip for existing projects:** start with `warn` severity and a minimal `order` subset. Broaden the list and switch to `error` gradually as the codebase is aligned.

---

## `script-attrs-order`

Enforces attribute order on the `<script>` tag. Provides autofix.

```vue
<!-- ✗ incorrect -->
<script lang="ts" setup>

<!-- ✓ correct -->
<script setup lang="ts">
<script setup lang="ts" generic="T">
```

### Options

```js
'@vueland/script-attrs-order': ['warn', {
  // Attribute order (default). Attributes not listed keep their
  // relative order after the listed ones.
  order: ['setup', 'lang', 'generic'],
}]
```

---

## `no-multi-declaration`

Forbids multiple declarators in a single `const`/`let` statement inside `<script setup>`.

```ts
// ✗ incorrect
const a = ref(1),
  b = ref(2)

// ✓ correct
const a = ref(1)
const b = ref(2)
```

---

## `no-inline-composable`

Forbids calling a composable inline as a function argument.

```ts
// ✗ incorrect
doSomething(useRouter())

// ✓ correct
const router = useRouter()
doSomething(router)
```
