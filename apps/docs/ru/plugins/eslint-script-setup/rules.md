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

### Конфликт зависимостей

Если после сортировки `const` окажется раньше значения, от которого зависит, правило сообщает о `depConflict` вместо применения сломанного фикса.

Если конфликтующее объявление — стрелочная функция (например `const useFoo = () => {}`), правило автоматически конвертирует её в `function` declaration (которая поднимается JavaScript-ом) и затем сортирует блок:

```ts
// До фикса
const count = useCounter() // ✗ используется до объявления
const useCounter = () => {
  return ref(0)
}

// После фикса — конвертировано и отсортировано
function useCounter() {
  return ref(0)
}
const count = useCounter()
```

### Опции

```js
'@vueland/script-setup-order': ['warn', {
  // Переопределить полный порядок категорий
  order: [
    'import', 'type', 'macros', 'class', 'composable', 'inject',
    'reactive', 'variable', 'computed', 'function', 'watchEffect',
    'watch', 'provide', 'lifecycle', 'defineExpose'
  ],

  // Регулярное выражение для определения composable (по умолчанию: /^use[A-Z]/)
  composablePattern: '^use[A-Z]',

  // Дополнительные API для каждой встроенной категории
  reactiveApis: ['customRef'],
  computedApis: ['asyncComputed'],
  watchEffectApis: ['watchDebounced'],
  watchApis: ['watchThrottled'],
  lifecycleApis: ['onIdle'],

  // Порядок хуков внутри группы lifecycle (по умолчанию — порядок срабатывания)
  lifecycleOrder: ['onBeforeMount', 'onMounted' /* ... */],

  // Собственные категории, определяемые по AST
  customCategories: [
    { name: 'handlers', namePattern: '^on[A-Z]' },
  ],
}]
```

Неизвестные записи в `order`, `lifecycleOrder` или некорректные `customCategories` бросают ошибку конфигурации, а не игнорируются молча.

### Закрепление декларации

Комментарий `// eslint-script-setup:keep` закрепляет декларацию на месте — остальной блок сортируется в свободные слоты вокруг неё. Комментарий должен стоять вплотную: на строке прямо перед декларацией или в конце её строки. Пустая строка между комментарием и декларацией разрывает закрепление.

```ts
const emit = defineEmits(['update'])

// eslint-script-setup:keep
const count = ref(0)

const props = defineProps<{ label: string }>() // останется ниже закреплённой ноды
```

### Порядок lifecycle-хуков

Хуки внутри группы `lifecycle` сортируются по моменту срабатывания: `onBeforeMount` → `onMounted` → `onBeforeUpdate` → `onUpdated` → `onBeforeUnmount` → `onUnmounted` → остальные. Несколько вызовов одного хука сохраняют исходный порядок.

Опция `lifecycleOrder` переопределяет этот порядок; пустой массив отключает сортировку хуков. Сортировка хуков действует только когда `lifecycle` перечислен в `order` — при частичном `order` без него хуки не трогаются.

### Отдельные макросы в `order`

Вместо общей группы `macros` можно перечислить конкретные макросы, чтобы зафиксировать порядок между ними. Не перечисленные макросы идут по позиции группы `macros`. `withDefaults(defineProps(...))` считается `defineProps`.

```js
'@vueland/script-setup-order': ['warn', {
  order: ['import', 'type', 'defineOptions', 'defineProps', 'defineEmits', 'macros'],
}]
```

### Кастомные категории

Опция `customCategories` определяет собственные группы, которые матчатся по AST — по имени объявляемого идентификатора (`namePattern`) и/или по имени вызова в инициализаторе (`calleePattern`). Кастомный матчинг выполняется до встроенной классификации, и каждая кастомная категория должна быть перечислена в `order`:

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
    'import', 'type', 'macros', 'class', 'composable', 'inject',
    'reactive', 'variable', 'computed', 'function', 'watchEffect',
    'watch', 'provide', 'lifecycle', 'defineExpose'
  ],
}]
```

> **Совет для существующих проектов:** начните с уровня `warn` и минимального подмножества `order`. Постепенно расширяйте список и переключайтесь на `error` по мере выравнивания кодовой базы.

---

## `script-attrs-order`

Фиксирует порядок атрибутов на теге `<script>`. Поддерживает автофикс.

```vue
<!-- ✗ неверно -->
<script lang="ts" setup>

<!-- ✓ верно -->
<script setup lang="ts">
<script setup lang="ts" generic="T">
```

### Опции

```js
'@vueland/script-attrs-order': ['warn', {
  // Порядок атрибутов (значение по умолчанию). Неперечисленные атрибуты
  // сохраняют свой относительный порядок после перечисленных.
  order: ['setup', 'lang', 'generic'],
}]
```

---

## `no-multi-declaration`

Запрещает несколько объявлений в одном операторе `const`/`let` внутри `<script setup>`.

```ts
// ✗ неверно
const a = ref(1),
  b = ref(2)

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
