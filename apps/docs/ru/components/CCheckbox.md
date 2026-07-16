# CCheckbox

`CCheckbox` — чекбокс, собранный из [`CInput`](/ru/components/CInput) и [`CSelectControl`](/ru/components/CSelectControl). Внутри — настоящий `<input type="checkbox">`, поэтому фокус, клавиатура и скринридеры работают нативно. Компонент связывает булево значение или собирает значения в массив, умеет в промежуточное состояние и участвует в валидации [`CForm`](/ru/components/CForm).

Все пропсы `CInput` (`label`, `details`, `no-details`, `rules`, `validate-on`, `disabled`, `readonly`, `preset`) можно передавать прямо в `CCheckbox`: они уйдут во внутренний инпут.

<script setup>
import BasicExample from '../../examples/CCheckbox/BasicExample.vue'
import GroupExample from '../../examples/CCheckbox/GroupExample.vue'
import IndeterminateExample from '../../examples/CCheckbox/IndeterminateExample.vue'
import StatesExample from '../../examples/CCheckbox/StatesExample.vue'
import SlotsExample from '../../examples/CCheckbox/SlotsExample.vue'
import PresetExample from '../../examples/CCheckbox/PresetExample.vue'
</script>

## Базовое использование

Свяжите булево значение через `v-model` и передайте `label`.

<BasicExample />

::: details Показать код

```vue
<template>
  <CCheckbox v-model="subscribed" label="Email me about releases" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const subscribed = ref(true)
</script>
```

:::

## Группы

Направьте несколько чекбоксов на одну модель-массив и задайте каждому свой `value`. Отметка добавляет `value` в массив, снятие — убирает. Компонент-обёртка для группы не нужен.

<GroupExample />

::: details Показать код

```vue
<template>
  <CCheckbox
    v-for="scope in available"
    :key="scope.value"
    v-model="scopes"
    :value="scope.value"
    :label="scope.label"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scopes = ref(['read'])

const available = [
  { value: 'read', label: 'Read repositories' },
  { value: 'write', label: 'Write repositories' },
  { value: 'admin', label: 'Manage members' },
]
</script>
```

:::

## Промежуточное состояние

`indeterminate` рисует третье состояние и выставляет нативное свойство `indeterminate` на инпуте — скринридер озвучит чекбокс как _mixed_. Состояние не связано с `modelValue`: чекбокс может быть одновременно снятым и промежуточным.

При переключении состояние снимается — компонент эмитит `update:indeterminate` со значением `false`. В типичном сценарии «выбрать всё» состояние родителя полностью выводится из детей, поэтому достаточно односторонней привязки `:indeterminate`.

<IndeterminateExample />

::: details Показать код

```vue
<template>
  <CCheckbox v-model="allInvited" :indeterminate="someInvited" label="All teams" no-details />

  <CCheckbox
    v-for="team in teams"
    :key="team"
    v-model="invited"
    :value="team"
    :label="team"
    no-details
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const teams = ['Design', 'Engineering', 'Marketing']
const invited = ref(['Design'])

const allInvited = computed({
  get: () => invited.value.length === teams.length,
  set: (value: boolean) => {
    invited.value = value ? [...teams] : []
  },
})

const someInvited = computed(() => invited.value.length > 0 && invited.value.length < teams.length)
</script>
```

:::

## Состояния и валидация

В `rules` приходит значение модели — булево или массив в режиме группы. С `validate-on="blur"` проверка запускается, когда чекбокс теряет фокус.

<StatesExample />

::: details Показать код

```vue
<template>
  <CCheckbox
    v-model="terms"
    label="I accept the terms of service"
    :rules="termsRules"
    validate-on="blur"
    details="Validation runs on blur"
  >
    <template #details="{ errorMessage, details }">
      <span :class="{ error: !!errorMessage }">{{ errorMessage || details }}</span>
    </template>
  </CCheckbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref(false)

const termsRules = [(value?: boolean) => ({ valid: !!value, message: 'You must accept the terms' })]
</script>
```

:::

## Слоты

Дефолтный слот заменяет текст `label` и получает текущее состояние, `icon` — сам бокс.

<SlotsExample />

::: details Показать код

```vue
<template>
  <CCheckbox v-model="starred" no-details>
    <template #icon="{ checked }">
      <CIcon
        name="fas:star"
        source="fa"
        :size="18"
        :class="checked ? 'text-amber' : 'text-blue-grey-lighten-2'"
      />
    </template>
    Star this repository
  </CCheckbox>

  <CCheckbox v-model="accepted" no-details>
    <template #default="{ checked }">
      <span class="d-flex items-center gap-2">
        Watch releases
        <CChip v-if="checked" class="bg-indigo text-white fs-xs">on</CChip>
      </span>
    </template>
  </CCheckbox>
</template>
```

:::

Подпись не является самостоятельной целью клика: нативный инпут перекрывает весь компонент — именно поэтому кликабельна вся строка. Интерактивные элементы (ссылки, кнопки) внутри слотов кликов не получат, размещайте их рядом с чекбоксом.

## Пресеты

Чекбокс берёт пресет из набора инпута: вложенное поле `checkbox` в `base`-снимке принимает обычный `CCheckboxPreset` — так же, как `field` принимает `CFieldPreset`. Зоны — `root`, `icon` и `label`; состояния схлопываются в порядке `disabled > readonly > error > focused > indeterminate > checked`.

<PresetExample />

::: details Показать код

```ts
import type { CInputPreset } from '@vueland/ui/types'

const consent: CInputPreset = {
  base: {
    checkbox: {
      base: { icon: ['text-blue-grey'], label: ['text-blue-grey'] },
      checked: { icon: ['text-indigo'], label: ['text-indigo', 'fw-semi-bold'] },
      indeterminate: { icon: ['text-indigo'] },
      focused: { icon: ['text-indigo-darken-2'] },
      error: { icon: ['text-red'], label: ['text-red'] },
      disabled: { icon: ['text-grey-lighten-1'], label: ['text-grey-lighten-1'] },
    },
  },
  error: { details: ['text-red'] },
}
```

```vue
<template>
  <CCheckbox v-model="allEnabled" label="All channels" preset="input.consent" />
</template>
```

:::

## Поведение

- **Клавиатура** — работает нативный инпут: `Tab` ставит фокус, `Space` переключает.
- **Readonly** — чекбокс остаётся фокусируемым и показывает значение, но переключение отменяется и модель не меняется. Наружу состояние отдаётся как `aria-readonly`, потому что своего readonly у нативного чекбокса нет.
- **Disabled** — блокирует фокус и изменения, правила не выполняются.
- **Иконки** — бокс приходит из [алиасов иконок](/ru/guide/icons) `checkboxOn` / `checkboxOff` / `checkboxIndeterminate`, поэтому весь чекбокс в приложении перерисовывается из конфига иконок.

## API

### Пропсы CCheckbox

| Проп            | Тип                   | По умолчанию | Описание                                                         |
| --------------- | --------------------- | ------------ | ---------------------------------------------------------------- |
| `modelValue`    | `T \| T[] \| boolean` | `false`      | Состояние отметки или массив, собирающий `value` в режиме группы |
| `value`         | `T`                   | —            | Значение, которое добавляется в модель или убирается из неё      |
| `indeterminate` | `boolean`             | `false`      | Промежуточное состояние; снимается при переключении              |
| `size`          | `number \| string`    | —            | Размер бокса в пикселях; прокидывается в `CIcon`                 |
| `disabled`      | `boolean`             | `false`      | Блокирует фокус и изменения                                      |
| `readonly`      | `boolean`             | `false`      | Показывает значение и держит фокус, но запрещает изменения       |

Все пропсы [`CInput`](/ru/components/CInput) — `label`, `details`, `no-details`, `rules`, `validate-on`, `preset` и другие — уходят во внутренний инпут.

### События CCheckbox

| Событие                | Аргументы             | Описание                                      |
| ---------------------- | --------------------- | --------------------------------------------- |
| `update:modelValue`    | `T \| T[] \| boolean` | Отметка изменилась                            |
| `update:indeterminate` | `boolean`             | Приходит с `false`, когда чекбокс переключили |

### Слоты CCheckbox

| Слот      | Пропсы                                                           | Описание                               |
| --------- | ---------------------------------------------------------------- | -------------------------------------- |
| `default` | `{ checked: boolean, indeterminate: boolean }`                   | Заменяет текст `label`                 |
| `icon`    | `{ checked: boolean, indeterminate: boolean }`                   | Заменяет бокс                          |
| `details` | `{ errorMessage?: string, details?: string, hasError: boolean }` | Переопределяет строку подсказки/ошибки |
