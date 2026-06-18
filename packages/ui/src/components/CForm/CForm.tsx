import { defineComponent, provide, type VNode } from 'vue'

import { $FORM_API_KEY } from '../../constants'

export type ValidatorFn = () => boolean

export interface FormAPI {
    add(fn: ValidatorFn): void

    remove(fn: ValidatorFn): void
}

export type FormSlots = {
    default(props: { validate: () => Promise<boolean> }): VNode
}


export const CForm = defineComponent({
    name: 'CForm',
    setup(_, { slots, expose }) {
        let validators: ValidatorFn[] = []

        function add(fn: ValidatorFn) {
            validators.push(fn)
        }

        function remove(fn: ValidatorFn) {
            validators = validators.filter((v) => v !== fn)
        }

        async function validate(): Promise<boolean> {
            return validators.map((fn) => fn()).every((v) => v)
        }

        expose({ validate })
        provide($FORM_API_KEY, {
            add,
            remove,
        })

        return () => (
            <form class="c-form" onSubmit={(e: Event) => e.preventDefault()}>
                {slots.default?.({ validate })}
            </form>
        )
    },
})

export type CFormProps = InstanceType<typeof CForm>['$props']
