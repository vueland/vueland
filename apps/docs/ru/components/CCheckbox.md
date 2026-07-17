# CCheckbox

`CCheckbox` — чекбокс, собранный из [`CInput`](/ru/components/CInput) и [`CSelectControl`](/ru/components/CSelectControl). Внутри — настоящий `<input type="checkbox">`, поэтому фокус, клавиатура и скринридеры работают нативно. Компонент связывает булево значение или собирает значения в массив, умеет в промежуточное состояние и участвует в валидации [`CForm`](/ru/components/CForm).

Все пропсы `CInput` (`label`, `details`, `no-details`, `rules`, `validate-on`, `disabled`, `readonly`, `preset`) можно передавать прямо в `CCheckbox`: они уйдут во внутренний инпут.

<script setup>
import BasicExample from '../../examples/CCheckbox/BasicExample.vue'
import GroupExample from '../../examples/CCheckbox/GroupExample.vue'
import IndeterminateExample from '../../examples/CCheckbox/IndeterminateExample.vue'
import StatesExample from '../../examples/CCheckbox/StatesExample.vue'
import ColorExample from '../../examples/CCheckbox/ColorExample.vue'
import SizeExample from '../../examples/CCheckbox/SizeExample.vue'
import SlotsExample from '../../examples/CCheckbox/SlotsExample.vue'
import PresetExample from '../../examples/CCheckbox/PresetExample.vue'
</script>

## Базовое использование

Свяжите булево значение через `v-model` и передайте `label`.

<BasicExample />

::: details Показать код

```vue
<template>
  <c-checkbox v-model="subscribed" label="Email me about releases" />
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
  <c-checkbox
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

## Цвет

`color` задаёт цвет бокса через текстовую утилиту (`text-{color}`), поэтому принимает токены палитры и сырые CSS-цвета.

::: tip Сырой цвет должен быть литералом
Arbitrary-классы (`text-[#e65100]`) генерируются статическим сканом: `color="#e65100"` сработает, `:color="someVar"` с сырым значением — нет. Палитровых токенов это не касается.
:::

<ColorExample />

::: details Показать код

```vue
<template>
  <c-checkbox
    v-for="item in variants"
    :key="item.value"
    v-model="selected"
    :value="item.value"
    :label="item.label"
    :color="item.color"
    no-details
  />

  <c-checkbox
    v-model="selected"
    value="custom"
    label="Custom CSS color"
    color="#e65100"
    no-details
  />

  <c-checkbox
    v-model="selected"
    value="brand"
    label="Brand variable"
    color="var(--c-sys-color-primary)"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(['teal', 'rose', 'amber', 'custom'])

const variants = [
  { value: 'teal', label: 'Teal', color: 'teal' },
  { value: 'indigo', label: 'Indigo', color: 'indigo' },
  { value: 'rose', label: 'Rose', color: 'pink-darken-1' },
  { value: 'amber', label: 'Amber', color: 'amber-darken-2' },
  { value: 'green', label: 'Green', color: 'green-darken-1' },
  { value: 'cyan', label: 'Cyan', color: 'cyan-darken-2' },
  { value: 'purple', label: 'Purple', color: 'deep-purple-lighten-1' },
  { value: 'red', label: 'Red', color: 'red-darken-1' },
]
</script>
```

:::

## Размер

`size` меняет только размер бокса, не влияя на высоту строки и подпись. Число превращается в пиксели, строка передаётся как CSS-значение.

<SizeExample />

::: details Показать код

```vue
<template>
  <c-checkbox
    v-for="item in variants"
    :key="item.value"
    v-model="selected"
    :value="item.value"
    :label="item.label"
    :size="item.size"
    color="indigo"
    no-details
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(['compact'])

const variants = [
  { value: 'compact', label: 'Compact 16', size: 16 },
  { value: 'regular', label: 'Regular 20', size: 20 },
  { value: 'comfortable', label: 'Comfortable 24', size: 24 },
  { value: 'large', label: 'Large 28', size: '28px' },
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
  <c-checkbox v-model="allInvited" :indeterminate="someInvited" label="All teams" no-details />

  <c-checkbox
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
  <c-checkbox
    v-model="terms"
    label="I accept the terms of service"
    :rules="termsRules"
    validate-on="blur"
    details="Validation runs on blur"
  >
    <template #details="{ errorMessage, details }">
      <span :class="{ error: !!errorMessage }">{{ errorMessage || details }}</span>
    </template>
  </c-checkbox>
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
  <c-checkbox v-model="starred" no-details>
    <template #icon="{ checked }">
      <c-icon
        name="fas:star"
        source="fa"
        :size="18"
        :class="checked ? 'text-amber' : 'text-blue-grey-lighten-2'"
      />
    </template>
    Star this repository
  </c-checkbox>

  <c-checkbox v-model="accepted" no-details>
    <template #default="{ checked }">
      <span class="d-flex items-center gap-2">
        Watch releases
        <c-chip v-if="checked" class="bg-indigo text-white fs-xs">on</c-chip>
      </span>
    </template>
  </c-checkbox>
</template>
```

:::

Подпись не является самостоятельной целью клика: нативный инпут перекрывает весь компонент — именно поэтому кликабельна вся строка. Интерактивные элементы (ссылки, кнопки) внутри слотов кликов не получат, размещайте их рядом с чекбоксом.

## Пресеты

Чекбокс берёт пресет из набора инпута: вложенное поле `checkbox` в `base`-снимке принимает обычный `CCheckboxPreset` — так же, как `field` принимает `CFieldPreset`. Зоны — `root`, `icon` и `label`; состояния схлопываются в порядке `disabled > readonly > error > focused > indeterminate > checked`. Для чекбокса `focused` применяется только при `:focus-visible`.

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
  <c-checkbox v-model="allEnabled" label="All channels" preset="input.consent" />
</template>
```

:::

## Поведение

- **Клавиатура** — работает нативный инпут: `Tab` ставит фокус, `Space` переключает.
- **Readonly** — чекбокс остаётся фокусируемым и показывает значение, но переключение отменяется и модель не меняется. Наружу состояние отдаётся как `aria-readonly`, потому что своего readonly у нативного чекбокса нет.
- **Disabled** — блокирует фокус и изменения, правила не выполняются.
- **Анимация** — при отметке бокс заливается, а галочка отрисовывается через `stroke-dashoffset`; даш промежуточного состояния въезжает через `scale` и `rotate`. И то, и другое построено на системных мотион-токенах и схлопывается в мгновенное при `prefers-reduced-motion: reduce`.

## Стилизация

Бокс — не иконка: это CSS-рамка, а галочка и даш берут геометрию из aliases `checkboxCheckMark` и `checkboxIndeterminateMark` и рендерятся внутри одного `CIcon` SVG-слоя как осевые path. Именно это позволяет галочку отрисовывать: у залитого глифа из иконочного набора нет осевой линии, вдоль которой можно гнать дэш, поэтому `checkboxOn` и `checkboxIndeterminate` здесь не участвуют. Чтобы заменить бокс целиком, используйте слот `icon`.

Переопределение этих алиасов через `icons.aliases` перерисовывает метки во всём приложении. Передавайте осевые линии, а не силуэты — по залитому глифу дэш обведёт контур вместо отрисовки. Оба марка живут в одном SVG, и его `viewBox` берётся из записи галочки, поэтому рисуйте их в одной системе координат.

На `.c-checkbox__icon` доступны две кастомные проперти:

| Переменная                | По умолчанию               | Описание                                  |
| ------------------------- | -------------------------- | ----------------------------------------- |
| `--c-checkbox-size`       | `20px`                     | Размер бокса; его задаёт проп `size`      |
| `--c-checkbox-mark-color` | `--c-sys-color-on-primary` | Цвет галочки и даша поверх залитого бокса |

Сам бокс красится в `currentColor` — значит им управляют цветовые утилиты и зоны пресета.

## API

### Props

| Проп            | Тип                   | По умолчанию | Описание                                                         |
| --------------- | --------------------- | ------------ | ---------------------------------------------------------------- |
| `modelValue`    | `T \| T[] \| boolean` | `false`      | Состояние отметки или массив, собирающий `value` в режиме группы |
| `value`         | `T`                   | —            | Значение, которое добавляется в модель или убирается из неё      |
| `indeterminate` | `boolean`             | `false`      | Промежуточное состояние; снимается при переключении              |
| `color`         | `string`              | —            | Цвет бокса: токен палитры или CSS-цвет                           |
| `size`          | `number \| string`    | `20px`       | Размер бокса; задаёт `--c-checkbox-size`                         |
| `disabled`      | `boolean`             | `false`      | Блокирует фокус и изменения                                      |
| `readonly`      | `boolean`             | `false`      | Показывает значение и держит фокус, но запрещает изменения       |

Все пропсы [`CInput`](/ru/components/CInput) — `label`, `details`, `no-details`, `rules`, `validate-on`, `preset` и другие — уходят во внутренний инпут.

### Events

| Событие                | Аргументы             | Описание                                      |
| ---------------------- | --------------------- | --------------------------------------------- |
| `update:modelValue`    | `T \| T[] \| boolean` | Отметка изменилась                            |
| `update:indeterminate` | `boolean`             | Приходит с `false`, когда чекбокс переключили |

### Slots

| Слот      | Пропсы                                                           | Описание                               |
| --------- | ---------------------------------------------------------------- | -------------------------------------- |
| `default` | `{ checked: boolean, indeterminate: boolean }`                   | Заменяет текст `label`                 |
| `icon`    | `{ checked: boolean, indeterminate: boolean }`                   | Заменяет бокс                          |
| `details` | `{ errorMessage?: string, details?: string, hasError: boolean }` | Переопределяет строку подсказки/ошибки |
