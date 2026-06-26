# CCol

Колонка в 12-колоночной сетке. Всегда используется внутри `CRow`. Ширина задаётся числом от 1 до 12.

<script setup>
import BasicGridExample from '../../examples/CGrid/BasicGridExample.vue'
import ResponsiveCardsExample from '../../examples/CGrid/ResponsiveCardsExample.vue'
import OffsetOrderExample from '../../examples/CGrid/OffsetOrderExample.vue'
</script>

## Размеры колонок

Все 12 колонок в действии — от 1/12 до полной ширины.

<BasicGridExample />

::: details Показать код

```vue
<template>
  <!-- Три равные колонки -->
  <c-row>
    <c-col cols="4"><div>4</div></c-col>
    <c-col cols="4"><div>4</div></c-col>
    <c-col cols="4"><div>4</div></c-col>
  </c-row>

  <!-- Две половины -->
  <c-row>
    <c-col cols="6"><div>6</div></c-col>
    <c-col cols="6"><div>6</div></c-col>
  </c-row>

  <!-- Асимметрия -->
  <c-row>
    <c-col cols="3"><div>3</div></c-col>
    <c-col cols="9"><div>9</div></c-col>
  </c-row>
</template>
```

:::

## Адаптивные карточки товаров

На мобилке карточки складываются в стек, на `sm` — по 2, на `md+` — по 3.

<ResponsiveCardsExample />

::: details Показать код

```vue
<template>
  <c-row>
    <c-col v-for="card in cards" :key="card.id" cols="12" sm="6" md="4">
      <c-card>…</c-card>
    </c-col>
  </c-row>
</template>
```

:::

## Offset и Order

<OffsetOrderExample />

::: details Показать код

```vue
<template>
  <!-- Offset: центрировать блок шириной 4 колонки -->
  <c-row>
    <c-col cols="4" offset="4">По центру</c-col>
  </c-row>

  <!-- Order: визуальный порядок без изменения DOM -->
  <c-row>
    <c-col cols="4" order="3">A — показывается последним</c-col>
    <c-col cols="4" order="1">B — показывается первым</c-col>
    <c-col cols="4" order="2">C — показывается вторым</c-col>
  </c-row>
</template>
```

:::

## Props

| Проп     | Тип                | По умолчанию | Описание                         |
| -------- | ------------------ | ------------ | -------------------------------- |
| `cols`   | `string \| number` | `null`       | Ширина колонки (1–12)            |
| `offset` | `string \| number` | `null`       | Левый отступ в колонках          |
| `order`  | `string \| number` | `null`       | Визуальный порядок (CSS `order`) |

### Адаптивные пропы

Для каждого брейкпоинта (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`):

| Проп                       | Тип                | Описание                                       |
| -------------------------- | ------------------ | ---------------------------------------------- |
| `xs` … `xxl`               | `string \| number` | Ширина колонки начиная с этого брейкпоинта     |
| `offset-xs` … `offset-xxl` | `string \| number` | Левый отступ начиная с этого брейкпоинта       |
| `order-xs` … `order-xxl`   | `string \| number` | Визуальный порядок начиная с этого брейкпоинта |

Значения брейкпоинтов по умолчанию: `xs` ≥ 0 px · `sm` ≥ 600 px · `md` ≥ 960 px · `lg` ≥ 1280 px · `xl` ≥ 1920 px · `xxl` ≥ 2560 px.

Кастомные имена брейкпоинтов, настроенные через `@vueland/utils-jit`, не становятся новыми пропами. Для них используйте сгенерированные классы, например `class="tablet-6"` или `:class="{ 'tablet-4': compact }"`.

## Слоты

| Слот      | Описание           |
| --------- | ------------------ |
| `default` | Содержимое колонки |

## См. также

- [CRow](/ru/components/CRow) — контейнер строки
- [CSpacer](/ru/components/CSpacer) — flex-распорка
- [Брейкпоинты](/ru/guide/breakpoints) — значения брейкпоинтов и настройка
