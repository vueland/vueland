import type { CFieldPreset, CInputPreset } from '@vueland/ui/types'

import { compact as listCompact, soft as listSoft } from './list-presets'
import { dark as menuDark, soft as menuSoft } from './menu-presets'

/**
 * Поле «мягкого» пресета.
 *
 * Каждое состояние — самостоятельный плоский пресет, который ЦЕЛИКОМ подменяет
 * зоны base. Поэтому структурные классы (radius у root, uppercase у label)
 * повторяются в каждом состоянии — иначе при смене состояния они «слетят».
 */
const softField: CFieldPreset = {
    base: {
        root: ['bg-blue-grey-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-blue-grey-darken-1'],
    },
    focused: {
        root: ['bg-blue-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-blue-darken-2'],
    },
    filled: {
        root: ['bg-green-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-green-darken-2'],
    },
    error: {
        root: ['bg-red-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-red-darken-2'],
    },
    disabled: {
        root: ['bg-grey-lighten-3', 'radius-8'],
        label: ['text-uppercase', 'text-grey'],
    },
    readonly: {
        root: ['bg-grey-lighten-4', 'radius-8'],
        label: ['text-uppercase', 'text-blue-grey'],
    },
}

/**
 * Полный комбо-пресет: пресеты поля, меню и списка подставлены по значению —
 * это те же объекты, что работают standalone (`preset="menu.soft"` и т.д.).
 * CField/CMenu/CList берут их из base-снимка через контекст и резолвят свои
 * состояния сами.
 */
export const soft: CInputPreset = {
    base: {
        root: ['mb-2'],
        field: softField,
        menu: menuSoft,
        list: listSoft,
    },
    error: {
        root: ['mb-2'],
        details: ['text-red-darken-2'],
    },
}

const outlineField: CFieldPreset = {
    base: { root: ['field-radius-[25px]'] },
    error: {
        root: ['bg-red-lighten-5', 'radius-12'],
        label: ['text-red-darken-2'],
    },
    disabled: {
        root: ['bg-grey-lighten-3', 'radius-12'],
        label: ['text-grey'],
    },
}

/**
 * Контрастный вариант: то же поле-скругление, но тёмное меню и компактный
 * список — переиспользуем те же вложенные пресеты в другом сочетании.
 */
export const outline: CInputPreset = {
    base: {
        root: ['mb-2'],
        field: outlineField,
        menu: menuDark,
        list: listCompact,
    },
    error: {
        root: ['mb-2'],
        details: ['text-red-darken-2'],
    },
}
