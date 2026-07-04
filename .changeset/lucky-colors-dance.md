---
'@vueland/utils-jit': minor
---

Добавлен универсальный API `attrs`/`defineAttr` для сканирования runtime-атрибутов.
Теперь пользователи могут описывать собственные атрибуты/пропы, которые должны учитываться при статическом сканировании: имя атрибута, валидатор значения и список utility-префиксов для генерации arbitrary-кандидатов.

Для проектов с `@vueland/ui` проп `color` сканируется внутренне автоматически и всегда добавляется поверх пользовательских `attrs`; это не публичная опция и не отключается через конфиг.

Публичная опция `colorAttributes` удалена. Для кастомных цветовых пропов используйте `attrs` вместе с `defineAttr` и `isColorValue`.

Added a universal `attrs`/`defineAttr` API for scanning runtime attributes.
Users can now define custom attributes or props that should be included in the static scan by providing the attribute name, value validator, and utility prefixes used to generate arbitrary candidates.

For projects using `@vueland/ui`, the built-in `color` prop is scanned internally and is always added on top of user-defined `attrs`. It is not a public option and cannot be disabled through config.

The public `colorAttributes` option has been removed. Use `attrs` with `defineAttr` and `isColorValue` for custom color props.

23:37
