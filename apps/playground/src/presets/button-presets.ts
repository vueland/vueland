import type { CButtonPreset } from '@vueland/ui/types'

export const A: CButtonPreset = {
    base: { root: ['elevation-2'] },
    disabled: { root: ['bg-grey', 'text-white'] },
    active: { root: ['elevation-0'] },
}

export const B: CButtonPreset = {
    base: { root: ['bg-blue', 'hover:bg-blue-lighten-1', 'text-white'] },
}
