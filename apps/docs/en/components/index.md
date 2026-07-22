# Components

Vueland UI is in active early development and is not production ready. This catalog shows the components that currently exist in the package; it is not a finished UI kit.

Components marked **Stable** are comparatively more documented and tested within the current early-development phase. The label does not guarantee production readiness. All other components are available in the library, but their API, documentation, or test coverage is still in progress.

## Layout

| Component                     | Status     | Description                                                                     |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------- |
| [CApp](/en/components/CApp)   | **Stable** | Root application wrapper. Manages scroll lock and provides context for overlays |
| [CMain](/en/components/CMain) | **Stable** | Main content area. Used inside `CApp`                                           |

## Grid

12-column responsive grid built on flexbox. Breakpoints follow the Material Design standard and are shared with utility classes and `useBreakpoints`. See [Breakpoints](/en/guide/breakpoints).

| Component                         | Status     | Description                                                   |
| --------------------------------- | ---------- | ------------------------------------------------------------- |
| [CRow](/en/components/CRow)       | **Stable** | Flex row container. Controls alignment and gutter             |
| [CCol](/en/components/CCol)       | **Stable** | Column with responsive width, offset, and order props         |
| [CSpacer](/en/components/CSpacer) | **Stable** | Fills remaining space in a row to push adjacent content apart |

## Form controls

| Component                                     | Status     | Description                                                                     |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| [CForm](/en/components/CForm)                 | **Stable** | Form wrapper. Coordinates validation of all child fields                        |
| [CTextField](/en/components/CTextField)       | **Stable** | Text field with floating label, icons, and hint text                            |
| [CInput](/en/components/CInput)               | **Stable** | Functional core of all field components. Manages state, validation, and presets |
| [CField](/en/components/CField)               | —          | Base field shell: label, hint, error, slot for any control                      |
| [CCheckbox](/en/components/CCheckbox)         | **Stable** | Checkbox with indeterminate state and label                                     |
| [CRadio](/en/components/CRadio)               | —          | Radio button, typically used inside a group                                     |
| [CSelect](/en/components/CSelect)             | **Stable** | Select dropdown built on `CMenu`                                                |
| [CAutocomplete](/en/components/CAutocomplete) | **Stable** | Autocomplete input with filtering and custom options                            |
| [CDateInput](/en/components/CDateInput)       | **Stable** | Date input with formatting and validation                                       |

## Pickers

| Component                                 | Status     | Description                    |
| ----------------------------------------- | ---------- | ------------------------------ |
| [CDatePicker](/en/components/CDatePicker) | **Stable** | Calendar picker for date input |

## Actions

| Component                   | Status     | Description                                           |
| --------------------------- | ---------- | ----------------------------------------------------- |
| [CBtn](/en/components/CBtn) | **Stable** | Button with variants, sizes, icons, and loading state |

## Content

| Component                       | Status     | Description                                                                            |
| ------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| [CCard](/en/components/CCard)   | **Stable** | Card with header, body, and footer. Includes `CCardHeader`, `CCardBody`, `CCardFooter` |
| [CList](/en/components/CList)   | **Stable** | List and list item components. Supports selection, keyboard navigation, and ARIA       |
| [CIcon](/en/components/CIcon)   | —          | Icon renderer. Supports custom resolvers and Font Awesome                              |
| [CLabel](/en/components/CLabel) | —          | Accessible label element                                                               |

## Overlays

| Component                           | Status     | Description                                                                                                     |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| [CMenu](/en/components/CMenu)       | **Stable** | Floating content container positioned relative to an activator. Foundation for dropdowns, selects, and tooltips |
| [CTooltip](/en/components/CTooltip) | **Stable** | Lightweight tooltip built on `CMenu`. Follows WAI-ARIA tooltip pattern                                          |
| [CDialog](/en/components/CDialog)   | —          | Modal dialog with backdrop, focus trap, and scroll lock                                                         |
| [COverlay](/en/components/COverlay) | —          | Low-level overlay primitive used by `CMenu` and `CDialog`                                                       |

## Feedback

| Component                                             | Status     | Description                                                          |
| ----------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| [CProgressCircular](/en/components/CProgressCircular) | **Stable** | Circular progress indicator with determinate and indeterminate modes |
| [CProgressLinear](/en/components/CProgressLinear)     | **Stable** | Linear progress bar with buffer and indeterminate modes              |
