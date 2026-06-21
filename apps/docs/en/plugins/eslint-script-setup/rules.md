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

function increment() { count.value++ }

watchEffect(() => { /* ... */ })

watch(count, () => { /* ... */ })

onMounted(() => { /* ... */ })
</script>
```

### Dependency conflict handling

If reordering would place a `const` before the value it depends on, the rule reports a `depConflict` instead of applying a broken fix.

When the conflicting declaration is an arrow function (e.g. `const useFoo = () => {}`), the rule automatically converts it to a `function` declaration (which is hoisted by JavaScript) and then sorts the block:

```ts
// Before fix
const count = useCounter() // ✗ used before declaration
const useCounter = () => { return ref(0) }

// After fix — converted and sorted
function useCounter() { return ref(0) }
const count = useCounter()
```

### Options

```js
'@vueland/script-setup-order': ['warn', {
  // Override the full category order
  order: [
    'import', 'type', 'macros', 'composable', 'reactive',
    'variable', 'computed', 'function', 'watchEffect', 'watch', 'lifecycle'
  ],

  // Regex to detect composables (default: /^use[A-Z]/)
  composablePattern: '^use[A-Z]',

  // Extra APIs added to each built-in category
  reactiveApis: ['customRef'],
  computedApis: ['asyncComputed'],
  watchEffectApis: ['watchDebounced'],
  watchApis: ['watchThrottled'],
  lifecycleApis: ['onIdle'],
}]
```

---

## `no-multi-declaration`

Forbids multiple declarators in a single `const`/`let` statement inside `<script setup>`.

```ts
// ✗ incorrect
const a = ref(1), b = ref(2)

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
