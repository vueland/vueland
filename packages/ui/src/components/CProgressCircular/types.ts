import type { VNode } from 'vue'

import type { PresetProps } from '@/composables/use-presets'

export type CProgressCircularProps = PresetProps & {
    value?: number | string
    size?: number | string
    width?: number | string
    rotate?: number | string
    indeterminate?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info'
}

export type CProgressCircularSlots = {
    default?(props: { value: number }): VNode
}
