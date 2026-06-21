import type { CInputPreset } from '@vueland/ui/types'

export const A: CInputPreset = {
    root: ['text-green-darken-2'],
    label: ['text-uppercase'],
    focused: {
        root: ['text-cyan-darken-2'],
    },
    // error: {
    //     root: ['text-pink'],
    // },
    // disabled: {},
    // details: ['text-grey', 'fs-xs'],
}

export const B: CInputPreset = {
    root: ['text-cyan'],
    error: {
        root: ['text-pink'],
    },
}
