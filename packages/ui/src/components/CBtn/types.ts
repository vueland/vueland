import type { PresetProps } from '@/composables/use-presets'

export type CBtnProps = PresetProps & {
    variant?: 'flat' | 'outlined'
    block?: boolean
    disabled?: boolean
}
