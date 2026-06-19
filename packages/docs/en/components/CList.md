# CList

`CList` is a generic list container that supports single and multiple selection, keyboard navigation, readonly mode, and ARIA roles. It works together with `CListItem` via provide/inject.

## Basic usage

```vue
<template>
  <CList v-model="selected" selectable>
    <CListItem value="apple">Apple</CListItem>
    <CListItem value="banana">Banana</CListItem>
    <CListItem value="cherry">Cherry</CListItem>
  </CList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selected = ref<string | null>(null)
</script>
```

## Multiple selection

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

## Mandatory selection

With `mandatory`, the currently selected item cannot be deselected. In `multiple` mode, the last remaining item cannot be removed.

```vue
<CList v-model="tab" selectable mandatory>
  <CListItem value="tab1">Tab 1</CListItem>
  <CListItem value="tab2">Tab 2</CListItem>
</CList>
```

## Readonly

```vue
<CList v-model="selected" selectable readonly>
  <CListItem value="a">Option A</CListItem>
  <CListItem value="b">Option B</CListItem>
</CList>
```

## Keyboard navigation

When `CList` is focused (via `focus()` or by receiving keyboard focus), `ArrowDown` / `ArrowUp` move focus between items.

```vue
<template>
  <CList ref="listRef" selectable role="menu">
    <CListItem value="cut">Cut</CListItem>
    <CListItem value="copy">Copy</CListItem>
    <CListItem value="paste">Paste</CListItem>
  </CList>
  <button @click="listRef?.focus()">Open menu</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const listRef = ref()
</script>
```

## Custom slot

The default slot exposes `select`, `unselect`, and `isActive` for fully custom item rendering.

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

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T \| T[] \| null` | `null` | Currently selected value(s) |
| `multiple` | `boolean` | `false` | Allow multiple items to be selected |
| `mandatory` | `boolean` | `false` | Prevent deselecting the current item (in `multiple` mode: prevent removing the last item) |
| `readonly` | `boolean` | `false` | Disable selection changes |
| `selectable` | `boolean` | `false` | Enable selection behaviour and sets `role="listbox"` automatically |
| `role` | `'listbox' \| 'menu' \| undefined` | — | Explicit ARIA role (overrides the `selectable` default) |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ select, unselect, isActive }` | List content |

#### `default` slot props

| Prop | Type | Description |
|------|------|-------------|
| `select` | `(item: T) => void` | Mark an item as selected |
| `unselect` | `(item: T) => void` | Remove an item from the selection |
| `isActive` | `(item: T) => boolean` | Check if an item is currently selected |

### Events

| Event | Arguments | Description |
|-------|-----------|-------------|
| `update:modelValue` | `T \| T[] \| null` | Emitted when the selection changes |

### Expose

| Method | Signature | Description |
|--------|-----------|-------------|
| `focus` | `() => void` | Programmatically focus the list and enable keyboard navigation |

### Accessibility

| Attribute | Condition | Value |
|-----------|-----------|-------|
| `role` | `selectable` or `role` prop set | `"listbox"` / `"menu"` |
| `aria-multiselectable` | always | `"true"` when `multiple`, `"false"` otherwise |
| `tabindex` | `selectable` or role-based | `-1` (focusable by `focus()`) |
