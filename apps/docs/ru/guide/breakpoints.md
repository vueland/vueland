# Брейкпоинты

Vueland использует **единую систему брейкпоинтов**, которая охватывает четыре слоя:

- **CSS-утилиты** — предопределённые отзывчивые классы вида `sm:d-flex`, `md:pa-4`
- **JIT-классы** — произвольные отзывчивые классы вида `sm:bg-[#fff]`, `lg:w-[960px]`
- **`useBreakpoints`** — реактивный JS-composable, отдающий текущее состояние экрана
- **Компоненты сетки** — `CRow` и `CCol` используют те же брейкпоинты для адаптивной ширины колонок и пропов выравнивания (например, `md="6"`, `align-lg="center"`)

Подробнее про компоненты — в разделе [Сетка](/ru/components/CRow).

По умолчанию каждый слой имеет встроенные значения. При настройке кастомных брейкпоинтов все четыре слоя синхронизируются автоматически.

## Брейкпоинты по умолчанию

| Название | min-width | CSS-префикс |
|----------|-----------|-------------|
| xs   | 0         | — (нет префикса) |
| sm   | 600px     | `sm:` |
| md   | 960px     | `md:` |
| lg   | 1280px    | `lg:` |
| xl   | 1920px    | `xl:` |
| xxl  | 2560px    | `xxl:` |

## Полная настройка шаг за шагом

Этот раздел показывает как подключить весь стек — кастомные брейкпоинты, SCSS-утилиты, компоненты сетки и `useBreakpoints` — из единой конфигурации.

### Шаг 1 — установите пакеты

::: code-group

```bash [pnpm]
pnpm add @vueland/ui
pnpm add -D @vueland/utils-jit
```

```bash [npm]
npm install @vueland/ui
npm install -D @vueland/utils-jit
```

```bash [yarn]
yarn add @vueland/ui
yarn add -D @vueland/utils-jit
```

:::

### Шаг 2 — настройте Vite

Добавьте `utilsJIT()` в плагины и укажите брейкпоинты. Это **единственное место**, где их нужно определить — плагин сам распространит значения на все слои.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    vue(),
    utilsJIT({
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    }),
  ],
})
```

### Шаг 3 — импортируйте стили именно как SCSS

::: warning Импортируйте SCSS-исходник, а не скомпилированный CSS
Это самый важный шаг. Значения брейкпоинтов внедряются в SCSS **на этапе компиляции** Vite-плагином. Если импортировать готовый скомпилированный файл (`@vueland/ui/dist/styles.css`) вместо SCSS-исходника, плагину нечего перехватывать — кастомные брейкпоинты не попадут ни в утилитарные классы, ни в компоненты сетки.
:::

В точке входа приложения импортируйте оба SCSS-исходника:

```ts
// src/main.ts
import '@vueland/ui/styles/styles.scss'  // CSS-переменные
import '@vueland/ui/styles/lib.scss'     // стили компонентов
import '@vueland/ui/styles/utils.scss'   // утилиты
```

Это запускает SCSS-препроцессор Vite, в ходе которого плагин перехватывает компиляцию и подставляет ваши значения в переменную `$grid-breakpoints`. В результате все четыре слоя — предопределённые утилиты (`sm:d-flex`), JIT-классы, media-запросы компонентов сетки и `useBreakpoints` — работают с одними и теми же числами.

Также импортируйте сгенерированный JIT CSS:

```ts
// src/main.ts
import 'src/.generated/utils-jit.css'
```

### Шаг 4 — зарегистрируйте библиотеку

```ts
// src/main.ts
import { createApp } from 'vue'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'

import '@vueland/ui/styles/styles.scss'
import '@vueland/ui/styles/lib.scss'
import '@vueland/ui/styles/utils.scss'
import 'src/.generated/utils-jit.css'

import App from './App.vue'

const app = createApp(App)

const vueland = createVuelandUI({
  components,
  // передавать breakpoints сюда не нужно — utils-jit внедряет их на этапе сборки
})

app.use(vueland)
app.mount('#app')
```

Если вы передадите `breakpoints` явно в `createVuelandUI`, эти значения перекроют значения из `utils-jit` только для `useBreakpoints`. Компиляция SCSS к тому моменту уже завершена, поэтому брейкпоинты утилитарных классов всегда берутся из Vite-плагина.

### Шаг 5 — используйте

Всё подключено. Отзывчивые утилиты, пропы компонентов сетки и `useBreakpoints` реагируют на одни и те же брейкпоинты.

**Утилитарные классы** — применяются начиная с указанного брейкпоинта вверх (mobile-first):

```html
<div class="pa-2 md:pa-6 lg:pa-10">отступы растут с экраном</div>
<div class="d-none md:d-flex">скрыт на мобильных</div>
<div class="text-center lg:text-left">выравнивание меняется на десктопе</div>
```

**JIT-классы с произвольными значениями** — те же адаптивные префиксы:

```html
<div class="w-[100%] md:w-[720px] lg:w-[960px]">адаптивная ширина</div>
```

**Компоненты сетки** — `cols` задаёт базовую ширину, брейкпоинт-пропы переопределяют её вверх:

```html
<c-row>
  <!-- полная ширина на мобильных, половина с sm, треть с md -->
  <c-col cols="12" sm="6" md="4">
    <c-card class="pa-4 elevation-2">Карточка</c-card>
  </c-col>
</c-row>
```

Выравнивание строки тоже реагирует на брейкпоинты:

```html
<c-row align="start" align-md="center" justify="start" justify-lg="space-between">
  <c-col cols="4">A</c-col>
  <c-col cols="4">B</c-col>
</c-row>
```

**`useBreakpoints`** — реактивные булевые значения в JS/Vue, синхронизированные с теми же числами:

```vue

<script setup lang="ts">
  import { useBreakpoints } from '@vueland/ui/composables'

  const { mdAndUp } = useBreakpoints()
</script>

<template>
  <c-row>
    <c-col :cols="mdAndUp ? 6 : 12">
      Адаптивная колонка через JS
    </c-col>
  </c-row>
</template>
```

## Кастомизация

### С `@vueland/utils-jit` (рекомендуется)

Настройте брейкпоинты один раз в `vite.config.ts` — плагин синхронизирует все четыре слоя автоматически. Подробности — в [Шаге 2](#шаг-2-настройте-vite) выше.

### Без `@vueland/utils-jit`

Передайте брейкпоинты напрямую в `createVuelandUI`. Это управляет `useBreakpoints` и SCSS-утилитами (только если вы сами собираете SCSS из исходников).

```ts
const vueland = createVuelandUI({
  components,
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
  },
})
```

Брейкпоинты колонок сетки (`sm="6"`, `md="4"`) формируются на этапе компиляции SCSS и этой опцией не управляются. Без `utils-jit` для их изменения нужно переопределить переменную `$grid-breakpoints` в SCSS вручную.

### Приоритет

| Источник | Приоритет                                                                     |
|----------|-------------------------------------------------------------------------------|
| `createVuelandUI({ breakpoints })` | **высший** — управляет только `useBreakpoints`                                |
| `utilsJIT({ breakpoints })` | управляет SCSS-утилитами, компонентами сетки, `useBreakpoints` и JIT-классами |
| Встроенные значения | запасной вариант                                                              |

## Отзывчивые CSS-утилиты

Предопределённые утилиты следуют паттерну `{bp}:{class}` и применяются начиная с указанного брейкпоинта (mobile-first, `min-width`):

```html
<!-- скрыт на мобильных, виден с md и выше -->
<div class="d-none md:d-block">...</div>

<!-- отступы растут с размером экрана -->
<div class="pa-2 md:pa-4 xl:pa-6">...</div>

<!-- направление flex меняется на планшете -->
<div class="d-flex flex-col md:flex-row gap-4">...</div>
```

## Composable `useBreakpoints`

`useBreakpoints` возвращает реактивные boolean-рефы для текущего состояния экрана в JS/Vue-коде.

```vue
<template>
  <div>
    <p v-if="display.xs">Мобильный</p>
    <p v-if="display.mdAndUp">Планшет и выше</p>
    <p v-if="display.lgAndLess">До десктопа</p>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { $BREAKPOINTS_KEY } from '@vueland/ui/constants'

const display = inject($BREAKPOINTS_KEY)!
</script>
```

### Доступные свойства

Все свойства — реактивные `Ref<boolean>`.

#### Точные брейкпоинты

| Свойство | Условие |
|----------|---------|
| `display.xs` | width < sm |
| `display.sm` | sm ≤ width < md |
| `display.md` | md ≤ width < lg |
| `display.lg` | lg ≤ width < xl |
| `display.xl` | xl ≤ width < xxl |
| `display.xxl` | width ≥ xxl |

#### Диапазонные хелперы

| Свойство | Условие |
|----------|---------|
| `display.smAndUp` | width ≥ sm |
| `display.mdAndUp` | width ≥ md |
| `display.lgAndUp` | width ≥ lg |
| `display.xlAndUp` | width ≥ xl |
| `display.smAndLess` | sm < width ≤ md |
| `display.mdAndLess` | md < width ≤ lg |
| `display.lgAndLess` | lg < width ≤ xl |
| `display.xlAndLess` | xl < width ≤ xxl |
