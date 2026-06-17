import { defineComponent, provide } from 'vue'

import { $FORM_API_KEY } from '../../constants'

import type { ValidatorFn } from './types'

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

        function validate(): boolean {
            return validators.map(fn => fn()).every(v => v)
        }

        expose({ validate })
        provide($FORM_API_KEY, { add, remove })

        return () => (
            <form
                class="c-form"
                onSubmit={(e: Event) => e.preventDefault()}
            >
                {slots.default?.({ validate })}
            </form>
        )
    },
})
