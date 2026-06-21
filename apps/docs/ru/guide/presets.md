# Пресеты

Пресеты — это именованные наборы утилитарных классов, которые компоненты применяют к своим внутренним зонам в зависимости от состояния. Они позволяют кастомизировать внешний вид компонентов без написания CSS.

## Принцип работы

Пресеты регистрируются в `createVuelandUI` под произвольным ключом. Компонент получает имя пресета через проп `preset` — строку вида `namespace.name`.

```ts
// src/plugins/vueland.ts
export const vueland = createVuelandUI({
  components,
  presets: {
    input: {
      outline: { /* ... */ },
    },
  },
})
```

```vue
<CTextField preset="input.outline" label="Email" />
```

## Пример: пресет для CTextField

```ts
// src/presets/input-presets.ts
import type { CInputPreset } from '@vueland/ui/types'

export const outline: CInputPreset = {
  root: ['text-blue'],
  focused: {
    root: ['text-cyan-darken-2'],
  },
  error: {
    root: ['text-red'],
    focused: {
      root: ['text-red-darken-2'],
    },
  },
  disabled: {
    root: ['text-grey'],
  },
}
```

```ts
import * as inputPresets from './presets/input-presets'

export const vueland = createVuelandUI({
  components,
  presets: {
    input: { ...inputPresets },  // outline → input.outline
  },
})
```

Подробное описание всех зон, состояний и типов пресетов доступно в разделе [Настройки](/ru/settings/).
