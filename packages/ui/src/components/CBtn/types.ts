import type { PresetProps } from '@/composables/use-presets'

export type CBtnColor =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'

export type CBtnProps = PresetProps & {
    variant?: 'flat' | 'outlined'
    color?: CBtnColor
    block?: boolean
    disabled?: boolean
}
