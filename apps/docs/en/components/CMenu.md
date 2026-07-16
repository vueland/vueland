# CMenu

A floating content container that positions itself relative to an activator element. Used as the foundation for dropdowns, selects, tooltips and other overlay components.

<script setup>
import BasicExample from '../../examples/CMenu/BasicExample.vue'
import HoverExample from '../../examples/CMenu/HoverExample.vue'
import PositioningExample from '../../examples/CMenu/PositioningExample.vue'
import ContextMenuExample from '../../examples/CMenu/ContextMenuExample.vue'
</script>

## Basic usage

<BasicExample />

::: details Show code

```vue
<template>
  <c-menu
    width="auto"
    open-on-click
    close-on-click-outside
    close-on-content-click
    align="bottom"
    :offset-y="4"
  >
    <template #activator="{ on, activator }">
      <c-btn class="bg-indigo" v-bind="activator" v-on="on" style="gap:8px">
        <c-icon name="fas:folder" source="fa" :size="14" />
        File
        <c-icon name="fas:chevron-down" source="fa" :size="10" />
      </c-btn>
    </template>

    <c-card class="elevation-4" style="min-width:220px">
      <c-card-body class="py-1 px-0">
        <c-list>
          <c-list-item class="px-4" style="gap:12px" @click="notify('New file')">
            <c-icon name="fas:plus" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">New file</span>
            <span class="kb">⌘N</span>
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="notify('Open')">
            <c-icon name="fas:folder" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Open…</span>
            <span class="kb">⌘O</span>
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="notify('Save')">
            <c-icon name="fas:save" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Save</span>
            <span class="kb">⌘S</span>
          </c-list-item>
        </c-list>
        <div class="sep" />
        <c-list>
          <c-list-item class="px-4" style="gap:12px;color:#f44336" @click="notify('Delete')">
            <c-icon name="fas:trash" source="fa" :size="13" style="width:14px" />
            Delete file
          </c-list-item>
        </c-list>
      </c-card-body>
    </c-card>
  </c-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('')
function notify(text: string) {
  msg.value = text
}
</script>

<style scoped>
.kb {
  font-size: 11px;
  color: var(--c-sys-color-on-surface-variant);
}
.sep {
  height: 1px;
  background: var(--c-sys-color-outline-variant);
  margin: 4px 0;
}
</style>
```

:::

## Hover

Use `open-on-hover` + `close-on-leave` for hover-triggered menus. `open-delay` / `close-delay` prevent accidental triggers.

<HoverExample />

::: details Show code

```vue
<template>
  <div class="d-flex align-center gap-1 pa-2 radius-8 elevation-1">
    <c-menu
      v-for="item in nav"
      :key="item.label"
      width="auto"
      open-on-hover
      close-on-leave
      align="bottom"
      :offset-y="2"
      :open-delay="80"
      :close-delay="140"
    >
      <template #activator="{ on, activator }">
        <c-btn variant="text" :class="item.color" v-bind="activator" v-on="on" style="gap:6px">
          <c-icon :name="item.icon" source="fa" :size="13" />
          {{ item.label }}
        </c-btn>
      </template>

      <c-card class="elevation-4" style="min-width:180px">
        <c-card-body class="py-1 px-0">
          <c-list>
            <c-list-item v-for="link in item.links" :key="link.label" class="px-4" style="gap:10px">
              <c-icon :name="link.icon" source="fa" :size="12" style="width:14px;opacity:.5" />
              {{ link.label }}
            </c-list-item>
          </c-list>
        </c-card-body>
      </c-card>
    </c-menu>
  </div>
</template>

<script setup lang="ts">
const nav = [
  {
    label: 'Products',
    icon: 'fas:briefcase',
    color: 'text-indigo',
    links: [
      { icon: 'fas:list-ul', label: 'UI Components' },
      { icon: 'fas:image', label: 'Icons' },
      { icon: 'fas:star', label: 'Themes' },
    ],
  },
  {
    label: 'Docs',
    icon: 'fas:code',
    color: 'text-light-blue',
    links: [
      { icon: 'fas:home', label: 'Getting started' },
      { icon: 'fas:file', label: 'Migration guide' },
    ],
  },
]
</script>

<style scoped>
.text-indigo {
  color: #3f51b5 !important;
}
.text-light-blue {
  color: #03a9f4 !important;
}
</style>
```

:::

## Positioning

`align` controls which side the menu opens on and how it aligns along the cross axis. Fine-tune with `offsetX` / `offsetY`.

When the menu is rendered inside its activator element, pass `activator="parent"` — `CMenu` binds activator listeners to the parent DOM element and does not render the `activator` slot.

| Value                              | Side  | Cross alignment           |
| ---------------------------------- | ----- | ------------------------- |
| `bottom`                           | Below | Left-aligned              |
| `bottom-center`                    | Below | Centered                  |
| `bottom-right`                     | Below | Right-aligned             |
| `top` / `top-center` / `top-right` | Above | Left / Center / Right     |
| `right` / `right-center`           | Right | Top / Centered vertically |
| `left` / `left-center`             | Left  | Top / Centered vertically |

<PositioningExample />

::: details Show code

```html
<!-- Opens below the activator, left-aligned -->
<c-menu
  width="auto"
  align="bottom"
  :offset-y="8"
  open-on-click
  close-on-click-outside
  close-on-content-click
>
  <template #activator="{ on, activator }">
    <c-btn class="bg-indigo" v-bind="activator" v-on="on">Bottom</c-btn>
  </template>
  <c-card>...</c-card>
</c-menu>

<!-- Opens to the right, vertically centered -->
<c-menu width="auto" align="right-center" :offset-x="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <c-btn class="bg-teal" v-bind="activator" v-on="on">Right</c-btn>
  </template>
  <c-card>...</c-card>
</c-menu>

<!-- Opens above, centered horizontally -->
<c-menu width="auto" align="top-center" :offset-y="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <c-btn class="bg-deep-purple" v-bind="activator" v-on="on">Top center</c-btn>
  </template>
  <c-card>...</c-card>
</c-menu>
```

:::

## Context menu

Use `position-x` / `position-y` to anchor the menu to fixed coordinates instead of an activator element.

<ContextMenuExample />

::: details Show code

```vue
<template>
  <div class="area" @contextmenu.prevent="onContextMenu">Right-click anywhere</div>

  <c-menu
    v-model="open"
    :position-x="x"
    :position-y="y"
    width="auto"
    close-on-click-outside
    close-on-content-click
  >
    <c-card class="elevation-4" style="min-width:200px">
      <c-card-body class="py-1 px-0">
        <c-list>
          <c-list-item class="px-4" style="gap:12px" @click="toast('Opened')">
            <c-icon name="fas:eye" source="fa" :size="13" style="width:14px;opacity:.5" /> Open
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="toast('Renamed')">
            <c-icon name="fas:pen" source="fa" :size="13" style="width:14px;opacity:.5" /> Rename
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="toast('Copied')">
            <c-icon name="fas:link" source="fa" :size="13" style="width:14px;opacity:.5" /> Copy
            path
          </c-list-item>
        </c-list>
        <div class="sep" />
        <c-list>
          <c-list-item class="px-4" style="gap:12px;color:#f44336" @click="toast('Deleted')">
            <c-icon name="fas:trash" source="fa" :size="13" style="width:14px" /> Move to Trash
          </c-list-item>
        </c-list>
      </c-card-body>
    </c-card>
  </c-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const x = ref(0)
const y = ref(0)

function onContextMenu(e: MouseEvent) {
  open.value = false
  setTimeout(() => {
    x.value = e.pageX
    y.value = e.pageY
    open.value = true
  }, 0)
}

function toast(msg: string) {
  console.log(msg)
}
</script>

<style scoped>
.area {
  padding: 48px;
  text-align: center;
  border: 2px dashed var(--c-sys-color-outline-variant);
  border-radius: 8px;
}
.sep {
  height: 1px;
  background: var(--c-sys-color-outline-variant);
}
</style>
```

:::

## Width

By default CMenu inherits the width of its activator element. Pass `width="auto"` to let the content define its own width, or pass a fixed value.

```html
<!-- Stretches to fill the activator (default) -->
<c-menu align="bottom">...</c-menu>

<!-- Content determines its own width -->
<c-menu align="bottom" width="auto">...</c-menu>

<!-- Fixed width -->
<c-menu align="bottom" :width="240">...</c-menu>
```

## Collision strategies

`strategy="reverse"` flips to the opposite side when there is not enough space. `strategy="bounce"` keeps the menu inside the viewport by shifting it.

```html
<!-- Flip above when there's no room below -->
<c-menu align="bottom" strategy="reverse" open-on-click>...</c-menu>

<!-- Stay inside the viewport edges -->
<c-menu align="bottom" strategy="bounce" open-on-click>...</c-menu>
```

## v-model

Control the open state from outside the component.

```vue
<template>
  <c-menu v-model="open" align="bottom">
    <template #activator="{ on, activator }">
      <button v-bind="activator" v-on="on">Toggle</button>
    </template>
    <div>Content</div>
  </c-menu>
  <button @click="open = !open">Toggle from outside</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
```

## ARIA

CMenu does not add any ARIA attributes on its own — each consumer is responsible for accessibility. Pass `role` and `aria-*` directly:

```html
<c-menu role="menu" aria-label="Actions" open-on-click align="bottom"> ... </c-menu>
```

---

## API

### Props

| Prop                  | Type                                                       | Default         | Description                                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                                  | `false`         | Controls the open state                                                                                                                                                                                        |
| `openOnClick`         | `boolean`                                                  | —               | Open when the activator is clicked                                                                                                                                                                             |
| `closeOnClick`        | `boolean`                                                  | —               | Toggle closed on repeated activator click                                                                                                                                                                      |
| `openOnHover`         | `boolean`                                                  | —               | Open on mouseenter                                                                                                                                                                                             |
| `closeOnLeave`        | `boolean`                                                  | —               | Close on mouseleave                                                                                                                                                                                            |
| `openOnFocus`         | `boolean`                                                  | —               | Open when the activator receives focus                                                                                                                                                                         |
| `closeOnClickOutside` | `boolean`                                                  | —               | Close when clicking outside the menu                                                                                                                                                                           |
| `closeOnContentClick` | `boolean`                                                  | —               | Close when clicking inside the menu content                                                                                                                                                                    |
| `align`               | `AlignValue`                                               | —               | Side + cross-axis alignment. E.g. `bottom`, `top-center`, `right-center`, `bottom-right`                                                                                                                       |
| `offsetX`             | `number \| string`                                         | —               | Horizontal offset in px                                                                                                                                                                                        |
| `offsetY`             | `number \| string`                                         | —               | Vertical offset in px                                                                                                                                                                                          |
| `positionX`           | `number`                                                   | —               | Fixed X coordinate (detaches from activator)                                                                                                                                                                   |
| `positionY`           | `number`                                                   | —               | Fixed Y coordinate (detaches from activator)                                                                                                                                                                   |
| `strategy`            | `'reverse' \| 'bounce'`                                    | —               | Collision handling strategy                                                                                                                                                                                    |
| `width`               | `number \| string`                                         | activator width | Content width                                                                                                                                                                                                  |
| `height`              | `number \| string`                                         | —               | Content height                                                                                                                                                                                                 |
| `minWidth`            | `number \| string`                                         | —               | Minimum content width                                                                                                                                                                                          |
| `maxWidth`            | `number \| string`                                         | —               | Maximum content width                                                                                                                                                                                          |
| `minHeight`           | `number \| string`                                         | —               | Minimum content height                                                                                                                                                                                         |
| `maxHeight`           | `number \| string`                                         | —               | Maximum content height                                                                                                                                                                                         |
| `openDelay`           | `number \| string`                                         | —               | Delay before opening (ms)                                                                                                                                                                                      |
| `closeDelay`          | `number \| string`                                         | —               | Delay before closing (ms)                                                                                                                                                                                      |
| `transition`          | `string`                                                   | `'fade'`        | Vue transition name applied to the content                                                                                                                                                                     |
| `ssr`                 | `boolean`                                                  | —               | Pre-render content on the server                                                                                                                                                                               |
| `activator`           | `Element \| ComponentPublicInstance \| 'parent' \| string` | —               | External activator, CSS selector, or parent element                                                                                                                                                            |
| `preset`              | `string`                                                   | —               | Registry path to a `CMenuPreset` (`root` zone, `opened` / `closed` states). Inside CSelect / CAutocomplete the menu also picks up the nested `CMenuPreset` from the combobox preset's `menu` field via context |

### `AlignValue`

```ts
type AlignValue =
  | 'top'
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-center'
  | 'right'
  | 'right-center'
```

### CSS variables

| Variable                 | Default                                     | Description             |
| ------------------------ | ------------------------------------------- | ----------------------- |
| `--c-menu-bg-color`      | `var(--c-sys-color-surface-container-high)` | Menu background         |
| `--c-menu-text-color`    | `var(--c-sys-color-on-surface)`             | Text color              |
| `--c-menu-border-radius` | `var(--c-sys-shape-lg)`                     | Container border radius |
| `--c-menu-elevation`     | `var(--c-sys-elevation-3)`                  | Container shadow        |
| `--c-menu-max-height`    | `100%`                                      | Maximum menu height     |

### Slots

| Slot        | Props               | Description           |
| ----------- | ------------------- | --------------------- |
| `activator` | `{ on, activator }` | The activator element |
| `default`   | —                   | Menu content          |

#### `activator` slot props

| Prop        | Type                  | Description                                   |
| ----------- | --------------------- | --------------------------------------------- |
| `on`        | `ActivatorListeners`  | Event listeners — spread with `v-on="on"`     |
| `activator` | `Record<string, any>` | Bind attrs — spread with `v-bind="activator"` |

### Events

| Event               | Arguments | Description            |
| ------------------- | --------- | ---------------------- |
| `update:modelValue` | `boolean` | Open state changed     |
| `open`              | —         | Menu opened            |
| `close`             | —         | Menu closed            |
| `click`             | —         | Content clicked        |
| `outside-click`     | —         | Click outside the menu |

### Expose

| Method   | Signature    | Description     |
| -------- | ------------ | --------------- |
| `open`   | `() => void` | Open the menu   |
| `close`  | `() => void` | Close the menu  |
| `toggle` | `() => void` | Toggle the menu |
