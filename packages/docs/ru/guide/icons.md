# Иконки

Vueland UI использует систему резолверов для интеграции с любой иконочной библиотекой. Резолвер — это функция, которая принимает имя иконки и возвращает данные для рендеринга: SVG-тело, компонент, спрайт или шрифтовой класс.

## Как это работает

Резолверы регистрируются через `icons.sets` — объект, где ключ это алиас набора, значение — функция-резолвер. При использовании `<CIcon>` вы указываете `:source="'fa'"` чтобы выбрать нужный набор.

```ts
export const vueland = createVuelandUI({
  components,
  icons: {
    sets: {
      fa: createFontAwesomeResolver({ icons: faIcons }),
    },
  },
})
```

```vue
<CIcon name="solid:home" source="fa" />
```

## Font Awesome

Vueland UI поставляется с готовым резолвером для **Font Awesome**. Он поддерживает `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-brands-svg-icons` и любые другие пакеты FA.

### Установка

```bash
yarn add @fortawesome/free-solid-svg-icons
yarn add @fortawesome/free-brands-svg-icons    # опционально
```

### Подключение

Импортируйте нужные иконки поштучно и зарегистрируйте их с ключом в формате `prefix:name`:

```ts
import * as components from '@vueland/ui/components'
import { createVuelandUI, createFontAwesomeResolver } from '@vueland/ui'
import { faUser, faTrash, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import '@vueland/ui/styles.css'
import '@vueland/ui/css/lib.css'

export const vueland = createVuelandUI({
  components,
  icons: {
    sets: {
      fa: createFontAwesomeResolver({
        defaultPrefix: 'fas',
        icons: {
          'fas:user': faUser,
          'fas:trash': faTrash,
          'fas:house': faHouse,
          'fab:github': faGithub,
        },
      }),
    },
  },
})
```

### Использование

Имя иконки записывается в формате `prefix:name`. Если `defaultPrefix` задан и имя не содержит `:`, он подставляется автоматически.

```vue
<!-- явный префикс -->
<CIcon name="fas:house" source="fa" />
<CIcon name="fab:github" source="fa" />

<!-- без префикса → использует defaultPrefix ('fas') -->
<CIcon name="house" source="fa" />
```

## Несколько наборов

Можно подключить сразу несколько наборов с разными ключами:

```ts
icons: {
  sets: {
    fa: createFontAwesomeResolver({ icons: faIcons }),
    // mdi: createMdiResolver({ icons: mdiIcons }),       // Material Design Icons
    // lucide: createLucideResolver({ icons: lucideIcons }), // Lucide
  },
}
```

::: info
Резолверы для Material Design Icons, Lucide, Heroicons и других популярных библиотек появятся в ближайших версиях. API резолвера публичен — вы можете написать свой уже сегодня.
:::

## Пользовательский резолвер

Резолвер — это функция с сигнатурой `(name, options) => IconResolverResult`:

```ts
import type { IconResolver } from '@vueland/ui'

const myResolver: IconResolver = (name) => {
  const svg = myIconMap[name]
  if (!svg) return null

  return {
    kind: 'svg',
    body: svg.path,
    viewBox: `0 0 ${svg.width} ${svg.height}`,
  }
}

// регистрация
icons: {
  sets: { my: myResolver }
}
```

Резолвер может возвращать один из четырёх форматов:

| `kind` | Описание |
|---|---|
| `svg` | Тело SVG (`body`) и `viewBox` |
| `font` | CSS-класс (`className`) и текст (`text`) для шрифтовых иконок |
| `component` | Vue-компонент (`component`) |
| `sprite` | Ссылка на символ спрайта (`href`) |

## Алиасы иконок

Помимо резолверов можно зарегистрировать именованные алиасы с фиксированными SVG-данными:

```ts
icons: {
  aliases: {
    close: {
      body: '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
      viewBox: '0 0 24 24',
    },
  },
}
```

```vue
<CIcon name="close" />
```
