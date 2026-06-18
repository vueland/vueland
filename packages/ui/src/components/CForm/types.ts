import type { VNode } from 'vue'

export type ValidatorFn = () => boolean

export interface FormAPI {
    add(fn: ValidatorFn): void

    remove(fn: ValidatorFn): void
}

export type FormSlots = {
    default(props: { validate: ValidatorFn }): VNode
}
