import { defineComponent, provide, type VNode } from 'vue'

import { $FORM_API_KEY } from '../../constants'

export type ValidatorFn = () => boolean | Promise<boolean>

export interface FormAPI {
    add(fn: ValidatorFn): void

    remove(fn: ValidatorFn): void
}

export type FormSlots = {
    default(props: { validate: () => Promise<boolean> }): VNode
}


export const CForm = defineComponent({
    name: 'CForm',
    props: { label: String },
    setup(props, { slots, expose }) {
        let validators: ValidatorFn[] = []

        function add(fn: ValidatorFn) {
            validators.push(fn)
        }

        function remove(fn: ValidatorFn) {
            validators = validators.filter((v) => v !== fn)
        }

        async function validate(): Promise<boolean> {
            return (await Promise.all(validators.map((fn) => fn()))).every(Boolean)
        }

        expose({ validate })
        provide($FORM_API_KEY, {
            add,
            remove,
        })

        return () => (
            <form class="c-form" novalidate aria-label={props.label} onSubmit={(e: Event) => e.preventDefault()}>
                {slots.default?.({ validate })}
            </form>
        )
    },
})

export type CFormProps = InstanceType<typeof CForm>['$props']
