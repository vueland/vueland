# Быстрый старт

`@vueland/utils-jit` — Vite-плагин для генерации CSS-утилит в JIT-режиме.

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
import vue from '@vitejs/plugin-vue'
import { utilsJIT } from '@vueland/utils-jit'

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

```vue
<template>
  <div class="w-[300px] h-[200px] px-[16px] radius-[12px] z-[10]">Hello Vueland</div>
</template>
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
