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
            <span style="flex:1">Новый файл</span>
            <span class="kb">⌘N</span>
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="notify('Save')">
            <c-icon name="fas:save" source="fa" :size="13" style="width:14px;opacity:.55" />
            <span style="flex:1">Сохранить</span>
            <span class="kb">⌘S</span>
          </c-list-item>
        </c-list>
        <div class="sep" />
        <c-list>
          <c-list-item class="px-4" style="gap:12px;color:#f44336" @click="notify('Delete')">
            <c-icon name="fas:trash" source="fa" :size="13" style="width:14px" />
            Удалить
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

`open-on-hover` + `close-on-leave` для меню при наведении. `open-delay` / `close-delay` предотвращают случайные срабатывания.

<HoverExample />

::: details Показать код

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
    label: 'Продукты',
    icon: 'fas:briefcase',
    color: 'text-indigo',
    links: [
      { icon: 'fas:list-ul', label: 'UI-компоненты' },
      { icon: 'fas:image', label: 'Иконки' },
    ],
  },
  {
    label: 'Документы',
    icon: 'fas:code',
    color: 'text-teal',
    links: [
      { icon: 'fas:home', label: 'Начало работы' },
      { icon: 'fas:file', label: 'Компоненты' },
    ],
  },
]
</script>

<style scoped>
.text-indigo {
  color: #3f51b5 !important;
}
.text-teal {
  color: #009688 !important;
}
</style>
```

:::

## Позиционирование

`align` управляет стороной и выравниванием. `offsetX` / `offsetY` добавляют отступ.

Если меню находится внутри элемента-активатора, передай `activator="parent"` — `CMenu` привяжет события к родительскому DOM-элементу и не будет рендерить слот `activator`.

<PositioningExample />

::: details Показать код

```html
<!-- Снизу от активатора -->
<c-menu
  width="auto"
  align="bottom"
  :offset-y="8"
  open-on-click
  close-on-click-outside
  close-on-content-click
>
  <template #activator="{ on, activator }">
    <c-btn class="bg-indigo" v-bind="activator" v-on="on">Снизу</c-btn>
  </template>
  <c-card>...</c-card>
</c-menu>

<!-- Справа, с вертикальным центрированием -->
<c-menu width="auto" align="right-center" :offset-x="8" open-on-click close-on-click-outside>
  <template #activator="{ on, activator }">
    <c-btn class="bg-teal" v-bind="activator" v-on="on">Справа</c-btn>
  </template>
  <c-card>...</c-card>
</c-menu>
```

:::

## Контекстное меню

`position-x` / `position-y` привязывают меню к фиксированным координатам вместо активатора.

<ContextMenuExample />

::: details Показать код

```vue
<template>
  <div class="area" @contextmenu.prevent="onContextMenu">Правый клик в этой области</div>

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
          <c-list-item class="px-4" style="gap:12px" @click="toast('Открыто')">
            <c-icon name="fas:eye" source="fa" :size="13" style="width:14px;opacity:.5" /> Открыть
          </c-list-item>
          <c-list-item class="px-4" style="gap:12px" @click="toast('Переименовано')">
            <c-icon name="fas:pen" source="fa" :size="13" style="width:14px;opacity:.5" />
            Переименовать
          </c-list-item>
        </c-list>
        <div class="sep" />
        <c-list>
          <c-list-item class="px-4" style="gap:12px;color:#f44336" @click="toast('Удалено')">
            <c-icon name="fas:trash" source="fa" :size="13" style="width:14px" /> В корзину
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

## Ширина

По умолчанию CMenu наследует ширину элемента-активатора. Передай `width="auto"` чтобы контент сам определял ширину, или укажи фиксированное значение.

```html
<!-- Растягивается по ширине активатора (по умолчанию) -->
<c-menu align="bottom">...</c-menu>

<!-- Ширина определяется контентом -->
<c-menu align="bottom" width="auto">...</c-menu>

<!-- Фиксированная ширина -->
<c-menu align="bottom" :width="240">...</c-menu>
```

## Стратегии коллизий

`strategy="reverse"` переворачивает меню при нехватке места. `strategy="bounce"` удерживает внутри viewport.

```vue
<c-menu align="bottom" strategy="reverse" open-on-click>
  ...
</c-menu>
```

## v-model

```vue
<template>
  <c-menu v-model="open">
    <template #activator="{ on, activator }">
      <button v-bind="activator" v-on="on">Переключить</button>
    </template>
    <div>Контент</div>
  </c-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
```

## ARIA

CMenu не добавляет ARIA-атрибуты самостоятельно. Передавай `role` и `aria-*` напрямую:

```vue
<c-menu role="menu" aria-label="Действия" open-on-click>
  ...
</c-menu>
```

---

## API

### Props

| Prop                  | Тип                                                        | По умолчанию      | Описание                                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                                  | `false`           | Управляет состоянием открытия                                                                                                                                                                               |
| `openOnClick`         | `boolean`                                                  | —                 | Открыть по клику                                                                                                                                                                                            |
| `closeOnClick`        | `boolean`                                                  | —                 | Закрыть по повторному клику                                                                                                                                                                                 |
| `openOnHover`         | `boolean`                                                  | —                 | Открыть при наведении                                                                                                                                                                                       |
| `closeOnLeave`        | `boolean`                                                  | —                 | Закрыть при уходе курсора                                                                                                                                                                                   |
| `openOnFocus`         | `boolean`                                                  | —                 | Открыть при фокусе                                                                                                                                                                                          |
| `closeOnClickOutside` | `boolean`                                                  | —                 | Закрыть при клике вне меню                                                                                                                                                                                  |
| `closeOnContentClick` | `boolean`                                                  | —                 | Закрыть при клике внутри контента                                                                                                                                                                           |
| `align`               | `AlignValue`                                               | —                 | Сторона и выравнивание (напр. `bottom`, `top-center`, `right-center`)                                                                                                                                       |
| `offsetX`             | `number \| string`                                         | —                 | Горизонтальный отступ (px)                                                                                                                                                                                  |
| `offsetY`             | `number \| string`                                         | —                 | Вертикальный отступ (px)                                                                                                                                                                                    |
| `positionX`           | `number`                                                   | —                 | Фиксированная координата X                                                                                                                                                                                  |
| `positionY`           | `number`                                                   | —                 | Фиксированная координата Y                                                                                                                                                                                  |
| `strategy`            | `'reverse' \| 'bounce'`                                    | —                 | Стратегия при коллизии                                                                                                                                                                                      |
| `width`               | `number \| string`                                         | ширина активатора | Ширина контента                                                                                                                                                                                             |
| `height`              | `number \| string`                                         | —                 | Высота контента                                                                                                                                                                                             |
| `minWidth`            | `number \| string`                                         | —                 | Минимальная ширина                                                                                                                                                                                          |
| `maxWidth`            | `number \| string`                                         | —                 | Максимальная ширина                                                                                                                                                                                         |
| `minHeight`           | `number \| string`                                         | —                 | Минимальная высота                                                                                                                                                                                          |
| `maxHeight`           | `number \| string`                                         | —                 | Максимальная высота                                                                                                                                                                                         |
| `openDelay`           | `number \| string`                                         | —                 | Задержка перед открытием (мс)                                                                                                                                                                               |
| `closeDelay`          | `number \| string`                                         | —                 | Задержка перед закрытием (мс)                                                                                                                                                                               |
| `transition`          | `string`                                                   | `'fade'`          | Имя Vue-перехода                                                                                                                                                                                            |
| `ssr`                 | `boolean`                                                  | —                 | Пре-рендер на сервере                                                                                                                                                                                       |
| `activator`           | `Element \| ComponentPublicInstance \| 'parent' \| string` | —                 | Внешний активатор, CSS-селектор или родительский элемент                                                                                                                                                    |
| `preset`              | `string`                                                   | —                 | Путь пресета `CMenuPreset` в реестре (зона `root`, состояния `opened` / `closed`). Внутри CSelect / CAutocomplete меню также берёт вложенный `CMenuPreset` из поля `menu` пресета комбобокса через контекст |

### CSS-переменные

| Переменная               | Значение по умолчанию                       | Описание                 |
| ------------------------ | ------------------------------------------- | ------------------------ |
| `--c-menu-bg-color`      | `var(--c-sys-color-surface-container-high)` | Фон меню                 |
| `--c-menu-text-color`    | `var(--c-sys-color-on-surface)`             | Цвет текста              |
| `--c-menu-border-radius` | `var(--c-sys-shape-lg)`                     | Скругление контейнера    |
| `--c-menu-elevation`     | `var(--c-sys-elevation-3)`                  | Тень контейнера          |
| `--c-menu-max-height`    | `100%`                                      | Максимальная высота меню |

### Slots

| Slot        | Props               | Описание          |
| ----------- | ------------------- | ----------------- |
| `activator` | `{ on, activator }` | Элемент-активатор |
| `default`   | —                   | Контент меню      |

### Events

| Событие             | Аргументы | Описание            |
| ------------------- | --------- | ------------------- |
| `update:modelValue` | `boolean` | Изменение состояния |
| `open`              | —         | Меню открылось      |
| `close`             | —         | Меню закрылось      |
| `click`             | —         | Клик по контенту    |
| `outside-click`     | —         | Клик вне меню       |

### Expose

| Метод    | Сигнатура    | Описание         |
| -------- | ------------ | ---------------- |
| `open`   | `() => void` | Открыть меню     |
| `close`  | `() => void` | Закрыть меню     |
| `toggle` | `() => void` | Переключить меню |
