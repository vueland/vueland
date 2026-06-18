<div align="center">
  <img src="logo.png" style="max-width: 100%;">
</div>

# Vueland

**Vueland** is a Vue 3 frontend foundation for building interfaces that need both ready-to-use components and deep visual control.

It combines UI components, scoped-slot customization, presets, composables, directives, theming primitives, and a custom JIT utility layer into one ecosystem for application development.

Vueland is not just another UI kit. Its core idea is to let developers use components as-is, style them with utility presets, or replace major visual parts of complex components while keeping their behavior, state, accessibility wiring, and interaction logic inside the component.

## Why Vueland?

Most UI libraries are easy to start with, but difficult to adapt once a project needs a custom design system.

Simple components can usually be styled from the outside. The real problem appears in complex components such as selects, menus, autocomplete fields, date pickers, tables, and other controls that combine state, keyboard interaction, overlays, focus handling, validation, and multiple visual areas.

Vueland is built around this distinction:

- **Primitive components** stay small, predictable, and easy to style from the outside.
- **Complex components** expose replaceable visual areas through typed scoped slots.
- **Fallback UI** is provided by default, so components work immediately without custom markup.
- **Behavior stays inside the component**, while the developer controls the visual output.

## Slot Anatomy

Vueland components use a slot-first architecture for complex UI.

Instead of hardcoding every visual part, a complex component can expose its internal visual anatomy as scoped slots. Each slot receives the state, attributes, callbacks, and data needed to render that part safely.

The default interface is implemented as fallback slot content. This means you can start with the default component and gradually replace only the parts that your product or design system needs.

For example, a select component can expose visual seams such as:

- field
- selected values
- menu content
- item rendering
- details, hints, and errors

The component keeps the model, selection logic, validation, focus state, menu behavior, and accessibility-related wiring. The application controls the markup, layout, icons, and visual composition.

```vue
<template>
  <CSelect v-model="user" :items="users">
    <template #selects="{ items }">
      <UserChip
        v-for="user in items"
        :key="user.id"
        :user="user"
      />
    </template>

    <template #menu="{ items, onSelect }">
      <UserList>
        <UserListItem
          v-for="user in items"
          :key="user.id"
          :user="user"
          @click="onSelect(user)"
        />
      </UserList>
    </template>
  </CSelect>
</template>
```

This approach is useful when a team wants the behavior of a ready-made component, but not the fixed DOM structure or visual design of a traditional component library.

## Styling model

Vueland supports visual customization on multiple levels:

- **Presets** for reusable component styling rules.
- **Utility classes** generated through the JIT utility layer.
- **Scoped slots** for replacing visual sections of complex components.
- **Composables** for reusing behavior and state across custom UI.

The goal is not to force every component into the same customization model. Small primitives should stay simple. Complex components should expose the right visual seams.

## Packages

Vueland currently includes:

### `@vueland/ui`

A Vue 3 UI package focused on composable components, slot-based visual replacement, presets, and reusable interaction patterns.

### `@vueland/utils-jit`

A Vite JIT plugin for generating arbitrary utility classes on demand.

## Project status

Vueland is currently in active early development.

The API, component contracts, package structure, and design system may evolve as the platform grows. The project is being shaped around real-world frontend needs, with a focus on flexibility, maintainability, and developer experience.

## Inspiration

Vueland's internal architecture draws heavily from [Vuetify](https://vuetifyjs.com).
Many of its internal patterns were studied from Vuetify's source
and adapted to fit Vueland's design goals.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, branch strategy, commit conventions, and PR guidelines.

## Branch strategy

The project follows **GitHub Flow**:

- `master` — stable branch, always production-ready. Releases are cut from here.
- All work happens in short-lived branches cut from `master`.
- A branch merges back into `master` via PR after CI passes and code is reviewed.

Branch naming: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` prefix followed by a short description.

## Vision

The long-term vision of Vueland is to become a frontend foundation for Vue 3 projects that need more control than a traditional UI kit, but more structure than fully headless components.

Vueland aims to bring together:

- UI components
- Slot-first component anatomy
- Theme and preset systems
- Utility classes
- Composables
- Directives
- Developer-first workflows

The goal is to help Vue developers build polished applications without losing control over the visual layer.

---

# Vueland

**Vueland** — это frontend-основа для Vue 3, созданная для интерфейсов, которым нужны и готовые компоненты, и глубокий контроль над визуальным слоем.

Платформа объединяет UI-компоненты, кастомизацию через scoped slots, пресеты, composables, директивы, примитивы темизации и собственный JIT-слой utility-классов в единую экосистему для разработки приложений.

Vueland — это не просто ещё один UI kit. Главная идея проекта — дать разработчику возможность использовать компоненты как есть, стилизовать их через utility-пресеты или заменять крупные визуальные части сложных компонентов, сохраняя внутри компонента поведение, состояние, accessibility-связи и интерактивную логику.

## Почему Vueland?

Многие UI-библиотеки удобны на старте, но становятся сложными для адаптации, когда проекту нужен собственный дизайн-системный слой.

Простые компоненты обычно можно настроить снаружи. Настоящая проблема появляется в сложных компонентах: select, menu, autocomplete, date picker, table и других контролах, где одновременно есть состояние, клавиатурное управление, overlay, focus handling, validation и несколько визуальных зон.

Vueland строится вокруг этого разделения:

- **Примитивы** остаются маленькими, предсказуемыми и легко стилизуются снаружи.
- **Сложные компоненты** открывают заменяемые визуальные зоны через типизированные scoped slots.
- **Дефолтный UI** реализован как fallback внутри слотов, поэтому компонент работает сразу.
- **Поведение остаётся внутри компонента**, а разработчик контролирует визуальный результат.

## Slot Anatomy

Сложные компоненты Vueland используют slot-first архитектуру.

Вместо того чтобы жёстко зашивать каждую визуальную часть, компонент может раскрывать свою внутреннюю визуальную анатомию через scoped slots. Каждый слот получает состояние, атрибуты, callbacks и данные, необходимые для безопасной отрисовки этой части.

Дефолтный интерфейс реализован как fallback slot content. Поэтому можно начать с готового компонента и постепенно заменять только те части, которые нужны конкретному продукту или дизайн-системе.

Например, select-компонент может раскрывать такие визуальные швы:

- поле
- выбранные значения
- содержимое меню
- отображение элементов
- детали, подсказки и ошибки

Компонент сохраняет model, логику выбора, validation, focus state, поведение меню и accessibility-связи. Приложение контролирует разметку, layout, иконки и визуальную композицию.

```vue
<CSelect v-model="user" :items="users">
  <template #selects="{ items }">
    <UserChip
      v-for="user in items"
      :key="user.id"
      :user="user"
    />
  </template>

  <template #menu="{ items, onSelect }">
    <UserList>
      <UserListItem
        v-for="user in items"
        :key="user.id"
        :user="user"
        @click="onSelect(user)"
      />
    </UserList>
  </template>
</CSelect>
```

Такой подход полезен, когда команде нужно поведение готового компонента, но не нужна жёстко заданная DOM-структура или визуальный стиль традиционной UI-библиотеки.

## Модель стилизации

Vueland поддерживает кастомизацию на нескольких уровнях:

- **Пресеты** для переиспользуемых правил оформления компонентов.
- **Utility-классы**, генерируемые через JIT-слой.
- **Scoped slots** для замены визуальных секций сложных компонентов.
- **Composables** для переиспользования поведения и состояния в кастомном UI.

Цель — не заставлять все компоненты использовать одну и ту же модель кастомизации. Маленькие примитивы должны оставаться простыми. Сложные компоненты должны открывать правильные визуальные швы.

## Пакеты

На текущем этапе Vueland включает:

### `@vueland/ui`

Vue 3 UI-пакет с фокусом на composable-компоненты, замену визуальных частей через слоты, пресеты и переиспользуемые interaction patterns.

### `@vueland/utils-jit`

Vite JIT plugin для генерации arbitrary utility-классов по мере необходимости.

## Статус проекта

Vueland находится на активной ранней стадии разработки.

API, контракты компонентов, структура пакетов и дизайн-система могут меняться по мере развития платформы. Проект формируется вокруг реальных потребностей frontend-разработки с акцентом на гибкость, поддерживаемость и developer experience.

## Вдохновение

Внутренняя архитектура Vueland во многом основана на изучении [Vuetify](https://vuetifyjs.com).
Ряд внутренних паттернов был заимствован из исходников Vuetify
и адаптирован под цели Vueland.

## Участие в разработке

Вклад приветствуется. См. [CONTRIBUTING.md](./CONTRIBUTING.md) — там описаны настройка окружения, стратегия веток, конвенции коммитов и правила PR.

## Стратегия веток

Проект использует **GitHub Flow**:

- `master` — стабильная ветка, всегда рабочая. Релизы выходят отсюда.
- Все изменения делаются в коротких ветках, бранчующихся от `master`.
- Ветка вливается обратно в `master` через PR после прохождения CI и ревью.

Именование веток: префикс `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` + короткое описание.

## Видение

Долгосрочная цель Vueland — стать frontend-основой для Vue 3 проектов, которым нужно больше контроля, чем в традиционном UI kit, но больше структуры, чем в полностью headless-подходе.

Vueland стремится объединить:

- UI-компоненты
- Slot-first component anatomy
- Системы темизации и пресетов
- Utility-классы
- Composables
- Директивы
- Удобные workflows для разработчиков

Цель платформы — помочь Vue-разработчикам создавать качественные приложения без потери контроля над визуальным слоем.
