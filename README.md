<div align="center">
  <img src="logo.png" style="max-width: 100%;">
</div>

<div align="center">
  <h1>Vueland</h1>
  <p><strong>A frontend platform for Vue 3</strong></p>
  <p>
    <a href="https://vueland.github.io/vueland/en/guide/getting-started">Documentation</a> ·
    <a href="https://vueland.github.io/vueland/en/components/">Components</a> ·
    <a href="https://vueland.github.io/vueland/en/plugins/">Plugins</a>
  </p>
  <p>
    <a href="https://github.com/vueland/vueland">
      <img src="https://img.shields.io/github/stars/vueland/vueland?style=flat&logo=github&label=Star%20us%20on%20GitHub" alt="GitHub Stars">
    </a>
  </p>
</div>

---

Vueland is a frontend platform for Vue 3, not just a component library.

It combines UI components, a JIT utility layer, a global settings system, composables, directives, and a plugin architecture into a single ecosystem — one that can grow with your product without requiring you to swap the foundation mid-way.

The platform is designed around a core idea: developers should be able to use components as-is, style them with utility presets, or replace major visual sections of complex components while keeping all behavior, state, accessibility wiring, and interaction logic inside the component itself.

## Platform overview

| Package              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `@vueland/ui`        | UI components, grid system, composables, preset engine      |
| `@vueland/utils-jit` | Vite JIT plugin for on-demand utility class generation      |
| More coming          | Plugins, adapters, and extensions are being added over time |

## Why a platform, not a library?

Most UI libraries give you components. When you need more — a utility layer, a settings system, reactive breakpoints, behavior composables — you pull in separate packages from different authors and wire them together yourself.

Vueland keeps all of it in one place, designed to work together from the start:

- One breakpoint config syncs the grid, utility classes, and the `useDisplay` composable.
- One preset system applies reusable visual rules across all components.
- One settings layer lets you control elevation, borders, color, and density globally.
- Slot-first component anatomy lets you replace visual sections without losing behavior.

## Slot anatomy

Complex components expose their internal visual structure through typed scoped slots. Each slot receives the state, data, and callbacks it needs to render that part safely. The default UI is implemented as fallback slot content — so components work out of the box, and you replace only what your product needs.

```vue
<CSelect v-model="user" :items="users">
  <template #selects="{ items }">
    <UserChip v-for="user in items" :key="user.id" :user="user" />
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

## Project status

Vueland is in active early development. APIs, component contracts, and package structure will evolve as the platform grows.

Production-ready components are marked **Stable** in the documentation.

## ⭐ Support the project

If Vueland looks useful to you, consider starring the repository. It helps us understand that the work matters and keeps the momentum going.

**[Star on GitHub →](https://github.com/vueland/vueland)**

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branch strategy, commit conventions, and PR guidelines.

## Branch strategy

**GitHub Flow:**

- `master` — stable, always production-ready. Releases are cut from here. Direct pushes are not allowed.
- All work happens in short-lived branches from `master`, merged back via PR (squash) after CI and review.
- Releases are automated via changesets (`changeset-release/master` PR).

Branch naming is enforced (local `pre-push` hook + CI `Branch name` check):
`<type>/<short-kebab-description>`, where `<type>` ∈ `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`, `revert`.

See [CONTRIBUTING.md](./CONTRIBUTING.md#стратегия-веток) for details.

## License

MIT

---

# Vueland

**Платформа для фронтенда на Vue 3**

---

Vueland — это не просто библиотека компонентов, а фронтенд-платформа для Vue 3.

Она объединяет UI-компоненты, JIT-слой утилитарных классов, систему глобальных настроек, composables, директивы и архитектуру плагинов в единую экосистему — ту, которая может расти вместе с продуктом, не требуя смены фундамента на полпути.

Платформа строится вокруг главной идеи: разработчик должен иметь возможность использовать компоненты как есть, стилизовать их через utility-пресеты или заменять крупные визуальные части сложных компонентов — сохраняя внутри компонента всё поведение, состояние, accessibility-связи и логику взаимодействия.

## Обзор платформы

| Пакет                | Описание                                                    |
| -------------------- | ----------------------------------------------------------- |
| `@vueland/ui`        | UI-компоненты, grid-система, composables, движок пресетов   |
| `@vueland/utils-jit` | Vite JIT plugin для генерации utility-классов по требованию |
| Больше в процессе    | Плагины, адаптеры и расширения добавляются по мере развития |

## Почему платформа, а не библиотека?

Большинство UI-библиотек дают только компоненты. Когда нужно больше — utility-слой, система настроек, реактивные брейкпоинты, composables — нужно тянуть отдельные пакеты от разных авторов и вручную всё связывать.

Vueland держит всё это в одном месте, спроектированном для совместной работы:

- Один конфиг брейкпоинтов синхронизирует grid, utility-классы и composable `useDisplay`.
- Одна система пресетов применяет переиспользуемые визуальные правила ко всем компонентам.
- Один settings-слой позволяет глобально управлять elevation, border, цветом и плотностью.
- Slot-first анатомия компонентов позволяет заменять визуальные части без потери поведения.

## Статус проекта

Vueland находится в активной ранней разработке. API, контракты компонентов и структура пакетов будут развиваться по мере роста платформы. Компоненты, готовые к продакшну, отмечены статусом **Stable** в документации.

## ⭐ Поддержи проект

Если Vueland кажется тебе полезным — поставь звезду репозиторию. Это помогает понять, что работа ценна, и даёт мотивацию двигаться вперёд.

**[Поставить звезду на GitHub →](https://github.com/vueland/vueland)**

## Contributing

Вклад приветствуется. См. [CONTRIBUTING.md](./CONTRIBUTING.md) — там описаны настройка окружения, стратегия веток, конвенции коммитов и правила PR.

## License

MIT
