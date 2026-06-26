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
  <CMenu
    width="auto"
    open-on-click
    close-on-click-outside
    close-on-content-click
    align="bottom"
    :offset-y="4"
  >
    <template #activator="{ on, activator }">
      <CBtn class="bg-indigo" v-bind="activator" v-on="on" style="gap:8px">
        <CIcon name="fas:folder" source="fa" :size="14" />
        File
        <CIcon name="fas:chevron-down" source="fa" :size="10" />
      </CBtn>
    </template>

    <CCard class="elevation-4" style="min-width:220px">
      <CCardBody class="py-1 px-0">
        <CList>
          <CListItem class="px-4" style="gap:12px" @click="notify('New file')">
            <CIcon name="fas:plus" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">New file</span>
            <span class="kb">⌘N</span>
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="notify('Open')">
            <CIcon name="fas:folder" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Open…</span>
            <span class="kb">⌘O</span>
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="notify('Save')">
            <CIcon name="fas:save" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Save</span>
            <span class="kb">⌘S</span>
          </CListItem>
        </CList>
        <div class="sep" />
        <CList>
          <CListItem class="px-4" style="gap:12px;color:#f44336" @click="notify('Delete')">
            <CIcon name="fas:trash" source="fa" :size="13" style="width:14px" />
            Delete file
          </CListItem>
        </CList>
      </CCardBody>
    </CCard>
  </CMenu>
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
  color: var(--c-app-text-secondary-color);
}
.sep {
  height: 1px;
  background: var(--c-app-border-color);
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
    <CMenu
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
        <CBtn variant="text" :class="item.color" v-bind="activator" v-on="on" style="gap:6px">
          <CIcon :name="item.icon" source="fa" :size="13" />
          {{ item.label }}
        </CBtn>
      </template>

      <CCard class="elevation-4" style="min-width:180px">
        <CCardBody class="py-1 px-0">
          <CList>
            <CListItem v-for="link in item.links" :key="link.label" class="px-4" style="gap:10px">
              <CIcon :name="link.icon" source="fa" :size="12" style="width:14px;opacity:.5" />
              {{ link.label }}
            </CListItem>
          </CList>
        </CCardBody>
      </CCard>
    </CMenu>
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
<CMenu
  width="auto"
  align="bottom"
  :offset-y="8"
  open-on-click
  close-on-click-outside
  close-on-content-click
>
  <template #activator="{ on, activator }">
    <CBtn class="bg-indigo" v-bind="activator" v-on="on">Bottom</CBtn>
  </template>
  <CCard>...</CCard>
</CMenu>

<!-- Opens to the right, vertically centered -->
<CMenu width="auto" align="right-center" :offset-x="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <CBtn class="bg-teal" v-bind="activator" v-on="on">Right</CBtn>
  </template>
  <CCard>...</CCard>
</CMenu>

<!-- Opens above, centered horizontally -->
<CMenu width="auto" align="top-center" :offset-y="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <CBtn class="bg-deep-purple" v-bind="activator" v-on="on">Top center</CBtn>
  </template>
  <CCard>...</CCard>
</CMenu>
```

:::

## Context menu

Use `position-x` / `position-y` to anchor the menu to fixed coordinates instead of an activator element.

<ContextMenuExample />

::: details Show code

```vue
<template>
  <div class="area" @contextmenu.prevent="onContextMenu">Right-click anywhere</div>

  <CMenu
    v-model="open"
    :position-x="x"
    :position-y="y"
    width="auto"
    close-on-click-outside
    close-on-content-click
  >
    <CCard class="elevation-4" style="min-width:200px">
      <CCardBody class="py-1 px-0">
        <CList>
          <CListItem class="px-4" style="gap:12px" @click="toast('Opened')">
            <CIcon name="fas:eye" source="fa" :size="13" style="width:14px;opacity:.5" /> Open
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="toast('Renamed')">
            <CIcon name="fas:pen" source="fa" :size="13" style="width:14px;opacity:.5" /> Rename
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="toast('Copied')">
            <CIcon name="fas:link" source="fa" :size="13" style="width:14px;opacity:.5" /> Copy path
          </CListItem>
        </CList>
        <div class="sep" />
        <CList>
          <CListItem class="px-4" style="gap:12px;color:#f44336" @click="toast('Deleted')">
            <CIcon name="fas:trash" source="fa" :size="13" style="width:14px" /> Move to Trash
          </CListItem>
        </CList>
      </CCardBody>
    </CCard>
  </CMenu>
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
  border: 2px dashed var(--c-app-border-color);
  border-radius: 8px;
}
.sep {
  height: 1px;
  background: var(--c-app-border-color);
}
</style>
```

:::

## Width

By default CMenu inherits the width of its activator element. Pass `width="auto"` to let the content define its own width, or pass a fixed value.

```html
<!-- Stretches to fill the activator (default) -->
<CMenu align="bottom">...</CMenu>

<!-- Content determines its own width -->
<CMenu align="bottom" width="auto">...</CMenu>

<!-- Fixed width -->
<CMenu align="bottom" :width="240">...</CMenu>
```

## Collision strategies

`strategy="reverse"` flips to the opposite side when there is not enough space. `strategy="bounce"` keeps the menu inside the viewport by shifting it.

```html
<!-- Flip above when there's no room below -->
<CMenu align="bottom" strategy="reverse" open-on-click>...</CMenu>

<!-- Stay inside the viewport edges -->
<CMenu align="bottom" strategy="bounce" open-on-click>...</CMenu>
```

## v-model

Control the open state from outside the component.

```vue
<template>
  <CMenu v-model="open" align="bottom">
    <template #activator="{ on, activator }">
      <button v-bind="activator" v-on="on">Toggle</button>
    </template>
    <div>Content</div>
  </CMenu>
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
<CMenu role="menu" aria-label="Actions" open-on-click align="bottom"> ... </CMenu>
```

---

## API

### Props

| Prop                  | Type                                                       | Default         | Description                                                                              |
| --------------------- | ---------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                                  | `false`         | Controls the open state                                                                  |
| `openOnClick`         | `boolean`                                                  | —               | Open when the activator is clicked                                                       |
| `closeOnClick`        | `boolean`                                                  | —               | Toggle closed on repeated activator click                                                |
| `openOnHover`         | `boolean`                                                  | —               | Open on mouseenter                                                                       |
| `closeOnLeave`        | `boolean`                                                  | —               | Close on mouseleave                                                                      |
| `openOnFocus`         | `boolean`                                                  | —               | Open when the activator receives focus                                                   |
| `closeOnClickOutside` | `boolean`                                                  | —               | Close when clicking outside the menu                                                     |
| `closeOnContentClick` | `boolean`                                                  | —               | Close when clicking inside the menu content                                              |
| `align`               | `AlignValue`                                               | —               | Side + cross-axis alignment. E.g. `bottom`, `top-center`, `right-center`, `bottom-right` |
| `offsetX`             | `number \| string`                                         | —               | Horizontal offset in px                                                                  |
| `offsetY`             | `number \| string`                                         | —               | Vertical offset in px                                                                    |
| `positionX`           | `number`                                                   | —               | Fixed X coordinate (detaches from activator)                                             |
| `positionY`           | `number`                                                   | —               | Fixed Y coordinate (detaches from activator)                                             |
| `strategy`            | `'reverse' \| 'bounce'`                                    | —               | Collision handling strategy                                                              |
| `width`               | `number \| string`                                         | activator width | Content width                                                                            |
| `height`              | `number \| string`                                         | —               | Content height                                                                           |
| `minWidth`            | `number \| string`                                         | —               | Minimum content width                                                                    |
| `maxWidth`            | `number \| string`                                         | —               | Maximum content width                                                                    |
| `minHeight`           | `number \| string`                                         | —               | Minimum content height                                                                   |
| `maxHeight`           | `number \| string`                                         | —               | Maximum content height                                                                   |
| `openDelay`           | `number \| string`                                         | —               | Delay before opening (ms)                                                                |
| `closeDelay`          | `number \| string`                                         | —               | Delay before closing (ms)                                                                |
| `transition`          | `string`                                                   | `'fade'`        | Vue transition name applied to the content                                               |
| `ssr`                 | `boolean`                                                  | —               | Pre-render content on the server                                                         |
| `activator`           | `Element \| ComponentPublicInstance \| 'parent' \| string` | —               | External activator, CSS selector, or parent element                                      |

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
