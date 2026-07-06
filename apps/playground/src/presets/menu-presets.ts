import type { CMenuPreset } from '@vueland/ui/types'

/** Мягкое скруглённое меню — вкладывается в `input.soft` и работает standalone. */
export const soft: CMenuPreset = {
    base: { root: ['radius-12', 'elevation-4'] },
}

/**
 * Тёмное меню. Состояние opened усиливает тень — видно, что standalone-CMenu
 * резолвит свои состояния сам (opened/closed).
 */
export const dark: CMenuPreset = {
    base: { root: ['bg-graphite', 'text-white', 'radius-8', 'elevation-2'] },
    opened: { root: ['bg-graphite', 'text-white', 'radius-8', 'elevation-8'] },
}
