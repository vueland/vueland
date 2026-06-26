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
  <CTextField v-model="value" id="basic-email" label="Email" placeholder="Enter your email" />
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
  <CTextField v-model="nickname" label="Nickname" :rules="nicknameRules" validate-on="input">
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
  <CTextField v-model="username" label="Username" :rules="usernameRules" validate-on="blur">
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
    await new Promise((resolve) => setTimeout(resolve, 800))
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
        base: { label: ['text-blue'] },
        focused: { label: ['text-blue'], field: ['text-blue'] },
        filled: { label: ['text-blue'] },
        error: { label: ['text-red'], details: ['text-red'] },
      } satisfies CInputPreset,
    },
  },
})
```

### Структура CInputPreset

Пресет — это **набор плоских пресетов по состояниям**: `base` плюс опциональные оверрайды по состояниям. Без составных состояний и вложенности:

```ts
type CInputZone = 'root' | 'field' | 'input' | 'label' | 'details' | 'prepend' | 'append'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

type ZonePreset = Partial<Record<CInputZone, string[]>>
type CInputPreset = Partial<Record<'base' | CInputState, ZonePreset>>
```

Компонент всегда в одном текущем состоянии — применяется пресет этого состояния, его зоны подменяют `base` пер-зонно, без стека и без приоритетов. Полная модель — в разделе [CInput → Система пресетов](/ru/components/CInput#система-пресетов).

Пресет распределяется автоматически: `CInput` применяет `root` и `details` и раздаёт набор в `CField` через provide/inject, а тот применяет `field`, `input`, `label`, `prepend`, `append`.

---

## API

### Props

`CTextField` принимает props [`CInput`](/ru/components/CInput#props), включая `label`, `details`, `clearable`, `disabled`, `readonly`, `focused`, `dirty`, `rules`, `validateOn` и `preset`.

`v-model` работает со значением `string | number | null | undefined`.

### Нативные атрибуты

`CTextField` **не** оборачивает атрибуты `<input>` в собственные пропсы. Благодаря `inheritAttrs` любой нестандартный атрибут пробрасывается как есть на внутренний `<input>` — поэтому используйте обычные HTML-атрибуты напрямую:

```vue
<CTextField
  type="number"
  placeholder="0"
  :min="0"
  :max="100"
  :step="5"
  inputmode="numeric"
  maxlength="10"
  autocomplete="off"
  name="amount"
  required
/>
```

Так же пробрасываются `pattern`, `minlength`, `tabindex`, `enterkeyhint` и любые `data-*` / `aria-*` атрибуты. Эти значения **не** документируются как пропсы — это стандартный контракт нативного `<input>`.

### Slots

| Слот      | Пропсы                   | Описание                                     |
| --------- | ------------------------ | -------------------------------------------- |
| `prepend` | —                        | Контент слева внутри поля (иконка, текст)    |
| `append`  | —                        | Контент справа внутри поля (иконка, текст)   |
| `menu`    | `{ id: string }`         | Контент выпадающего меню, связанного с полем |
| `details` | `CInputDetailsSlotProps` | Замена блока подсказки/ошибки                |

#### Пропсы слота `menu`

| Проп | Тип      | Описание                                     |
| ---- | -------- | -------------------------------------------- |
| `id` | `string` | ID для меню, связанного с полем (`uid-menu`) |

#### Пропсы слота `details`

| Проп           | Тип                   | Описание                                       |
| -------------- | --------------------- | ---------------------------------------------- |
| `errorMessage` | `string \| undefined` | Текущее сообщение об ошибке                    |
| `hasError`     | `boolean`             | Есть ли активная ошибка                        |
| `validating`   | `boolean`             | Идёт ли async-валидация прямо сейчас           |
| `uid`          | `string`              | ID поля (совпадает с `id` нативного `<input>`) |
| `details`      | `string \| undefined` | Значение prop `details`                        |

### События

| Событие             | Аргументы                       | Описание                     |
| ------------------- | ------------------------------- | ---------------------------- |
| `update:modelValue` | `string \| number \| undefined` | Изменение значения (v-model) |
| `focus`             | —                               | Поле получило фокус          |
| `blur`              | —                               | Поле потеряло фокус          |

### Expose

Методы, доступные через template ref:

| Метод      | Сигнатура                | Описание                      |
| ---------- | ------------------------ | ----------------------------- |
| `validate` | `() => Promise<boolean>` | Запустить валидацию вручную   |
| `reset`    | `() => void`             | Сбросить состояние ошибки     |
| `focus`    | `() => void`             | Программно сфокусировать поле |
| `blur`     | `() => void`             | Программно убрать фокус       |

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

| Переменная                      | По умолчанию                  | Описание                        |
| ------------------------------- | ----------------------------- | ------------------------------- |
| `--c-input-details-height`      | `24px`                        | Высота блока details            |
| `--c-input-transition-duration` | `0.2s`                        | Длительность перехода цвета     |
| `--c-input-background-color`    | `var(--c-app-surface-color)`  | Фон компонента                  |
| `--c-input-primary-color`       | `var(--c-app-primary-color)`  | Цвет текста в состоянии default |
| `--c-input-error-color`         | `var(--c-app-error-color)`    | Цвет текста при ошибке          |
| `--c-input-disabled-color`      | `var(--c-app-disabled-color)` | Цвет текста при disabled        |
| `--c-input-readonly-color`      | `var(--c-app-readonly-color)` | Цвет текста при readonly        |

### CField (рамка и лейбл)

| Переменная                      | По умолчанию                     | Описание                      |
| ------------------------------- | -------------------------------- | ----------------------------- |
| `--c-field-min-height`          | `40px`                           | Минимальная высота поля       |
| `--c-field-prepend-min-width`   | `40px`                           | Мин. ширина зоны prepend      |
| `--c-field-append-min-width`    | `24px`                           | Мин. ширина зоны append       |
| `--c-field-border-radius`       | `var(--c-app-border-radius)`     | Скругление поля               |
| `--c-field-transition-duration` | `0.2s`                           | Длительность переходов поля   |
| `--c-field-bg-color`            | `var(--c-app-surface-color)`     | Фон поля                      |
| `--c-field-color`               | `var(--c-input-primary-color)`   | Цвет рамки и лейбла в default |
| `--c-field-border-color`        | `var(--c-app-border-color)`      | Цвет рамки                    |
| `--c-field-input-color`         | `var(--c-app-text-color)`        | Цвет вводимого текста         |
| `--c-field-readonly-bg-color`   | `var(--c-app-readonly-bg-color)` | Фон поля при readonly         |
| `--c-field-disabled-opacity`    | `var(--c-app-disabled-opacity)`  | Прозрачность при disabled     |

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

| Класс                  | Условие                              |
| ---------------------- | ------------------------------------ |
| `c-input--default`     | Нет ошибки, не disabled, не readonly |
| `c-input--focused`     | Поле в фокусе                        |
| `c-input--has-error`   | Есть ошибка валидации                |
| `c-input--disabled`    | `disabled = true`                    |
| `c-input--readonly`    | `readonly = true`                    |
| `c-input--clearable`   | `clearable = true`                   |
| `c-input--validating`  | Идёт async-валидация                 |
| `c-field--focused`     | Рамка в фокусе                       |
| `c-field--filled`      | Поле имеет значение (лейбл поднят)   |
| `c-field--disabled`    | Рамка disabled                       |
| `c-field--readonly`    | Рамка readonly (пунктирная рамка)    |
| `c-field--has-prepend` | Есть слот prepend                    |
