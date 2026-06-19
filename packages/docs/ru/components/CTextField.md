# CTextField

`CTextField` — основной компонент текстового поля ввода. Построен поверх [`CInput`](/ru/components/CInput) и предоставляет полностью стилизованный, доступный и валидируемый `<input>` с плавающим лейблом, иконками, подсказками и поддержкой тем.

<script setup>
import BasicExample from '../../examples/CTextField/BasicExample.vue'
import StatesExample from '../../examples/CTextField/StatesExample.vue'
import ValidationExample from '../../examples/CTextField/ValidationExample.vue'
import SlotsExample from '../../examples/CTextField/SlotsExample.vue'
import AsyncValidationExample from '../../examples/CTextField/AsyncValidationExample.vue'
import PresetsExample from '../../examples/CTextField/PresetsExample.vue'
</script>

## Использование

<BasicExample />

::: details Показать код
```vue
<template>
  <CTextField
    v-model="value"
    id="basic-email"
    label="Email"
    placeholder="Enter your email"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>
```
:::

## Состояния

`CTextField` поддерживает стандартные состояния: обычное, отключённое (`disabled`), только для чтения (`readonly`) и с очисткой (`clearable`).

<StatesExample />

::: details Показать код
```vue
<template>
  <CTextField v-model="value" label="Default" />
  <CTextField v-model="value" label="Disabled" disabled />
  <CTextField v-model="readonly" label="Readonly" readonly />
  <CTextField v-model="value" label="Clearable" clearable />
</template>
```
:::

## Валидация

Передайте массив функций-правил в prop `rules`. Каждое правило принимает текущее значение и возвращает объект `{ valid: boolean, message: string }`. Prop `validate-on` управляет моментом запуска: `'input'` (по умолчанию) или `'blur'`.

<ValidationExample />

::: details Показать код
```vue
<template>
  <CTextField
    v-model="email"
    label="Email"
    :rules="emailRules"
    validate-on="blur"
    details="We'll never share your email"
  />
  <CTextField
    v-model="password"
    label="Password"
    type="password"
    :rules="passwordRules"
    validate-on="blur"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]

const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Password is required' }),
  (v: string) => ({ valid: v.length >= 8, message: 'Minimum 8 characters' }),
]
</script>
```
:::

## Слоты prepend, append и details

Слоты `prepend` и `append` позволяют разместить иконку или текст внутри поля. Слот `details` полностью заменяет блок подсказки/ошибки.

<SlotsExample />

::: details Показать код
```vue
<template>
  <!-- Prepend icon -->
  <CTextField v-model="search" label="Search">
    <template #prepend>
      <CIcon name="mdi-magnify" />
    </template>
  </CTextField>

  <!-- Append text -->
  <CTextField v-model="amount" label="Amount" type="number">
    <template #append>
      <span style="opacity: .6; font-size: 13px">USD</span>
    </template>
  </CTextField>

  <!-- Custom details slot -->
  <CTextField
    v-model="nickname"
    label="Nickname"
    :rules="nicknameRules"
    validate-on="input"
  >
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
        {{ errorMessage || `${nickname.length}/20 characters` }}
      </span>
    </template>
  </CTextField>
</template>
```
:::

## Асинхронная валидация

Правила могут возвращать `Promise`. Пока идёт проверка, слот `details` получает `validating: true`.

<AsyncValidationExample />

::: details Показать код
```vue
<template>
  <CTextField
    v-model="username"
    label="Username"
    :rules="usernameRules"
    validate-on="blur"
  >
    <template #details="{ errorMessage, hasError, validating }">
      <span v-if="validating" style="color: var(--c-app-primary-color)">
        Checking availability…
      </span>
      <span v-else-if="hasError" style="color: var(--c-app-error-color)">
        {{ errorMessage }}
      </span>
      <span v-else style="opacity: .6">Must be unique</span>
    </template>
  </CTextField>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const username = ref('')
const taken = ['admin', 'user', 'root']

const usernameRules = [
  (v: string) => ({ valid: v.length >= 3, message: 'Minimum 3 characters' }),
  async (v: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { valid: !taken.includes(v.toLowerCase()), message: `"${v}" is already taken` }
  },
]
</script>
```
:::

## Пресеты

Пресеты позволяют задать внешний вид поля (цвет лейбла, рамки) централизованно — один раз при инициализации плагина, а потом использовать по имени через prop `preset`.

<PresetsExample />

::: details Показать код
```vue
<template>
  <CTextField v-model="value" label="Email" preset="input.blue">
    <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
  </CTextField>
</template>
```
:::

Регистрация пресетов при инициализации плагина:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

createVuelandUI({
  presets: {
    input: {
      blue: {
        root:    ['text-blue'],
        focused: { label: ['text-blue'] },
        filled:  { label: ['text-blue'] },
        error:   { root: ['text-red'] },
      } satisfies CInputPreset,
    },
  },
})
```

### Структура CInputPreset

```ts
type Zone = { root?: string[]; label?: string[]; input?: string[]; details?: string[] }

// error / disabled / readonly поддерживают вложенные составные состояния
type CompoundState = Zone & {
  focused?: Zone   // активно когда основное состояние + focused одновременно
  filled?:  Zone   // активно когда основное состояние + filled одновременно
}

type CInputPreset = Zone & {
  focused?:   Zone
  filled?:    Zone
  error?:     CompoundState
  disabled?:  CompoundState
  readonly?:  CompoundState
  prepended?: Zone
  appended?:  Zone
}
```

Пресет автоматически разбивается под капотом: `root` и `details` применяются на уровне `CInput`, а `label` и `input` — на уровне `CField`.

**Составные состояния** позволяют стилизовать комбинации двух одновременно активных состояний. Например, чтобы изменить цвет лейбла когда поле одновременно в ошибке _и_ в фокусе:

```ts
const myPreset: CInputPreset = {
  label: ['text-blue'],
  error: {
    label: ['text-red'],
    focused: {
      label: ['text-red', 'font-bold'],  // error + focused одновременно
    },
  },
}
```

---

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `modelValue` | `string \| number \| null` | `undefined` | Значение поля (v-model) |
| `id` | `string` | auto | ID для `<input>`. Если не передан, генерируется с префиксом `input-` |
| `label` | `string` | — | Плавающий лейбл поля |
| `placeholder` | `string` | — | Placeholder нативного `<input>` (attr) |
| `details` | `string` | — | Подсказка под полем |
| `noDetails` | `boolean` | `false` | Скрыть блок details полностью |
| `clearable` | `boolean` | `false` | Кнопка очистки при наличии значения и фокуса |
| `disabled` | `boolean` | `false` | Отключить поле. Блокирует фокус и ввод |
| `readonly` | `boolean` | `false` | Только для чтения. Фокус разрешён, редактирование — нет |
| `focused` | `boolean` | `false` | Начальное состояние фокуса |
| `rules` | `ValidateFn[]` | `[]` | Массив функций валидации |
| `validateOn` | `'input' \| 'blur'` | `'input'` | Момент запуска автоматической валидации |
| `preset` | `string` | — | Имя пресета из конфигурации Vueland UI |
| `type` | `string` | `'text'` | Тип `<input>` — передаётся как нативный attr |
| `name` | `string` | — | `name` нативного `<input>` |
| `autocomplete` | `string` | — | `autocomplete` нативного `<input>` |
| `required` | `boolean` | — | `required` нативного `<input>` |
| `inputmode` | `string` | — | `inputmode` нативного `<input>` |
| `pattern` | `string` | — | `pattern` нативного `<input>` |
| `maxlength` | `number` | — | `maxlength` нативного `<input>` |
| `minlength` | `number` | — | `minlength` нативного `<input>` |
| `min` | `number` | — | `min` для `type="number"` |
| `max` | `number` | — | `max` для `type="number"` |
| `step` | `number` | — | `step` для `type="number"` |
| `tabindex` | `number` | — | `tabindex` нативного `<input>` |
| `enterkeyhint` | `string` | — | Подпись кнопки Enter на мобильной клавиатуре |
| `aria-label` | `string` | — | Дополнительная aria-метка (attr) |

### Slots

| Слот | Пропсы | Описание |
|------|--------|----------|
| `prepend` | — | Контент слева внутри поля (иконка, текст) |
| `append` | — | Контент справа внутри поля (иконка, текст) |
| `details` | `CInputDetailsSlotProps` | Замена блока подсказки/ошибки |

#### Пропсы слота `details`

| Проп | Тип | Описание |
|------|-----|----------|
| `errorMessage` | `string \| undefined` | Текущее сообщение об ошибке |
| `hasError` | `boolean` | Есть ли активная ошибка |
| `validating` | `boolean` | Идёт ли async-валидация прямо сейчас |
| `uid` | `string` | ID поля (совпадает с `id` нативного `<input>`) |
| `details` | `string \| undefined` | Значение prop `details` |

### События

| Событие | Аргументы | Описание |
|---------|-----------|----------|
| `update:modelValue` | `string \| number \| undefined` | Изменение значения (v-model) |
| `focus` | — | Поле получило фокус |
| `blur` | — | Поле потеряло фокус |

### Expose

Методы, доступные через template ref:

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `validate` | `() => Promise<boolean>` | Запустить валидацию вручную |
| `reset` | `() => void` | Сбросить состояние ошибки |
| `focus` | `() => void` | Программно сфокусировать поле |
| `blur` | `() => void` | Программно убрать фокус |

```vue
<template>
  <CTextField ref="fieldRef" v-model="value" label="Name" :rules="rules" />
  <CBtn @click="fieldRef?.validate()">Validate</CBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const fieldRef = ref()
const value = ref('')
const rules = [(v: string) => ({ valid: !!v, message: 'Required' })]
</script>
```

### Тип ValidateFn

```ts
type ValidateResult = { valid: boolean; message: string }
type ValidateFn = (value: any) => ValidateResult | Promise<ValidateResult>
```

---

## CSS-переменные

### CInput (корневой элемент)

| Переменная | По умолчанию | Описание |
|-----------|-------------|----------|
| `--c-input-background-color` | `var(--c-app-surface-color)` | Фон компонента |
| `--c-input-primary-color` | `var(--c-app-primary-color)` | Цвет текста в состоянии default |
| `--c-input-error-color` | `var(--c-app-error-color)` | Цвет текста при ошибке |
| `--c-input-disabled-color` | `var(--c-app-disabled-color)` | Цвет текста при disabled |
| `--c-input-readonly-color` | `var(--c-app-primary-color)` | Цвет текста при readonly |
| `--c-input-readonly-bg-color` | `grey lighten-4` | Фон поля при readonly |
| `--c-input-field-border-radius` | `var(--c-app-border-radius)` | Скругление поля |
| `--c-input-details-height` | `24px` | Высота блока details |

### CField (рамка и лейбл)

| Переменная | По умолчанию | Описание |
|-----------|-------------|----------|
| `--c-field-border-color` | `var(--c-app-border-color, #e5e5e5)` | Цвет рамки |
| `--c-field-disabled-opacity` | `0.5` | Прозрачность при disabled |

### Пример переопределения

```vue
<CTextField
  v-model="value"
  label="Custom styled"
  style="
    --c-input-primary-color: #7c3aed;
    --c-field-border-color: #ddd6fe;
  "
/>
```

---

## CSS-классы состояний

| Класс | Условие |
|-------|---------|
| `c-input--default` | Нет ошибки, не disabled, не readonly |
| `c-input--focused` | Поле в фокусе |
| `c-input--has-error` | Есть ошибка валидации |
| `c-input--disabled` | `disabled = true` |
| `c-input--readonly` | `readonly = true` |
| `c-input--clearable` | `clearable = true` |
| `c-input--validating` | Идёт async-валидация |
| `c-field--focused` | Рамка в фокусе |
| `c-field--filled` | Поле имеет значение (лейбл поднят) |
| `c-field--disabled` | Рамка disabled |
| `c-field--readonly` | Рамка readonly (пунктирная рамка) |
| `c-field--has-prepend` | Есть слот prepend |
