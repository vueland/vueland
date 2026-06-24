# Components

Vueland UI provides a set of ready-to-use components for building interfaces with Vue 3. All components support the preset system, CSS-variable theming, and accessibility (ARIA).

Components marked **Stable** are fully documented, covered by tests, and ready for production use. All others are available in the library but their documentation or test coverage is still in progress.

## Layout

| Component | Status | Description |
|---|---|---|
| [CApp](/en/components/CApp) | **Stable** | Root application wrapper. Manages scroll lock and provides context for overlays |
| [CMain](/en/components/CMain) | **Stable** | Main content area. Used inside `CApp` |

## Grid

12-column responsive grid built on flexbox. Breakpoints follow the Material Design standard and are shared with utility classes and `useBreakpoints`. See [Breakpoints](/en/guide/breakpoints).

| Component | Status | Description |
|---|---|---|
| [CRow](/en/components/CRow) | **Stable** | Flex row container. Controls alignment and gutter |
| [CCol](/en/components/CCol) | **Stable** | Column with responsive width, offset, and order props |
| [CSpacer](/en/components/CSpacer) | **Stable** | Fills remaining space in a row to push adjacent content apart |

## Form controls

| Component | Status | Description |
|---|---|---|
| [CForm](/en/components/CForm) | **Stable** | Form wrapper. Coordinates validation of all child fields |
| [CTextField](/en/components/CTextField) | **Stable** | Text field with floating label, icons, and hint text |
| [CInput](/en/components/CInput) | **Stable** | Functional core of all field components. Manages state, validation, and presets |
| [CField](/en/components/CField) | — | Base field shell: label, hint, error, slot for any control |
| [CCheckbox](/en/components/CCheckbox) | — | Checkbox with indeterminate state and label |
| [CRadio](/en/components/CRadio) | — | Radio button, typically used inside a group |
| [CSelect](/en/components/CSelect) | — | Select dropdown built on `CMenu` |
| [CAutocomplete](/en/components/CAutocomplete) | — | Autocomplete input with filtering and custom options |

## Actions

| Component | Status | Description |
|---|---|---|
| [CBtn](/en/components/CBtn) | — | Button with variants, sizes, icons, and loading state |

## Content

| Component | Status | Description |
|---|---|---|
| [CCard](/en/components/CCard) | **Stable** | Card with header, body, and footer. Includes `CCardHeader`, `CCardBody`, `CCardFooter` |
| [CList](/en/components/CList) | — | List and list item components. Supports selection, keyboard navigation, and ARIA |
| [CIcon](/en/components/CIcon) | — | Icon renderer. Supports custom resolvers and Font Awesome |
| [CLabel](/en/components/CLabel) | — | Accessible label element |

## Overlays

| Component | Status | Description |
|---|---|---|
| [CMenu](/en/components/CMenu) | **Stable** | Floating content container positioned relative to an activator. Foundation for dropdowns, selects, and tooltips |
| [CTooltip](/en/components/CTooltip) | **Stable** | Lightweight tooltip built on `CMenu`. Follows WAI-ARIA tooltip pattern |
| [CDialog](/en/components/CDialog) | — | Modal dialog with backdrop, focus trap, and scroll lock |
| [COverlay](/en/components/COverlay) | — | Low-level overlay primitive used by `CMenu` and `CDialog` |
