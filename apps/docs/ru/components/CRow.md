# CRow

Flex-контейнер, образующий строку в 12-колоночной сетке. Используется вместе с `CCol` для построения адаптивных раскладок.

<script setup>
import AlignmentExample from '../../examples/CGrid/AlignmentExample.vue'
import DashboardLayoutExample from '../../examples/CGrid/DashboardLayoutExample.vue'
</script>

## Выравнивание

Вертикальное выравнивание колонок задаётся через `align`, горизонтальное распределение — через `justify`.

<AlignmentExample />

::: details Показать код

```vue
<template>
  <!-- align="start" · justify="start" -->
  <c-row align="start" justify="start">
    <c-col cols="2"><div style="height:60px">…</div></c-col>
    <c-col cols="2"><div style="height:90px">…</div></c-col>
    <c-col cols="2"><div style="height:50px">…</div></c-col>
  </c-row>

  <!-- align="center" · justify="center" -->
  <c-row align="center" justify="center"> … </c-row>

  <!-- align="end" · justify="space-between" -->
  <c-row align="end" justify="space-between"> … </c-row>
</template>
```

:::

## Пример dashboard-раскладки

Полноценный адаптивный лэйаут через `CRow` + `CCol`: карточки статистики, график и сайдбар.

<DashboardLayoutExample />

::: details Показать код

```vue
<template>
  <!-- Статистика: 2 колонки на мобилке, 4 на md+ -->
  <c-row class="mb-4">
    <c-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
      <c-card>…</c-card>
    </c-col>
  </c-row>

  <!-- График + сайдбар: полная ширина на мобилке, 8/4 на md+ -->
  <c-row>
    <c-col cols="12" md="8">
      <c-card>…график…</c-card>
    </c-col>
    <c-col cols="12" md="4">
      <c-card>…топ продуктов…</c-card>
    </c-col>
  </c-row>
</template>
```

:::

## Адаптивное выравнивание

Для каждого пропа выравнивания есть адаптивный вариант, который переопределяет базовое значение начиная с указанного брейкпоинта (mobile-first):

```vue
<template>
  <c-row align="start" :align-md="'center'" :justify-lg="'space-between'">
    <c-col cols="12" md="6">A</c-col>
    <c-col cols="12" md="6">B</c-col>
  </c-row>
</template>
```

## Без отступов

Убрать стандартный gap между колонками можно через `no-gutter`:

```vue
<template>
  <c-row no-gutter>
    <c-col cols="6">A</c-col>
    <c-col cols="6">B</c-col>
  </c-row>
</template>
```

## Props

| Проп            | Тип                                                                              | По умолчанию | Описание                                                 |
| --------------- | -------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| `align`         | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`                        | `null`       | Вертикальное выравнивание колонок (`align-items`)        |
| `align-content` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'stretch'` | `null`       | Выравнивание переносов строк (`align-content`)           |
| `justify`       | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'`              | `null`       | Горизонтальное распределение колонок (`justify-content`) |
| `no-gutter`     | `boolean`                                                                        | `false`      | Убирает gap между колонками                              |

### Адаптивные пропы выравнивания

Для каждого брейкпоинта (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) доступны следующие пропы:

| Проп                                     | Тип                   | Описание                                                   |
| ---------------------------------------- | --------------------- | ---------------------------------------------------------- |
| `align-xs` … `align-xxl`                 | как у `align`         | Переопределяет `align` начиная с этого брейкпоинта         |
| `align-content-xs` … `align-content-xxl` | как у `align-content` | Переопределяет `align-content` начиная с этого брейкпоинта |
| `justify-xs` … `justify-xxl`             | как у `justify`       | Переопределяет `justify` начиная с этого брейкпоинта       |

Значения брейкпоинтов по умолчанию: `xs` ≥ 0 px · `sm` ≥ 600 px · `md` ≥ 960 px · `lg` ≥ 1280 px · `xl` ≥ 1920 px · `xxl` ≥ 2560 px.

Кастомные имена брейкпоинтов, настроенные через `@vueland/utils-jit`, не становятся новыми пропами выравнивания. Для них используйте сгенерированные utility-классы, например `class="tablet:justify-center tablet:items-center"`.

## CSS-переменные

`CRow` не определяет собственных CSS-переменных. Отступы сетки генерируются из SCSS-карты брейкпоинтов и могут быть изменены через настройку брейкпоинтов `@vueland/utils-jit`.

## Слоты

| Слот      | Описание                                             |
| --------- | ---------------------------------------------------- |
| `default` | Компоненты колонок (`CCol`) или любой другой контент |

## См. также

- [CCol](/ru/components/CCol) — компонент колонки
- [CSpacer](/ru/components/CSpacer) — flex-распорка
- [Брейкпоинты](/ru/guide/breakpoints) — значения брейкпоинтов и настройка
