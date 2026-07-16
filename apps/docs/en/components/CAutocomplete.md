# CAutocomplete

`CAutocomplete` is a selection field with text search built on top of `CTextField`, `CMenu` and `CList`. Unlike [`CSelect`](/en/components/CSelect), the field stays editable: typing filters the options by the beginning of their title. It supports single and multiple selection, plain or object items (with `title-key` / `value-key`), chips and clearing. Any `CTextField` prop (label, placeholder, clearable, rules, disabled…) is forwarded to the underlying field.

<script setup>
import BasicExample from '../../examples/CAutocomplete/BasicExample.vue'
import ObjectItemsExample from '../../examples/CAutocomplete/ObjectItemsExample.vue'
import MultipleChipsExample from '../../examples/CAutocomplete/MultipleChipsExample.vue'
import CustomMenuExample from '../../examples/CAutocomplete/CustomMenuExample.vue'
</script>

## Basic usage

Pass an array of values to `items` and bind the selection with `v-model`. Focus opens the menu, typing filters the list; picking an option stores the value and clears the search string.

<BasicExample />

::: details Show code

```vue
<template>
  <c-autocomplete
    v-model="destination"
    label="City"
    placeholder="Start typing — try «B»"
    :items="cities"
    clearable
  />

  <div v-if="destination" class="d-flex items-center gap-2 fs-sm mt-4">
    <c-icon name="fas:check" source="fa" :size="12" class="text-green" />
    Courier available in <b>{{ destination }}</b>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const destination = ref<string>()
const cities = ['Amsterdam', 'Barcelona', 'Berlin', 'Lisbon', 'London', 'Paris']
</script>
```

:::

## Object items

When items are objects, use `title-key` to pick the **displayed label** and `value-key` to pick the **stored value**. Both accept a dotted path (e.g. `user.name`). Search matches against the title.

<ObjectItemsExample />

::: details Show code

```vue
<template>
  <c-autocomplete
    v-model="assignee"
    label="Reviewer"
    placeholder="Search a member"
    :items="members"
    title-key="name"
    value-key="id"
    clearable
  />

  <!-- v-model holds the id, the found object drives the summary card -->
  <div v-if="reviewer" class="d-flex items-center gap-2 mt-4">
    <b>{{ reviewer.name }}</b>
    <span class="fs-xs text-blue-grey">{{ reviewer.role }}</span>
    <c-chip>v-model: {{ assignee }}</c-chip>
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

Omit `value-key` to store the whole item object instead of a single field. When titles are not unique, always provide `value-key` so distinct entries stay distinguishable.

## Multiple selection

Add `multiple` to collect an array of values, and `chips` to render each selection as a removable chip. After a pick the menu stays open and focus returns to the field, so you can keep searching. `Backspace` in the empty field removes the last selected value.

<MultipleChipsExample />

::: details Show code

```vue
<template>
  <c-autocomplete
    v-model="stack"
    label="Technologies"
    placeholder="Add a technology"
    :items="technologies"
    multiple
    chips
    clearable
  />

  <c-progress-linear
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

## Custom menu

The `menu` slot replaces the whole dropdown while keeping the component's filtering and selection: it receives the already-filtered `items` (`NormalizedItem<T>[]`) and `onSelect`. Put a [`CList`](/en/components/CList) inside the slot and keyboard works out of the box: the list registers itself into the autocomplete's keyboard loop — arrows from the field, `Enter` / `Space` and the after-pick search reset all work with zero wiring. Combined with the `chips` slot you can build a full people-picker — avatars, statuses, role badges and your own empty state:

<CustomMenuExample />

::: details Show code

```vue
<template>
  <c-autocomplete
    v-model="invited"
    label="Teammates"
    placeholder="Search by name"
    title-key="name"
    :items="members"
    multiple
    chips
    clearable
  >
    <template #chips>
      <div v-for="member of invited" :key="member.email" class="invite-chip">
        <span class="avatar" :class="member.color">{{ initials(member) }}</span>
        {{ member.name.split(' ')[0] }}
        <c-icon name="fas:times" source="fa" :size="10" @click.stop="uninvite(member)" />
      </div>
    </template>

    <!-- Custom dropdown: own layout on top of items + onSelect -->
    <template #menu="{ items }">
      <div class="invite-menu radius-12 elevation-4">
        <div class="invite-menu__head">Team directory — {{ items.length }} matches</div>

        <div v-if="!items.length" class="pa-4 fs-sm text-blue-grey">Nobody matches this search</div>

        <c-list v-else v-model="invited" multiple variant="menu">
          <c-list-item v-for="item of items" :key="item.key" :value="item.raw">
            <span class="avatar" :class="item.raw.color">
              {{ initials(item.raw) }}
              <i class="dot" :class="item.raw.online ? 'bg-green' : 'bg-grey'"></i>
            </span>
            <c-list-item-content>
              <c-list-item-title>{{ item.title }}</c-list-item-title>
              <c-list-item-subtitle>{{ item.raw.email }}</c-list-item-subtitle>
            </c-list-item-content>
            <c-chip>{{ item.raw.role }}</c-chip>
            <c-icon
              v-if="invited.includes(item.raw)"
              name="fas:check"
              source="fa"
              :size="14"
              class="text-teal"
            />
          </c-list-item>
        </c-list>
      </div>
    </template>
  </c-autocomplete>
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

Selection state stays on the component: `onSelect` toggles the value in `multiple` mode, the search string keeps filtering `items`, and `Backspace` still removes the last pick.

## Search

- Options are filtered case-insensitively by the **beginning** of the item title.
- Every change of the search string emits `update:search` — use it for external logic such as highlighting, analytics or data loading.
- Closing the menu in any way (pick, `Escape`, `Tab`, outside click) resets the search string, so the next opening shows the full list.

## Behaviour

- Focus opens the menu; `Escape` / `Tab` close it and blur the field.
- `ArrowUp` / `ArrowDown` move the active option, `Enter` / `Space` select it.
- In single mode a pick closes the menu and clears the search string; picking the already-selected option keeps it.
- In `multiple` mode picking a selected option removes it. Pass `mandatory` to keep the last item.
- `Backspace` in the empty field removes the last value (`multiple`) or clears the model (single).
- `readonly` keeps the menu closed and `Backspace` does not remove selected values.

## API

### CAutocomplete props

| Prop         | Type                          | Default | Description                                                        |
| ------------ | ----------------------------- | ------- | ------------------------------------------------------------------ |
| `modelValue` | `T \| T[]`                    | —       | Selected value(s); array in `multiple` mode                        |
| `items`      | `readonly T[]`                | `[]`    | Available options                                                  |
| `title-key`  | `string`                      | —       | Path to the option's display label; search matches against it      |
| `value-key`  | `string`                      | —       | Path to the value stored in `v-model` (defaults to the whole item) |
| `multiple`   | `boolean`                     | `false` | Collect selected values into an array                              |
| `mandatory`  | `boolean`                     | `false` | In `multiple`: keep the last item                                  |
| `chips`      | `boolean`                     | `false` | Render selected values as removable chips                          |
| `options`    | `{ noItemsMessage?: string }` | —       | Empty-list message                                                 |

Any [`CTextField`](/en/components/CTextField) prop — `label`, `placeholder`, `clearable`, `rules`, `disabled`, `readonly`, … — is forwarded to the underlying field. Functions in `rules` receive the model value, not the search string.

Presets compose by value: the `menu` and `list` fields of an input preset take plain `CMenuPreset` and `CListPreset` objects — the same format standalone components use. [`CMenu`](/en/components/CMenu), [`CList`](/en/components/CList) and `CListItem` pick them up from the same set via context.

```ts
import { menuRounded } from './presets/menu' // CMenuPreset: root zone, opened/closed states
import { listCompact } from './presets/list' // CListPreset: root/option zones, disabled/readonly states

const combo: CInputPreset = {
  base: {
    field: ['text-indigo'],
    menu: menuRounded,
    list: listCompact,
  },
}
```

### CAutocomplete events

| Event               | Arguments  | Description                            |
| ------------------- | ---------- | -------------------------------------- |
| `update:modelValue` | `T \| T[]` | Emitted when the selection changes     |
| `update:search`     | `string`   | Emitted when the search string changes |

### CAutocomplete slots

| Slot               | Props                                                    | Description                                                         |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------- |
| `chips`            | `{ items: unknown[] }`                                   | Override how the selected values are displayed                      |
| `menu`             | `{ items: NormalizedItem<T>[], onSelect } & KeyboardAPI` | Override the dropdown content; `items` is the already-filtered list |
| `details`          | `{ errorMessage?: string, details?: string }`            | Override the hint / error line                                      |
| `prepend`          | —                                                        | Content before the field                                            |
| `append`           | —                                                        | Content after the field; replaces the dropdown icon                 |
| `no-items-message` | —                                                        | Message shown when the search has no matches                        |

In `menu` the `onSelect` function updates the model: in `multiple` mode calling it with an already-selected value removes it (toggle). The slot also receives the autocomplete's keyboard api: `register` / `unregister` to plug a custom target into the keyboard loop, `forward` to relay an event to the active target, and `blur` to reset its focus state. A [`CList`](/en/components/CList)-based menu needs none of it — the list registers itself.

### NormalizedItem

The `menu` slot receives prepared entries:

```ts
type NormalizedItem<T> = {
  raw: T
  title: unknown
  value: unknown
  key: string
}
```

`raw` is the original item, `title` is resolved via `title-key`, `value` via `value-key`, and `key` is used for stable list rendering.
