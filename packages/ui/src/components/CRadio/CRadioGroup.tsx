import { defineComponent } from 'vue'

export const CRadioGroup = defineComponent({
    setup(_, { slots }) {
        return () => slots.default?.()
    },
})

export type CRadioGroupProps = InstanceType<typeof CRadioGroup>['$props']
