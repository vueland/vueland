# CInput

`CInput` — базовый примитив для построения компонентов ввода. Управляет состоянием фокуса, валидацией, aria-атрибутами и интеграцией с [`CForm`](/ru/components/CForm). Сам по себе не рендерит `<input>` — вместо этого предоставляет данные через слот `field`, из которых потребитель строит собственное поле.

:::tip Когда использовать CInput напрямую?
Для большинства задач используйте [`CTextField`](/ru/components/CTextField). `CInput` нужен, когда требуется нестандартное поле: textarea с кастомным оформлением, PIN-input, числовой степпер и другие виджеты, которым нужна валидация и состояние фокуса.
:::

<script setup>
import CustomFieldExample from '../../examples/CInput/CustomFieldExample.vue'
import PresetStatesExample from '../../examples/CInput/PresetStatesExample.vue'
</script>

## Пример: кастомное поле

<CustomFieldExample />

::: details Показать код

```vue
<template>
  <CInput v-model="pin" id="custom-pin" label="PIN-код" :rules="pinRules" validate-on="blur">
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
          @input="(e: any) => (pin = (e.target as HTMLInputElement).value)"
          @focus="field.focus"
          @blur="field.blur"
        />
      </div>
    </template>
    <template #details="{ errorMessage, hasError }">
      <span :style="{ color: hasError ? 'var(--c-sys-color-error)' : 'inherit' }">
        {{ errorMessage || '4-значный PIN' }}
      </span>
    </template>
  </CInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pin = ref('')
const pinRules = [(v: string) => ({ valid: /^\d{4}$/.test(v), message: 'Введите 4-значный PIN' })]
</script>
```

:::

---

## Система пресетов

Пресеты — основной способ стилизации компонентов на основе `CInput`. Вместо условных CSS-классов в каждом шаблоне вы один раз описываете **пресет** и ссылаетесь на него по имени. Компонент сам применяет нужные классы под текущее состояние.

Каждое значение — массив имён утилитарных классов, поэтому пресеты работают с любым utility-first движком, который вы используете.

### Зоны

Плоский пресет (`ZonePreset`) — это карта **зон** в списки классов. Зоны маппятся 1:1 на отрисованный DOM:

| Зона      | Элемент                          |
| --------- | -------------------------------- |
| `root`    | обёртка `.c-input`               |
| `field`   | коробка `.c-field` (рамка / фон) |
| `input`   | нативный `<input>`               |
| `label`   | плавающий лейбл                  |
| `details` | строка подсказки / ошибки        |
| `prepend` | обёртка prepend-слота            |
| `append`  | обёртка append-слота             |

### Тип CInputPreset

Пресет — это **набор плоских пресетов по состояниям**. `base` — спокойный вид, каждое состояние — отдельный полный плоский пресет:

```ts
type CInputZone = 'root' | 'field' | 'input' | 'label' | 'details' | 'prepend' | 'append'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

type ZonePreset = Partial<Record<CInputZone, string[]>>

// base + опциональные плоские пресеты по состояниям — всё опционально
type CInputPreset = Partial<Record<'base' | CInputState, ZonePreset>>
```

**Составных состояний нет** и нет вложенности — состояние это просто ещё один плоский пресет.

### Одно состояние за раз

Компонент всегда находится в одном текущем состоянии, и применяется пресет именно этого состояния — ничего не складывается и нет никаких приоритетов. Вы просто описываете плоский пресет на каждое состояние, активное применяется (или `base`, когда поле в покое). Зоны активного состояния подменяют **одноимённые** зоны `base`; зона, которую состояние не описывает, берётся из `base`.

:::tip Почему одно состояние, а не стек?
Утилитарные классы — это `!important` с одинаковой специфичностью, поэтому при стэке конфликтующих классов (например двух `bg-*`) побеждает порядок в стайлшите, а не намерение. Ровно один комплект классов на зону делает результат предсказуемым.
:::

### Адресация состояния напрямую

Каждое состояние — самостоятельный плоский пресет, адресуемый как `name.state`. `input.blue` — это весь набор; `input.blue.focused` — только плоский пресет состояния focused.

### Регистрация пресетов

Пресеты регистрируются глобально в `createVuelandUI`:

```ts
import { createVuelandUI } from '@vueland/ui'
import type { CInputPreset } from '@vueland/ui/types'

function makePreset(color: string): CInputPreset {
  return {
    base: { label: [color] },
    focused: { label: [color], field: [color] },
    filled: { label: [color] },
    error: { label: ['text-red'], field: ['text-red'], details: ['text-red'] },
    readonly: { label: ['text-grey'] },
    // `disabled` притеняется компонентом; зона нужна только для оверрайда
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

### Распределение CInput → CField

Вы пишете **один** пресет. `CInput` его резолвит, применяет свои зоны (`root`, `details`) и раздаёт набор в поддерево поля через `provide`/`inject`. `CField` его инжектит и применяет `field`, `input`, `label`, `prepend`, `append`. Отдельный пресет для поля писать не нужно, и ничего не мутируется глобально.

### Все состояния наглядно

<PresetStatesExample />

Пример выше использует `preset="input.blue"` в шести состояниях:

- **Default** — зоны `base`
- **Focused** — зоны `focused` подменяют одноимённые зоны `base`
- **Filled** — `filled` подменяет `base` (лейбл поднимается, цвет сохраняется)
- **Error** — `error` подменяет `base` (красный)
- **Disabled** — взаимодействие заблокировано; компонент притеняет поле
- **Readonly** — значение видно, но редактировать нельзя

---

## API

### Props

| Prop              | Тип                             | По умолчанию | Описание                                                                                                           |
| ----------------- | ------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `modelValue`      | `T \| T[] \| undefined \| null` | `undefined`  | Значение (v-model)                                                                                                 |
| `id`              | `string`                        | auto         | Базовый ID для генерации `uid`, `uid-label`, `uid-details`                                                         |
| `label`           | `string`                        | —            | Текст лейбла (передаётся в слот `field`)                                                                           |
| `details`         | `string`                        | —            | Подсказка под полем                                                                                                |
| `noDetails`       | `boolean`                       | `false`      | Скрыть блок details                                                                                                |
| `clearable`       | `boolean`                       | `false`      | Передать `clearable` в слот `field`                                                                                |
| `disabled`        | `boolean`                       | `false`      | Блокирует фокус, добавляет `aria-disabled`                                                                         |
| `readonly`        | `boolean`                       | `false`      | Добавляет `aria-readonly`, блокирует ввод                                                                          |
| `focused`         | `boolean`                       | `false`      | Начальное состояние фокуса                                                                                         |
| `dirty`           | `boolean`                       | `false`      | Помечает поле как заполненное для визуального состояния                                                            |
| `role`            | `CInputRole`                    | —            | Семантическая роль. Управляет aria-разметкой и префиксом `uid`                                                     |
| `rules`           | `ValidateFn[]`                  | `[]`         | Функции валидации                                                                                                  |
| `validateOn`      | `'input' \| 'blur'`             | `'input'`    | Момент запуска валидации                                                                                           |
| `validationValue` | `any`                           | —            | Значение, которое передаётся в `rules` вместо `modelValue` — для полей, где `modelValue` хранит отображаемый текст |
| `preset`          | `string`                        | —            | Имя пресета (dot-путь в объекте `presets`, переданном в `createVuelandUI`)                                         |

#### Тип CInputRole

```ts
type CInputRole = 'combobox' | 'checkbox' | 'radio' | 'listbox'
```

| Значение     | Поведение                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `'combobox'` | Добавляет `role="combobox"`, `aria-haspopup="listbox"`, `aria-controls`, `aria-expanded` — для активаторов select / autocomplete |
| `'checkbox'` | Привязывает `aria-labelledby` к лейблу                                                                                           |
| `'radio'`    | Привязывает `aria-labelledby` к лейблу                                                                                           |
| `'listbox'`  | Для контролов на основе listbox (aria + префикс `uid`)                                                                           |

### Слоты

| Слот      | Пропсы                   | Описание                                   |
| --------- | ------------------------ | ------------------------------------------ |
| `field`   | `CInputFieldSlotProps`   | **Обязательный.** Рендерит само поле ввода |
| `details` | `CInputDetailsSlotProps` | Замена блока подсказки/ошибки              |

#### Пропсы слота `field`

| Проп           | Тип                         | Описание                                                           |
| -------------- | --------------------------- | ------------------------------------------------------------------ |
| `uid`          | `string`                    | Сгенерированный ID для нативного `<input>`                         |
| `attrs`        | `Record<string, unknown>`   | Готовые aria-атрибуты и нативные attrs — передавать через `v-bind` |
| `focused`      | `boolean`                   | Текущее состояние фокуса                                           |
| `label`        | `string \| undefined`       | Значение prop `label`                                              |
| `clearable`    | `boolean \| undefined`      | Значение prop `clearable`                                          |
| `disabled`     | `boolean \| undefined`      | Значение prop `disabled`                                           |
| `readonly`     | `boolean \| undefined`      | Значение prop `readonly`                                           |
| `dirty`        | `boolean \| undefined`      | Значение prop `dirty`                                              |
| `preset`       | `CInputPreset \| undefined` | Резолвнутый набор пресета (также провайдится в поддерево поля)     |
| `hasError`     | `boolean`                   | Есть ли активная ошибка                                            |
| `errorMessage` | `string \| undefined`       | Текущее сообщение об ошибке                                        |
| `validating`   | `boolean`                   | Идёт ли async-валидация                                            |
| `focus`        | `() => void`                | Вызвать при фокусе нативного элемента                              |
| `blur`         | `() => void`                | Вызвать при потере фокуса нативного элемента                       |
| `reset`        | `() => void`                | Сбросить ошибку валидации                                          |
| `validate`     | `() => Promise<boolean>`    | Запустить валидацию                                                |

#### Пропсы слота `details`

| Проп           | Тип                   | Описание                |
| -------------- | --------------------- | ----------------------- |
| `uid`          | `string`              | ID поля                 |
| `errorMessage` | `string \| undefined` | Сообщение об ошибке     |
| `hasError`     | `boolean`             | Есть ли ошибка          |
| `validating`   | `boolean`             | Идёт ли async-валидация |
| `details`      | `string \| undefined` | Значение prop `details` |

### События

| Событие | Аргументы | Описание            |
| ------- | --------- | ------------------- |
| `focus` | `boolean` | Поле получило фокус |
| `blur`  | —         | Поле потеряло фокус |

### Expose

| Метод      | Сигнатура                | Описание                    |
| ---------- | ------------------------ | --------------------------- |
| `validate` | `() => Promise<boolean>` | Запустить валидацию вручную |
| `reset`    | `() => void`             | Сбросить ошибку             |
| `focus`    | `() => void`             | Программно сфокусировать    |
| `blur`     | `() => void`             | Программно убрать фокус     |

---

## Интеграция с CForm

`CInput` автоматически регистрирует свой метод `validate` в ближайшем родительском `CForm`. При вызове `form.validate()` все зарегистрированные поля проверяются параллельно через `Promise.all`.

```vue
<template>
  <CForm>
    <template #default="{ validate }">
      <CInput v-model="pin" :rules="rules">
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

| Атрибут                             | Условие                                     |
| ----------------------------------- | ------------------------------------------- |
| `aria-labelledby="{uid}-label"`     | `label` задан, или `kind` = checkbox/radio  |
| `aria-label`                        | Если `label` задан как единственная метка   |
| `aria-describedby="{uid}-details"`  | Есть details или ошибка                     |
| `aria-invalid="true"`               | Есть ошибка валидации                       |
| `aria-errormessage="{uid}-details"` | Есть сообщение об ошибке                    |
| `aria-disabled="true"`              | `disabled = true`                           |
| `aria-readonly="true"`              | `readonly = true`                           |
| `aria-haspopup="listbox"`           | `kind = 'listbox'`                          |
| `aria-controls="{uid}-menu"`        | `kind = 'listbox'`                          |
| `aria-expanded`                     | `kind = 'listbox'` (обновляется при фокусе) |

---

## CSS-переменные

| Переменная                      | По умолчанию                          | Описание                        |
| ------------------------------- | ------------------------------------- | ------------------------------- |
| `--c-input-details-height`      | `var(--c-sys-control-height-sm)`      | Высота блока details            |
| `--c-input-transition-duration` | `var(--c-sys-motion-duration-medium)` | Длительность перехода цвета     |
| `--c-input-primary-color`       | `var(--c-sys-color-primary)`          | Цвет текста в состоянии default |
| `--c-input-error-color`         | `var(--c-sys-color-error)`            | Цвет текста при ошибке          |
| `--c-input-disabled-color`      | `var(--c-sys-color-disabled)`         | Цвет текста при disabled        |
| `--c-input-readonly-color`      | `var(--c-sys-color-readonly)`         | Цвет текста при readonly        |

> Фон поля в состояниях `focused`/`readonly`/`disabled`/`error` отрисовывает компонент `CField` (`--c-field-focused-bg-color`, `--c-field-readonly-bg-color`, `--c-field-disabled-bg-color`, `--c-field-error-bg-color`), а не `CInput`.

---

## CSS-классы состояний

| Класс                 | Условие                              |
| --------------------- | ------------------------------------ |
| `c-input--default`    | Нет ошибки, не disabled, не readonly |
| `c-input--focused`    | В фокусе                             |
| `c-input--has-error`  | Ошибка валидации                     |
| `c-input--disabled`   | `disabled = true`                    |
| `c-input--readonly`   | `readonly = true`                    |
| `c-input--dirty`      | `dirty = true`                       |
| `c-input--clearable`  | `clearable = true`                   |
| `c-input--validating` | Идёт async-валидация                 |
