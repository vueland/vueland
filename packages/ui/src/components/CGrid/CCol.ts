import { computed, defineComponent, h, type PropType, type VNode } from 'vue'

import { BREAKPOINTS } from '../../constants'
import { isDef, toCamelCase } from '../../helpers'

export const CCol = defineComponent({
    name: 'CCol',

    props: {
        order: {
            type: [String, Number] as PropType<string | number>,
            default: null,
        },

        cols: {
            type: [String, Number] as PropType<string | number>,
            default: null,
        },

        offset: {
            type: [String, Number] as PropType<string | number>,
            default: null,
        },

        ...BREAKPOINTS.reduce((props, bp) => {
            props[bp] = {
                type: [String, Number] as PropType<string | number>,
                default: null,
            }

            props[`order-${bp}`] = {
                type: [String, Number] as PropType<string | number>,
                default: null,
            }

            props[`offset-${bp}`] = {
                type: [String, Number] as PropType<string | number>,
                default: null,
            }

            return props
        }, {} as Record<string, any>),
    },

    setup(props, { slots }): () => VNode {
        const classes = computed<Record<string, boolean>>(() => {
            const cls: Record<string, boolean> = {
                'c-col': true,
            }

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
                const orderVal = toCamelCase(...`order-${bp}`.split('-'))
                const offsetVal = toCamelCase(...`offset-${bp}`.split('-'))

                if (isDef(props[bp])) {
                    cls[`${bp}-${props[bp]}`] = true
                }

                if (isDef(props[orderVal])) {
                    cls[`${bp}:order-${props[orderVal]}`] = true
                }

                if (isDef(props[offsetVal])) {
                    cls[`${bp}:offset-${props[offsetVal]}`] = true
                }
            }

            return cls
        })

        return () => h('div', { class: classes.value }, slots.default?.())
    },
})
