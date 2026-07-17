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
  <c-input v-model="search">
    <template #field="field">
      <div class="search-bar" :class="{ 'search-bar--focused': field.focused }">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-bind="field.attrs"
          class="search-input"
          placeholder="Search anything…"
          :value="search"
          @input="
            (e: any) => {
              search = e.target.value
            }
          "
          @focus="field.focus"
          @blur="field.blur"
        />
        <kbd v-if="!search" class="search-kbd">⌘K</kbd>
        <button v-else class="search-clear" @click="search = ''">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            width="14"
            height="14"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </template>
  </c-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
</script>
```

:::

---

## Система пресетов

Пресеты — основной способ стилизации компонентов на основе `CInput`. Вместо условных CSS-классов в каждом шаблоне вы один раз описываете **пресет** и ссылаетесь на него по имени. Компонент сам применяет нужные классы под текущее состояние.

Каждое значение — массив имён утилитарных классов, поэтому пресеты работают с любым utility-first движком, который вы используете.

### Зоны

Плоский пресет (`ZonePreset`) — это карта **зон** в списки классов. Зоны маппятся 1:1 на отрисованный DOM:

У самого `CInput` две зоны:

| Зона      | Элемент                   |
| --------- | ------------------------- |
| `root`    | обёртка `.c-input`        |
| `details` | строка подсказки / ошибки |

Вложенные части описываются собственными пресетами компонентов и подставляются в снимок инпута **по значению** — тот же формат, что у standalone-компонентов:

| Поле    | Тип пресета    | Зоны                                                     | Состояния                                        |
| ------- | -------------- | -------------------------------------------------------- | ------------------------------------------------ |
| `field` | `CFieldPreset` | `root` (.c-field), `input`, `label`, `prepend`, `append` | `focused` `filled` `error` `disabled` `readonly` |
| `menu`  | `CMenuPreset`  | `root` (.c-menu)                                         | `opened` `closed`                                |
| `list`  | `CListPreset`  | `root` (.c-list), `option` (.c-list-item)                | `disabled` `readonly`                            |

### Тип CInputPreset

Пресет — это **набор плоских пресетов по состояниям**. `base` — спокойный вид, каждое состояние — отдельный полный плоский пресет:

```ts
type CInputZone = 'root' | 'details'
type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

// один снимок: свои зоны + вложенные пресеты частей (по значению)
type CInputSnapshot = Partial<Record<CInputZone, string[]>> & {
  field?: CFieldPreset
  menu?: CMenuPreset
  list?: CListPreset
}

// base + опциональные снимки по состояниям — всё опционально
type CInputPreset = Partial<Record<'base' | CInputState, CInputSnapshot>>
```

**Составных состояний нет.** Вложенность — только по компонентам: вложенный пресет кладут в `base`, а его состояния компонент резолвит сам.

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
    base: {
      field: {
        base: { label: [color] },
        focused: { label: [color], root: [color] },
        filled: { label: [color] },
        error: { label: ['text-red'], root: ['text-red'] },
        readonly: { label: ['text-grey'] },
        // `disabled` притеняется компонентом; состояние нужно только для оверрайда
      },
    },
    error: { details: ['text-red'] },
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
<c-text-field preset="input.blue" ... />
<c-text-field preset="input.teal" ... />
```

### Распределение CInput → CField

Вы пишете **один** пресет. `CInput` его резолвит, применяет свои зоны (`root`, `details`) и раздаёт набор в поддерево через `provide`/`inject`. `CField`, `CMenu` и `CList` берут из `base`-снимка свои вложенные пресеты (`field`/`menu`/`list`) и резолвят собственные состояния сами. У каждого из них есть и свой проп `preset` — он перекрывает контекст, поэтому standalone-режим работает без изменений. Ничего не мутируется глобально.

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

### Slots

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

### Events

| Событие          | Аргументы | Описание                   |
| ---------------- | --------- | -------------------------- |
| `update:focused` | `boolean` | Изменение состояния фокуса |

`CInput` — renderless-примитив: он принимает `modelValue` для валидации и состояния, но не знает, как менять значение кастомного поля. Обновляйте источник данных внутри `field`-слота.

### Expose

| Метод        | Сигнатура                | Описание                                                                  |
| ------------ | ------------------------ | ------------------------------------------------------------------------- |
| `validate`   | `() => Promise<boolean>` | Запустить валидацию вручную                                               |
| `reset`      | `() => void`             | Сбросить ошибку валидации                                                 |
| `focus`      | `() => void`             | Программно сфокусировать поле; ничего не делает при `disabled`/`readonly` |
| `blur`       | `() => void`             | Программно убрать фокус                                                   |
| `isReadonly` | `() => boolean`          | Вернуть текущее значение prop `readonly`                                  |
| `isDisabled` | `() => boolean`          | Вернуть текущее значение prop `disabled`                                  |

---

## Интеграция с CForm

`CInput` автоматически регистрирует свой метод `validate` в ближайшем родительском `CForm`. При вызове `form.validate()` все зарегистрированные поля проверяются параллельно через `Promise.all`.

```vue
<template>
  <c-form>
    <template #default="{ validate }">
      <c-input v-model="pin" :rules="rules">
        <template #field="field">
          <input
            :id="field.uid"
            v-bind="field.attrs"
            :value="pin"
            @focus="field.focus"
            @blur="field.blur"
          />
        </template>
      </c-input>
      <button @click="validate">Проверить</button>
    </template>
  </c-form>
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

| Переменная                      | По умолчанию                          | Описание                    |
| ------------------------------- | ------------------------------------- | --------------------------- |
| `--c-input-details-height`      | `var(--c-sys-control-height-sm)`      | Высота блока details        |
| `--c-input-transition-duration` | `var(--c-sys-motion-duration-medium)` | Длительность перехода цвета |
| `--c-input-primary-color`       | `var(--c-sys-color-primary)`          | Базовый цвет текста         |
| `--c-input-error-color`         | `var(--c-sys-color-error)`            | Цвет текста при ошибке      |
| `--c-input-disabled-color`      | `var(--c-sys-color-disabled)`         | Цвет текста при disabled    |
| `--c-input-readonly-color`      | `var(--c-sys-color-readonly)`         | Цвет текста при readonly    |

> Фон поля в состояниях `focused`/`readonly`/`disabled`/`error` отрисовывает компонент `CField` (`--c-field-focused-bg-color`, `--c-field-readonly-bg-color`, `--c-field-disabled-bg-color`, `--c-field-error-bg-color`), а не `CInput`.

---

## CSS-классы состояний

| Класс                | Условие                                             |
| -------------------- | --------------------------------------------------- |
| `c-input--focused`   | В фокусе                                            |
| `c-input--has-error` | Ошибка валидации (и не `disabled`, и не `readonly`) |
| `c-input--disabled`  | `disabled = true`                                   |
| `c-input--readonly`  | `readonly = true`                                   |
| `c-input--dirty`     | `dirty = true`                                      |
| `c-input--clearable` | `clearable = true`                                  |
