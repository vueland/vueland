# CMenu

Плавающий контейнер контента, который позиционирует себя относительно элемента-активатора. Используется как основа для выпадающих меню, select'ов, тултипов и других overlay-компонентов.

<script setup>
import BasicExample from '../../examples/CMenu/BasicExample.vue'
import HoverExample from '../../examples/CMenu/HoverExample.vue'
import PositioningExample from '../../examples/CMenu/PositioningExample.vue'
import ContextMenuExample from '../../examples/CMenu/ContextMenuExample.vue'
</script>

## Базовое использование

<BasicExample />

::: details Показать код
```vue
<template>
  <CMenu width="auto" open-on-click close-on-click-outside close-on-content-click align="bottom" :offset-y="4">
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
            <CIcon name="fas:plus"   source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Новый файл</span>
            <span class="kb">⌘N</span>
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="notify('Save')">
            <CIcon name="fas:save"   source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Сохранить</span>
            <span class="kb">⌘S</span>
          </CListItem>
        </CList>
        <div class="sep" />
        <CList>
          <CListItem class="px-4" style="gap:12px;color:#f44336" @click="notify('Delete')">
            <CIcon name="fas:trash" source="fa" :size="13" style="width:14px" />
            Удалить
          </CListItem>
        </CList>
      </CCardBody>
    </CCard>
  </CMenu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('')
function notify(text: string) { msg.value = text }
</script>

<style scoped>
.kb  { font-size: 11px; color: var(--c-app-text-secondary-color) }
.sep { height: 1px; background: var(--c-app-border-color); margin: 4px 0 }
</style>
```
:::

## Hover

`open-on-hover` + `close-on-leave` для меню при наведении. `open-delay` / `close-delay` предотвращают случайные срабатывания.

<HoverExample />

::: details Показать код
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
            <CListItem
              v-for="link in item.links"
              :key="link.label"
              class="px-4"
              style="gap:10px"
            >
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
    label: 'Продукты', icon: 'fas:briefcase', color: 'text-indigo',
    links: [
      { icon: 'fas:list-ul', label: 'UI-компоненты' },
      { icon: 'fas:image',   label: 'Иконки' },
    ],
  },
  {
    label: 'Документы', icon: 'fas:code', color: 'text-teal',
    links: [
      { icon: 'fas:home', label: 'Начало работы' },
      { icon: 'fas:file', label: 'Компоненты' },
    ],
  },
]
</script>

<style scoped>
.text-indigo { color: #3f51b5 !important }
.text-teal   { color: #009688 !important }
</style>
```
:::

## Позиционирование

`align` управляет стороной и выравниванием. `offsetX` / `offsetY` добавляют отступ.

<PositioningExample />

::: details Показать код
```html
<!-- Снизу от активатора -->
<CMenu width="auto" align="bottom" :offset-y="8" open-on-click close-on-click-outside close-on-content-click>
  <template #activator="{ on, activator }">
    <CBtn class="bg-indigo" v-bind="activator" v-on="on">Снизу</CBtn>
  </template>
  <CCard>...</CCard>
</CMenu>

<!-- Справа, с вертикальным центрированием -->
<CMenu width="auto" align="right-center" :offset-x="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <CBtn class="bg-teal" v-bind="activator" v-on="on">Справа</CBtn>
  </template>
  <CCard>...</CCard>
</CMenu>
```
:::

## Контекстное меню

`position-x` / `position-y` привязывают меню к фиксированным координатам вместо активатора.

<ContextMenuExample />

::: details Показать код
```vue
<template>
  <div class="area" @contextmenu.prevent="onContextMenu">
    Правый клик в этой области
  </div>

  <CMenu v-model="open" :position-x="x" :position-y="y" width="auto" close-on-click-outside close-on-content-click>
    <CCard class="elevation-4" style="min-width:200px">
      <CCardBody class="py-1 px-0">
        <CList>
          <CListItem class="px-4" style="gap:12px" @click="toast('Открыто')">
            <CIcon name="fas:eye"  source="fa" :size="13" style="width:14px;opacity:.5" /> Открыть
          </CListItem>
          <CListItem class="px-4" style="gap:12px" @click="toast('Переименовано')">
            <CIcon name="fas:pen"  source="fa" :size="13" style="width:14px;opacity:.5" /> Переименовать
          </CListItem>
        </CList>
        <div class="sep" />
        <CList>
          <CListItem class="px-4" style="gap:12px;color:#f44336" @click="toast('Удалено')">
            <CIcon name="fas:trash" source="fa" :size="13" style="width:14px" /> В корзину
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
function toast(msg: string) { console.log(msg) }
</script>

<style scoped>
.area { padding: 48px; text-align: center; border: 2px dashed var(--c-app-border-color); border-radius: 8px }
.sep  { height: 1px; background: var(--c-app-border-color) }
</style>
```
:::

## Ширина

По умолчанию CMenu наследует ширину элемента-активатора. Передай `width="auto"` чтобы контент сам определял ширину, или укажи фиксированное значение.

```html
<!-- Растягивается по ширине активатора (по умолчанию) -->
<CMenu align="bottom">...</CMenu>

<!-- Ширина определяется контентом -->
<CMenu align="bottom" width="auto">...</CMenu>

<!-- Фиксированная ширина -->
<CMenu align="bottom" :width="240">...</CMenu>
```

## Стратегии коллизий

`strategy="reverse"` переворачивает меню при нехватке места. `strategy="bounce"` удерживает внутри viewport.

```vue
<CMenu align="bottom" strategy="reverse" open-on-click>
  ...
</CMenu>
```

## v-model

```vue
<template>
  <CMenu v-model="open">
    <template #activator="{ on, activator }">
      <button v-bind="activator" v-on="on">Переключить</button>
    </template>
    <div>Контент</div>
  </CMenu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
```

## ARIA

CMenu не добавляет ARIA-атрибуты самостоятельно. Передавай `role` и `aria-*` напрямую:

```vue
<CMenu role="menu" aria-label="Действия" open-on-click>
  ...
</CMenu>
```

---

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `modelValue` | `boolean` | `false` | Управляет состоянием открытия |
| `openOnClick` | `boolean` | — | Открыть по клику |
| `closeOnClick` | `boolean` | — | Закрыть по повторному клику |
| `openOnHover` | `boolean` | — | Открыть при наведении |
| `closeOnLeave` | `boolean` | — | Закрыть при уходе курсора |
| `openOnFocus` | `boolean` | — | Открыть при фокусе |
| `closeOnClickOutside` | `boolean` | — | Закрыть при клике вне меню |
| `closeOnContentClick` | `boolean` | — | Закрыть при клике внутри контента |
| `align` | `AlignValue` | — | Сторона и выравнивание (напр. `bottom`, `top-center`, `right-center`) |
 |
 |
 |
| `offsetX` | `number \| string` | — | Горизонтальный отступ (px) |
| `offsetY` | `number \| string` | — | Вертикальный отступ (px) |
| `positionX` | `number` | — | Фиксированная координата X |
| `positionY` | `number` | — | Фиксированная координата Y |
| `strategy` | `'reverse' \| 'bounce'` | — | Стратегия при коллизии |
| `width` | `number \| string` | ширина активатора | Ширина контента |
| `height` | `number \| string` | — | Высота контента |
| `minWidth` | `number \| string` | — | Минимальная ширина |
| `maxWidth` | `number \| string` | — | Максимальная ширина |
| `minHeight` | `number \| string` | — | Минимальная высота |
| `maxHeight` | `number \| string` | — | Максимальная высота |
| `openDelay` | `number \| string` | — | Задержка перед открытием (мс) |
| `closeDelay` | `number \| string` | — | Задержка перед закрытием (мс) |
| `transition` | `string` | `'fade'` | Имя Vue-перехода |
| `ssr` | `boolean` | — | Пре-рендер на сервере |
| `activator` | `Element \| ComponentPublicInstance` | — | Внешний элемент-активатор |

### Slots

| Slot | Props | Описание |
|------|-------|----------|
| `activator` | `{ on, activator }` | Элемент-активатор |
| `default` | — | Контент меню |

### Events

| Событие | Аргументы | Описание |
|---------|-----------|----------|
| `update:modelValue` | `boolean` | Изменение состояния |
| `open` | — | Меню открылось |
| `close` | — | Меню закрылось |
| `click` | — | Клик по контенту |
| `outside-click` | — | Клик вне меню |

### Expose

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `open` | `() => void` | Открыть меню |
| `close` | `() => void` | Закрыть меню |
| `toggle` | `() => void` | Переключить меню |
