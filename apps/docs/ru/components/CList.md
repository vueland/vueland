# CList

`CList` — это generic-контейнер списка с поддержкой одиночного и множественного выбора, навигации с клавиатуры, typeahead, состояний readonly/disabled и ARIA-ролей. Работает в паре с `CListItem` через provide/inject.

<script setup>
import PlainListExample from '../../examples/CList/PlainListExample.vue'
import BasicExample from '../../examples/CList/BasicExample.vue'
import MultipleExample from '../../examples/CList/MultipleExample.vue'
import RichItemsExample from '../../examples/CList/RichItemsExample.vue'
import MenuExample from '../../examples/CList/MenuExample.vue'
import ObjectValuesExample from '../../examples/CList/ObjectValuesExample.vue'
</script>

Модель взаимодействия задаётся пропом `variant`:

| `variant`             | Роль             | Поведение                                                                             |
| --------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `list` (по умолчанию) | —                | Обычный неинтерактивный список. Элементы не регистрируются и не выбираются.           |
| `listbox`             | `role="listbox"` | Выбираемые опции с полной поддержкой клавиатуры (элементы `option`, `aria-selected`). |
| `menu`                | `role="menu"`    | Список действий с поддержкой клавиатуры (элементы `menuitem`, без состояния выбора).  |

## Обычный список

С `variant="list"` (значение по умолчанию) список не интерактивен: элементы не регистрируются, не выбираются и не участвуют в навигации с клавиатуры. Это удобно для статичного вывода информации, где `CListItem` и вспомогательные компоненты используются только ради раскладки и типографики.

<PlainListExample />

::: details Показать код

```vue
<template>
  <CCard class="elevation-3 radius-16" style="width:360px;overflow:hidden">
    <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
      Contact details
    </div>
    <CList class="pa-2">
      <CListItem v-for="d in details" :key="d.label" class="px-3 py-2">
        <CListItemIcon>
          <CIcon :name="d.icon" source="fa" :size="14" class="text-blue-grey" />
        </CListItemIcon>
        <CListItemContent>
          <CListItemSubtitle>{{ d.label }}</CListItemSubtitle>
          <CListItemTitle class="fw-medium">{{ d.value }}</CListItemTitle>
        </CListItemContent>
      </CListItem>
    </CList>
  </CCard>
</template>

<script setup lang="ts">
const details = [
  { icon: 'fas:user', label: 'Full name', value: 'Anna Smith' },
  { icon: 'fas:envelope', label: 'Email', value: 'anna.smith@example.com' },
  { icon: 'fas:phone', label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: 'fas:briefcase', label: 'Company', value: 'Vueland Inc.' },
  { icon: 'fas:map-marker-alt', label: 'Location', value: 'Berlin, Germany' },
]
</script>
```

:::

## Базовое использование

Укажите `variant="listbox"`, чтобы элементы стали выбираемыми, и привяжите выбор через `v-model`.

<BasicExample />

::: details Показать код

```vue
<template>
  <CCard class="elevation-3 radius-16" style="width:300px;overflow:hidden">
    <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
      Display density
    </div>
    <CList v-model="selected" variant="listbox" mandatory class="pa-2">
      <CListItem v-for="d in densities" :key="d.value" :value="d.value" class="px-3 py-2 radius-8">
        <CListItemContent>
          <CListItemTitle class="fw-medium">{{ d.label }}</CListItemTitle>
          <CListItemSubtitle>{{ d.hint }}</CListItemSubtitle>
        </CListItemContent>
        <CIcon v-if="selected === d.value" name="fas:check" source="fa" :size="14" />
      </CListItem>
    </CList>
  </CCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('comfortable')
const densities = [
  { value: 'compact', label: 'Compact', hint: 'Tight spacing' },
  { value: 'comfortable', label: 'Comfortable', hint: 'Balanced (default)' },
  { value: 'spacious', label: 'Spacious', hint: 'Roomy layout' },
]
</script>
```

:::

## Множественный выбор

Добавьте `multiple`, чтобы собирать значения в массив.

<MultipleExample />

::: details Показать код

```vue
<template>
  <CList v-model="selected" variant="listbox" multiple class="pa-2">
    <CListItem v-for="s in skills" :key="s.value" :value="s.value" class="px-3 py-2 radius-8">
      <CListItemIcon>
        <CIcon :name="s.icon" source="fa" :size="14" />
      </CListItemIcon>
      <span class="grow-1 fw-medium">{{ s.label }}</span>
      <CIcon v-if="selected.includes(s.value)" name="fas:check" source="fa" :size="14" />
    </CListItem>
  </CList>

  <div class="d-flex flex-wrap items-center gap-2 mt-4">
    <span
      v-for="s in selected"
      :key="s"
      class="radius-pill bg-teal text-white px-3 py-1 fs-xs fw-semi-bold text-capitalize"
    >
      {{ s }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>(['frontend', 'design'])
const skills = [
  { value: 'design', label: 'Design', icon: 'fas:pen' },
  { value: 'frontend', label: 'Frontend', icon: 'fas:code' },
  { value: 'backend', label: 'Backend', icon: 'fas:box' },
  { value: 'devops', label: 'DevOps', icon: 'fas:cog' },
  { value: 'qa', label: 'QA', icon: 'fas:shield-alt' },
]
</script>
```

:::

В множественном `listbox` с клавиатуры также доступно:

- `Shift` + `ArrowUp` / `ArrowDown` — расширение выбора по диапазону.
- `Ctrl` / `Cmd` + `A` — выбор всех доступных элементов.

## Насыщенные элементы

`CListItem` раскладывает свой default-слот в виде flex-**ряда**, поэтому иконки, текст и завершающий контент можно свободно комбинировать. В библиотеке есть вспомогательные компоненты для единообразной структуры и типографики:

- `CListItemIcon` — слот для ведущей/завершающей иконки.
- `CListItemContent` — обёртка-колонка, стекающая заголовок и подзаголовок.
- `CListItemTitle` / `CListItemSubtitle` — основной и вторичный текст.

<RichItemsExample />

::: details Показать код

```vue
<template>
  <CCard class="elevation-3 radius-16" style="width:340px;overflow:hidden">
    <CList v-model="selected" variant="listbox" mandatory class="pa-2">
      <CListItem v-for="f in folders" :key="f.value" :value="f.value" class="px-3 py-2 radius-8">
        <span
          class="d-inline-flex items-center justify-center radius-circle text-white"
          :class="f.bg"
          style="width:38px;height:38px;flex-shrink:0"
        >
          <CIcon :name="f.icon" source="fa" :size="15" />
        </span>
        <CListItemContent>
          <CListItemTitle class="fw-medium">{{ f.title }}</CListItemTitle>
          <CListItemSubtitle>{{ f.subtitle }}</CListItemSubtitle>
        </CListItemContent>
        <span
          v-if="f.badge"
          class="badge fs-xs fw-semi-bold"
          :class="selected === f.value ? 'badge--active' : 'bg-pink text-white'"
        >
          {{ f.badge }}
        </span>
      </CListItem>
    </CList>
  </CCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('inbox')
const folders = [
  {
    value: 'inbox',
    icon: 'fas:envelope',
    bg: 'bg-indigo',
    title: 'Inbox',
    subtitle: '12 unread messages',
    badge: '12',
  },
  {
    value: 'starred',
    icon: 'fas:star',
    bg: 'bg-amber',
    title: 'Starred',
    subtitle: '3 conversations',
    badge: '3',
  },
  {
    value: 'sent',
    icon: 'fas:share-alt',
    bg: 'bg-teal',
    title: 'Sent',
    subtitle: 'Last sent 2h ago',
    badge: '',
  },
  {
    value: 'trash',
    icon: 'fas:trash',
    bg: 'bg-blue-grey',
    title: 'Trash',
    subtitle: 'Empty',
    badge: '',
  },
]
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
/* На выделенном (primary) ряду бейдж инвертируется: surface-фон + primary-текст */
.badge--active {
  background: var(--c-app-on-primary-color);
  color: var(--c-app-primary-color);
}
</style>
```

:::

## Вариант menu

Используйте `variant="menu"` для списков действий. Элементы рендерятся как `menuitem`, не имеют состояния выбора, а `Enter` / `Space` вызывают нативный `click` вместо переключения значения.

<MenuExample />

::: details Показать код

```vue
<template>
  <CCard class="elevation-4 radius-12" style="width:250px;overflow:hidden">
    <CList variant="menu" class="pa-2">
      <CListItem
        v-for="a in actions"
        :key="a.value"
        :value="a.value"
        class="px-3 py-2 radius-8"
        @click="last = a.label"
      >
        <CListItemIcon>
          <CIcon :name="a.icon" source="fa" :size="14" class="text-blue-grey" />
        </CListItemIcon>
        <span class="grow-1 fw-medium">{{ a.label }}</span>
        <span class="kbd fs-xs fw-medium">{{ a.kb }}</span>
      </CListItem>

      <div class="divider my-1 mx-2" />

      <CListItem
        value="delete"
        class="px-3 py-2 radius-8 text-deep-orange"
        @click="last = 'Delete'"
      >
        <CListItemIcon>
          <CIcon name="fas:trash" source="fa" :size="14" />
        </CListItemIcon>
        <span class="grow-1 fw-medium">Delete</span>
      </CListItem>
    </CList>
  </CCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const last = ref('')
const actions = [
  { value: 'copy', icon: 'fas:copy', label: 'Copy', kb: '⌘C' },
  { value: 'cut', icon: 'fas:cut', label: 'Cut', kb: '⌘X' },
  { value: 'paste', icon: 'fas:paste', label: 'Paste', kb: '⌘V' },
  { value: 'rename', icon: 'fas:pen', label: 'Rename…', kb: 'F2' },
]
</script>

<style scoped>
.kbd {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  background: color-mix(in srgb, currentColor 12%, transparent);
}
.divider {
  height: 1px;
  background: var(--c-app-border-color, rgba(0, 0, 0, 0.1));
}
</style>
```

:::

## Сравнение значений-объектов

По умолчанию значения сравниваются по ссылке (через `toRaw`) — этого достаточно для примитивов и стабильных ссылок на объекты. Если значения — это объекты из разных источников (например, повторно полученные из API), передайте `item-key`, чтобы сравнивать их по полю или по функции.

В демо ниже начальный выбор — это **другая ссылка на объект**, чем элемент в списке; именно `item-key="id"` заставляет их совпасть и отрисоваться выбранными.

<ObjectValuesExample />

::: details Показать код

```vue
<template>
  <CCard class="elevation-3 radius-16" style="width:360px;overflow:hidden">
    <CList v-model="selected" variant="listbox" item-key="id" multiple class="pa-2">
      <CListItem v-for="u in users" :key="u.id" :value="u" class="px-3 py-2 radius-8">
        <span
          class="d-inline-flex items-center justify-center radius-circle text-white fs-sm fw-semi-bold"
          :class="u.bg"
          style="width:38px;height:38px;flex-shrink:0"
        >
          {{ u.initials }}
        </span>
        <CListItemContent>
          <CListItemTitle class="fw-medium">{{ u.name }}</CListItemTitle>
          <CListItemSubtitle>{{ u.role }}</CListItemSubtitle>
        </CListItemContent>
        <CIcon v-if="selectedIds.includes(u.id)" name="fas:check" source="fa" :size="15" />
      </CListItem>
    </CList>
  </CCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type User = { id: number; name: string; role: string; initials: string; bg: string }

const users: User[] = [
  { id: 1, name: 'Anna Smith', role: 'Product Designer', initials: 'AS', bg: 'bg-pink' },
  { id: 2, name: 'Boris Lee', role: 'Software Engineer', initials: 'BL', bg: 'bg-indigo' },
  { id: 3, name: 'Clara Diaz', role: 'Product Manager', initials: 'CD', bg: 'bg-teal' },
  { id: 4, name: 'Dmitri Orlov', role: 'QA Engineer', initials: 'DO', bg: 'bg-deep-orange' },
]

// Другая ссылка на объект, чем элемент списка — совпадение даёт item-key="id".
const selected = ref<User[]>([{ ...users[1] }])
const selectedIds = computed(() => selected.value.map((u) => u.id))
</script>
```

:::

`item-key` также принимает функцию:

```vue
<CList v-model="selected" variant="listbox" :item-key="(item) => item.id">
  <!-- ... -->
</CList>
```

## Обязательный выбор

С `mandatory` текущий выбранный элемент нельзя снять. В режиме `multiple` нельзя удалить последний оставшийся элемент.

```vue
<CList v-model="tab" variant="listbox" mandatory>
  <CListItem value="tab1">Tab 1</CListItem>
  <CListItem value="tab2">Tab 2</CListItem>
</CList>
```

## Readonly и disabled

`readonly` сохраняет текущий выбор видимым, но блокирует любые изменения. `disabled` дополнительно приглушает список и убирает его из таб-порядка. Отдельные элементы можно отключить пропом `disabled` — они сохраняют ARIA-контракт, но пропускаются при выборе, наведении, клике и навигации с клавиатуры.

```vue
<CList v-model="selected" variant="listbox" readonly>
  <CListItem value="a">Option A</CListItem>
  <CListItem value="b">Option B</CListItem>
</CList>

<CList v-model="selected" variant="listbox">
  <CListItem value="a">Available</CListItem>
  <CListItem value="b" disabled>Sold out</CListItem>
  <CListItem value="c">Available</CListItem>
</CList>
```

## Навигация с клавиатуры

Когда `variant` равен `listbox` или `menu`, список входит в таб-порядок (`tabindex="0"`) и может быть сфокусирован напрямую. Также его можно сфокусировать программно через метод `focus()`.

| Клавиша                 | Действие                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Переместить активный элемент                                           |
| `Home` / `End`          | Перейти к первому / последнему доступному элементу                     |
| `Enter` / `Space`       | Активировать текущий элемент (переключение в `listbox`, клик в `menu`) |
| `Shift` + `Arrow`       | Расширить выбор (множественный `listbox`)                              |
| `Ctrl` / `Cmd` + `A`    | Выбрать все доступные элементы (множественный `listbox`)               |
| Ввод символов           | Typeahead — фокус на первый подходящий доступный элемент               |

```vue
<template>
  <CList ref="listRef" variant="menu">
    <CListItem value="cut">Cut</CListItem>
    <CListItem value="copy">Copy</CListItem>
    <CListItem value="paste">Paste</CListItem>
  </CList>
  <CBtn @click="listRef?.focus()">Focus menu</CBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const listRef = ref()
</script>
```

## Кастомный рендеринг

Дефолтный слот предоставляет `select`, `unselect` и `isActive`, так что выбор можно отрисовать любыми компонентами вместо `CListItem`.

```vue
<template>
  <CList v-model="selected" variant="listbox">
    <template #default="{ select, unselect, isActive }">
      <CChip
        v-for="item in items"
        :key="item"
        :class="{ 'is-active': isActive(item) }"
        @click="isActive(item) ? unselect(item) : select(item)"
      >
        {{ item }}
      </CChip>
    </template>
  </CList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const items = ['one', 'two', 'three']
const selected = ref<string | null>(null)
</script>
```

---

## API

### Пропы CList

| Проп         | Тип                                 | По умолчанию | Описание                                                                          |
| ------------ | ----------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `modelValue` | `T \| T[] \| null`                  | `null`       | Текущее выбранное значение(я)                                                     |
| `variant`    | `'list' \| 'listbox' \| 'menu'`     | `'list'`     | Режим взаимодействия и ARIA                                                       |
| `multiple`   | `boolean`                           | `false`      | Разрешить выбор нескольких элементов (только `listbox`)                           |
| `mandatory`  | `boolean`                           | `false`      | Запретить снятие текущего элемента (в `multiple` — запретить удаление последнего) |
| `readonly`   | `boolean`                           | `false`      | Заблокировать изменения выбора                                                    |
| `disabled`   | `boolean`                           | `false`      | Отключить весь список и убрать его из таб-порядка                                 |
| `item-key`   | `keyof T \| ((item: T) => unknown)` | —            | Как сравнивать значения: имя поля или функция. По умолчанию — сравнение по ссылке |

### События CList

| Событие             | Аргументы          | Описание                         |
| ------------------- | ------------------ | -------------------------------- |
| `update:modelValue` | `T \| T[] \| null` | Срабатывает при изменении выбора |

### Слоты CList

| Слот      | Пропы                            | Описание          |
| --------- | -------------------------------- | ----------------- |
| `default` | `{ select, unselect, isActive }` | Содержимое списка |

#### Пропы слота `default`

| Проп       | Тип                    | Описание                       |
| ---------- | ---------------------- | ------------------------------ |
| `select`   | `(item: T) => void`    | Отметить элемент как выбранный |
| `unselect` | `(item: T) => void`    | Удалить элемент из выбора      |
| `isActive` | `(item: T) => boolean` | Проверить, выбран ли элемент   |

### Expose CList

| Метод                            | Сигнатура    | Описание                                                       |
| -------------------------------- | ------------ | -------------------------------------------------------------- |
| `focus`                          | `() => void` | Программно сфокусировать список (только в `listbox` / `menu`)  |
| `navigateFirst` / `navigateLast` | `() => void` | Переместить активный элемент к первому / последнему доступному |
| `navigateUp` / `navigateDown`    | `() => void` | Переместить активный элемент вверх / вниз                      |
| `activateCurrentItem`            | `() => void` | Активировать текущий сфокусированный элемент                   |

### Пропы CListItem

| Проп       | Тип       | По умолчанию | Описание                        |
| ---------- | --------- | ------------ | ------------------------------- |
| `value`    | `T`       | —            | Значение, связанное с элементом |
| `disabled` | `boolean` | `false`      | Отключить этот элемент          |

### События CListItem

| Событие    | Аргументы    | Описание                                |
| ---------- | ------------ | --------------------------------------- |
| `active`   | `id: string` | Элемент стал активным (фокус/наведение) |
| `inactive` | `id: string` | Элемент перестал быть активным          |

### Слоты CListItem

| Слот      | Описание                                                                  |
| --------- | ------------------------------------------------------------------------- |
| `default` | Содержимое элемента, раскладывается как flex-ряд (по умолчанию — `value`) |

### Вспомогательные компоненты

| Компонент           | Рендерит                             | Назначение                                          |
| ------------------- | ------------------------------------ | --------------------------------------------------- |
| `CListItemIcon`     | `<div class="c-list-item-icon">`     | Обёртка для ведущей/завершающей иконки              |
| `CListItemContent`  | `<div class="c-list-item-content">`  | Обёртка-колонка, стекающая заголовок и подзаголовок |
| `CListItemTitle`    | `<div class="c-list-item-title">`    | Основной текст элемента                             |
| `CListItemSubtitle` | `<div class="c-list-item-subtitle">` | Вторичный текст элемента                            |

### Доступность

| Атрибут                | Условие                                            | Значение                  |
| ---------------------- | -------------------------------------------------- | ------------------------- |
| `role` (список)        | `variant="listbox"` / `"menu"`                     | `"listbox"` / `"menu"`    |
| `role` (элемент)       | внутри управляемого списка                         | `"option"` / `"menuitem"` |
| `aria-multiselectable` | `listbox` + `multiple`                             | `"true"`                  |
| `aria-selected`        | элементы `listbox`                                 | `"true"` / `"false"`      |
| `aria-disabled`        | `disabled` список или элемент в управляемом списке | `"true"`                  |
| `tabindex` (список)    | `listbox` / `menu`, не disabled                    | `0`                       |

### CSS-переменные

`CList`:

| Переменная                  | По умолчанию                         |
| --------------------------- | ------------------------------------ |
| `--c-list-bg-color`         | `var(--c-app-surface-color)`         |
| `--c-list-color`            | `var(--c-app-text-color)`            |
| `--c-list-border-radius`    | `var(--c-app-border-radius)`         |
| `--c-list-padding-block`    | `0`                                  |
| `--c-list-padding-inline`   | `0`                                  |
| `--c-list-disabled-opacity` | `var(--c-app-disabled-opacity, 0.5)` |

`CListItem`:

| Переменная                           | По умолчанию                         |
| ------------------------------------ | ------------------------------------ |
| `--c-list-item-min-height`           | `36px`                               |
| `--c-list-item-padding-block`        | `4px`                                |
| `--c-list-item-padding-inline`       | `8px`                                |
| `--c-list-item-gap`                  | `12px`                               |
| `--c-list-item-border-radius`        | `0`                                  |
| `--c-list-item-color`                | `currentColor`                       |
| `--c-list-item-bg-color`             | `transparent`                        |
| `--c-list-item-selected-bg-color`    | `var(--c-app-primary-color)`         |
| `--c-list-item-selected-color`       | `var(--c-app-on-primary-color)`      |
| `--c-list-item-hover-bg-color`       | `var(--c-app-primary-color)`         |
| `--c-list-item-disabled-opacity`     | `var(--c-app-disabled-opacity, 0.5)` |
| `--c-list-item-disabled-color`       | `var(--c-app-disabled-color)`        |
| `--c-list-item-title-font-size`      | `1rem`                               |
| `--c-list-item-title-line-height`    | `1.25rem`                            |
| `--c-list-item-title-font-weight`    | `400`                                |
| `--c-list-item-subtitle-font-size`   | `0.8rem`                             |
| `--c-list-item-subtitle-line-height` | `1rem`                               |
| `--c-list-item-subtitle-color`       | `currentColor`                       |
| `--c-list-item-subtitle-opacity`     | `0.6`                                |
