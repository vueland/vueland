# Пользовательские правила

Плагин можно расширять через `rules` и `defineRule`.

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  defineRule,
  isColorValue,
  isSizeValue,
  utilsJIT,
} from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    vue(),
    utilsJIT({
      rules: [
        defineRule({
          name: 'surface',
          matcher: /^surface-\[(.+)\]$/,
          validate: isColorValue,
          declaration: (value) => ({
            backgroundColor: value,
          }),
          important: false,
        }),

        defineRule({
          name: 'size',
          matcher: /^size-\[(.+)\]$/,
          validate: isSizeValue,
          declaration: (value) => ({
            width: value,
            height: value,
          }),
        }),
      ],
    }),
  ],
})
```

Теперь можно использовать:

```vue
<template>
  <div class="surface-[#fff] size-[40px] hover:size-[48px]">
    Custom utilities
  </div>
</template>
```

Сгенерированный CSS:

```css
.surface-\[\#fff\]{background-color: #fff;}
.size-\[40px\]{width: 40px !important;height: 40px !important;}
.hover\:size-\[48px\]:hover{width: 48px !important;height: 48px !important;}
```

## API `defineRule`

```ts
defineRule({
  name: 'rule-name',
  matcher: /^rule-name-\[(.+)\]$/,
  validate: (value) => true,
  declaration: (value) => ({
    cssProperty: value,
  }),
  important: true,
})
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `name` | `string` | Название правила для читаемости и отладки. |
| `matcher` | `RegExp` | Matcher utility-части без variants. |
| `validate` | `(value: string) => boolean` | Проверка значения внутри `[]`. |
| `declaration` | `(value: string) => Record<string, string \| number> \| string[]` | Генерация CSS declarations. |
| `important` | `boolean` | Добавлять ли `!important` к object-based declarations. По умолчанию `true`. |

`matcher` получает utility-часть без variants.

Для класса:

```html
<div class="hover:surface-[#fff]"></div>
```

`matcher` должен матчить:

```txt
surface-[#fff]
```

## Декларации

`declaration` обычно возвращает объект с css свойствами:

```ts
defineRule({
  name: 'bg',
  matcher: /^bg-\[(.+)\]$/,
  validate: isColorValue,
  declaration: (value) => ({
    backgroundColor: value,
  }),
})
```

CSS-свойства в camelCase автоматически превращаются в kebab-case:

```ts
{
  backgroundColor: '#fff',
  borderTopLeftRadius: '8px',
}
```

Результат:

```css
background-color: #fff !important;
border-top-left-radius: 8px !important;
```

CSS-переменные не изменяются:

```ts
defineRule({
  name: 'token',
  matcher: /^token-\[(.+)\]$/,
  declaration: (value) => ({
    '--vl-token': value,
  }),
  important: false,
})
```

Результат:

```css
--vl-token: #fff;
```

Если `declaration` возвращает `string[]`, строки считаются готовым CSS. В этом случае `!important` автоматически не добавляется.

```ts
defineRule({
  name: 'raw',
  matcher: /^raw-\[(.+)\]$/,
  declaration: (value) => [
    `--raw-value: ${value};`,
  ],
})
```

## Более строгая валидация

Для правил лучше явно ограничивать допустимый формат:

```ts
import { defineRule } from '@vueland/utils-jit'

const gridColsRule = defineRule({
  name: 'grid-cols',
  matcher: /^grid-cols-\[(.+)\]$/,
  validate: (value) => /^\d+$/.test(value),
  declaration: (value) => ({
    gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
  }),
})
```

Использование:

```html
<div class="grid-cols-[3]"></div>
```

Результат:

```css
.grid-cols-\[3\]{grid-template-columns: repeat(3, minmax(0, 1fr)) !important;}
```

## Валидаторы

Пакет экспортирует валидаторы, которые можно использовать в создаваемых правилах:

```ts
import {
  isColorValue,
  isMarginValue,
  isOpacityValue,
  isPaddingValue,
  isPositionValue,
  isRadiusValue,
  isSizeValue,
  isZIndexValue,
} from '@vueland/utils-jit'
```

Пример:

```ts
defineRule({
  name: 'text',
  matcher: /^text-\[(.+)\]$/,
  validate: isColorValue,
  declaration: (value) => ({
    color: value,
  }),
})
```
