import type { CFieldPreset } from '@vueland/ui/types'

export const base: CFieldPreset = {
    root: [''],
    label: ['text-uppercase'],
    focused: {
        label: ['text-amber'],
    },
    filled: {
        label: ['text-green', 'text-uppercase'],
    },
}

export const error: CFieldPreset = {
    root: [''],
    filled: {
        label: ['text-red-darken-2', 'text-uppercase'],
    },
}
