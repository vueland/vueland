# CInput

`CInput` — базовый примитив для построения компонентов ввода. Управляет состоянием фокуса, валидацией, aria-атрибутами и интеграцией с [`CForm`](/ru/components/CForm). Сам по себе не рендерит `<input>` — вместо этого предоставляет данные через слот `field`, из которых потребитель строит собственное поле.

:::tip Когда использовать CInput напрямую?
Для большинства задач используйте [`CTextField`](/ru/components/CTextField). `CInput` нужен, когда требуется нестандартное поле: textarea с кастомным оформлением, PIN-input, числовой степпер и другие виджеты, которым нужна валидация и состояние фокуса.
:::

<script setup>
import CustomFieldExample from '../../examples/CInput/CustomFieldExample.vue'
import PresetStatesExample from '../../examples/CInput/PresetStatesExample.vue'
import PresetCompoundExample from '../../examples/CInput/PresetCompoundExample.vue'
</script>

## Пример: кастомное поле

<CustomFieldExample />

::: details Показать код
```vue
<template>
  <CInput
    v-model="pin"
    id="custom-pin"
    label="PIN-код"
    kind="input"
    :rules="pinRules"
    validate-on="blur"
  >
    <template #field="field">
      <div class="pin-wrap" :class="{ 'has-error': field.hasError }">
        <label :for="field.uid">PIN-код</label>
        <input
          v-bind="field.attrs"
          :id="field.uid"
          type="password"
          maxlength="4"
          inputmode="numeric"
          :value="pin"
          @input="(e: any) => pin = (e.target as HTMLInputElement).value"
          @focus="field.focus"
          @blur="field.blur"
        />
      </div>
    </template>
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-app-error-color)' : 'inherit' }">
        {{ errorMessage || '4-значный PIN' }}
      </span>
    </template>
  </CInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const pinRules = [
  (v: string) => ({ valid: /^\d{4}$/.test(v), message: 'Введите 4-значный PIN' }),
]
</script>
```
:::

---

## Система пресетов

Пресеты — основной способ стилизации компонентов на основе `CInput`. Вместо того чтобы писать условные CSS-классы в каждом шаблоне, вы один раз описываете **объект пресета** и ссылаетесь на него по имени. Компонент сам вычисляет нужные классы в зависимости от активного состояния.

Пресеты работают в связке с утилитарными классами — каждое значение в пресете это массив имён утилитарных классов. Это делает пресеты независимыми от конкретного CSS-движка: они работают с любым utility-first инструментом, который вы используете.

### Тип CInputPreset

```ts
type CInputZone = {
  root?: string[]     // классы на корневом элементе CInput
  label?: string[]    // классы на плавающем лейбле
  input?: string[]    // классы на нативном <input>
  details?: string[]  // классы на строке подсказки/ошибки
}

type CInputCompoundState = CInputZone & {
  focused?: CInputZone  // составное: основное состояние + фокус одновременно
  filled?: CInputZone   // составное: основное состояние + заполненность одновременно
}

type CInputPreset = CInputZone & {
  // состояния взаимодействия
  focused?: CInputZone
  filled?: CInputZone
  error?: CInputCompoundState
  disabled?: CInputCompoundState
  readonly?: CInputCompoundState

  // структурные модификаторы (всегда аддитивны)
  prepended?: CInputZone
  appended?: CInputZone
}
```

### Приоритет состояний

В каждый момент времени активно только **одно состояние взаимодействия**. Если одновременно истинны несколько условий, побеждает состояние с наибольшим приоритетом:

```
disabled  >  readonly  >  error  >  focused  >  filled
```

Например, если у поля есть ошибка и оно при этом в фокусе, побеждает `error` — если только не определено составное состояние `error.focused`, которое в этом случае применяется вместо него.

### Составные состояния (compound states)

Составные состояния позволяют задать уникальную стилизацию для комбинации двух условий. Они определяются **внутри** основного состояния и замещают его, когда дополнительное условие тоже истинно:

| Ключ | Когда активен |
|------|--------------|
| `error.focused` | есть ошибка **и** поле в фокусе |
| `error.filled` | есть ошибка **и** поле заполнено |
| `disabled.focused` | поле disabled **и** в фокусе |
| `disabled.filled` | поле disabled **и** заполнено |
| `readonly.focused` | поле readonly **и** в фокусе |
| `readonly.filled` | поле readonly **и** заполнено |

:::warning Нет фолбэка на базовый пресет
Когда активно любое состояние взаимодействия, базовые зоны (`root`, `label` и т.д. на верхнем уровне) **не применяются**. Если в зоне состояния отсутствует конкретный ключ (например, не задан `error.label`), этот ключ вернёт `[]`, а не базовое значение.

Это намеренное поведение — оно предотвращает «просачивание» цветов базового состояния при активном состоянии ошибки или другом.
:::

### Структурные модификаторы

`prepended` и `appended` — единственные **всегда аддитивные** модификаторы: они добавляются поверх любого активного состояния. Используйте их для сдвига лейбла или отступов при наличии иконки в слоте:

```ts
prepended: {
  label: ['pl-10'],  // сдвинуть лейбл вправо, чтобы не перекрывать иконку
  input: ['pl-10'],
}
```

### Регистрация пресетов

Пресеты регистрируются глобально в `createVuelandUI`:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

function makePreset(color: string): CInputPreset {
  return {
    root: [color],
    focused: {
      root: [color],
      label: [color],
    },
    filled: {
      label: [color],
    },
    error: {
      root: ['text-red'],
      label: ['text-red'],
      focused: {
        // исправляем ошибку — лейбл переключается на основной цвет
        root: [color],
        label: [color],
      },
      filled: {
        label: ['text-red'],
      },
    },
    disabled: {
      root: ['opacity-50'],
    },
    readonly: {
      root: ['text-grey'],
      label: ['text-grey'],
    },
  }
}

const vueland = createVuelandUI({
  presets: {
    input: {
      blue: makePreset('text-blue'),
      teal: makePreset('text-teal'),
    },
  },
})
```

Затем указывайте пресет по имени на любом компоненте на основе `CInput`:

```vue
<CTextField preset="input.blue" ... />
<CTextField preset="input.teal" ... />
```

### Автогенерация CFieldPreset

При регистрации `CInputPreset` компонент `CInput` автоматически выводит из него `CFieldPreset` и регистрирует его внутренне под именем `__field.<имя-пресета>`. Компонент `CField` (который отрисовывает рамку, лейбл и слоты) подхватывает его прозрачно — вам не нужно писать `CFieldPreset` вручную.

Производный `CFieldPreset` содержит только зоны `label` и `input` (зоны `root` и `details` принадлежат `CInput`, а не `CField`) и сохраняет все составные подсостояния.

### Все состояния наглядно

<PresetStatesExample />

Пример выше использует `preset="input.blue"` в шести состояниях. Обратите внимание:
- **Default** — применяются базовые классы
- **Focused** — `focused.label` и `focused.root` заменяют базовые
- **Filled** — `filled.label` заменяет базовые (лейбл поднимается, цвет сохраняется)
- **Error** — `error.root` и `error.label` заменяют всё
- **Disabled** — применяется зона `disabled`; взаимодействие заблокировано
- **Readonly** — применяется зона `readonly`; значение видно, но редактировать нельзя

### Составные состояния в действии

<PresetCompoundExample />

В левой колонке `error.focused` не определён — при фокусе на поле с ошибкой лейбл остаётся красным. В правой колонке `error.focused.label` задан с основным цветом, сигнализируя пользователю, что он активно исправляет ошибку.

::: details Показать определение пресета
```ts
// Без составных состояний
const noCompound: CInputPreset = {
  root: ['text-blue'],
  focused: { label: ['text-blue'], root: ['text-blue'] },
  filled:  { label: ['text-blue'] },
  error: {
    root:  ['text-red'],
    label: ['text-red'],
    // error.focused не задан — при error+focused остаётся красным
  },
}

// С составными состояниями
const withCompound: CInputPreset = {
  root: ['text-blue'],
  focused: { label: ['text-blue'], root: ['text-blue'] },
  filled:  { label: ['text-blue'] },
  error: {
    root:  ['text-red'],
    label: ['text-red'],
    focused: {
      // error + focused → лейбл переключается на основной цвет
      label: ['text-blue'],
      root:  ['text-blue'],
    },
    filled: {
      label: ['text-red'],  // error + filled → остаётся красным
    },
  },
}
```
:::

---

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `modelValue` | `any` | `undefined` | Значение (v-model) |
| `id` | `string` | auto | Базовый ID для генерации `uid`, `uid-label`, `uid-details` |
| `label` | `string` | — | Текст лейбла (передаётся в слот `field`) |
| `details` | `string` | — | Подсказка под полем |
| `noDetails` | `boolean` | `false` | Скрыть блок details |
| `clearable` | `boolean` | `false` | Передать `clearable` в слот `field` |
| `disabled` | `boolean` | `false` | Блокирует фокус, добавляет `aria-disabled` |
| `readonly` | `boolean` | `false` | Добавляет `aria-readonly`, блокирует ввод |
| `focused` | `boolean` | `false` | Начальное состояние фокуса |
| `kind` | `CInputKind` | — | Тип поля. Влияет на aria-атрибуты и генерацию uid |
| `rules` | `ValidateFn[]` | `[]` | Функции валидации |
| `validateOn` | `'input' \| 'blur'` | `'input'` | Момент запуска валидации |
| `preset` | `string` | — | Имя пресета (dot-путь в объекте `presets`, переданном в `createVuelandUI`) |

#### Тип CInputKind

```ts
type CInputKind = 'input' | 'area' | 'checkbox' | 'radio' | 'listbox'
```

| Значение | Поведение |
|----------|-----------|
| `'input'` | Стандартный текстовый ввод |
| `'area'` | Многострочный ввод |
| `'checkbox'` | Добавляет `aria-labelledby` автоматически |
| `'radio'` | Добавляет `aria-labelledby` автоматически |
| `'listbox'` | Добавляет `aria-haspopup`, `aria-controls`, `aria-expanded` |

### Слоты

| Слот | Пропсы | Описание |
|------|--------|----------|
| `field` | `CInputFieldSlotProps` | **Обязательный.** Рендерит само поле ввода |
| `details` | `CInputDetailsSlotProps` | Замена блока подсказки/ошибки |

#### Пропсы слота `field`

| Проп | Тип | Описание |
|------|-----|----------|
| `uid` | `string` | Сгенерированный ID для нативного `<input>` |
| `attrs` | `Record<string, unknown>` | Готовые aria-атрибуты и нативные attrs — передавать через `v-bind` |
| `focused` | `boolean` | Текущее состояние фокуса |
| `label` | `string \| undefined` | Значение prop `label` |
| `clearable` | `boolean \| undefined` | Значение prop `clearable` |
| `disabled` | `boolean \| undefined` | Значение prop `disabled` |
| `readonly` | `boolean \| undefined` | Значение prop `readonly` |
| `preset` | `string \| undefined` | Вычисленный пресет для поля |
| `hasError` | `boolean` | Есть ли активная ошибка |
| `errorMessage` | `string \| undefined` | Текущее сообщение об ошибке |
| `validating` | `boolean` | Идёт ли async-валидация |
| `focus` | `() => void` | Вызвать при фокусе нативного элемента |
| `blur` | `() => void` | Вызвать при потере фокуса нативного элемента |
| `reset` | `() => void` | Сбросить ошибку валидации |
| `validate` | `() => Promise<boolean>` | Запустить валидацию |

#### Пропсы слота `details`

| Проп | Тип | Описание |
|------|-----|----------|
| `uid` | `string` | ID поля |
| `errorMessage` | `string \| undefined` | Сообщение об ошибке |
| `hasError` | `boolean` | Есть ли ошибка |
| `validating` | `boolean` | Идёт ли async-валидация |
| `details` | `string \| undefined` | Значение prop `details` |

### События

| Событие | Аргументы | Описание |
|---------|-----------|----------|
| `focus` | `boolean` | Поле получило фокус |
| `blur` | — | Поле потеряло фокус |

### Expose

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `validate` | `() => Promise<boolean>` | Запустить валидацию вручную |
| `reset` | `() => void` | Сбросить ошибку |
| `focus` | `() => void` | Программно сфокусировать |
| `blur` | `() => void` | Программно убрать фокус |

---

## Интеграция с CForm

`CInput` автоматически регистрирует свой метод `validate` в ближайшем родительском `CForm`. При вызове `form.validate()` все зарегистрированные поля проверяются параллельно через `Promise.all`.

```vue
<template>
  <CForm>
    <template #default="{ validate }">
      <CInput v-model="pin" :rules="rules" kind="input">
        <template #field="field">
          <input
            :id="field.uid"
            v-bind="field.attrs"
            :value="pin"
            @focus="field.focus"
            @blur="field.blur"
          />
        </template>
      </CInput>
      <button @click="validate">Проверить</button>
    </template>
  </CForm>
</template>
```

---

## Автоматические aria-атрибуты

`CInput` формирует aria-атрибуты и передаёт их в `field.attrs`. Используйте `v-bind="field.attrs"` на нативном элементе.

| Атрибут | Условие |
|---------|---------|
| `aria-labelledby="{uid}-label"` | `label` задан, или `kind` = checkbox/radio |
| `aria-label` | Если `label` задан как единственная метка |
| `aria-describedby="{uid}-details"` | Есть details или ошибка |
| `aria-invalid="true"` | Есть ошибка валидации |
| `aria-errormessage="{uid}-details"` | Есть сообщение об ошибке |
| `aria-disabled="true"` | `disabled = true` |
| `aria-readonly="true"` | `readonly = true` |
| `aria-haspopup="listbox"` | `kind = 'listbox'` |
| `aria-controls="{uid}-menu"` | `kind = 'listbox'` |
| `aria-expanded` | `kind = 'listbox'` (обновляется при фокусе) |

---

## CSS-переменные

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

---

## CSS-классы состояний

| Класс | Условие |
|-------|---------|
| `c-input--default` | Нет ошибки, не disabled, не readonly |
| `c-input--focused` | В фокусе |
| `c-input--has-error` | Ошибка валидации |
| `c-input--disabled` | `disabled = true` |
| `c-input--readonly` | `readonly = true` |
| `c-input--clearable` | `clearable = true` |
| `c-input--validating` | Идёт async-валидация |
