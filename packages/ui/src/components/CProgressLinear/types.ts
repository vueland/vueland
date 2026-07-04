import type { PresetProps } from '@/composables/use-presets'

export type CProgressLinearProps = PresetProps & {
    value?: number | string
    bufferValue?: number | string
    height?: number | string
    indeterminate?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info'
}
