# CSpacer

Функциональный компонент, который растягивается и заполняет доступное пространство в flex-контейнере. Используется внутри `CRow` или любого flex-лэйаута, чтобы оттолкнуть соседний контент к противоположному краю.

<script setup>
import SpacerExample from '../../examples/CGrid/SpacerExample.vue'
</script>

## Примеры

Тулбар, шапка статьи и пагинатор — три распространённых паттерна с `CSpacer`.

<SpacerExample />

::: details Показать код

```vue
<template>
  <!-- Тулбар: логотип слева, ссылки + кнопка справа -->
  <c-row align="center" no-gutter>
    <div class="d-flex items-center gap-2">
      <c-icon name="fas:bolt" source="fa" />
      Dashboard
    </div>
    <c-spacer />
    <div class="d-flex gap-3">
      <span>Docs</span>
      <button>Sign In</button>
    </div>
  </c-row>

  <!-- Шапка статьи: аватар + имя слева, действия справа -->
  <c-row align="center" no-gutter>
    <div><!-- аватар --></div>
    <div>Jane Doe</div>
    <c-spacer />
    <div class="d-flex gap-2">
      <button><c-icon name="fas:bookmark" source="fa" /></button>
      <button><c-icon name="fas:heart" source="fa" /></button>
    </div>
  </c-row>

  <!-- Пагинация: назад слева, страница по центру, вперёд справа -->
  <c-row align="center" no-gutter>
    <button><c-icon name="fas:arrow-left" source="fa" /> Пред</button>
    <c-spacer />
    <span>Страница 3 из 12</span>
    <c-spacer />
    <button>След <c-icon name="fas:arrow-right" source="fa" /></button>
  </c-row>
</template>
```

:::

## Как работает

`CSpacer` рендерит `<div class="c-spacer">` со стилем `flex-grow: 1 !important`, что позволяет ему расти и занимать свободное место в строке.

## Props

Пропов нет.

## Слоты

Слотов нет.

## CSS-переменные

`CSpacer` не определяет собственных CSS-переменных.

## См. также

- [CRow](/ru/components/CRow) — контейнер строки
- [CCol](/ru/components/CCol) — компонент колонки
