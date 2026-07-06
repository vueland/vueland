import type { CListPreset } from '@vueland/ui/types'

/** Просторный список с округлыми пунктами — пара к `menu.soft`. */
export const soft: CListPreset = {
    base: {
        root: ['pa-2'],
        option: ['radius-8 mt-2'],
    },
}

/**
 * Компактный список. Состояния disabled/readonly глушат пункты — их резолвит
 * сам CList по своим пропам, где бы пресет ни жил (проп или контекст).
 */
export const compact: CListPreset = {
    base: {
        root: ['pa-1'],
        option: ['radius-4 mt-2'],
    },
    disabled: {
        root: ['pa-1'],
        option: ['radius-4', 'text-grey'],
    },
    readonly: {
        root: ['pa-1'],
        option: ['radius-4', 'text-blue-grey'],
    },
}
