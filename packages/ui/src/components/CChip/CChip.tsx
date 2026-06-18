import { defineComponent } from 'vue'

import { propsFactory } from '../../utils'

const makeCChipProps = propsFactory({ value: String })

export const CChip = defineComponent({
    props: makeCChipProps(),
    setup(props) {
        return () => <div class={'c-chip'}>{props.value}</div>
    },
})

export type CChipProps = InstanceType<typeof CChip>['$props']
