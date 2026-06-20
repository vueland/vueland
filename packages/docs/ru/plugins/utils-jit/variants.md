# Вариативность

Варианты добавляются перед названием утилитыарного класса через `:`.

```html
<div class="hover:w-[320px] md:px-[24px] focus-visible:bg-[#eee]"></div>
```

## Псевдоклассы

По умолчанию доступны:

```txt
hover
focus
focus-visible
focus-within
active
disabled
checked
visited
first
last
odd
even
```

Пример:

```vue
<template>
  <button class="w-[160px] hover:w-[180px] focus:px-[20px] active:radius-[10px]">
    Button
  </button>
</template>
```

Результат:

```css
.hover\:w-\[180px\]:hover{width: 180px !important;}
.focus\:px-\[20px\]:focus{padding-left: 20px !important;padding-right: 20px !important;}
.active\:radius-\[10px\]:active{border-radius: 10px !important;}
```

## Responsive-варианты

По умолчанию доступны breakpoints:

```ts
{
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1280,
  '2xl': 1536,
}
```

Пример:

```vue
<template>
  <div class="w-[100%] md:w-[720px] lg:w-[960px] xl:w-[1200px] 2xl:w-[1440px]">
    Container
  </div>
</template>
```

Результат:

```css
@media (min-width: 768px) { .md\:w-\[720px\]{width: 720px !important;} }
@media (min-width: 1024px) { .lg\:w-\[960px\]{width: 960px !important;} }
@media (min-width: 1280px) { .xl\:w-\[1200px\]{width: 1200px !important;} }
@media (min-width: 1536px) { .2xl\:w-\[1440px\]{width: 1440px !important;} }
```

## Пользовательские варианты

Пользовательские варианты позволяют расширять синтаксис состояний.

```ts
utilsJIT({
  variants: {
    hocus: {
      kind: 'selector',
      value: '&:hover,&:focus',
    },
    selected: {
      kind: 'attribute',
      value: '[aria-selected="true"]',
    },
    tablet: {
      kind: 'media',
      value: 900,
    },
  },
})
```

Использование:

```html
<div class="hocus:w-[320px] selected:bg-[#eee] tablet:px-[24px]"></div>
```

Результат:

```css
.hocus\:w-\[320px\]:hover,.hocus\:w-\[320px\]:focus{width: 320px !important;}
.selected\:bg-\[\#eee\][aria-selected="true"]{background-color: #eee !important;}
@media (min-width: 900px) { .tablet\:px-\[24px\]{padding-left: 24px !important;padding-right: 24px !important;} }
```

## Темы

Dark mode — это часть стратегии темизации приложения. В разных проектах она может быть реализована через `.dark`, `data-theme`, CSS variables, provider или собственный theme layer. Поэтому плагин не навязывает конкретную модель.

Если нужен `dark:` variant, добавьте его явно через `variants`.

### Через `data-theme`

```ts
utilsJIT({
  variants: {
    dark: {
      kind: 'selector',
      value: '[data-theme="dark"] &',
    },
  },
})
```

Использование:

```html
<div class="bg-[#fff] dark:bg-[#111] color-[#111] dark:color-[#fff]"></div>
```

Результат:

```css
[data-theme="dark"] .dark\:bg-\[\#111\]{background-color: #111 !important;}
[data-theme="dark"] .dark\:color-\[\#fff\]{color: #fff !important;}
```

### Через `.dark`

```ts
utilsJIT({
  variants: {
    dark: {
      kind: 'selector',
      value: '.dark &',
    },
  },
})
```

Использование:

```html
<div class="dark:bg-[#111]"></div>
```

Результат:

```css
.dark .dark\:bg-\[\#111\]{background-color: #111 !important;}
```

## Комбинирование variants

Псевдоклассы, selector variants и responsive-варианты можно комбинировать.

`hocus:` не является встроенным variant. Перед использованием его нужно добавить в `variants`:

```ts
utilsJIT({
  variants: {
    hocus: {
      kind: 'selector',
      value: '&:hover,&:focus',
    },
  },
})
```

Теперь `hocus:` можно комбинировать с responsive-вариантами:

```vue
<template>
  <button class="hover:md:w-[240px] focus:lg:px-[32px] hocus:xl:bg-[#eee]">
    Responsive button
  </button>
</template>
```

Результат:

```css
@media (min-width: 768px) { .hover\:md\:w-\[240px\]:hover{width: 240px !important;} }
@media (min-width: 1024px) { .focus\:lg\:px-\[32px\]:focus{padding-left: 32px !important;padding-right: 32px !important;} }
@media (min-width: 1280px) { .hocus\:xl\:bg-\[\#eee\]:hover,.hocus\:xl\:bg-\[\#eee\]:focus{background-color: #eee !important;} }
```
