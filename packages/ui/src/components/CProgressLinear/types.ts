import type { PresetProps } from '@/composables/use-presets'

export type CProgressLinearProps = PresetProps & {
    value?: number | string
    bufferValue?: number | string
    height?: number | string
    indeterminate?: boolean
    /** Палитровый токен ('red-lighten-2') или сырой цвет ('#fa5a5a', rgb(...), var(...)) */
    color?: string
}
