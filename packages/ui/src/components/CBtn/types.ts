import type { PresetProps } from '@/composables/use-presets'

export type CBtnProps = PresetProps & {
    variant?: 'flat' | 'outlined'
    /** Палитровый токен ('red-lighten-2') или сырой цвет ('#fa5a5a', rgb(...), var(...)) */
    color?: string
    block?: boolean
    disabled?: boolean
    loading?: boolean
}

/** Отслеживаемые кнопкой взаимодействия — драйвят состояния пресета. */
export type CBtnState = {
    focused: boolean
    active: boolean
}
