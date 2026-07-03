---
'@vueland/ui': patch
---

useValidate`(and every`CInput`-based component) now accepts a `validationValue`prop. When set, validation rules receive it instead of`modelValue`; when nullish, rules fall back to `modelValue`as before. The`validateOn: 'input'`watcher reacts to changes of both values, and the`validateOn: 'blur'` semantics are unchanged — input changes are skipped while the effective value stays non-empty.
