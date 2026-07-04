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
      outline: {/* ... */},
    },
  },
})
```

```vue
<CTextField preset="input.outline" label="Email" />
```

## Пример: пресет для CTextField

Пресет — это **набор плоских пресетов по состояниям**: `base` — спокойный вид, а каждое состояние (`focused`, `filled`, `error`, `disabled`, `readonly`) — отдельный полный плоский пресет. В каждый момент применяется ровно одно состояние; его зоны подменяют одноимённые зоны `base`.

```ts
// src/presets/input-presets.ts
import type { CInputPreset } from '@vueland/ui/types'

export const outline: CInputPreset = {
  base: {
    label: ['text-blue'],
  },
  focused: {
    label: ['text-cyan-darken-2'],
    field: ['text-cyan-darken-2'],
  },
  error: {
    label: ['text-red'],
    details: ['text-red'],
  },
  readonly: {
    label: ['text-grey'],
  },
}
```

```ts
import * as inputPresets from './presets/input-presets'

export const vueland = createVuelandUI({
  components,
  presets: {
    input: { ...inputPresets }, // outline → input.outline
  },
})
```

## Пресеты и проп `color`

У окрашиваемых компонентов (`CBtn`, `CChip`, `CProgressLinear`, `CProgressCircular`) есть проп `color`, который принимает палитровый токен (`red-lighten-2`) или сырой цвет (`#fa5a5a`, `rgb(...)`, `var(...)`). Под капотом оба механизма делают одно и то же — добавляют утилитарные классы на зоны компонента, поэтому они аддитивны и свободно сочетаются, **пока отвечают за разные аспекты**: пресет — за форму, тень, типографику и состояния, `color` — за точечную окраску конкретного экземпляра.

```html
<!-- пресет задаёт форму и поведение, color — цвет -->
<CBtn preset="button.pill" color="#7C4DFF">Save</CBtn>
```

Если же пресет и `color` задают **одно и то же свойство одной зоны** (например, оба ставят `bg-*` на корень кнопки), результат определяет порядок правил в подключённом CSS, а не порядок в шаблоне: все утилиты равны по специфичности и используют `!important`. Полагаться на этот порядок не стоит — считайте такой конфликт ошибкой конфигурации и держите цвет в одном месте: либо в пресете, либо в пропе.

Подробное описание всех зон, состояний и типов пресетов доступно в разделе [Настройки](/ru/settings/).
