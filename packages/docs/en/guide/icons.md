# Icons

Vueland UI uses a resolver system to integrate with any icon library. A resolver is a function that receives an icon name and returns data for rendering: an SVG body, a component, a sprite reference, or a font class.

## How it works

Resolvers are registered in `icons.sets` — an object where each key is a set alias and the value is a resolver function. When using `<CIcon>` you specify `:source="'fa'"` to select the desired set.

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

Vueland UI ships with a built-in resolver for **Font Awesome**. It supports `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-brands-svg-icons`, and any other FA packages.

### Installation

```bash
yarn add @fortawesome/free-solid-svg-icons
yarn add @fortawesome/free-brands-svg-icons    # optional
```

### Setup

Import icons individually and register them with a `prefix:name` key:

```ts
import * as components from '@vueland/ui/components'
import { createVuelandUI, createFontAwesomeResolver } from '@vueland/ui'
import { faUser, faTrash, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import '@vueland/ui/styles.css'

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

### Usage

Icon names follow the `prefix:name` format. If `defaultPrefix` is set and no `:` is present, it is prepended automatically.

```vue
<!-- explicit prefix -->
<CIcon name="fas:house" source="fa" />
<CIcon name="fab:github" source="fa" />

<!-- no prefix → uses defaultPrefix ('fas') -->
<CIcon name="house" source="fa" />
```

## Multiple sets

You can register several sets under different keys:

```ts
icons: {
  sets: {
    fa: createFontAwesomeResolver({ icons: faIcons }),
    // mdi: createMdiResolver({ icons: mdiIcons }),
    // lucide: createLucideResolver({ icons: lucideIcons }),
  },
}
```

::: info
Resolvers for Material Design Icons, Lucide, Heroicons, and other popular libraries are coming in future releases. The resolver API is public — you can write your own today.
:::

## Custom resolver

A resolver is a function with the signature `(name, options) => IconResolverResult`:

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

// register
icons: {
  sets: { my: myResolver }
}
```

A resolver can return one of four formats:

| `kind` | Description |
|---|---|
| `svg` | SVG body (`body`) and `viewBox` |
| `font` | CSS class (`className`) and text (`text`) for font icons |
| `component` | A Vue component (`component`) |
| `sprite` | A sprite symbol reference (`href`) |

## Icon aliases

In addition to resolvers you can register named aliases with fixed SVG data:

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
