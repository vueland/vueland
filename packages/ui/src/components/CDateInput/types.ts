import type { VNode } from 'vue'

import type {
    CDatePickerSlots,
    DateLocale,
    DisabledDates,
} from '@/components/CDatePicker'

// Инпутные пропсы (label/details/rules/preset/…) не дублируются —
// они едут через $attrs в CTextField; публичный тип собирается в index.ts
export type CDateInputProps = {
    modelValue?: Date | null
    typeable?: boolean
    // Языковой тег (BCP-47) либо точечное переопределение Intl-словаря (база — en)
    locale?: string | Partial<DateLocale>
    format?: string
    mondayFirst?: boolean
    disabledDates?: DisabledDates
    highlightedDates?: (Date | string)[]
    minDate?: Date | string
    maxDate?: Date | string
}

// Слоты пикера форвардятся как есть — контракт живёт в CDatePickerSlots
export type CDateInputSlots = Pick<CDatePickerSlots, 'date' | 'week' | 'dates' | 'before-header' | 'before-body' | 'footer'> & {
    prepend?(): VNode
    append?(): VNode
    details?(props: {
        errorMessage?: string
        details?: string
        hasError: boolean
        validating?: boolean
    }): VNode
}
