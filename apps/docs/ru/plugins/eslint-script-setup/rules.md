# Правила

## `script-setup-order`

Обеспечивает порядок объявлений внутри `<script setup>`. Поддерживает автофикс — достаточно запустить `eslint --fix`.

**Правильный порядок:**

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

### Конфликт зависимостей

Если после сортировки `const` окажется раньше значения, от которого зависит, правило сообщает о `depConflict` вместо применения сломанного фикса.

Если конфликтующее объявление — стрелочная функция (например `const useFoo = () => {}`), правило автоматически конвертирует её в `function` declaration (которая поднимается JavaScript-ом) и затем сортирует блок:

```ts
// До фикса
const count = useCounter() // ✗ используется до объявления
const useCounter = () => { return ref(0) }

// После фикса — конвертировано и отсортировано
function useCounter() { return ref(0) }
const count = useCounter()
```

### Опции

```js
'@vueland/script-setup-order': ['warn', {
  // Переопределить полный порядок категорий
  order: [
    'import', 'type', 'macros', 'composable', 'reactive',
    'variable', 'computed', 'function', 'watchEffect', 'watch', 'lifecycle'
  ],

  // Регулярное выражение для определения composable (по умолчанию: /^use[A-Z]/)
  composablePattern: '^use[A-Z]',

  // Дополнительные API для каждой встроенной категории
  reactiveApis: ['customRef'],
  computedApis: ['asyncComputed'],
  watchEffectApis: ['watchDebounced'],
  watchApis: ['watchThrottled'],
  lifecycleApis: ['onIdle'],
}]
```

### Адаптация под существующий проект

Полный порядок может быть слишком жёстким для большой устоявшейся кодовой базы. Опция `order` принимает **любое подмножество** категорий — проверяется только их порядок относительно друг друга, всё остальное игнорируется.

**Минимальный пресет — только макросы:**

```js
// Гарантирует что defineProps / defineEmits всегда идут раньше composable
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'macros'],
}]
```

**Средний пресет — добавляем composable:**

```js
// Также проверяет что composable идут после макросов
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'macros', 'composable'],
}]
```

**Полный пресет (дефолтный `recommended`):**

```js
'@vueland/script-setup-order': ['error', {
  order: [
    'import', 'type', 'macros', 'composable', 'reactive',
    'variable', 'computed', 'function', 'watchEffect', 'watch', 'lifecycle'
  ],
}]
```

> **Совет для существующих проектов:** начните с уровня `warn` и минимального подмножества `order`. Постепенно расширяйте список и переключайтесь на `error` по мере выравнивания кодовой базы.

---

## `no-multi-declaration`

Запрещает несколько объявлений в одном операторе `const`/`let` внутри `<script setup>`.

```ts
// ✗ неверно
const a = ref(1), b = ref(2)

// ✓ верно
const a = ref(1)
const b = ref(2)
```

---

## `no-inline-composable`

Запрещает вызов composable как аргумента функции напрямую.

```ts
// ✗ неверно
doSomething(useRouter())

// ✓ верно
const router = useRouter()
doSomething(router)
```
