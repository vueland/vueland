import type { CDatePickerPreset } from '@vueland/ui/types'

/**
 * Мягкий пикер: вкладывается в `input.soft` и работает standalone
 * (`preset="datePicker.soft"`). Состояния — активная вьюха: в years
 * ячейки годов получают свой комплект, dates/months живут на base.
 */
export const soft: CDatePickerPreset = {
    base: {
        root: ['radius-12'],
        display: ['bg-grey-darken-2'],
        header: ['text-white bg-grey-darken-3'],
        cell: ['radius-8'],
        // week: ['text-white', 'bg-green'],
    },
    years: {
        // cell: ['radius-8', 'bg-blue-grey-darken-1', 'text-white'],
    },
}
