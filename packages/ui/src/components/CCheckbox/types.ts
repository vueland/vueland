import type { VNode } from 'vue'

import type { CInputProps } from '@/components/CInput'
import type { PresetProps } from '@/composables/use-presets'

export type CCheckboxModel<T> = T | T[] | boolean

export type CCheckboxProps<T> = {
    /** Значение, которое кладётся в модель (или в массив модели) при отметке. */
    value?: T
    /** Размер бокса в пикселях — прокидывается в CIcon. */
    size?: number | string
    /**
     * Объявлены здесь, а не берутся из $attrs: их нужно раздать явно и в
     * CSelectControl (он гасит toggle), и в CInput (он красит и озвучивает).
     */
    disabled?: boolean
    readonly?: boolean
}

export type CCheckboxSlots = {
    icon?(props: { checked: boolean, indeterminate: boolean }): VNode
    default?(props: { checked: boolean, indeterminate: boolean }): VNode | string
    details?(props: { errorMessage?: string, details?: string, hasError: boolean }): VNode | string
}

export type CCheckboxEmits<T> = {
    (e: 'update:modelValue', value: CCheckboxModel<T>): void
    (e: 'update:indeterminate', value: boolean): void
}

export type CCheckboxPublicProps<T> =
    CCheckboxProps<T>
    & CInputProps<CCheckboxModel<T>>
    & { indeterminate?: boolean }

/** Внутренний презентационный слой — не часть публичного API. */
export type CheckboxElementProps = PresetProps & {
    id: string
    error: boolean
    checked: boolean
    focused: boolean
    indeterminate?: boolean
    label?: string
    size?: number | string
    disabled?: boolean
    readonly?: boolean
}
