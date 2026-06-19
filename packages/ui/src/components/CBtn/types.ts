import type { PresetProps } from '../../composables'

export type CBtnProps = PresetProps & {
    variant?: 'flat' | 'outlined'
    block?: boolean
    disabled?: boolean
}
