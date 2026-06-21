# Plugins

Vueland is more than a component library — it is a growing platform. Plugins are standalone packages that extend the development workflow with build-time tools, code generators, and runtime helpers that work alongside the core UI library.

Each plugin lives in its own package, is installed independently, and integrates without modifying your existing setup.

## Available plugins

| Plugin | Package | Description |
|--------|---------|-------------|
| [ESLint Script Setup](./eslint-script-setup/getting-started) | `@vueland/eslint-script-setup` | ESLint plugin that enforces a consistent declaration order inside `<script setup>` blocks and provides autofix |
| [Utils JIT](./utils-jit/getting-started) | `@vueland/utils-jit` | Vite plugin that generates arbitrary-value CSS utility classes on demand — only classes you actually use end up in the bundle |

## Coming soon

The plugin ecosystem is actively expanding. Planned additions include:

- **Form builder** — schema-driven form generation with built-in validation
- **Theme generator** — visual CSS variable editor with live preview and export
- **Icon resolver** — automatic icon set discovery and tree-shaking
- **CLI** — scaffolding tool for components, pages, and presets

## Plugin structure

Every plugin follows the same pattern: a package-level entry point, a documented API, and zero required changes to the core library configuration.

```ts
// Example: adding a Vueland plugin to vite.config.ts
import { somePlugin } from '@vueland/some-plugin'

export default defineConfig({
  plugins: [somePlugin()],
})
```

Plugins that need access to the Vueland runtime (theming, presets, icons) accept an optional config object that mirrors the `createVuelandUI` options.
