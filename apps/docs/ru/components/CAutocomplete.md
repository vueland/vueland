# CAutocomplete

`CAutocomplete` — поле выбора с текстовым поиском, собранное из [`CTextField`](/ru/components/CTextField), [`CMenu`](/ru/components/CMenu) и [`CList`](/ru/components/CList). В отличие от [`CSelect`](/ru/components/CSelect), поле остаётся редактируемым: ввод фильтрует список опций по началу строки. Компонент поддерживает одиночный и множественный выбор, примитивы и объекты, чипы и очистку через `clearable`.

Все пропсы поля ввода, которые принимает `CTextField`/`CInput` (`label`, `placeholder`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset` и другие), можно передавать прямо в `CAutocomplete`: они уйдут во внутреннее поле.

<script setup>
import BasicExample from '../../examples/CAutocomplete/BasicExample.vue'
import ObjectItemsExample from '../../examples/CAutocomplete/ObjectItemsExample.vue'
import MultipleChipsExample from '../../examples/CAutocomplete/MultipleChipsExample.vue'
import CustomMenuExample from '../../examples/CAutocomplete/CustomMenuExample.vue'
</script>

## Базовое использование

Передайте массив вариантов в `items` и свяжите выбранное значение через `v-model`. Фокус открывает меню, ввод фильтрует список; выбор пункта записывает значение в модель и очищает строку поиска.

<BasicExample />

::: details Показать код

```vue
<template>
  <CAutocomplete
    v-model="destination"
    label="City"
    placeholder="Start typing — try «B»"
    :items="cities"
    clearable
  />

  <div v-if="destination" class="d-flex items-center gap-2 fs-sm mt-4">
    <CIcon name="fas:check" source="fa" :size="12" class="text-green" />
    Курьер доступен в <b>{{ destination }}</b>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const destination = ref<string>()
const cities = ['Amsterdam', 'Barcelona', 'Berlin', 'Lisbon', 'London', 'Paris']
</script>
```

:::

## Объектные items

Если пункты — объекты, используйте `title-key` для отображаемого текста и `value-key` для значения, которое попадёт в `v-model`. Оба пропса принимают путь к полю, в том числе вложенный: например, `user.name`. Поиск выполняется по заголовку (`title-key`).

<ObjectItemsExample />

::: details Показать код

```vue
<template>
  <CAutocomplete
    v-model="assignee"
    label="Reviewer"
    placeholder="Search a member"
    :items="members"
    title-key="name"
    value-key="id"
    clearable
  />

  <!-- в v-model лежит id, найденный объект рисует карточку -->
  <div v-if="reviewer" class="d-flex items-center gap-2 mt-4">
    <b>{{ reviewer.name }}</b>
    <span class="fs-xs text-blue-grey">{{ reviewer.role }}</span>
    <CChip>v-model: {{ assignee }}</CChip>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const assignee = ref<number>()
const members = [
  { id: 1, name: 'Anna Smith', role: 'Product Designer' },
  { id: 2, name: 'Boris Lee', role: 'Software Engineer' },
  { id: 3, name: 'Clara Diaz', role: 'Product Manager' },
]

const reviewer = computed(() => members.find((member) => member.id === assignee.value))
</script>
```

:::

Без `value-key` в модель попадёт весь объект. Если заголовки пунктов не уникальны, обязательно задавайте `value-key`, чтобы записи оставались различимы.

## Множественный выбор

Добавьте `multiple`, чтобы модель стала массивом значений. Проп `chips` отрисует выбранные значения как удаляемые чипы внутри поля. После выбора пункта меню остаётся открытым, а фокус возвращается в поле — можно сразу продолжать поиск. `Backspace` в пустом поле удаляет последнее выбранное значение.

<MultipleChipsExample />

::: details Показать код

```vue
<template>
  <CAutocomplete
    v-model="stack"
    label="Technologies"
    placeholder="Add a technology"
    :items="technologies"
    multiple
    chips
    clearable
  />

  <CProgressLinear
    :value="(stack.length / 5) * 100"
    :color="stack.length >= 5 ? 'green' : 'indigo'"
    height="6"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stack = ref(['Vue', 'TypeScript'])
const technologies = ['Vue', 'React', 'TypeScript', 'Node.js', 'Nuxt', 'Vite', 'Go', 'Rust']
</script>
```

:::

## Кастомное меню

Слот `menu` заменяет выпадашку целиком, сохраняя фильтрацию и выбор за компонентом: в него приходит уже отфильтрованный массив `items` (`NormalizedItem<T>[]`) и функция `onSelect`. Вместе со слотом `chips` из этого собирается полноценный people-picker — аватары, статусы, бейджи ролей и своё пустое состояние:

<CustomMenuExample />

::: details Показать код

```vue
<template>
  <CAutocomplete
    v-model="invited"
    label="Teammates"
    placeholder="Search by name"
    title-key="name"
    :items="members"
    multiple
    chips
    clearable
  >
    <!-- Кастомные чипы: аватар + имя + своё удаление -->
    <template #chips>
      <div v-for="member of invited" :key="member.email" class="invite-chip">
        <span class="avatar" :class="member.color">{{ initials(member) }}</span>
        {{ member.name.split(' ')[0] }}
        <CIcon name="fas:times" source="fa" :size="10" @click.stop="uninvite(member)" />
      </div>
    </template>

    <!-- Кастомное меню: свой лейаут поверх items + onSelect -->
    <template #menu="{ items, onSelect }">
      <div class="invite-menu radius-12 elevation-4">
        <div class="invite-menu__head">Team directory — {{ items.length }} matches</div>

        <div v-if="!items.length" class="pa-4 fs-sm text-blue-grey">Никого не нашлось</div>

        <CList v-else variant="menu">
          <CListItem
            v-for="item of items"
            :key="item.key"
            :value="item.raw"
            @click="onSelect(item.raw)"
          >
            <span class="avatar" :class="item.raw.color">
              {{ initials(item.raw) }}
              <i class="dot" :class="item.raw.online ? 'bg-green' : 'bg-grey'"></i>
            </span>
            <CListItemContent>
              <CListItemTitle>{{ item.title }}</CListItemTitle>
              <CListItemSubtitle>{{ item.raw.email }}</CListItemSubtitle>
            </CListItemContent>
            <CChip>{{ item.raw.role }}</CChip>
            <CIcon
              v-if="invited.includes(item.raw)"
              name="fas:check"
              source="fa"
              :size="14"
              class="text-teal"
            />
          </CListItem>
        </CList>
      </div>
    </template>
  </CAutocomplete>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const invited = ref<Member[]>([])

const members: Member[] = [
  { name: 'Anna Smith', email: 'anna@vueland.dev', role: 'Design', color: 'bg-pink', online: true },
  {
    name: 'Boris Lee',
    email: 'boris@vueland.dev',
    role: 'Frontend',
    color: 'bg-indigo',
    online: true,
  },
  // ...
]

const initials = (member: Member) =>
  member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
const uninvite = (member: Member) => {
  invited.value = invited.value.filter((it) => it !== member)
}
</script>
```

:::

Состояние выбора остаётся за компонентом: `onSelect` в `multiple` работает как toggle, строка поиска продолжает фильтровать `items`, а `Backspace` по-прежнему удаляет последний выбор.

## Поиск

- Список фильтруется по **началу** заголовка пункта без учёта регистра.
- Каждое изменение строки поиска эмитит событие `update:search` — его можно использовать для внешней логики: подсветки, аналитики или подгрузки данных.
- Закрытие меню любым способом (выбор, `Escape`, `Tab`, клик вне) сбрасывает строку поиска, поэтому при следующем открытии виден полный список.

## Поведение

- В фокусе поле открывает меню. `Escape` и `Tab` закрывают меню и снимают фокус.
- `ArrowUp` / `ArrowDown` перемещают активный пункт списка, `Enter` / `Space` выбирают его.
- В одиночном режиме выбор закрывает меню и очищает строку поиска. Повторный выбор текущего пункта не очищает модель.
- В `multiple` выбранный пункт снимается повторным выбором. `mandatory` запрещает снять последний пункт через список.
- `Backspace` в пустом поле удаляет последнее значение (`multiple`) или очищает модель (одиночный режим).
- `readonly` не открывает меню, а `Backspace` не удаляет выбранные значения.

## API

### Пропы CAutocomplete

| Проп         | Тип                             | По умолчанию | Описание                                                  |
| ------------ | ------------------------------- | ------------ | --------------------------------------------------------- |
| `modelValue` | `T \| T[] \| null \| undefined` | —            | Текущее выбранное значение; массив в режиме `multiple`    |
| `items`      | `readonly T[]`                  | `[]`         | Доступные варианты                                        |
| `title-key`  | `string`                        | —            | Путь к отображаемому заголовку пункта; поиск идёт по нему |
| `value-key`  | `string`                        | —            | Путь к значению, которое будет сохранено в `v-model`      |
| `multiple`   | `boolean`                       | `false`      | Собирать выбор в массив                                   |
| `mandatory`  | `boolean`                       | `false`      | В `multiple` запрещает снять последний пункт через список |
| `chips`      | `boolean`                       | `false`      | Показывать выбранные значения как чипы                    |
| `options`    | `{ noItemsMessage?: string }`   | —            | Текст пункта при пустом списке                            |

Также доступны пропсы внутреннего поля: `label`, `placeholder`, `details`, `clearable`, `disabled`, `readonly`, `rules`, `validate-on`, `preset` и другие пропсы [`CInput`](/ru/components/CInput#props) / [`CTextField`](/ru/components/CTextField#api). Функции из `rules` вызываются со значением модели (`v-model`), а не со строкой поиска.

Пресеты компонуются по значению: в поля `menu` и `list` пресета инпута подставляются обычные `CMenuPreset` и `CListPreset` — тот же формат, что у standalone-компонентов. [`CMenu`](/ru/components/CMenu), [`CList`](/ru/components/CList) и `CListItem` получают их из того же набора через контекст.

```ts
import { menuRounded } from './presets/menu' // CMenuPreset: зона root, состояния opened/closed
import { listCompact } from './presets/list' // CListPreset: зоны root/option, состояния disabled/readonly

const combo: CInputPreset = {
  base: {
    field: ['text-indigo'],
    menu: menuRounded,
    list: listCompact,
  },
}
```

### События CAutocomplete

| Событие             | Аргументы          | Описание                                |
| ------------------- | ------------------ | --------------------------------------- |
| `update:modelValue` | `T \| T[] \| null` | Срабатывает при изменении выбора        |
| `update:search`     | `string`           | Срабатывает при изменении строки поиска |

### Слоты CAutocomplete

| Слот               | Пропы                                         | Описание                                                                   |
| ------------------ | --------------------------------------------- | -------------------------------------------------------------------------- |
| `chips`            | `{ items: unknown[] }`                        | Заменяет отображение выбранных значений внутри поля                        |
| `menu`             | `{ items: NormalizedItem<T>[], onSelect }`    | Заменяет содержимое выпадающего меню; `items` — уже отфильтрованный список |
| `details`          | `{ errorMessage?: string, details?: string }` | Заменяет строку подсказки или ошибки                                       |
| `prepend`          | —                                             | Контент перед полем                                                        |
| `append`           | —                                             | Контент после поля; заменяет иконку дропдауна                              |
| `no-items-message` | —                                             | Текст пункта, когда поиск не дал результатов                               |

В `menu` функция `onSelect` обновляет модель: в `multiple` повторный вызов с уже выбранным значением снимает его (toggle).

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

Визуальная настройка наследуется от [`CTextField`](/ru/components/CTextField), [`CMenu`](/ru/components/CMenu) и [`CList`](/ru/components/CList); чипы настраиваются через переменные `CChip`.
