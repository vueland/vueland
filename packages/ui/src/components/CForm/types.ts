import type { VNode } from 'vue'

export type ValidatorFn = () => boolean | Promise<boolean>
export type ResetFn = () => void

export interface FormAPI {
    add(fn: ValidatorFn): void
    remove(fn: ValidatorFn): void
    addReset(fn: ResetFn): void
    removeReset(fn: ResetFn): void
}

export type CFormProps = {
    label?: string
}

export type CFormEmits = {
    submit: [event: Event]
}

export type CFormSlots = {
    default(props: {
        validate: ValidatorFn,
        reset: () => void
    }): VNode
}
