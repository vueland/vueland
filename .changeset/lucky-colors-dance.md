---
'@vueland/ui': minor
'@vueland/utils-jit': minor
---

Проп `color` без предопределённых наборов + сканирование color-пропов в utils-jit.

**@vueland/ui**

- `CBtn`, `CChip`, `CProgressLinear`, `CProgressCircular`: `color` теперь принимает любой цвет платформы — палитровый токен (`red-lighten-2`) или сырое CSS-значение (`#fa5a5a`, `rgb(...)`, `var(...)`). Наборы `primary | secondary | ...` удалены (breaking для этих значений — используйте палитру или `var(--c-sys-color-*)`).
- Новый глобальный хелпер `toColorClass(prefix, color)` — строит утилитарный класс из значения цвета.
- `CBtn`: рамка и hover/pressed-оверлеи через `currentColor`; лоадер outlined-кнопки следует за цветом текста; дефолтный `type="button"` (переопределяется атрибутом).
- `CProgressLinear`: цвет ложится на бар и буфер, а не на корень.

**@vueland/utils-jit**

- Новая опция `colorAttributes`: значения перечисленных атрибутов сканируются как цвета — для сырых значений генерируются arbitrary-кандидаты `bg-[...]`/`color-[...]`. По умолчанию `['color']`, если в проекте установлен `@vueland/ui`.
- Правило `bg-[...]` теперь ставит и `border-color` — как статические `.bg-*` утилиты.
