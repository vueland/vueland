import {
    computed,
    defineComponent,
    h,
    type PropType,
    type VNode,
} from 'vue'

import { BREAKPOINTS } from '@/constants'
import { BreakpointLabels } from '@/enums'
import { isDef, toCamelCase } from '@/helpers'

type CColPropValue = string | number

type CColBreakpoint = `${BreakpointLabels}`

type CColOrderBreakpointKey =
    | 'orderXxl'
    | 'orderXl'
    | 'orderLg'
    | 'orderMd'
    | 'orderSm'
    | 'orderXs'

type CColOffsetBreakpointKey =
    | 'offsetXxl'
    | 'offsetXl'
    | 'offsetLg'
    | 'offsetMd'
    | 'offsetSm'
    | 'offsetXs'

export type CColBreakpointProps = Partial<Record<CColBreakpoint, CColPropValue>>

type CColInternalProps = {
    order: CColPropValue | null
    cols: CColPropValue | null
    offset: CColPropValue | null

    xxl: CColPropValue | null
    xl: CColPropValue | null
    lg: CColPropValue | null
    md: CColPropValue | null
    sm: CColPropValue | null
    xs: CColPropValue | null

    orderXxl: CColPropValue | null
    orderXl: CColPropValue | null
    orderLg: CColPropValue | null
    orderMd: CColPropValue | null
    orderSm: CColPropValue | null
    orderXs: CColPropValue | null

    offsetXxl: CColPropValue | null
    offsetXl: CColPropValue | null
    offsetLg: CColPropValue | null
    offsetMd: CColPropValue | null
    offsetSm: CColPropValue | null
    offsetXs: CColPropValue | null
}

function createColProp() {
    return {
        type: [String, Number] as PropType<CColPropValue>,
        default: null,
    }
}

function getOrderPropName(bp: CColBreakpoint): CColOrderBreakpointKey {
    return toCamelCase('order', bp) as CColOrderBreakpointKey
}

function getOffsetPropName(bp: CColBreakpoint): CColOffsetBreakpointKey {
    return toCamelCase('offset', bp) as CColOffsetBreakpointKey
}

export const CCol = defineComponent({
    name: 'CCol',

    props: {
        order: createColProp(),
        cols: createColProp(),
        offset: createColProp(),

        xxl: createColProp(),
        xl: createColProp(),
        lg: createColProp(),
        md: createColProp(),
        sm: createColProp(),
        xs: createColProp(),

        orderXxl: createColProp(),
        orderXl: createColProp(),
        orderLg: createColProp(),
        orderMd: createColProp(),
        orderSm: createColProp(),
        orderXs: createColProp(),

        offsetXxl: createColProp(),
        offsetXl: createColProp(),
        offsetLg: createColProp(),
        offsetMd: createColProp(),
        offsetSm: createColProp(),
        offsetXs: createColProp(),
    },

    setup(rawProps, { slots }): () => VNode {
        const props = rawProps as Readonly<CColInternalProps>

        const classes = computed<Record<string, boolean>>(() => {
            const cls: Record<string, boolean> = { 'c-col': true }

            if (isDef(props.cols)) {
                cls[`c-col-${props.cols}`] = true
            }

            if (isDef(props.order)) {
                cls[`order-${props.order}`] = true
            }

            if (isDef(props.offset)) {
                cls[`offset-${props.offset}`] = true
            }

            for (const bp of BREAKPOINTS) {
                const breakpoint = bp as CColBreakpoint
                const orderProp = getOrderPropName(breakpoint)
                const offsetProp = getOffsetPropName(breakpoint)

                const colValue = props[breakpoint]
                const orderValue = props[orderProp]
                const offsetValue = props[offsetProp]

                if (isDef(colValue)) {
                    cls[`${breakpoint}-${colValue}`] = true
                }

                if (isDef(orderValue)) {
                    cls[`${breakpoint}:order-${orderValue}`] = true
                }

                if (isDef(offsetValue)) {
                    cls[`${breakpoint}:offset-${offsetValue}`] = true
                }
            }

            return cls
        })

        return () => h('div', { class: classes.value }, slots.default?.())
    },
})
