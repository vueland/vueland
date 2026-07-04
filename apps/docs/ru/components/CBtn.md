# CBtn

Кнопка. Два варианта отрисовки, окраска через утилитарные классы платформы, состояние загрузки со слотом-лоадером и полная поддержка [системы пресетов](/ru/guide/presets).

<script setup>
import BasicExample from '../../examples/CBtn/BasicExample.vue'
import VariantsExample from '../../examples/CBtn/VariantsExample.vue'
import ColorsExample from '../../examples/CBtn/ColorsExample.vue'
import LoadingExample from '../../examples/CBtn/LoadingExample.vue'
import PresetExample from '../../examples/CBtn/PresetExample.vue'
import PresetColorExample from '../../examples/CBtn/PresetColorExample.vue'
</script>

## Базовое использование

Обычная кнопка эмитит `click`, `disabled` отключает её нативно, `block` растягивает на всю ширину контейнера.

<BasicExample />

::: details Показать код

```vue
<template>
  <CBtn @click="count++">Click me</CBtn>
  <CBtn disabled>Disabled</CBtn>
  <CBtn block @click="count++">Block button</CBtn>
</template>
```

:::

## Варианты

`variant` переключает отрисовку: `flat` (по умолчанию) — залитая кнопка, `outlined` — прозрачная с рамкой. У `outlined` рамка рисуется `currentColor`, поэтому всегда совпадает с цветом текста.

<VariantsExample />

::: details Показать код

```html
<CBtn>Flat</CBtn> <CBtn variant="outlined">Outlined</CBtn>
```

:::

## Цвет

`color` принимает **любой цвет платформы** — предопределённого набора нет:

- **палитровый токен** — `red-darken-1`, `teal`, `deep-purple-lighten-1` — превращается в статическую утилиту (`bg-teal`);
- **сырое CSS-значение** — `#7C4DFF`, `rgb(0,150,136)`, `var(--my-color)` — превращается в arbitrary-класс (`bg-[#7C4DFF]`), который генерирует [utils-jit](/ru/plugins/utils-jit/getting-started).

Куда ложится цвет, решает вариант: у `flat` это фон, у `outlined` — текст и рамка (через `currentColor`).

<ColorsExample />

::: details Показать код

```html
<CBtn color="red-darken-1">red-darken-1</CBtn>
<CBtn color="teal">teal</CBtn>
<CBtn color="#7C4DFF">#7C4DFF</CBtn>
<CBtn color="rgb(0,150,136)">rgb(0,150,136)</CBtn>

<CBtn variant="outlined" color="red-darken-1">outlined red</CBtn>
<CBtn variant="outlined" color="#7C4DFF">outlined #7C4DFF</CBtn>
```

:::

::: tip Сырой цвет должен быть литералом
Arbitrary-классы генерируются статическим сканом исходников: `color="#7C4DFF"` и `:color="'#7C4DFF'"` сработают, а `:color="someVar"` с сырым значением — нет. Палитровых токенов это не касается — их классы всегда есть в CSS. Подробнее — в [Custom attrs](/ru/plugins/utils-jit/custom-attrs).
:::

Цвет текста у залитой кнопки остаётся `on-primary` (белый). Если фон требует тёмного текста — добавьте `text-*` класс:

```html
<CBtn color="amber-lighten-3" class="text-black">Light button</CBtn>
```

## Загрузка

`loading` показывает лоадер вместо лейбла (размеры кнопки сохраняются), ставит `aria-busy` и глушит `click`. Дефолтный лоадер — `CProgressCircular`, слот `loader` заменяет его на что угодно.

<LoadingExample />

::: details Показать код

```vue
<template>
  <CBtn :loading="loading" @click="submit">Submit</CBtn>

  <CBtn :loading="loading" color="teal" @click="submit">
    Custom loader
    <template #loader>
      <span>Saving…</span>
    </template>
  </CBtn>
</template>
```

:::

## Пресеты

`CBtn` поддерживает [систему пресетов](/ru/guide/presets). Зоны: `root` (кнопка), `label` (лейбл), `loader` (контейнер лоадера). Состояния: `disabled`, `loading`, `active`, `focused`. В каждый момент работает ровно один пресет состояния (если он задан) — его зоны подменяют одноимённые зоны `base`.

<PresetExample />

::: details Показать код

```ts
// main.ts — пресет регистрируется один раз
createVuelandUI({
  presets: {
    button: {
      save: {
        base: { root: ['bg-indigo', 'hover:bg-indigo-darken-1', 'text-white', 'elevation-2'] },
        active: { root: ['bg-indigo-darken-2', 'text-white', 'elevation-0'] },
        loading: { root: ['bg-indigo-lighten-2', 'text-white', 'elevation-0'] },
        disabled: { root: ['bg-grey-lighten-1', 'text-grey-darken-1'] },
      },
    },
  },
})
```

```vue
<template>
  <CBtn preset="button.save" :loading="loading" :disabled="disabled" @click="save"> Save </CBtn>
</template>
```

:::

## Пресет и `color` вместе

Оба механизма делают одно и то же — добавляют утилитарные классы на зоны кнопки. Они аддитивны и хорошо сочетаются, пока отвечают за разное: в примере ниже пресет задаёт форму, отступы и тень, а цвет каждой кнопки — проп `color`.

<PresetColorExample />

::: details Показать код

```ts
createVuelandUI({
  presets: {
    button: {
      pill: {
        base: { root: ['radius-16', 'px-6', 'text-uppercase', 'elevation-3'] },
      },
    },
  },
})
```

```html
<CBtn preset="button.pill" color="teal">teal</CBtn>
<CBtn preset="button.pill" color="red-darken-1">red</CBtn>
<CBtn preset="button.pill" color="#7C4DFF">#7C4DFF</CBtn>
```

:::

::: warning Не задавайте один аспект дважды
Если и пресет, и `color` красят одно и то же свойство одной зоны (например, оба ставят `bg-*` на корень), победителя определяет не порядок в шаблоне, а порядок правил в подключённом CSS: все утилиты равны по специфичности и оба с `!important`. На практике arbitrary-классы (`bg-[#7C4DFF]`) обычно подключаются после статических утилит и перекрывают их, но это деталь порядка импортов, а не контракт.

Правило простое: цвет живёт **либо** в пресете (системное решение с состояниями), **либо** в `color` (точечная окраска конкретной кнопки). Пресету при этом остаются форма, тень, типографика и поведение состояний.
:::

## Доступность

Рендерится нативный `<button>`: клавиатура и фокус работают из коробки. В состоянии `loading` ставится `aria-busy="true"`, а `click` не эмитится. `disabled` использует нативный атрибут.

По умолчанию кнопка рендерится с `type="button"` — внутри формы она не триггерит submit. Для сабмит-кнопки передайте атрибут явно:

```html
<CForm @submit="onSubmit">
  <CBtn type="submit">Отправить</CBtn>
</CForm>
```

---

## API

### Пропы

| Проп       | Тип                    | По умолчанию | Описание                                                                             |
| ---------- | ---------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `variant`  | `'flat' \| 'outlined'` | `'flat'`     | Вариант отрисовки                                                                    |
| `color`    | `string`               | —            | Палитровый токен (`red-darken-1`) или сырой цвет (`#7C4DFF`, `rgb(...)`, `var(...)`) |
| `block`    | `boolean`              | `false`      | Кнопка на всю ширину контейнера                                                      |
| `disabled` | `boolean`              | `false`      | Отключает кнопку (нативный `disabled`)                                               |
| `loading`  | `boolean`              | `false`      | Показывает лоадер, глушит `click`, ставит `aria-busy`                                |
| `preset`   | `string`               | —            | Имя пресета (путь через точку) из реестра                                            |

### Слоты

| Слот      | Описание                                                      |
| --------- | ------------------------------------------------------------- |
| `default` | Содержимое кнопки (лейбл)                                     |
| `loader`  | Замена дефолтного лоадера (`CProgressCircular`) при `loading` |

### События

| Событие | Аргументы         | Описание                                  |
| ------- | ----------------- | ----------------------------------------- |
| `click` | `(e: MouseEvent)` | Клик по кнопке; не эмитится при `loading` |

### CSS-переменные

| Переменная                    | По умолчанию                                |
| ----------------------------- | ------------------------------------------- |
| `--c-btn-bg-color`            | `var(--c-sys-color-primary)`                |
| `--c-btn-text-color`          | `var(--c-sys-color-on-primary)`             |
| `--c-btn-loader-color`        | `var(--c-sys-color-on-primary)`             |
| `--c-btn-container-color`     | `var(--c-sys-color-primary-container)`      |
| `--c-btn-on-container-color`  | `var(--c-sys-color-on-primary-container)`   |
| `--c-btn-border-color`        | `currentColor`                              |
| `--c-btn-border-width`        | `var(--c-sys-border-width-thin)`            |
| `--c-btn-border-radius`       | `var(--c-sys-shape-md)`                     |
| `--c-btn-hover-bg-color`      | `currentColor`                              |
| `--c-btn-focus-bg-color`      | `var(--c-sys-state-focus-color)`            |
| `--c-btn-pressed-bg-color`    | `currentColor`                              |
| `--c-btn-transition-duration` | `.3s`                                       |
| `--c-btn-disabled-text-color` | `var(--c-sys-color-disabled)`               |
| `--c-btn-disabled-bg-color`   | `var(--c-sys-color-disabled-container)`     |
| `--c-btn-disabled-opacity`    | `var(--c-sys-state-disabled-opacity)`       |
| `--c-btn-paddings`            | `var(--c-sys-space-2) var(--c-sys-space-3)` |
| `--c-btn-min-width`           | `80px`                                      |
| `--c-btn-min-height`          | `var(--c-sys-control-height-sm)`            |
| `--c-btn-font-size`           | `var(--c-sys-typography-body-size)`         |

Hover/pressed-оверлеи рисуются псевдоэлементом поверх фона: `currentColor` с небольшой прозрачностью, поэтому подсветка состояний автоматически подстраивается под цвет кнопки.
