---
'@vueland/utils-jit': patch
---

Improve startup scanning and package metadata.

The initial project scan now uses async filesystem traversal and bounded async
file reads, reducing event-loop blocking during Vite startup in larger
workspaces.

Vite config files are now excluded from the default scan, preventing custom rule
names declared in `vite.config.*` from being treated as used utility classes.

The package now exposes separate ESM and CJS declaration files through
conditional exports and declares public npm access explicitly for scoped
publishing.
