# CSelect

`CSelect` is a dropdown selection field built on top of `CTextField` and `CList`. It supports single and multiple selection, plain or object items (with `title-key` / `value-key`), chips, clearing and full keyboard navigation. Any `CTextField` prop (label, placeholder, clearable, rules, disabled…) is forwarded to the underlying field.

<script setup>
import BasicExample from '../../examples/CSelect/BasicExample.vue'
import ObjectItemsExample from '../../examples/CSelect/ObjectItemsExample.vue'
import MultipleExample from '../../examples/CSelect/MultipleExample.vue'
</script>

## Basic usage

Pass an array of values to `items` and bind the selection with `v-model`. With primitive items the value _is_ the option.

<BasicExample />

::: details Show code

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

## Object items

When items are objects, use `title-key` to pick the **displayed label** and `value-key` to pick the **stored value**. Both accept a dotted path (e.g. `user.name`). In the demo below the option shows the member name, but `v-model` stores the id.

<ObjectItemsExample />

::: details Show code

```vue
<template>
  <CSelect
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
  <CSelect v-model="skills" label="Skills" :items="allSkills" multiple chips clearable />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const skills = ref(['Vue', 'TypeScript'])
const allSkills = ['Vue', 'React', 'TypeScript', 'Node.js', 'Go', 'Rust']
</script>
```

:::

## Behaviour

- **Single is mandatory by default** — clicking the already-selected option keeps it; use the clear button (`clearable`) to reset. In `multiple` mode clicking a selected option removes it. Pass `mandatory` to also keep the last item in `multiple` mode.
- **Keyboard** — focus opens the menu; `ArrowUp` / `ArrowDown` move the active option (moving real focus), `Enter` / `Space` select it, type characters to jump to a matching option (typeahead), `Escape` / `Tab` close the menu.

## API

### CSelect props

| Prop         | Type                               | Default | Description                                                        |
| ------------ | ---------------------------------- | ------- | ------------------------------------------------------------------ |
| `modelValue` | `T \| T[]`                         | —       | Selected value(s); array in `multiple` mode                        |
| `items`      | `T[]`                              | `[]`    | Available options                                                  |
| `title-key`  | `string \| ((item: T) => unknown)` | —       | Path to the option's display label (for object items)              |
| `value-key`  | `string \| ((item: T) => unknown)` | —       | Path to the value stored in `v-model` (defaults to the whole item) |
| `multiple`   | `boolean`                          | `false` | Collect selected values into an array                              |
| `mandatory`  | `boolean`                          | `false` | In `multiple`: keep the last item. Single selection is always kept |
| `chips`      | `boolean`                          | `false` | Render selected values as removable chips                          |

Any [`CTextField`](/en/components/CTextField) prop — `label`, `placeholder`, `clearable`, `rules`, `disabled`, `readonly`, … — is forwarded to the underlying field. Functions in `rules` receive the model value (the value or array stored in `v-model`), not the text displayed in the field.

### CSelect events

| Event               | Arguments  | Description                        |
| ------------------- | ---------- | ---------------------------------- |
| `update:modelValue` | `T \| T[]` | Emitted when the selection changes |

### CSelect slots

| Slot                 | Props                                         | Description                                    |
| -------------------- | --------------------------------------------- | ---------------------------------------------- |
| `selects`            | `{ items: T[] }`                              | Override how the selected values are displayed |
| `menu`               | `{ items: NormalizedItem<T>[], onSelect }`    | Override the dropdown content                  |
| `details`            | `{ errorMessage?: string, details?: string }` | Override the hint / error line                 |
| `prepend` / `append` | —                                             | Forwarded to the text field                    |
