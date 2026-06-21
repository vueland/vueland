export const ARIA = {
    EXPANDED: 'aria-expanded',
    HASPOPUP: 'aria-haspopup',
    CONTROLS: 'aria-controls',
    LABEL: 'aria-label',
    LABELLEDBY: 'aria-labelledby',
    DESCRIBEDBY: 'aria-describedby',
    ERRORMESSAGE: 'aria-errormessage',
    HIDDEN: 'aria-hidden',
    DISABLED: 'aria-disabled',
    INVALID: 'aria-invalid',
    READONLY: 'aria-readonly',
    SELECTED: 'aria-selected',
    MULTISELECTABLE: 'aria-multiselectable',
    REQUIRED: 'aria-required',
    LIVE: 'aria-live',
    ATOMIC: 'aria-atomic',
    BUSY: 'aria-busy',
    CURRENT: 'aria-current',
    PRESSED: 'aria-pressed',
    CHECKED: 'aria-checked',
    VALUENOW: 'aria-valuenow',
    VALUEMIN: 'aria-valuemin',
    VALUEMAX: 'aria-valuemax',
    VALUETEXT: 'aria-valuetext',
    MODAL: 'aria-modal',
    ACTIVEDESCENDANT: 'aria-activedescendant',
    AUTOCOMPLETE: 'aria-autocomplete',
    ORIENTATION: 'aria-orientation',
} as const

export type AriaKey = typeof ARIA[keyof typeof ARIA]

export type AriaHaspopup = 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

export type AriaLive = 'off' | 'polite' | 'assertive'

export type AriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'
