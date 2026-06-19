import { computed, defineComponent, h, type PropType, type VNode } from 'vue'

import { BREAKPOINTS } from '../../constants'
import { isDef, toCamelCase } from '../../helpers'

const positions = ['start', 'center', 'end'] as const
const justifyValues = [...positions, 'space-between', 'space-around'] as const
const alignValues = [...positions, 'baseline', 'stretch'] as const
const alignContentValues = [
    ...positions,
    'space-between',
    'space-around',
    'stretch',
] as const

type JustifyValue = (typeof justifyValues)[number]
type AlignValue = (typeof alignValues)[number]
type AlignContentValue = (typeof alignContentValues)[number]

export const CRow = defineComponent({
    name: 'CRow',

    props: {
        align: {
            type: String as PropType<AlignValue>,
            default: null,
            validator: (value: string) => alignValues.includes(value as AlignValue),
        },

        alignContent: {
            type: String as PropType<AlignContentValue>,
            default: null,
            validator: (value: string) =>
                alignContentValues.includes(value as AlignContentValue),
        },

        justify: {
            type: String as PropType<JustifyValue>,
            default: null,
            validator: (value: string) =>
                justifyValues.includes(value as JustifyValue),
        },

        noGutter: Boolean,

        ...BREAKPOINTS.reduce((props, bp) => {
            props[`justify-${bp}`] = {
                type: String as PropType<JustifyValue>,
                default: null,
                validator: (value: string) =>
                    justifyValues.includes(value as JustifyValue),
            }

            props[`align-${bp}`] = {
                type: String as PropType<AlignValue>,
                default: null,
                validator: (value: string) =>
                    alignValues.includes(value as AlignValue),
            }

            props[`align-content-${bp}`] = {
                type: String as PropType<AlignContentValue>,
                default: null,
                validator: (value: string) =>
                    alignContentValues.includes(value as AlignContentValue),
            }

            return props
        }, {} as Record<string, any>),
    },

    setup(props, { slots }): () => VNode {
        const classes = computed<Record<string, boolean>>(() => {
            const cls: Record<string, boolean> = {
                'c-row': true,
            }

            if (props.noGutter) {
                cls['no-gutter'] = true
            }

            if (isDef(props.justify)) {
                cls[`justify-${props.justify}`] = true
            }

            if (isDef(props.align)) {
                cls[`align-${props.align}`] = true
            }

            if (isDef(props.alignContent)) {
                cls[`align-content-${props.alignContent}`] = true
            }

            for (const bp of BREAKPOINTS) {
                const justifyVal = toCamelCase(...`justify-${bp}`.split('-'))
                const alignVal = toCamelCase(...`align-${bp}`.split('-'))
                const contentVal = toCamelCase(...`align-content-${bp}`.split('-'))

                if (isDef(props[justifyVal])) {
                    cls[`${bp}:justify-${props[justifyVal]}`] = true
                }

                if (isDef(props[alignVal])) {
                    cls[`${bp}:align-${props[alignVal]}`] = true
                }

                if (isDef(props[contentVal])) {
                    cls[`${bp}:align-content-${props[contentVal]}`] = true
                }
            }

            return cls
        })

        return () => h('div', { class: classes.value }, slots.default?.())
    },
})
