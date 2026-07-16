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
  <c-text-field v-model="value" id="basic-email" label="Email" placeholder="Enter your email" />
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
  <c-text-field v-model="value" label="Default" />
  <c-text-field v-model="value" label="Disabled" disabled />
  <c-text-field v-model="readonly" label="Readonly" readonly />
  <c-text-field v-model="value" label="Clearable" clearable />
</template>
```

:::

## Валидация

Передайте массив функций-правил в prop `rules`. Каждое правило принимает текущее значение и возвращает объект `{ valid: boolean, message: string }`. Prop `validate-on` управляет моментом запуска: `'input'` (по умолчанию) или `'blur'`.

Если в `modelValue` хранится отображаемый текст, а проверять нужно другое значение, передайте его в prop `validation-value` — правила получат его вместо `modelValue`. Именно так `CSelect` валидирует выбранную модель, а не строку, показанную в поле.

<ValidationExample />

::: details Показать код

```vue
<template>
  <c-text-field
    v-model="email"
    label="Email"
    :rules="emailRules"
    validate-on="blur"
    details="We'll never share your email"
  />
  <c-text-field
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
  <c-text-field v-model="search" label="Search">
    <template #prepend>
      <c-icon name="mdi-magnify" />
    </template>
  </c-text-field>

  <!-- Append text -->
  <c-text-field v-model="amount" label="Amount" type="number">
    <template #append>
      <span style="opacity: .6; font-size: 13px">USD</span>
    </template>
  </c-text-field>

  <!-- Custom details slot -->
  <c-text-field v-model="nickname" label="Nickname" :rules="nicknameRules" validate-on="input">
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-sys-color-error)' : 'inherit' }">
        {{ errorMessage || `${nickname.length}/20 characters` }}
      </span>
    </template>
  </c-text-field>
</template>
```

:::

## Асинхронная валидация

Правила могут возвращать `Promise`. Пока идёт проверка, слот `details` получает `validating: true`.

<AsyncValidationExample />

::: details Показать код

```vue
<template>
  <c-text-field v-model="username" label="Username" :rules="usernameRules" validate-on="blur">
    <template #details="{ errorMessage, hasError, validating }">
      <span v-if="validating" style="color: var(--c-sys-color-primary)">
        Checking availability…
      </span>
      <span v-else-if="hasError" style="color: var(--c-sys-color-error)">
        {{ errorMessage }}
      </span>
      <span v-else style="opacity: .6">Must be unique</span>
    </template>
  </c-text-field>
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
  <c-text-field v-model="value" label="Email" preset="input.blue">
    <template #prepend><c-icon name="fas:envelope" :size="16" source="fa" /></template>
  </c-text-field>
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
        base: {
          field: {
            base: { label: ['text-blue'] },
            focused: { label: ['text-blue'], root: ['text-blue'] },
            filled: { label: ['text-blue'] },
            error: { label: ['text-red'] },
          },
        },
        error: { details: ['text-red'] },
      } satisfies CInputPreset,
    },
  },
})
```

### Структура CInputPreset

Пресет — это **набор снимков по состояниям**: `base` плюс опциональные оверрайды. Свои зоны у `CInput` — `root` и `details`, а пресет поля (`CFieldPreset`) вкладывается по значению:

```ts
type CInputZone = 'root' | 'details'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

type CInputSnapshot = Partial<Record<CInputZone, string[]>> & {
  field?: CFieldPreset
  menu?: CMenuPreset
  list?: CListPreset
}

type CInputPreset = Partial<Record<'base' | CInputState, CInputSnapshot>>
```

Компонент всегда в одном текущем состоянии — применяется снимок этого состояния, его зоны подменяют одноимённые зоны `base`, без стека и без приоритетов. Полная модель — в разделе [CInput → Система пресетов](/ru/components/CInput#система-пресетов).

Пресет распределяется автоматически: `CInput` применяет `root` и `details` и раздаёт набор в поддерево через provide/inject, а `CField` берёт вложенный `field`-пресет из `base`-снимка и резолвит свои состояния (`root` поля, `input`, `label`, `prepend`, `append`) самостоятельно.

---

## API

### Props

`CTextField` принимает props [`CInput`](/ru/components/CInput#props), включая `label`, `details`, `clearable`, `disabled`, `readonly`, `focused`, `dirty`, `rules`, `validateOn`, `validationValue` и `preset`.

`v-model` работает со значением `string | number | null | undefined`.

### Нативные атрибуты

`CTextField` **не** оборачивает атрибуты `<input>` в собственные пропсы. Благодаря `inheritAttrs` любой нестандартный атрибут пробрасывается как есть на внутренний `<input>` — поэтому используйте обычные HTML-атрибуты напрямую:

```vue
<c-text-field
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

| Метод        | Сигнатура                    | Описание                                                                  |
| ------------ | ---------------------------- | ------------------------------------------------------------------------- |
| `validate`   | `() => Promise<boolean>`     | Запустить валидацию вручную                                               |
| `reset`      | `() => void`                 | Сбросить состояние ошибки                                                 |
| `focus`      | `() => void`                 | Программно сфокусировать поле; ничего не делает при `disabled`/`readonly` |
| `blur`       | `() => void`                 | Программно убрать фокус                                                   |
| `isReadonly` | `() => boolean \| undefined` | Вернуть текущее значение prop `readonly`                                  |
| `isDisabled` | `() => boolean \| undefined` | Вернуть текущее значение prop `disabled`                                  |

```vue
<template>
  <c-text-field ref="fieldRef" v-model="value" label="Name" :rules="rules" />
  <c-btn @click="fieldRef?.validate()">Validate</c-btn>
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

| Переменная                      | По умолчанию                          | Описание                    |
| ------------------------------- | ------------------------------------- | --------------------------- |
| `--c-input-details-height`      | `var(--c-sys-control-height-sm)`      | Высота блока details        |
| `--c-input-transition-duration` | `var(--c-sys-motion-duration-medium)` | Длительность перехода цвета |
| `--c-input-primary-color`       | `var(--c-sys-color-primary)`          | Базовый цвет текста         |
| `--c-input-error-color`         | `var(--c-sys-color-error)`            | Цвет текста при ошибке      |
| `--c-input-disabled-color`      | `var(--c-sys-color-disabled)`         | Цвет текста при disabled    |
| `--c-input-readonly-color`      | `var(--c-sys-color-readonly)`         | Цвет текста при readonly    |

### CField (рамка и лейбл)

| Переменная                      | По умолчанию                            | Описание                    |
| ------------------------------- | --------------------------------------- | --------------------------- |
| `--c-field-min-height`          | `var(--c-sys-control-height-md)`        | Минимальная высота поля     |
| `--c-field-prepend-min-width`   | `var(--c-sys-control-height-md)`        | Мин. ширина зоны prepend    |
| `--c-field-append-min-width`    | `var(--c-sys-control-icon-size)`        | Мин. ширина зоны append     |
| `--c-field-padding-inline`      | `var(--c-sys-control-padding-inline)`   | Горизонтальный отступ поля  |
| `--c-field-border-radius`       | `var(--c-sys-shape-md)`                 | Скругление поля             |
| `--c-field-transition-duration` | `var(--c-sys-motion-duration-medium)`   | Длительность переходов поля |
| `--c-field-density-offset`      | `var(--c-sys-density-scale)`            | Добавка к высоте поля       |
| `--c-field-bg-color`            | `var(--c-sys-color-surface)`            | Фон поля                    |
| `--c-field-focused-bg-color`    | `var(--c-sys-color-surface-bright)`     | Фон поля в фокусе           |
| `--c-field-disabled-bg-color`   | `var(--c-sys-color-surface-dim)`        | Фон поля при disabled       |
| `--c-field-border-color`        | `var(--c-sys-color-outline)`            | Цвет рамки                  |
| `--c-field-border-width`        | `var(--c-sys-border-width-thin)`        | Толщина рамки               |
| `--c-field-input-text-color`    | `var(--c-sys-color-on-surface)`         | Цвет вводимого текста       |
| `--c-field-placeholder-color`   | `var(--c-sys-color-placeholder)`        | Цвет placeholder            |
| `--c-field-error-bg-color`      | `var(--c-sys-color-surface-bright)`     | Фон поля при ошибке         |
| `--c-field-error-border-color`  | `var(--c-sys-color-error)`              | Цвет рамки при ошибке       |
| `--c-field-readonly-bg-color`   | `var(--c-sys-color-readonly-container)` | Фон поля при readonly       |
| `--c-field-disabled-opacity`    | `var(--c-sys-state-disabled-opacity)`   | Прозрачность при disabled   |

### Пример переопределения

```vue
<c-text-field
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

| Класс                  | Условие                                             |
| ---------------------- | --------------------------------------------------- |
| `c-input--focused`     | Поле в фокусе                                       |
| `c-input--has-error`   | Ошибка валидации (и не `disabled`, и не `readonly`) |
| `c-input--disabled`    | `disabled = true`                                   |
| `c-input--readonly`    | `readonly = true`                                   |
| `c-input--clearable`   | `clearable = true`                                  |
| `c-field--focused`     | Рамка в фокусе                                      |
| `c-field--filled`      | Поле имеет значение (лейбл поднят)                  |
| `c-field--error`       | Есть ошибка валидации                               |
| `c-field--disabled`    | Рамка disabled                                      |
| `c-field--readonly`    | Рамка readonly                                      |
| `c-field--has-prepend` | Есть слот prepend                                   |
