# Components

Vueland UI provides a set of ready-to-use components for building interfaces with Vue 3. All components support the preset system, CSS-variable theming, and accessibility (ARIA).

## General

Root components that wrap the whole application and define the base layout.

| Component | Description |
|---|---|
| [CApp](/en/components/CApp) | Root application wrapper. Manages scroll lock and provides context for overlays |
| [CMain](/en/components/CMain) | Main content area. Used inside `CApp` |

## Form controls

Components for building forms with validation, states, and presets.

| Component | Description |
|---|---|
| [CForm](/en/components/CForm) | Form wrapper. Coordinates validation of all child fields |
| [CTextField](/en/components/CTextField) | Text field with floating label, icons, and hint text |
| [CInput](/en/components/CInput) | Functional core of all field components. Manages state, validation, and presets |

## Actions

> Coming soon...

## Lists and navigation

> Coming soon...

## Overlays

> Coming soon...

## Content

| Component | Description |
|---|---|
| [CCard](/en/components/CCard) | Card with header, body, and footer. Includes `CCardHeader`, `CCardBody`, `CCardFooter` |

## Grid system

12-column responsive grid built on flexbox. Breakpoints follow the Material Design standard and are shared with utility classes and `useDisplay`. See [Breakpoints](/en/guide/breakpoints).

| Component | Description |
|---|---|
| [CRow](/en/components/CRow) | Flex row container. Controls alignment and gutter |
| [CCol](/en/components/CCol) | Column with responsive width, offset, and order props |
| [CSpacer](/en/components/CSpacer) | Fills remaining space in a row to push adjacent content apart |
