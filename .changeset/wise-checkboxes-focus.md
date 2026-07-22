---
'@vueland/ui': patch
---

refactor(CCheckbox): unify focus state naming to `focused`

Rename the internal `focusVisible` state to `focused` across `CheckboxElement`,
`useCheckboxPresets`, and the `.c-checkbox--focused` style hook, and drop the
redundant boolean coercions in the preset state map.
