# @vueland/eslint-script-setup

## 1.1.0

### Minor Changes

- [#96](https://github.com/vueland/vueland/pull/96) [`b716d3c`](https://github.com/vueland/vueland/commit/b716d3c5b3cfb6277747cfecb3cafd45750ee57f) Thanks [@wiseadme](https://github.com/wiseadme)! - eslint-script-setup keep marker, lifecycle order, new categories

## 1.0.0

### Major Changes

- [#94](https://github.com/vueland/vueland/pull/94) [`1887ed1`](https://github.com/vueland/vueland/commit/1887ed19e096444c551a34f60231b2b0d8f93ebd) Thanks [@wiseadme](https://github.com/wiseadme)! - fix: `script-setup-order` dependency detection hardened — dependencies through TS wrappers (`as`, `satisfies`, `!`) and destructured declarations are now tracked (prevents auto-sort from producing broken code), member properties and object keys are no longer treated as references, and autofix preserves node indentation after leading comments

## 0.1.1

### Patch Changes

- [#49](https://github.com/vueland/vueland/pull/49) [`0cc2ab1`](https://github.com/vueland/vueland/commit/0cc2ab15c5505fd8f3041f10c5a7812e7e92aa6b) Thanks [@wiseadme](https://github.com/wiseadme)! - sorry for false start)

## 0.1.0

### Minor Changes

- [`e96ca99`](https://github.com/vueland/vueland/commit/e96ca9933467c9644ac42f2a8e967d6f140fdbf0) - Initial release of `@vueland/eslint-script-setup` — an ESLint plugin that enforces consistent code ordering in Vue 3 `<script setup>` blocks.

  Rules:
  - `script-setup-order` — enforces `import → type → macros → composable → reactive → variable → computed → function → watchEffect → watch → lifecycle` order with autofix
  - `no-multi-declaration` — forbids multiple declarators in a single statement
  - `no-inline-composable` — forbids calling composables inline as arguments
