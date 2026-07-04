import type { VNode } from 'vue'

import type { PresetProps } from '@/composables/use-presets'

export type CProgressCircularProps = PresetProps & {
    value?: number | string
    size?: number | string
    width?: number | string
    rotate?: number | string
    indeterminate?: boolean
    /** Палитровый токен ('red-lighten-2') или сырой цвет ('#fa5a5a', rgb(...), var(...)) */
    color?: string
}

export type CProgressCircularSlots = {
    default?(props: { value: number }): VNode
}
