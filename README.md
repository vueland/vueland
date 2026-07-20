<div align="center">
  <img src="logo.png" alt="Vueland" style="max-width: 100%;">

  <h1>Vueland</h1>
  <p><strong>A frontend platform for Vue 3 — components, JIT utilities, presets and theming, designed to work together.</strong></p>

  <p>
    <a href="https://vueland.github.io/vueland/en/guide/getting-started">Documentation</a> ·
    <a href="https://vueland.github.io/vueland/en/components/">Components</a> ·
    <a href="https://vueland.github.io/vueland/en/utilities/">Utilities</a> ·
    <a href="https://vueland.github.io/vueland/en/plugins/">Plugins</a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@vueland/ui"><img src="https://img.shields.io/npm/v/%40vueland%2Fui?logo=npm&color=42b883&label=%40vueland%2Fui" alt="npm @vueland/ui"></a>
    <a href="https://www.npmjs.com/package/@vueland/utils-jit"><img src="https://img.shields.io/npm/v/%40vueland%2Futils-jit?logo=npm&color=42b883&label=%40vueland%2Futils-jit" alt="npm @vueland/utils-jit"></a>
    <a href="https://github.com/vueland/vueland/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/vueland/vueland/ci.yml?branch=master&logo=github&label=CI" alt="CI status"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white" alt="Vue 3">
  </p>

  <p>
    <strong>English</strong> · <a href="./README.ru.md">Русский</a>
  </p>
</div>

---

Vueland is a frontend platform for Vue 3, not just a component library. It combines UI components, a JIT utility layer, a global settings system, composables, directives, and a plugin architecture into a single ecosystem — one that can grow with your product without requiring you to swap the foundation mid-way.

The core idea: use components as-is, style them with utility classes and presets, or replace major visual sections of complex components — while all behavior, state, accessibility wiring, and interaction logic stay inside the component.

## ✨ Highlights

- 🧩 **29 components** — from buttons and chips to selects, autocomplete, date pickers, and dialogs, with accessibility wired in.
- ⚡ **JIT utility engine** — arbitrary values (`w-[320px]`), responsive variants (`md:flex-row`), generated on demand by [`@vueland/utils-jit`](packages/utils-jit).
- 📏 **One breakpoint config** — a single source of truth syncs the grid, utility classes, and the `useBreakpoints` composable.
- 🧬 **Preset system** — reusable visual rules applied across all components from one place.
- 🎨 **CSS-variable theming** — define themes as plain objects, switch them at runtime.
- 🔌 **Slot-first anatomy** — typed scoped slots expose the internal structure of complex components, with the default UI as fallback content.
- ⌨️ **Centralized keyboard navigation** — `CKeyboardProvider` gives menus and lists a shared keyboard loop with zero wiring.
- 🟦 **TypeScript-first** — typed props, slots, and injection keys throughout.

## 📦 Packages

| Package                                                            | Version                                                                                                                                                 | Description                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [`@vueland/ui`](packages/ui)                                       | [![npm](https://img.shields.io/npm/v/%40vueland%2Fui?color=42b883&label=)](https://www.npmjs.com/package/@vueland/ui)                                   | UI components, grid system, composables, preset engine |
| [`@vueland/utils-jit`](packages/utils-jit)                         | [![npm](https://img.shields.io/npm/v/%40vueland%2Futils-jit?color=42b883&label=)](https://www.npmjs.com/package/@vueland/utils-jit)                     | Framework-agnostic JIT utility CSS engine for Vite     |
| [`@vueland/eslint-script-setup`](integrations/eslint-script-setup) | [![npm](https://img.shields.io/npm/v/%40vueland%2Feslint-script-setup?color=42b883&label=)](https://www.npmjs.com/package/@vueland/eslint-script-setup) | ESLint plugin for Vue 3 `script setup` code style      |

More plugins, adapters, and extensions are being added over time.

## 🚀 Quick start

```bash
pnpm add @vueland/ui
```

```ts
// src/plugins/vueland.ts
import * as components from '@vueland/ui/components'
import { createVuelandUI } from '@vueland/ui'
import '@vueland/ui/styles.css' // reset and ui themes variables
import '@vueland/ui/css/lib.css' // component styles
import '@vueland/ui/css/utils.css' // utils css classes

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

That's the pre-built CSS setup. For custom breakpoints and arbitrary utility values, use the **SCSS + JIT** setup with `@vueland/utils-jit` — see the [Getting Started guide](https://vueland.github.io/vueland/en/guide/getting-started).

## ⚡ Utility classes

With the JIT engine, predefined utilities and arbitrary values share one responsive config:

```vue
<template>
  <c-card class="d-flex flex-col md:flex-row gap-4 pa-4">
    <c-btn color="#42b883" class="w-[100%] md:w-[240px]">Save</c-btn>
    <c-btn class="w-[100%] md:w-[240px]">Cancel</c-btn>
  </c-card>
</template>
```

The `breakpoints` config passed to `utilsJIT()` in `vite.config.ts` controls JIT responsive classes, predefined SCSS utilities, and the `useBreakpoints` composable — all at once.

## 🔌 Slot anatomy

Complex components expose their internal visual structure through typed scoped slots. Each slot receives the state, data, and callbacks it needs to render that part safely. The default UI is implemented as fallback slot content — so components work out of the box, and you replace only what your product needs:

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

## 🗂 Components

| Category           | Components                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Layout & app shell | `CApp` `CMain` `CToolbar` `CGrid` `CCard`                                                                       |
| Forms & inputs     | `CForm` `CField` `CInput` `CTextField` `CSelect` `CSelectControl` `CAutocomplete` `CCheckbox` `CRadio` `CLabel` |
| Dates              | `CDateInput` `CDatePicker`                                                                                      |
| Overlays           | `CDialog` `CMenu` `CTooltip` `COverlay` `CScrim`                                                                |
| Actions & display  | `CBtn` `CChip` `CIcon` `CList`                                                                                  |
| Feedback           | `CProgressLinear` `CProgressCircular`                                                                           |
| Infrastructure     | `CKeyboardProvider`                                                                                             |

See the [component reference](https://vueland.github.io/vueland/en/components/) for props, slots, and live examples.

## 📚 Documentation

| Section                                                                       | What's inside                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------- |
| [Getting Started](https://vueland.github.io/vueland/en/guide/getting-started) | Installation, pre-built CSS vs SCSS + JIT setup   |
| [Theming](https://vueland.github.io/vueland/en/guide/theming)                 | CSS-variable themes, runtime switching            |
| [Breakpoints](https://vueland.github.io/vueland/en/guide/breakpoints)         | The single responsive config                      |
| [Presets](https://vueland.github.io/vueland/en/guide/presets)                 | Reusable visual rules for components              |
| [Icons](https://vueland.github.io/vueland/en/guide/icons)                     | Icon sets and aliases                             |
| [Components](https://vueland.github.io/vueland/en/components/)                | Full component reference                          |
| [Utilities](https://vueland.github.io/vueland/en/utilities/)                  | Spacing, flex, grid, typography, colors, and more |
| [Settings](https://vueland.github.io/vueland/en/settings/)                    | Global settings layer and CSS variables           |
| [Plugins](https://vueland.github.io/vueland/en/plugins/)                      | `utils-jit` and upcoming plugins                  |

## 🚧 Project status

Vueland is in active early development. APIs, component contracts, and package structure will evolve as the platform grows. Production-ready components are marked **Stable** in the documentation.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for environment setup, branch strategy (GitHub Flow with enforced branch naming), commit conventions, and PR guidelines. Releases are automated via changesets.

## ⭐ Support the project

If Vueland looks useful to you, consider starring the repository — it helps us understand that the work matters and keeps the momentum going.

**[Star on GitHub →](https://github.com/vueland/vueland)**

## 📄 License

[MIT](./LICENSE)
