# CSelect

`CSelect` is a dropdown selection field built on top of `CTextField` and `CList`. It supports single and multiple selection, plain or object items (with `title-key` / `value-key`), chips, clearing and full keyboard navigation. Any `CTextField` prop (label, placeholder, clearable, rules, disabled…) is forwarded to the underlying field.

<script setup>
import BasicExample from '../../examples/CSelect/BasicExample.vue'
import ObjectItemsExample from '../../examples/CSelect/ObjectItemsExample.vue'
import MultipleExample from '../../examples/CSelect/MultipleExample.vue'
import CustomMenuExample from '../../examples/CSelect/CustomMenuExample.vue'
</script>

## Basic usage

Pass an array of values to `items` and bind the selection with `v-model`. With primitive items the value _is_ the option.

<BasicExample />

::: details Show code

```vue
<template>
  <c-select
    v-model="environment"
    label="Environment"
    placeholder="Choose one"
    :items="environments"
    clearable
  />

  <div class="d-flex items-center gap-2 fs-sm text-blue-grey mt-4">
    Deploys to
    <span class="radius-pill text-white px-3 py-1 fs-xs fw-semi-bold" :class="badge">
      {{ environment ?? 'nowhere' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const environment = ref('Staging')
const environments = ['Preview', 'Staging', 'Production']

const badge = computed(
  () =>
    ({
      Preview: 'bg-blue-grey',
      Staging: 'bg-orange',
      Production: 'bg-green',
    })[environment.value ?? ''] ?? 'bg-blue-grey',
)
</script>
```

:::

## Object items

When items are objects, use `title-key` to pick the **displayed label** and `value-key` to pick the **stored value**. Both accept a dotted path (e.g. `user.name`). In the demo below the option shows the member name, but `v-model` stores the id.

<ObjectItemsExample />

::: details Show code

```vue
<template>
  <c-select
    v-model="assignee"
    label="Assignee"
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

Omit `value-key` to store the whole item object instead of a single field. When items are objects and their titles are not unique, always provide `value-key` so distinct entries stay distinguishable.

## Multiple selection

Add `multiple` to collect an array of values, and `chips` to render each selection as a removable chip.

<MultipleExample />

::: details Show code

```vue
<template>
  <c-select
    v-model="channels"
    label="Channels"
    placeholder="Where do we ping you?"
    :items="allChannels"
    multiple
    chips
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const channels = ref(['Email', 'Slack'])
const allChannels = ['Email', 'Slack', 'Push', 'SMS', 'Webhook']
</script>
```

:::

## Custom rendering

The `chips` slot replaces how selected values are displayed inside the field, and the `menu` slot rebuilds the dropdown from scratch. `menu` receives the normalized `items` and an `onSelect` function that updates the model (in `multiple` mode calling it with a selected value removes it). Put a [`CList`](/en/components/CList) inside the slot and keyboard works out of the box: the list registers itself into the select's keyboard loop, so arrows, typeahead and `Enter` / `Space` from the field reach it with zero wiring:

<CustomMenuExample />

::: details Show code

```vue
<template>
  <c-select
    v-model="region"
    label="Data region"
    :items="regions"
    title-key="name"
    value-key="code"
    clearable
  >
    <template #chips="{ items }">
      <div v-if="items.length && selectedRegion" class="region-value">
        <span :class="['region-mark', selectedRegion.color]">
          {{ selectedRegion.code.toUpperCase() }}
        </span>
        <span>{{ items[0] }}</span>
        <span>{{ selectedRegion.latency }}</span>
      </div>
    </template>

    <template #menu="{ items, onSelect }">
      <c-list variant="menu" class="region-menu">
        <c-list-item
          v-for="item in items"
          :key="item.key"
          :value="item.value"
          @click="onSelect(item.value)"
        >
          <c-list-item-content>
            <c-list-item-title>{{ item.title }}</c-list-item-title>
            <c-list-item-subtitle>
              {{ item.raw.location }} - {{ item.raw.latency }}
            </c-list-item-subtitle>
          </c-list-item-content>
        </c-list-item>
      </c-list>
    </template>
  </c-select>
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

## Behaviour

- **Single is mandatory by default** — clicking the already-selected option keeps it; use the clear button (`clearable`) to reset. In `multiple` mode clicking a selected option removes it. Pass `mandatory` to also keep the last item in `multiple` mode.
- **Keyboard** — focus opens the menu; `ArrowUp` / `ArrowDown` move the active option (moving real focus), `Enter` / `Space` select it, type characters to jump to a matching option (typeahead), `Escape` / `Tab` close the menu.
- **Readonly** — the field stays focusable, but the menu does not open and the value cannot be changed.

## API

### CSelect props

| Prop         | Type                          | Default | Description                                                                   |
| ------------ | ----------------------------- | ------- | ----------------------------------------------------------------------------- |
| `modelValue` | `T \| T[]`                    | —       | Selected value(s); array in `multiple` mode                                   |
| `items`      | `readonly T[]`                | `[]`    | Available options                                                             |
| `title-key`  | `string`                      | —       | Path to the option's display label (for object items); dotted paths supported |
| `value-key`  | `string`                      | —       | Path to the value stored in `v-model` (defaults to the whole item)            |
| `multiple`   | `boolean`                     | `false` | Collect selected values into an array                                         |
| `mandatory`  | `boolean`                     | `false` | In `multiple`: keep the last item. Single selection is always kept            |
| `chips`      | `boolean`                     | `false` | Render selected values as removable chips                                     |
| `options`    | `{ noItemsMessage?: string }` | —       | Empty-list message                                                            |

Any [`CTextField`](/en/components/CTextField) prop — `label`, `placeholder`, `clearable`, `rules`, `disabled`, `readonly`, … — is forwarded to the underlying field. Functions in `rules` receive the model value (the value or array stored in `v-model`), not the text displayed in the field.

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

### CSelect events

| Event               | Arguments  | Description                        |
| ------------------- | ---------- | ---------------------------------- |
| `update:modelValue` | `T \| T[]` | Emitted when the selection changes |

### CSelect slots

| Slot               | Props                                                    | Description                                                                                               |
| ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `chips`            | `{ items: unknown[] }`                                   | Override how the selected values are displayed                                                            |
| `menu`             | `{ items: NormalizedItem<T>[], onSelect } & KeyboardAPI` | Override the dropdown content; in `multiple` calling `onSelect` with a selected value removes it (toggle) |
| `details`          | `{ errorMessage?: string, details?: string }`            | Override the hint / error line                                                                            |
| `prepend`          | —                                                        | Content before the field                                                                                  |
| `append`           | —                                                        | Content after the field; replaces the dropdown icon                                                       |
| `no-items-message` | —                                                        | Message shown when `items` is empty                                                                       |

Besides `items` and `onSelect`, the `menu` slot receives the select's keyboard api: `register` / `unregister` to plug a custom target into the keyboard loop, `forward` to relay an event to the active target, and `blur` to reset its focus state. A [`CList`](/en/components/CList)-based menu needs none of it — the list registers itself.
