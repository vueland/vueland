declare module '*.vue' {
    import type { DefineComponent } from 'vue'

    const component: DefineComponent<any, any, any>
    export default component

    export type CDateInputProps = any
    export type CDatePickerProps = any
    export type DatePickerEnrichedDate = any
    export type DatePickerEnrichedMonth = any
    export type DatePickerEnrichedYear = any
    export type DatePickerSlotApi = any
    export type DatePickerWeekDay = any
}
