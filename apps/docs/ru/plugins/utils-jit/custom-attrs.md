# Пользовательские атрибуты

Плагин можно расширять через `attrs` и `defineAttr`.

Используйте пользовательские атрибуты, когда компонент принимает литеральное значение пропа и в runtime собирает из него utility-класс. Сканер не видит этот сгенерированный класс в исходниках, поэтому `defineAttr` описывает, какой проп читать, как валидировать значение и какие utility-префиксы генерировать.

```ts
import { defineConfig } from 'vite'
import { defineAttr, isColorValue, isSizeValue, utilsJIT } from '@vueland/utils-jit'

export default defineConfig({
  plugins: [
    utilsJIT({
      attrs: [
        defineAttr({
          attr: 'tone',
          validator: isColorValue,
          prefixes: ['bg', 'text'],
        }),

        defineAttr({
          attr: 'box-size',
          validator: isSizeValue,
          prefixes: ['w', 'h'],
        }),
      ],
    }),
  ],
})
```

Теперь литеральные атрибуты генерируют настроенные кандидаты:

```html
<c-box tone="#fa5a5a" box-size="40px" />
```

```txt
bg-[#fa5a5a]
text-[#fa5a5a]
w-[40px]
h-[40px]
```

## API `defineAttr`

```ts
defineAttr({
  attr: 'tone',
  validator: isColorValue,
  prefixes: ['bg', 'text'],
})
```

| Поле        | Тип                          | Описание                                                                            |
| ----------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `attr`      | `string`                     | Имя атрибута или пропа для сканирования.                                            |
| `validator` | `(value: string) => boolean` | Проверяет нормализованное значение перед генерацией кандидатов.                     |
| `prefixes`  | `string[]`                   | Utility-префиксы, которые генерируются из значения.                                 |
| `normalize` | `(value: string) => string`  | Опциональная нормализация значения. По умолчанию пробелы внутри значения убираются. |

Дефолтная нормализация полезна для значений вроде `rgb(255, 90, 90)`: итоговый кандидат станет `bg-[rgb(255,90,90)]`.

## Валидаторы

Можно использовать встроенные валидаторы или любую проектную функцию с такой же сигнатурой `(value: string) => boolean`.

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

Примеры:

```ts
defineAttr({
  attr: 'panel-width',
  validator: isSizeValue,
  prefixes: ['w'],
})

defineAttr({
  attr: 'content-space',
  validator: isPaddingValue,
  prefixes: ['pa'],
})
```

## Статические значения

Значение должно быть статическим в исходном коде. Сканер видит литералы, включая простые bound string literals:

```vue
<template>
  <c-box tone="#fa5a5a" />
  <c-box :tone="'#fa5a5a'" />
</template>
```

```tsx
export function Example() {
  return <Box tone={'#fa5a5a'} />
}
```

Runtime-выражения не вычисляются:

```vue
<template>
  <c-box :tone="themeColor" />
</template>
```

## Вместе с `@vueland/ui`

Если в проекте найден `@vueland/ui`, `utilsJIT` всегда сканирует встроенный проп `color` у компонентов Vueland как внутреннее правило:

```ts
defineAttr({
  attr: 'color',
  validator: isColorValue,
  prefixes: ['bg', 'text'],
})
```

Это не публичная опция, и `attrs` её не заменяет. При этом свои атрибуты можно добавлять как обычно:

```ts
utilsJIT({
  attrs: [
    defineAttr({
      attr: 'track-color',
      validator: isColorValue,
      prefixes: ['bg'],
    }),
  ],
})
```

В проекте с `@vueland/ui` будут сканироваться и `color="#fa5a5a"`, и `track-color="#22c55e"`.
