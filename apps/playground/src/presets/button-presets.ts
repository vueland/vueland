import type { CButtonPreset } from '@vueland/ui/types'

export const A: CButtonPreset = {
    base: { root: ['bg-green-darken-2', 'hover:bg-green-lighten-2', 'text-white', 'elevation-2'] },
    disabled: { root: ['bg-grey', 'text-white'] },
    active: { root: ['bg-green-darken-1', 'elevation-0'] },
}

export const B: CButtonPreset = {
    base: { root: ['bg-blue', 'hover:bg-blue-lighten-1', 'text-white'] },
}
