# Быстрый старт

Это руководство описывает два режима подключения — выберите подходящий.

## Выбор варианта

| | Готовый CSS | SCSS + JIT |
|---|---|---|
| Утилитарные классы | Фиксированные брейкпоинты | **Настраиваемые брейкпоинты** |
| Произвольные значения (`w-[320px]`) | ✗ | ✓ через `@vueland/utils-jit` |
| Кастомные брейкпоинты | ✗ | ✓ один конфиг, все слои синхронизированы |
| Сложность подключения | Минимальная | Требует Vite + SCSS |

---

## Вариант A — Готовый CSS (быстрый старт)

Подходит для проектов, которым не нужны кастомные брейкпоинты и произвольные значения утилит.

### 1. Установка

```bash
pnpm add @vueland/ui
```

### 2. Создание плагина

```ts
// src/plugins/vueland.ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css'     // ресет и переменные
import '@vueland/ui/css/lib.css'    // стили компонентов
import '@vueland/ui/css/utils.css'  // утилиты

export const vueland = createVuelandUI({
  components,
  theme: 'light',
  themes: {
    light: { primary: '#1976d2', /* ... */ },
  },
})
```

### 3. Подключение к приложению

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { vueland } from './plugins/vueland'

createApp(App).use(vueland).mount('#app')
```

---

## Вариант B — SCSS + JIT (рекомендуется)

Полное подключение с кастомными брейкпоинтами, произвольными значениями утилит и единой точкой конфигурации адаптивности.

**Требования:** Vite, Sass (`pnpm add -D sass`).

### 1. Установка

```bash
pnpm add @vueland/ui
pnpm add -D @vueland/utils-jit sass
```

### 2. Настройка Vite

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

> `breakpoints` здесь становятся единственной точкой истины — они управляют JIT-классами (`sm:w-[960px]`), предопределёнными SCSS-утилитами (`md:d-flex`) и composable `useDisplay` одновременно.

### 3. Создание SCSS точки входа

```scss
/* src/styles/main.scss */

/* 1. Утилиты, CSS-переменные, reset */
@use '@vueland/ui/styles/styles.scss';

/* 2. Стили компонентов */
@use '@vueland/ui/styles/lib.scss';

/* 2. Утилиты */
@use '@vueland/ui/styles/utils.scss';

/* 3. Ваши стили */
@use './variables';
@use './overrides';
```

> **Почему `@use`, а не `@import`?**
> `@use` — это современная система модулей Sass: переменные изолированы и не дублируются. `@import` считается устаревшим.

### 4. Создание плагина

```ts
// src/plugins/vueland.ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'

export const vueland = createVuelandUI({
  components,
  theme: 'light',
  themes: {
    light: { primary: '#1976d2', /* ... */ },
  },
  // breakpoints подтягиваются из utils-jit автоматически
  // передайте явно только если хотите переопределить их для useDisplay
})
```

### 5. Подключение к приложению

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { vueland } from './plugins/vueland'

// SCSS точка входа (Vite компилирует автоматически)
import './styles/main.scss'

// JIT-сгенерированные утилиты
import 'src/.generated/utils-jit.css'

createApp(App).use(vueland).mount('#app')
```

### 6. Использование утилитарных классов

```vue
<template>
  <!-- Предопределённые утилиты с адаптивными вариантами -->
  <div class="d-flex flex-col md:flex-row gap-4 pa-4">

    <!-- Произвольные значения через JIT -->
    <div class="w-[320px] h-[200px] bg-[#42b883] radius-[8px]">
      Карточка
    </div>

    <!-- Адаптивные JIT-классы -->
    <div class="w-[100%] md:w-[480px] lg:w-[640px]">
      Сайдбар
    </div>

  </div>
</template>
```

---

## Структура проекта (Вариант B)

```
src/
├── plugins/
│   └── vueland.ts        ← createVuelandUI
├── styles/
│   ├── main.scss         ← SCSS точка входа: @use vueland + свои стили
│   ├── variables.scss    ← ваши SCSS-переменные
│   └── overrides.scss    ← переопределения компонентов
├── .generated/
│   └── utils-jit.css     ← генерируется автоматически (добавьте в .gitignore)
├── main.ts               ← импорт стилей + монтирование приложения
└── App.vue
```

Добавьте `.generated/` в `.gitignore`:

```
src/.generated/
```

---

## Опции `createVuelandUI`

| Опция | Тип | Описание |
|---|---|---|
| `components` | `Record` | Компоненты для глобальной регистрации |
| `theme` | `string` | Активная тема при старте |
| `themes` | `ThemesOptions` | Определения цветов темы |
| `icons` | `IconsOptions` | Наборы иконок и псевдонимы |
| `presets` | `Record` | Пресеты стилей компонентов |
| `breakpoints` | `Record<string, number>` | Кастомные брейкпоинты для `useDisplay`. При использовании `utils-jit` подтягиваются автоматически — явное значение имеет приоритет. Подробнее в [Брейкпоинты](/ru/guide/breakpoints) |
| `ssr` | `boolean` | Поддержка SSR |
