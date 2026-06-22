import type { CInputPreset } from '@vueland/ui/types'

/**
 * «Мягкий» пресет.
 *
 * Каждое состояние — самостоятельный плоский пресет, который ЦЕЛИКОМ подменяет
 * зоны base. Поэтому структурные классы (radius у field, uppercase у label)
 * повторяются в каждом состоянии — иначе при смене состояния они «слетят».
 *
 * Зоны: root (.c-input), field (.c-field), input (<input>), label, details.
 * CInput красит root/details, CField — field/input/label (через inject).
 */
export const soft: CInputPreset = {
    base: {
        root: ['mb-2'],
        field: ['bg-blue-grey-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-blue-grey-darken-1'],
    },
    focused: {
        root: ['mb-2'],
        field: ['bg-blue-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-blue-darken-2'],
    },
    filled: {
        root: ['mb-2'],
        field: ['bg-green-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-green-darken-2'],
    },
    error: {
        root: ['mb-2'],
        field: ['bg-red-lighten-5', 'radius-8'],
        label: ['text-uppercase', 'text-red-darken-2'],
        details: ['text-red-darken-2'],
    },
    disabled: {
        root: ['mb-2'],
        field: ['bg-grey-lighten-3', 'radius-8'],
        label: ['text-uppercase', 'text-grey'],
    },
    readonly: {
        root: ['mb-2'],
        field: ['bg-grey-lighten-4', 'radius-8'],
        label: ['text-uppercase', 'text-blue-grey'],
    },
}

/**
 * Контрастный пресет в индиго-палитре — чтобы видеть, что один и тот же
 * компонент выглядит совсем по-разному в зависимости от пресета.
 */
export const outline: CInputPreset = {
    base: {
        root: ['mb-2'],
        field: ['bg-indigo-lighten-5', 'radius-12'],
        label: ['text-indigo-darken-1'],
        input: ['text-indigo-darken-2'],
    },
    focused: {
        root: ['mb-2'],
        field: ['bg-indigo-lighten-4', 'radius-12'],
        label: ['text-indigo-darken-3'],
        input: ['text-indigo-darken-2'],
    },
    filled: {
        root: ['mb-2'],
        field: ['bg-indigo-lighten-5', 'radius-12'],
        label: ['text-indigo-darken-2'],
        input: ['text-indigo-darken-2'],
    },
    error: {
        root: ['mb-2'],
        field: ['bg-red-lighten-5', 'radius-12'],
        label: ['text-red-darken-2'],
        details: ['text-red-darken-2'],
    },
    disabled: {
        root: ['mb-2'],
        field: ['bg-grey-lighten-3', 'radius-12'],
        label: ['text-grey'],
    },
}
