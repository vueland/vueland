<div align="center">
  <img src="logo.png" alt="Vueland" style="max-width: 100%;">

  <h1>Vueland</h1>
  <p><strong>Фронтенд-платформа для Vue 3 — компоненты, JIT-утилиты, пресеты и темизация, спроектированные для совместной работы.</strong></p>

  <p>
    <a href="https://vueland.github.io/vueland/ru/guide/getting-started">Документация</a> ·
    <a href="https://vueland.github.io/vueland/ru/components/">Компоненты</a> ·
    <a href="https://vueland.github.io/vueland/ru/utilities/">Утилиты</a> ·
    <a href="https://vueland.github.io/vueland/ru/plugins/">Плагины</a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@vueland/ui"><img src="https://img.shields.io/npm/v/%40vueland%2Fui?logo=npm&color=42b883&label=%40vueland%2Fui" alt="npm @vueland/ui"></a>
    <a href="https://www.npmjs.com/package/@vueland/utils-jit"><img src="https://img.shields.io/npm/v/%40vueland%2Futils-jit?logo=npm&color=42b883&label=%40vueland%2Futils-jit" alt="npm @vueland/utils-jit"></a>
    <a href="https://github.com/vueland/vueland/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/vueland/vueland/ci.yml?branch=master&logo=github&label=CI" alt="CI status"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white" alt="Vue 3">
  </p>

  <p>
    <a href="./README.md">English</a> · <strong>Русский</strong>
  </p>
</div>

---

Vueland — это не просто библиотека компонентов, а фронтенд-платформа для Vue 3. Она объединяет UI-компоненты, JIT-слой утилитарных классов, систему глобальных настроек, composables, директивы и архитектуру плагинов в единую экосистему — ту, которая может расти вместе с продуктом, не требуя смены фундамента на полпути.

Главная идея: используйте компоненты как есть, стилизуйте их утилитарными классами и пресетами или заменяйте крупные визуальные части сложных компонентов — при этом всё поведение, состояние, accessibility-связи и логика взаимодействия остаются внутри компонента.

## ✨ Возможности

- 🧩 **29 компонентов** — от кнопок и чипов до селектов, автокомплита, date picker'ов и диалогов, с продуманной доступностью.
- ⚡ **JIT-движок утилит** — произвольные значения (`w-[320px]`), responsive-варианты (`md:flex-row`), генерация по требованию через [`@vueland/utils-jit`](packages/utils-jit).
- 📏 **Один конфиг брейкпоинтов** — единый источник истины синхронизирует grid, utility-классы и composable `useBreakpoints`.
- 🧬 **Система пресетов** — переиспользуемые визуальные правила применяются ко всем компонентам из одного места.
- 🎨 **Темизация на CSS-переменных** — темы описываются обычными объектами и переключаются в рантайме.
- 🔌 **Slot-first анатомия** — типизированные scoped-слоты открывают внутреннюю структуру сложных компонентов, а дефолтный UI реализован как fallback-контент слотов.
- ⌨️ **Централизованная клавиатурная навигация** — `CKeyboardProvider` даёт меню и спискам общий keyboard loop без ручной обвязки.
- 🟦 **TypeScript-first** — типизированные пропсы, слоты и injection-ключи во всей библиотеке.

## 📦 Пакеты

| Пакет                                                              | Версия                                                                                                                                                  | Описание                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`@vueland/ui`](packages/ui)                                       | [![npm](https://img.shields.io/npm/v/%40vueland%2Fui?color=42b883&label=)](https://www.npmjs.com/package/@vueland/ui)                                   | UI-компоненты, grid-система, composables, движок пресетов |
| [`@vueland/utils-jit`](packages/utils-jit)                         | [![npm](https://img.shields.io/npm/v/%40vueland%2Futils-jit?color=42b883&label=)](https://www.npmjs.com/package/@vueland/utils-jit)                     | Framework-agnostic JIT-движок utility CSS для Vite        |
| [`@vueland/eslint-script-setup`](integrations/eslint-script-setup) | [![npm](https://img.shields.io/npm/v/%40vueland%2Feslint-script-setup?color=42b883&label=)](https://www.npmjs.com/package/@vueland/eslint-script-setup) | ESLint-плагин для стиля кода Vue 3 `script setup`         |

Плагины, адаптеры и расширения добавляются по мере развития платформы.

## 🚀 Быстрый старт

```bash
pnpm add @vueland/ui
```

```ts
// src/plugins/vueland.ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css' // reset и CSS-переменные тем
import '@vueland/ui/css/lib.css' // стили компонентов
import '@vueland/ui/css/utils.css' // utility-классы

export const vueland = createVuelandUI({
  components,
  theme: 'light',
  themes: {
    light: { primary: '#1976d2' /* ... */ },
  },
})
```

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { vueland } from './plugins/vueland'

createApp(App).use(vueland).mount('#app')
```

Это установка с готовым CSS. Для кастомных брейкпоинтов и произвольных значений утилит используйте режим **SCSS + JIT** с `@vueland/utils-jit` — см. [руководство по установке](https://vueland.github.io/vueland/ru/guide/getting-started).

## ⚡ Utility-классы

С JIT-движком предопределённые утилиты и произвольные значения используют один responsive-конфиг:

```vue
<template>
  <c-card class="d-flex flex-col md:flex-row gap-4 pa-4">
    <c-btn color="#42b883" class="w-[100%] md:w-[240px]">Сохранить</c-btn>
    <c-btn class="w-[100%] md:w-[240px]">Отмена</c-btn>
  </c-card>
</template>
```

Конфиг `breakpoints`, переданный в `utilsJIT()` в `vite.config.ts`, управляет responsive-классами JIT, предопределёнными SCSS-утилитами и composable `useBreakpoints` — одновременно.

## 🔌 Анатомия слотов

Сложные компоненты открывают свою внутреннюю визуальную структуру через типизированные scoped-слоты. Каждый слот получает состояние, данные и коллбэки, необходимые для безопасного рендера этой части. Дефолтный UI реализован как fallback-контент слотов — компоненты работают из коробки, а вы заменяете только то, что нужно вашему продукту:

```vue
<c-select v-model="user" :items="users">
  <template #selects="{ items }">
    <user-chip v-for="user in items" :key="user.id" :user="user" />
  </template>

  <template #menu="{ items, onSelect }">
    <user-list>
      <user-list-item
        v-for="user in items"
        :key="user.id"
        :user="user"
        @click="onSelect(user)"
      />
    </user-list>
  </template>
</c-select>
```

## 🗂 Компоненты

| Категория          | Компоненты                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Layout и каркас    | `CApp` `CMain` `CToolbar` `CGrid` `CCard`                                                                       |
| Формы и поля ввода | `CForm` `CField` `CInput` `CTextField` `CSelect` `CSelectControl` `CAutocomplete` `CCheckbox` `CRadio` `CLabel` |
| Даты               | `CDateInput` `CDatePicker`                                                                                      |
| Оверлеи            | `CDialog` `CMenu` `CTooltip` `COverlay` `CScrim`                                                                |
| Действия и данные  | `CBtn` `CChip` `CIcon` `CList`                                                                                  |
| Индикация          | `CProgressLinear` `CProgressCircular`                                                                           |
| Инфраструктура     | `CKeyboardProvider`                                                                                             |

Пропсы, слоты и живые примеры — в [справочнике компонентов](https://vueland.github.io/vueland/ru/components/).

## 📚 Документация

| Раздел                                                                      | Что внутри                                          |
| --------------------------------------------------------------------------- | --------------------------------------------------- |
| [Быстрый старт](https://vueland.github.io/vueland/ru/guide/getting-started) | Установка, режимы «готовый CSS» и SCSS + JIT        |
| [Темизация](https://vueland.github.io/vueland/ru/guide/theming)             | Темы на CSS-переменных, переключение в рантайме     |
| [Брейкпоинты](https://vueland.github.io/vueland/ru/guide/breakpoints)       | Единый responsive-конфиг                            |
| [Пресеты](https://vueland.github.io/vueland/ru/guide/presets)               | Переиспользуемые визуальные правила для компонентов |
| [Иконки](https://vueland.github.io/vueland/ru/guide/icons)                  | Наборы иконок и алиасы                              |
| [Компоненты](https://vueland.github.io/vueland/ru/components/)              | Полный справочник компонентов                       |
| [Утилиты](https://vueland.github.io/vueland/ru/utilities/)                  | Spacing, flex, grid, типографика, цвета и другое    |
| [Настройки](https://vueland.github.io/vueland/ru/settings/)                 | Слой глобальных настроек и CSS-переменные           |
| [Плагины](https://vueland.github.io/vueland/ru/plugins/)                    | `utils-jit` и будущие плагины                       |

## 🚧 Статус проекта

Vueland находится в активной ранней разработке. API, контракты компонентов и структура пакетов будут развиваться по мере роста платформы. Компоненты, готовые к продакшну, отмечены статусом **Stable** в документации.

## 🤝 Contributing

Вклад приветствуется! См. [CONTRIBUTING.md](./CONTRIBUTING.md) — настройка окружения, стратегия веток (GitHub Flow с проверкой именования веток), конвенции коммитов и правила PR. Релизы автоматизированы через changesets.

## ⭐ Поддержи проект

Если Vueland кажется тебе полезным — поставь звезду репозиторию. Это помогает понять, что работа ценна, и даёт мотивацию двигаться вперёд.

**[Поставить звезду на GitHub →](https://github.com/vueland/vueland)**

## 📄 Лицензия

[MIT](./LICENSE)
