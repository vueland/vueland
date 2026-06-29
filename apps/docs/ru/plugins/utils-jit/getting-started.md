# Быстрый старт

`@vueland/utils-jit` — самостоятельный Vite-плагин для генерации CSS-утилит в JIT-режиме. Он сканирует классы, которые реально используются в исходниках, и отдаёт только нужный CSS.

Пакет входит в экосистему Vueland, но не требует Vue или `@vueland/ui`. Его можно использовать в любом Vite-проекте: Vue, React, Preact, Solid, Svelte, Astro или обычном HTML. В связке с `@vueland/ui` он также становится общим слоем брейкпоинтов для JIT-классов, предопределённых SCSS-утилит, grid-компонентов и `useBreakpoints`.

## Установка

::: code-group

```bash [pnpm]
pnpm add -D @vueland/utils-jit
```

```bash [npm]
npm install -D @vueland/utils-jit
```

```bash [yarn]
yarn add -D @vueland/utils-jit
```

:::

## Подключение плагина

Добавьте `utilsJIT()` в `vite.config.ts`.

```ts
import { defineConfig } from 'vite'
import { utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [utilsJIT()],
})
```

Если приложению нужен плагин фреймворка, оставьте его рядом с `utilsJIT()`:

```ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), utilsJIT()],
})
```

По умолчанию CSS отдаётся виртуальным модулем `virtual:utils-jit.css` — файл на диск не пишется. Импортируйте его один раз в точке входа приложения, например в `src/main.ts`:

```ts
import 'virtual:utils-jit.css'
```

Если нужно увидеть результат файлом (для дебага), включите [`emitFile`](./configuration#emitfile) — тогда CSS дополнительно запишется в [`outFile`](./configuration#outfile).

## Быстрый пример

```html
<div class="w-[300px] h-[200px] px-[16px] radius-[12px] z-[10]">Hello utilities</div>
```

Виртуальный модуль будет отдавать примерно такой CSS:

```css
/* @vueland/utils-jit: generated utilities */
.h-\[200px\] {
  height: 200px !important;
}
.px-\[16px\] {
  padding-left: 16px !important;
  padding-right: 16px !important;
}
.radius-\[12px\] {
  border-radius: 12px !important;
}
.w-\[300px\] {
  width: 300px !important;
}
.z-\[10\] {
  z-index: 10 !important;
}
```

Порядок правил в итоговом CSS сортируется по имени utility-токена, поэтому не стоит завязывать поведение на порядок объявления классов в шаблоне.

## Примеры для фреймворков

Vue / HTML-подобные шаблоны:

```vue
<template>
  <button class="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
</template>
```

React / Preact:

```tsx
export function SaveButton() {
  return (
    <button className="w-[160px] px-[20px] py-[12px] radius-[8px] hover:bg-[#2f855a]">Save</button>
  )
}
```

Класс должен существовать в исходниках статически. Строки, собранные в runtime, не вычисляются:

```vue
<!-- Найдётся -->
<div :class="isWide ? 'w-[320px]' : 'w-[240px]'"></div>

<!-- Не вычисляется -->
<div :class="`w-[${width}px]`"></div>
```

## Другие расширения

По умолчанию сканируются `.vue`, `.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.svelte` и `.astro`. Другие расширения добавляются через [`include`](./configuration#include):

```ts
utilsJIT({
  include: [/\.(vue|js|ts|jsx|tsx|html|svelte|astro|mdx)$/],
})
```

## Вместе с Vueland UI

В Vueland-приложении `utilsJIT()` может быть единой точкой настройки адаптивных брейкпоинтов:

```ts
utilsJIT({
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

Эти значения используются JIT-классами вроде `md:w-[720px]`, предопределёнными SCSS-утилитами вроде `md:pa-4`, CSS/классами сетки и `useBreakpoints`. Подробности интеграции — в [конфигурации](./configuration#breakpoints).
