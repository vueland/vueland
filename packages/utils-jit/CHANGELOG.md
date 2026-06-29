# @vueland/utils-jit

## 1.0.0

### Major Changes

- [#78](https://github.com/vueland/vueland/pull/78) [`9b1a4d6`](https://github.com/vueland/vueland/commit/9b1a4d6e3566bd79fbcda85e7fbb4d90d5aac3f8) Thanks [@wiseadme](https://github.com/wiseadme)! - Release `@vueland/utils-jit` as a stable 1.0.0 package.

  The plugin now has a stable public API for arbitrary utilities, custom `defineRule`
  utilities, responsive variants, Svelte and Astro source scanning, React
  `className` string literals, and optional Vueland UI integration. It can be used
  as a framework-agnostic Vite utility CSS engine outside of Vueland as well.

## 0.3.0

### Minor Changes

- [#64](https://github.com/vueland/vueland/pull/64) [`9d42f5d`](https://github.com/vueland/vueland/commit/9d42f5d3a59fa55e161af863d735d9ab67428438) Thanks [@wiseadme](https://github.com/wiseadme)! - virtual utils

## 0.2.7

### Patch Changes

- [#61](https://github.com/vueland/vueland/pull/61) [`cb57694`](https://github.com/vueland/vueland/commit/cb576946698fe0ac6626c6b8447f5ae3e07d0f22) Thanks [@wiseadme](https://github.com/wiseadme)! - fully breakpoints synchronization between ui and utils-jit

## 0.2.6

### Patch Changes

- [#40](https://github.com/vueland/vueland/pull/40) [`1f25263`](https://github.com/vueland/vueland/commit/1f252633b157d324875728830ccf3890e0f49a64) Thanks [@wiseadme](https://github.com/wiseadme)! - updates

## 0.2.5

### Patch Changes

- [#34](https://github.com/vueland/vueland/pull/34) [`94648a5`](https://github.com/vueland/vueland/commit/94648a54b3287ebb92aac0f861679bc0a747290b) Thanks [@wiseadme](https://github.com/wiseadme)! - shared breakpoints between jit and ui

## 0.2.4

### Patch Changes

- When `breakpoints` option is provided, the plugin now automatically injects custom breakpoint values into `@vueland/ui` SCSS utilities via Vite's `additionalData` hook. This makes `breakpoints` a single source of truth for both JIT class generation and predefined SCSS responsive classes.

## 0.2.3

### Patch Changes

- [#13](https://github.com/vueland/vueland/pull/13) [`47555eb`](https://github.com/vueland/vueland/commit/47555eb44aa07f547328080a186c30138a8e8342) Thanks [@wiseadme](https://github.com/wiseadme)! - fix

## 0.2.2

### Patch Changes

- [#11](https://github.com/vueland/vueland/pull/11) [`a1252f6`](https://github.com/vueland/vueland/commit/a1252f6be979206fc2a0386f74bf20fe782dfd40) Thanks [@wiseadme](https://github.com/wiseadme)! - fix readme file

## 0.2.1

### Patch Changes

- [#9](https://github.com/vueland/vueland/pull/9) [`a055c60`](https://github.com/vueland/vueland/commit/a055c60997186b684cd3f18d8332dab2a0e55550) Thanks [@wiseadme](https://github.com/wiseadme)! - README updated

## 0.2.0

### Minor Changes

- [#2](https://github.com/vueland/vueland/pull/2) [`e7f06ae`](https://github.com/vueland/vueland/commit/e7f06aebdab1607cf14812c0013a4a0d9ba11a8f) Thanks [@wiseadme](https://github.com/wiseadme)! - utils jit update to minor
