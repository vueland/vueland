# CList

`CList` is a generic list container that supports single and multiple selection, keyboard navigation, typeahead, readonly/disabled states and ARIA roles. It works together with `CListItem` via provide/inject.

<script setup>
import PlainListExample from '../../examples/CList/PlainListExample.vue'
import BasicExample from '../../examples/CList/BasicExample.vue'
import MultipleExample from '../../examples/CList/MultipleExample.vue'
import RichItemsExample from '../../examples/CList/RichItemsExample.vue'
import MenuExample from '../../examples/CList/MenuExample.vue'
import ObjectValuesExample from '../../examples/CList/ObjectValuesExample.vue'
</script>

The interaction model is driven by the `variant` prop:

| `variant`        | Role             | Behaviour                                                                                        |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| `list` (default) | —                | Plain, non-interactive list. Items are not registered and not selectable.                        |
| `listbox`        | `role="listbox"` | Selectable options with full keyboard support (`option` items, `aria-selected`).                 |
| `menu`           | `role="menu"`    | Same selection behaviour as `listbox`; only ARIA differs (`menuitem` items, no `aria-selected`). |

## Plain list

With `variant="list"` (the default) the list is non-interactive: items are not registered, not selectable and stay out of keyboard navigation. This is handy for static information display, where `CListItem` and the helper components are used purely for layout and typography.

<PlainListExample />

::: details Show code

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

## Basic usage

Use `variant="listbox"` to make items selectable and bind the selection with `v-model`.

<BasicExample />

::: details Show code

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

## Multiple selection

Add `multiple` to collect values into an array.

<MultipleExample />

::: details Show code

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

`multiple` is not limited to `listbox` — it works in any interactive `variant`.

## Rich items

`CListItem` lays out its default slot as a flex **row**, so you can freely compose icons, text and trailing content. The library ships helper components for consistent structure and typography:

- `CListItemIcon` — a leading/trailing icon slot.
- `CListItemContent` — a column wrapper that stacks the title and subtitle.
- `CListItemTitle` / `CListItemSubtitle` — primary and secondary text.

<RichItemsExample />

::: details Show code

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
/* On a selected (primary) row the badge inverts: surface bg + primary text */
.badge--active {
  background: var(--c-sys-color-on-primary);
  color: var(--c-sys-color-primary);
}
</style>
```

:::

## Menu variant

Use `variant="menu"` for action lists. Items render as `menuitem` (no `aria-selected`). `Enter` / `Space` and click both trigger the item's own click — so a menu item's `@click` runs from the keyboard too, and the value toggles just like in `listbox`. Only the ARIA role differs.

<MenuExample />

::: details Show code

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

## Comparing object values

By default values are matched by reference (via `toRaw`), which is enough for primitives and stable object references. When your values are objects coming from different sources (e.g. re-fetched from an API), pass `item-key` to compare them by a field or a custom function.

`item-key` must resolve to a **unique** value per item. If two items share the same key (e.g. objects with a non-unique title), they are treated as the same value — selecting one marks both. Prefer a stable id field over a display field.

In the demo below, the initial selection is a **different object reference** than the one in the list — `item-key="id"` is what makes it match and render as selected.

<ObjectValuesExample />

::: details Show code

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

// Different object reference than the list entry — item-key="id" makes it match.
const selected = ref<User[]>([{ ...users[1] }])
const selectedIds = computed(() => selected.value.map((u) => u.id))
</script>
```

:::

`item-key` also accepts a function:

```vue
<c-list v-model="selected" variant="listbox" :item-key="(item) => item.id">
  <!-- ... -->
</c-list>
```

## Mandatory selection

With `mandatory`, the currently selected item cannot be deselected. In `multiple` mode, the last remaining item cannot be removed.

```vue
<c-list v-model="tab" variant="listbox" mandatory>
  <c-list-item value="tab1">Tab 1</c-list-item>
  <c-list-item value="tab2">Tab 2</c-list-item>
</c-list>
```

## Readonly and disabled

`readonly` keeps the current selection visible but blocks any changes. `disabled` additionally dims the list and removes it from the tab order. Individual items can be disabled with the `disabled` prop — they keep their ARIA contract but are skipped by selection, hover, click and keyboard navigation.

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

## Keyboard navigation

When `variant` is `listbox` or `menu`, the list is part of the tab order (`tabindex="0"`) and can be focused directly. It can also be focused programmatically via the exposed `focus()` method.

| Key                     | Action                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active item (disabled items are skipped)                                  |
| `Home` / `End`          | Jump to the first / last enabled item                                              |
| `Enter` / `Space`       | Activate the current item — fires its click (selection toggles, its `@click` runs) |
| Type characters         | Typeahead — focus the first matching enabled item                                  |

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

## Custom rendering

The default slot is bound to the **full list API** — the very same `ListAPI` contract that `CListItem` consumes internally via inject. There is no separate "slot-only" surface: whatever the component uses to drive selection is exactly what the slot hands you, so you can re-render items with any components and keep the behaviour.

For selection you only need `toggle` (or the granular `select` / `unselect`) and `isActive`:

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

### CList props

| Prop         | Type                               | Default  | Description                                                                          |
| ------------ | ---------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `modelValue` | `T \| T[] \| null`                 | `null`   | Currently selected value(s)                                                          |
| `variant`    | `'list' \| 'listbox' \| 'menu'`    | `'list'` | Interaction and ARIA mode                                                            |
| `multiple`   | `boolean`                          | `false`  | Collect selected values into an array (works in any interactive `variant`)           |
| `mandatory`  | `boolean`                          | `false`  | Prevent deselecting the current item (in `multiple`: prevent removing the last item) |
| `readonly`   | `boolean`                          | `false`  | Disable selection changes                                                            |
| `disabled`   | `boolean`                          | `false`  | Disable the whole list and remove it from the tab order                              |
| `item-key`   | `string \| ((item: T) => unknown)` | —        | How to compare values: a property name or a function. Defaults to reference equality |

### CList events

| Event               | Arguments          | Description                        |
| ------------------- | ------------------ | ---------------------------------- |
| `update:modelValue` | `T \| T[] \| null` | Emitted when the selection changes |

### CList slots

| Slot      | Props        | Description  |
| --------- | ------------ | ------------ |
| `default` | `ListAPI<T>` | List content |

#### `default` slot props

The slot receives the whole `ListAPI<T>` — the same object provided to `CListItem` via inject. Selection-facing members:

| Prop       | Type                               | Description                                                                                            |
| ---------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `toggle`   | `(item: T) => void`                | Select the item, or unselect it if already selected — the same primitive the component uses internally |
| `select`   | `(item: T) => void`                | Mark an item as selected                                                                               |
| `unselect` | `(item: T) => void`                | Remove an item from the selection                                                                      |
| `isActive` | `(item: T) => boolean`             | Check if an item is currently selected                                                                 |
| `role`     | `'listbox' \| 'menu' \| undefined` | Current interaction mode                                                                               |

For rebuilding `CListItem` from scratch the same object also exposes `registerItem` / `unregisterItem`, so keyboard navigation can discover your items. Both take a `ListItem` controller.

### CList expose

| Method                           | Signature                    | Description                                                          |
| -------------------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `focus`                          | `() => void`                 | Programmatically focus the list (only in `listbox` / `menu`)         |
| `navigateFirst` / `navigateLast` | `() => void`                 | Move the active item to the first / last enabled item                |
| `navigateUp` / `navigateDown`    | `() => void`                 | Move the active item up / down                                       |
| `activateItem`                   | `() => void`                 | Fire the focused item's click (selection toggles, its `@click` runs) |
| `onKeydown`                      | `(e: KeyboardEvent) => void` | Feed a keyboard event to the list's handler (drive it from a parent) |

### CListItem props

| Prop       | Type      | Default | Description                    |
| ---------- | --------- | ------- | ------------------------------ |
| `value`    | `T`       | —       | Value associated with the item |
| `disabled` | `boolean` | `false` | Disable this item              |

### CListItem events

| Event      | Arguments    | Description                                    |
| ---------- | ------------ | ---------------------------------------------- |
| `active`   | `id: string` | Item became the active (keyboard-focused) item |
| `inactive` | `id: string` | Item stopped being the active item             |

### CListItem slots

| Slot      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `default` | Item content, laid out as a flex row (falls back to `value`) |

### Helper components

| Component           | Renders                              | Purpose                                       |
| ------------------- | ------------------------------------ | --------------------------------------------- |
| `CListItemIcon`     | `<div class="c-list-item-icon">`     | Wrapper for a leading/trailing icon           |
| `CListItemContent`  | `<div class="c-list-item-content">`  | Column wrapper that stacks title and subtitle |
| `CListItemTitle`    | `<div class="c-list-item-title">`    | Primary item text                             |
| `CListItemSubtitle` | `<div class="c-list-item-subtitle">` | Secondary item text                           |

### Accessibility

| Attribute              | Condition                                 | Value                     |
| ---------------------- | ----------------------------------------- | ------------------------- |
| `role` (list)          | `variant="listbox"` / `"menu"`            | `"listbox"` / `"menu"`    |
| `role` (item)          | inside a managed list                     | `"option"` / `"menuitem"` |
| `aria-multiselectable` | `listbox` + `multiple`                    | `"true"`                  |
| `aria-selected`        | `listbox` items                           | `"true"` / `"false"`      |
| `aria-disabled`        | `disabled` list or item in a managed list | `"true"`                  |
| `tabindex` (list)      | `listbox` / `menu`, not disabled          | `0`                       |

### CSS variables

`CList`:

| Variable                    | Default                               |
| --------------------------- | ------------------------------------- |
| `--c-list-bg-color`         | `var(--c-sys-color-surface)`          |
| `--c-list-color`            | `var(--c-sys-color-on-surface)`       |
| `--c-list-border-radius`    | `var(--c-sys-shape-md)`               |
| `--c-list-padding-block`    | `0`                                   |
| `--c-list-padding-inline`   | `0`                                   |
| `--c-list-disabled-opacity` | `var(--c-sys-state-disabled-opacity)` |

`CListItem`:

| Variable                             | Default                                     |
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
