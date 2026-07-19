---
'@vueland/ui': patch
---

Dispose the display watch effect on app unmount

`useDisplay` now owns its breakpoint `watchEffect` via a detached `effectScope` and exposes `dispose()`; the library's `app.unmount` wrapper stops the scope alongside removing the `resize` listener. Previously the effect was created outside any scope and lived forever — leaking across app instances (tests, micro-frontends, HMR).
