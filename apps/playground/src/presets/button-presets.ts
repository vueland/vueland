import { type CButtonPreset } from '@vueland/ui/types'

export const A: CButtonPreset = {
    base: { root: ['bg-green-darken-2', 'hover:bg-green-lighten-2', 'text-white'] },
    disabled: { root: ['bg-grey', 'text-white'] },
}

export const B: CButtonPreset = {
    base: { root: ['bg-blue', 'hover:bg-blue-lighten-1', 'text-white'] },
}
