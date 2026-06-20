# CList

`CList` — универсальный контейнер списка с поддержкой одиночного и множественного выбора, клавиатурной навигации, режима readonly и ARIA-ролей. Работает совместно с `CListItem` через provide/inject.

## Базовое использование

```vue
<template>
  <CList v-model="selected" selectable>
    <CListItem value="apple">Яблоко</CListItem>
    <CListItem value="banana">Банан</CListItem>
    <CListItem value="cherry">Вишня</CListItem>
  </CList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selected = ref<string | null>(null)
</script>
```

## Множественный выбор

```vue
<template>
  <CList v-model="selected" selectable multiple>
    <CListItem value="vue">Vue</CListItem>
    <CListItem value="react">React</CListItem>
    <CListItem value="angular">Angular</CListItem>
  </CList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selected = ref<string[]>([])
</script>
```

## Обязательный выбор (mandatory)

При `mandatory` нельзя снять выбор с текущего элемента. В режиме `multiple` нельзя убрать последний оставшийся выбранный элемент.

```vue
<CList v-model="tab" selectable mandatory>
  <CListItem value="tab1">Вкладка 1</CListItem>
  <CListItem value="tab2">Вкладка 2</CListItem>
</CList>
```

## Readonly

```vue
<CList v-model="selected" selectable readonly>
  <CListItem value="a">Вариант А</CListItem>
  <CListItem value="b">Вариант Б</CListItem>
</CList>
```

## Клавиатурная навигация

Когда `CList` получает фокус (через `focus()` или нативно), клавиши `ArrowDown` / `ArrowUp` перемещают фокус между элементами.

```vue
<template>
  <CList ref="listRef" selectable role="menu">
    <CListItem value="cut">Вырезать</CListItem>
    <CListItem value="copy">Копировать</CListItem>
    <CListItem value="paste">Вставить</CListItem>
  </CList>
  <button @click="listRef?.focus()">Открыть меню</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const listRef = ref()
</script>
```

## Кастомный слот

Дефолтный слот предоставляет `select`, `unselect` и `isActive` для полностью кастомного рендеринга элементов.

```vue
<CList v-model="selected" selectable>
  <template #default="{ select, unselect, isActive }">
    <li
      v-for="item in items"
      :key="item"
      :class="{ active: isActive(item) }"
      @click="isActive(item) ? unselect(item) : select(item)"
    >
      {{ item }}
    </li>
  </template>
</CList>
```

---

## API

### Пропсы

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `modelValue` | `T \| T[] \| null` | `null` | Текущее выбранное значение (или массив) |
| `multiple` | `boolean` | `false` | Разрешить выбор нескольких элементов |
| `mandatory` | `boolean` | `false` | Запретить снятие выбора (в `multiple`: нельзя убрать последний) |
| `readonly` | `boolean` | `false` | Отключить изменение выбора |
| `selectable` | `boolean` | `false` | Включить режим выбора и автоматически установить `role="listbox"` |
| `role` | `'listbox' \| 'menu' \| undefined` | — | Явная ARIA-роль (переопределяет значение по умолчанию от `selectable`) |

### Слоты

| Слот | Пропсы | Описание |
|------|--------|----------|
| `default` | `{ select, unselect, isActive }` | Содержимое списка |

#### Пропсы слота `default`

| Проп | Тип | Описание |
|------|-----|----------|
| `select` | `(item: T) => void` | Выбрать элемент |
| `unselect` | `(item: T) => void` | Убрать элемент из выбора |
| `isActive` | `(item: T) => boolean` | Проверить, выбран ли элемент |

### События

| Событие | Аргументы | Описание |
|---------|-----------|----------|
| `update:modelValue` | `T \| T[] \| null` | Эмитится при изменении выбора |

### Expose

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `focus` | `() => void` | Программно сфокусировать список и включить клавиатурную навигацию |

### Доступность

| Атрибут | Условие | Значение |
|---------|---------|----------|
| `role` | `selectable` или передан проп `role` | `"listbox"` / `"menu"` |
| `aria-multiselectable` | всегда | `"true"` если `multiple`, иначе `"false"` |
| `tabindex` | `selectable` или role-based | `-1` (фокусируется через `focus()`) |
