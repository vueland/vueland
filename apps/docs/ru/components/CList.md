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

| `variant`             | Роль             | Поведение                                                                                            |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `list` (по умолчанию) | —                | Обычный неинтерактивный список. Элементы не регистрируются и не выбираются.                          |
| `listbox`             | `role="listbox"` | Выбираемые опции с полной поддержкой клавиатуры (элементы `option`, `aria-selected`).                |
| `menu`                | `role="menu"`    | Поведение выбора как у `listbox`; отличается только ARIA (элементы `menuitem`, без `aria-selected`). |

## Обычный список

С `variant="list"` (значение по умолчанию) список не интерактивен: элементы не регистрируются, не выбираются и не участвуют в навигации с клавиатуры. Это удобно для статичного вывода информации, где `CListItem` и вспомогательные компоненты используются только ради раскладки и типографики.

<PlainListExample />

::: details Показать код

```vue
<template>
  <c-card class="elevation-3 radius-16" style="width:360px;overflow:hidden">
    <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
      Contact details
    </div>
    <c-list class="pa-2">
      <c-list-item v-for="d in details" :key="d.label" class="px-3 py-2">
        <c-list-item-icon>
          <c-icon :name="d.icon" source="fa" :size="14" class="text-blue-grey" />
        </c-list-item-icon>
        <c-list-item-content>
          <c-list-item-subtitle>{{ d.label }}</c-list-item-subtitle>
          <c-list-item-title class="fw-medium">{{ d.value }}</c-list-item-title>
        </c-list-item-content>
      </c-list-item>
    </c-list>
  </c-card>
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
  <c-card class="elevation-3 radius-16" style="width:300px;overflow:hidden">
    <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
      Display density
    </div>
    <c-list v-model="selected" variant="listbox" mandatory class="pa-2">
      <c-list-item
        v-for="d in densities"
        :key="d.value"
        :value="d.value"
        class="px-3 py-2 radius-8"
      >
        <c-list-item-content>
          <c-list-item-title class="fw-medium">{{ d.label }}</c-list-item-title>
          <c-list-item-subtitle>{{ d.hint }}</c-list-item-subtitle>
        </c-list-item-content>
        <c-icon v-if="selected === d.value" name="fas:check" source="fa" :size="14" />
      </c-list-item>
    </c-list>
  </c-card>
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
  <c-list v-model="selected" variant="listbox" multiple class="pa-2">
    <c-list-item v-for="s in skills" :key="s.value" :value="s.value" class="px-3 py-2 radius-8">
      <c-list-item-icon>
        <c-icon :name="s.icon" source="fa" :size="14" />
      </c-list-item-icon>
      <span class="grow-1 fw-medium">{{ s.label }}</span>
      <c-icon v-if="selected.includes(s.value)" name="fas:check" source="fa" :size="14" />
    </c-list-item>
  </c-list>

  <c-row class="gap-y-2 mt-4" align="center">
    <c-col v-for="s in selected" :key="s" cols="6" class="d-flex justify-center">
      <span class="radius-pill bg-teal text-white px-3 py-1 fs-xs fw-semi-bold text-capitalize">
        {{ s }}
      </span>
    </c-col>
  </c-row>
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

`multiple` не ограничен `listbox` — работает в любом интерактивном `variant`.

## Насыщенные элементы

`CListItem` раскладывает свой default-слот в виде flex-**ряда**, поэтому иконки, текст и завершающий контент можно свободно комбинировать. В библиотеке есть вспомогательные компоненты для единообразной структуры и типографики:

- `CListItemIcon` — слот для ведущей/завершающей иконки.
- `CListItemContent` — обёртка-колонка, стекающая заголовок и подзаголовок.
- `CListItemTitle` / `CListItemSubtitle` — основной и вторичный текст.

<RichItemsExample />

::: details Показать код

```vue
<template>
  <c-card class="elevation-3 radius-16" style="width:340px;overflow:hidden">
    <c-list v-model="selected" variant="listbox" mandatory class="pa-2">
      <c-list-item v-for="f in folders" :key="f.value" :value="f.value" class="px-3 py-2 radius-8">
        <span
          class="d-inline-flex items-center justify-center radius-circle text-white"
          :class="f.bg"
          style="width:38px;height:38px;flex-shrink:0"
        >
          <c-icon :name="f.icon" source="fa" :size="15" />
        </span>
        <c-list-item-content>
          <c-list-item-title class="fw-medium">{{ f.title }}</c-list-item-title>
          <c-list-item-subtitle>{{ f.subtitle }}</c-list-item-subtitle>
        </c-list-item-content>
        <span
          v-if="f.badge"
          class="badge fs-xs fw-semi-bold"
          :class="selected === f.value ? 'badge--active' : 'bg-pink text-white'"
        >
          {{ f.badge }}
        </span>
      </c-list-item>
    </c-list>
  </c-card>
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
  background: var(--c-sys-color-on-primary);
  color: var(--c-sys-color-primary);
}
</style>
```

:::

## Вариант menu

Используйте `variant="menu"` для списков действий. Элементы рендерятся как `menuitem` (без `aria-selected`). `Enter` / `Space` и клик оба вызывают клик самого элемента — поэтому `@click` пункта меню срабатывает и с клавиатуры, а значение переключается как в `listbox`. Отличается только ARIA-роль.

<MenuExample />

::: details Показать код

```vue
<template>
  <c-card class="elevation-4 radius-12" style="width:250px;overflow:hidden">
    <c-list variant="menu" class="pa-2">
      <c-list-item
        v-for="a in actions"
        :key="a.value"
        :value="a.value"
        class="px-3 py-2 radius-8"
        @click="last = a.label"
      >
        <c-list-item-icon>
          <c-icon :name="a.icon" source="fa" :size="14" class="text-blue-grey" />
        </c-list-item-icon>
        <span class="grow-1 fw-medium">{{ a.label }}</span>
        <span class="kbd fs-xs fw-medium">{{ a.kb }}</span>
      </c-list-item>

      <div class="divider my-1 mx-2" />

      <c-list-item
        value="delete"
        class="px-3 py-2 radius-8 text-deep-orange"
        @click="last = 'Delete'"
      >
        <c-list-item-icon>
          <c-icon name="fas:trash" source="fa" :size="14" />
        </c-list-item-icon>
        <span class="grow-1 fw-medium">Delete</span>
      </c-list-item>
    </c-list>
  </c-card>
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
  background: var(--c-sys-color-surface-variant);
}
.divider {
  height: 1px;
  background: var(--c-sys-color-outline-variant, rgba(0, 0, 0, 0.1));
}
</style>
```

:::

## Сравнение значений-объектов

По умолчанию значения сравниваются по ссылке (через `toRaw`) — этого достаточно для примитивов и стабильных ссылок на объекты. Если значения — это объекты из разных источников (например, повторно полученные из API), передайте `item-key`, чтобы сравнивать их по полю или по функции.

`item-key` должен давать **уникальное** значение на элемент. Если у двух элементов ключ совпадает (например, объекты с неуникальным заголовком), они считаются одним значением — выбор одного отметит оба. Берите стабильное поле-id, а не отображаемое поле.

В демо ниже начальный выбор — это **другая ссылка на объект**, чем элемент в списке; именно `item-key="id"` заставляет их совпасть и отрисоваться выбранными.

<ObjectValuesExample />

::: details Показать код

```vue
<template>
  <c-card class="elevation-3 radius-16" style="width:360px;overflow:hidden">
    <c-list v-model="selected" variant="listbox" item-key="id" multiple class="pa-2">
      <c-list-item v-for="u in users" :key="u.id" :value="u" class="px-3 py-2 radius-8">
        <span
          class="d-inline-flex items-center justify-center radius-circle text-white fs-sm fw-semi-bold"
          :class="u.bg"
          style="width:38px;height:38px;flex-shrink:0"
        >
          {{ u.initials }}
        </span>
        <c-list-item-content>
          <c-list-item-title class="fw-medium">{{ u.name }}</c-list-item-title>
          <c-list-item-subtitle>{{ u.role }}</c-list-item-subtitle>
        </c-list-item-content>
        <c-icon v-if="selectedIds.includes(u.id)" name="fas:check" source="fa" :size="15" />
      </c-list-item>
    </c-list>
  </c-card>
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
<c-list v-model="selected" variant="listbox" :item-key="(item) => item.id">
  <!-- ... -->
</c-list>
```

## Обязательный выбор

С `mandatory` текущий выбранный элемент нельзя снять. В режиме `multiple` нельзя удалить последний оставшийся элемент.

```vue
<c-list v-model="tab" variant="listbox" mandatory>
  <c-list-item value="tab1">Tab 1</c-list-item>
  <c-list-item value="tab2">Tab 2</c-list-item>
</c-list>
```

## Readonly и disabled

`readonly` сохраняет текущий выбор видимым, но блокирует любые изменения. `disabled` дополнительно приглушает список и убирает его из таб-порядка. Отдельные элементы можно отключить пропом `disabled` — они сохраняют ARIA-контракт, но пропускаются при выборе, наведении, клике и навигации с клавиатуры.

```vue
<c-list v-model="selected" variant="listbox" readonly>
  <c-list-item value="a">Option A</c-list-item>
  <c-list-item value="b">Option B</c-list-item>
</c-list>

<c-list v-model="selected" variant="listbox">
  <c-list-item value="a">Available</c-list-item>
  <c-list-item value="b" disabled>Sold out</c-list-item>
  <c-list-item value="c">Available</c-list-item>
</c-list>
```

## Навигация с клавиатуры

Когда `variant` равен `listbox` или `menu`, список входит в таб-порядок (`tabindex="0"`) и может быть сфокусирован напрямую. Также его можно сфокусировать программно через метод `focus()`.

| Клавиша                 | Действие                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Переместить активный элемент (disabled пропускаются)                                         |
| `Home` / `End`          | Перейти к первому / последнему доступному элементу                                           |
| `Enter` / `Space`       | Активировать текущий элемент — вызывает его клик (выбор переключается, срабатывает `@click`) |
| Ввод символов           | Typeahead — фокус на первый подходящий доступный элемент                                     |

```vue
<template>
  <c-list ref="listRef" variant="menu">
    <c-list-item value="cut">Cut</c-list-item>
    <c-list-item value="copy">Copy</c-list-item>
    <c-list-item value="paste">Paste</c-list-item>
  </c-list>
  <c-btn @click="listRef?.focus()">Focus menu</c-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const listRef = ref()
</script>
```

## Кастомный рендеринг

Дефолтный слот привязан к **полному API списка** — тому самому контракту `ListAPI`, который `CListItem` использует внутри через inject. Отдельной «поверхности под слот» нет: слот отдаёт ровно то, чем компонент сам управляет выбором, поэтому элементы можно перерисовать любыми компонентами, сохранив поведение.

Для выбора достаточно `toggle` (или гранулярных `select` / `unselect`) и `isActive`:

```vue
<template>
  <c-list v-model="selected" variant="listbox">
    <template #default="{ toggle, isActive }">
      <c-chip
        v-for="item in items"
        :key="item"
        :class="{ 'is-active': isActive(item) }"
        @click="toggle(item)"
      >
        {{ item }}
      </c-chip>
    </template>
  </c-list>
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

| Проп         | Тип                                | По умолчанию | Описание                                                                          |
| ------------ | ---------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `modelValue` | `T \| T[] \| null`                 | `null`       | Текущее выбранное значение(я)                                                     |
| `variant`    | `'list' \| 'listbox' \| 'menu'`    | `'list'`     | Режим взаимодействия и ARIA                                                       |
| `multiple`   | `boolean`                          | `false`      | Собирать выбранные значения в массив (работает в любом интерактивном `variant`)   |
| `mandatory`  | `boolean`                          | `false`      | Запретить снятие текущего элемента (в `multiple` — запретить удаление последнего) |
| `readonly`   | `boolean`                          | `false`      | Заблокировать изменения выбора                                                    |
| `disabled`   | `boolean`                          | `false`      | Отключить весь список и убрать его из таб-порядка                                 |
| `item-key`   | `string \| ((item: T) => unknown)` | —            | Как сравнивать значения: имя поля или функция. По умолчанию — сравнение по ссылке |

### События CList

| Событие             | Аргументы          | Описание                         |
| ------------------- | ------------------ | -------------------------------- |
| `update:modelValue` | `T \| T[] \| null` | Срабатывает при изменении выбора |

### Слоты CList

| Слот      | Пропы        | Описание          |
| --------- | ------------ | ----------------- |
| `default` | `ListAPI<T>` | Содержимое списка |

#### Пропы слота `default`

Слот получает весь `ListAPI<T>` — тот же объект, что провайдится в `CListItem` через inject. Методы выбора:

| Проп       | Тип                                | Описание                                                                                               |
| ---------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `toggle`   | `(item: T) => void`                | Выбрать элемент или снять выбор, если он уже выбран — тот же примитив, что компонент использует внутри |
| `select`   | `(item: T) => void`                | Отметить элемент как выбранный                                                                         |
| `unselect` | `(item: T) => void`                | Удалить элемент из выбора                                                                              |
| `isActive` | `(item: T) => boolean`             | Проверить, выбран ли элемент                                                                           |
| `role`     | `'listbox' \| 'menu' \| undefined` | Текущий режим взаимодействия                                                                           |

Чтобы пересобрать `CListItem` с нуля, тот же объект отдаёт ещё `registerItem` / `unregisterItem`, чтобы клавиатурная навигация находила ваши элементы. Оба принимают контроллер `ListItem`.

### Expose CList

| Метод                            | Сигнатура                    | Описание                                                                           |
| -------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `focus`                          | `() => void`                 | Программно сфокусировать список (только в `listbox` / `menu`)                      |
| `navigateFirst` / `navigateLast` | `() => void`                 | Переместить активный элемент к первому / последнему доступному                     |
| `navigateUp` / `navigateDown`    | `() => void`                 | Переместить активный элемент вверх / вниз                                          |
| `activateItem`                   | `() => void`                 | Вызвать клик сфокусированного элемента (выбор переключается, срабатывает `@click`) |
| `onKeydown`                      | `(e: KeyboardEvent) => void` | Передать событие клавиатуры обработчику списка (управление из родителя)            |

### Пропы CListItem

| Проп       | Тип       | По умолчанию | Описание                        |
| ---------- | --------- | ------------ | ------------------------------- |
| `value`    | `T`       | —            | Значение, связанное с элементом |
| `disabled` | `boolean` | `false`      | Отключить этот элемент          |

### События CListItem

| Событие    | Аргументы    | Описание                                   |
| ---------- | ------------ | ------------------------------------------ |
| `active`   | `id: string` | Элемент стал активным (фокус с клавиатуры) |
| `inactive` | `id: string` | Элемент перестал быть активным             |

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

| Переменная                  | По умолчанию                          |
| --------------------------- | ------------------------------------- |
| `--c-list-bg-color`         | `var(--c-sys-color-surface)`          |
| `--c-list-color`            | `var(--c-sys-color-on-surface)`       |
| `--c-list-border-radius`    | `var(--c-sys-shape-md)`               |
| `--c-list-padding-block`    | `0`                                   |
| `--c-list-padding-inline`   | `0`                                   |
| `--c-list-disabled-opacity` | `var(--c-sys-state-disabled-opacity)` |

`CListItem`:

| Переменная                           | По умолчанию                                |
| ------------------------------------ | ------------------------------------------- |
| `--c-list-item-min-height`           | `var(--c-sys-control-height-sm)`            |
| `--c-list-item-padding-block`        | `var(--c-sys-space-1)`                      |
| `--c-list-item-padding-inline`       | `var(--c-sys-space-2)`                      |
| `--c-list-item-gap`                  | `var(--c-sys-space-3)`                      |
| `--c-list-item-border-radius`        | `var(--c-sys-shape-none)`                   |
| `--c-list-item-color`                | `currentColor`                              |
| `--c-list-item-bg-color`             | `transparent`                               |
| `--c-list-item-selected-bg-color`    | `var(--c-sys-color-secondary-container)`    |
| `--c-list-item-selected-color`       | `var(--c-sys-color-primary)`                |
| `--c-list-item-state-layer-color`    | `transparent`                               |
| `--c-list-item-hover-bg-color`       | `var(--c-sys-state-hover-color)`            |
| `--c-list-item-focus-bg-color`       | `var(--c-sys-state-focus-color)`            |
| `--c-list-item-pressed-bg-color`     | `var(--c-sys-state-pressed-color)`          |
| `--c-list-item-focus-ring-color`     | `var(--c-sys-color-focus-ring)`             |
| `--c-list-item-disabled-opacity`     | `var(--c-sys-state-disabled-opacity)`       |
| `--c-list-item-disabled-color`       | `var(--c-sys-color-disabled)`               |
| `--c-list-item-dragged-opacity`      | `var(--c-sys-state-dragged-opacity)`        |
| `--c-list-item-title-font-size`      | `var(--c-sys-typography-body-size)`         |
| `--c-list-item-title-line-height`    | `var(--c-sys-typography-label-line-height)` |
| `--c-list-item-title-font-weight`    | `400`                                       |
| `--c-list-item-subtitle-font-size`   | `var(--c-sys-typography-label-size)`        |
| `--c-list-item-subtitle-line-height` | `var(--c-sys-typography-label-line-height)` |
| `--c-list-item-subtitle-color`       | `var(--c-sys-color-on-surface-variant)`     |
| `--c-list-item-subtitle-opacity`     | `0.6`                                       |
