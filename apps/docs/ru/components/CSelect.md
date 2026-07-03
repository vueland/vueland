# CSelect

`CSelect` — выпадающее поле выбора, собранное из [`CTextField`](/ru/components/CTextField), [`CMenu`](/ru/components/CMenu) и [`CList`](/ru/components/CList). Компонент подходит для одиночного и множественного выбора, работает с примитивами и объектами, умеет показывать выбранные значения чипами, очищаться через `clearable` и управляться с клавиатуры.

Все пропсы поля ввода, которые принимает `CTextField`/`CInput` (`label`, `placeholder`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset` и другие), можно передавать прямо в `CSelect`: они уйдут во внутреннее поле.

<script setup>
import BasicExample from '../../examples/CSelect/BasicExample.vue'
import ObjectItemsExample from '../../examples/CSelect/ObjectItemsExample.vue'
import MultipleExample from '../../examples/CSelect/MultipleExample.vue'
import StatesExample from '../../examples/CSelect/StatesExample.vue'
import CustomMenuExample from '../../examples/CSelect/CustomMenuExample.vue'
</script>

## Базовое использование

Передайте массив вариантов в `items` и свяжите выбранное значение через `v-model`. Для примитивов выбранное значение совпадает с самим пунктом списка.

<BasicExample />

::: details Показать код

```vue
<template>
  <CSelect
    v-model="framework"
    label="Framework"
    placeholder="Choose one"
    :items="frameworks"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const framework = ref()
const frameworks = ['Vue', 'React', 'Svelte', 'Angular', 'Solid', 'Qwik']
</script>
```

:::

## Объектные items

Если пункты — объекты, используйте `title-key` для отображаемого текста и `value-key` для значения, которое попадёт в `v-model`. Оба пропса принимают путь к полю, в том числе вложенный: например, `user.name`.

<ObjectItemsExample />

::: details Показать код

```vue
<template>
  <CSelect
    v-model="assignee"
    label="Assignee"
    placeholder="Select a member"
    :items="members"
    title-key="name"
    value-key="id"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const assignee = ref()
const members = [
  { id: 1, name: 'Anna Smith', role: 'Product Designer' },
  { id: 2, name: 'Boris Lee', role: 'Software Engineer' },
  { id: 3, name: 'Clara Diaz', role: 'Product Manager' },
]
</script>
```

:::

Без `value-key` в модель попадёт весь объект. Это удобно, когда форма работает с объектом целиком; если на отправку нужен только идентификатор, укажите `value-key`.

## Множественный выбор

Добавьте `multiple`, чтобы модель стала массивом значений. Проп `chips` отрисует выбранные значения как удаляемые чипы внутри поля.

<MultipleExample />

::: details Показать код

```vue
<template>
  <CSelect
    v-model="skills"
    label="Skills"
    placeholder="Add skills"
    :items="allSkills"
    multiple
    chips
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const skills = ref(['Vue', 'TypeScript'])
const allSkills = ['Vue', 'React', 'TypeScript', 'Node.js', 'Go', 'Rust']
</script>
```

:::

## Состояния и валидация

`CSelect` наследует состояния поля: `disabled`, `readonly`, `clearable`, `details`, `rules`, `validate-on` и пресеты ввода. Это позволяет использовать select в формах без отдельной обвязки.

Правила из `rules` получают саму модель — значение (или массив в `multiple`) из `v-model`, а не текст, отображаемый в поле. С `value-key` в правило придёт именно сохранённое значение.

<StatesExample />

::: details Показать код

```vue
<template>
  <CSelect
    v-model="plan"
    label="Plan"
    :items="plans"
    details="Current billing plan"
    clearable
    preset="input.indigo"
  />

  <CSelect
    v-model="region"
    label="Region"
    :items="regions"
    details="Readonly keeps the selected value visible"
    readonly
    preset="input.teal"
  />

  <CSelect
    model-value="Production"
    label="Environment"
    :items="environments"
    details="Disabled blocks focus and changes"
    disabled
    preset="input.orange"
  />

  <CSelect
    v-model="channel"
    label="Release channel"
    :items="channels"
    :rules="channelRules"
    validate-on="blur"
    details="Validation runs on blur"
    clearable
    preset="input.pink"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const plan = ref('Team')
const region = ref('EU West')
const channel = ref<string>()

const plans = ['Starter', 'Team', 'Business', 'Enterprise']
const regions = ['US East', 'EU West', 'Asia Pacific']
const environments = ['Preview', 'Staging', 'Production']
const channels = ['Stable', 'Beta', 'Canary']

const channelRules = [(value?: string) => ({ valid: !!value, message: 'Select a release channel' })]
</script>
```

:::

## Кастомный рендеринг

Слот `selects` заменяет отображение выбранных значений внутри поля, а слот `menu` позволяет полностью пересобрать выпадающий список. В `menu` приходит нормализованный массив `items` и функция `onSelect`, которая обновляет модель.

<CustomMenuExample />

::: details Показать код

```vue
<template>
  <CSelect
    v-model="region"
    label="Data region"
    :items="regions"
    title-key="name"
    value-key="code"
    clearable
  >
    <template #selects="{ items }">
      <div v-if="items.length && selectedRegion" class="region-value">
        <span :class="['region-mark', selectedRegion.color]">
          {{ selectedRegion.code.toUpperCase() }}
        </span>
        <span>{{ items[0] }}</span>
        <span>{{ selectedRegion.latency }}</span>
      </div>
    </template>

    <template #menu="{ items, onSelect }">
      <CList variant="menu" class="region-menu">
        <CListItem
          v-for="item in items"
          :key="item.key"
          :value="item.value"
          @click="onSelect(item.value)"
        >
          <CListItemContent>
            <CListItemTitle>{{ item.title }}</CListItemTitle>
            <CListItemSubtitle>
              {{ item.raw.location }} - {{ item.raw.latency }}
            </CListItemSubtitle>
          </CListItemContent>
        </CListItem>
      </CList>
    </template>
  </CSelect>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const region = ref('eu')
const regions = [
  {
    code: 'us',
    name: 'North America',
    location: 'Virginia, USA',
    latency: '41 ms',
    color: 'bg-indigo',
  },
  {
    code: 'eu',
    name: 'Europe',
    location: 'Frankfurt, Germany',
    latency: '24 ms',
    color: 'bg-teal',
  },
]

const selectedRegion = computed(() => regions.find((item) => item.code === region.value))
</script>
```

:::

## Поведение

- В фокусе поле открывает меню. `Escape` и `Tab` закрывают меню и снимают фокус.
- `ArrowUp` / `ArrowDown` перемещают активный пункт, `Enter` / `Space` выбирают его.
- Ввод символов работает как typeahead: фокус переходит к ближайшему подходящему пункту.
- В одиночном режиме повторный выбор текущего пункта не очищает модель; используйте `clearable`, если значение можно сбрасывать.
- В `multiple` выбранный пункт можно снять повторным кликом в меню. `mandatory` запрещает снять последний пункт через меню.

---

## API

### Пропы CSelect

| Проп         | Тип                             | По умолчанию | Описание                                                  |
| ------------ | ------------------------------- | ------------ | --------------------------------------------------------- |
| `modelValue` | `T \| T[] \| null \| undefined` | —            | Текущее выбранное значение; массив в режиме `multiple`    |
| `items`      | `readonly T[]`                  | `[]`         | Доступные варианты                                        |
| `title-key`  | `string`                        | —            | Путь к отображаемому заголовку пункта                     |
| `value-key`  | `string`                        | —            | Путь к значению, которое будет сохранено в `v-model`      |
| `multiple`   | `boolean`                       | `false`      | Собирать выбор в массив                                   |
| `mandatory`  | `boolean`                       | `false`      | В `multiple` запрещает снять последний пункт через список |
| `chips`      | `boolean`                       | `false`      | Показывать выбранные значения как чипы                    |

Также доступны пропсы внутреннего поля: `label`, `placeholder`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset`, `id`, `no-details` и другие пропсы [`CInput`](/ru/components/CInput#props) / [`CTextField`](/ru/components/CTextField#api). Функции из `rules` вызываются со значением модели (`v-model`), а не с отображаемой строкой.

### События CSelect

| Событие             | Аргументы          | Описание                         |
| ------------------- | ------------------ | -------------------------------- |
| `update:modelValue` | `T \| T[] \| null` | Срабатывает при изменении выбора |

### Слоты CSelect

| Слот      | Пропы                                         | Описание                                            |
| --------- | --------------------------------------------- | --------------------------------------------------- |
| `selects` | `{ items: unknown[] }`                        | Заменяет отображение выбранных значений внутри поля |
| `menu`    | `{ items: NormalizedItem<T>[], onSelect }`    | Заменяет содержимое выпадающего меню                |
| `details` | `{ errorMessage?: string, details?: string }` | Заменяет строку подсказки или ошибки                |

### NormalizedItem

Слот `menu` получает уже подготовленные элементы:

```ts
type NormalizedItem<T> = {
  raw: T
  title: unknown
  value: unknown
  key: string
}
```

`raw` — исходный пункт из `items`, `title` вычисляется через `title-key`, `value` — через `value-key`, `key` используется для стабильного рендера списка.

### CSS-переменные

| Переменная             | По умолчанию |
| ---------------------- | ------------ |
| `--c-select-chips-gap` | `4px`        |

Остальная визуальная настройка наследуется от [`CTextField`](/ru/components/CTextField), [`CMenu`](/ru/components/CMenu) и [`CList`](/ru/components/CList).
