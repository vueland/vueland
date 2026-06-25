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

type CRowJustifyBreakpointKey =
    | 'justifyXs'
    | 'justifySm'
    | 'justifyMd'
    | 'justifyLg'
    | 'justifyXl'
    | 'justifyXxl'

type CRowAlignBreakpointKey =
    | 'alignXs'
    | 'alignSm'
    | 'alignMd'
    | 'alignLg'
    | 'alignXl'
    | 'alignXxl'

type CRowAlignContentBreakpointKey =
    | 'alignContentXs'
    | 'alignContentSm'
    | 'alignContentMd'
    | 'alignContentLg'
    | 'alignContentXl'
    | 'alignContentXxl'

type CRowInternalProps = {
    align: AlignValue | null
    alignContent: AlignContentValue | null
    justify: JustifyValue | null
    noGutter: boolean

    justifyXs: JustifyValue | null
    justifySm: JustifyValue | null
    justifyMd: JustifyValue | null
    justifyLg: JustifyValue | null
    justifyXl: JustifyValue | null
    justifyXxl: JustifyValue | null

    alignXs: AlignValue | null
    alignSm: AlignValue | null
    alignMd: AlignValue | null
    alignLg: AlignValue | null
    alignXl: AlignValue | null
    alignXxl: AlignValue | null

    alignContentXs: AlignContentValue | null
    alignContentSm: AlignContentValue | null
    alignContentMd: AlignContentValue | null
    alignContentLg: AlignContentValue | null
    alignContentXl: AlignContentValue | null
    alignContentXxl: AlignContentValue | null
}

function createJustifyProp() {
    return {
        type: String as PropType<JustifyValue>,
        default: null,
        validator: (value: string) => justifyValues.includes(value as JustifyValue),
    }
}

function createAlignProp() {
    return {
        type: String as PropType<AlignValue>,
        default: null,
        validator: (value: string) => alignValues.includes(value as AlignValue),
    }
}

function createAlignContentProp() {
    return {
        type: String as PropType<AlignContentValue>,
        default: null,
        validator: (value: string) =>
            alignContentValues.includes(value as AlignContentValue),
    }
}

function getJustifyPropName(bp: BreakpointLabels): CRowJustifyBreakpointKey {
    return toCamelCase('justify', bp) as CRowJustifyBreakpointKey
}

function getAlignPropName(bp: BreakpointLabels): CRowAlignBreakpointKey {
    return toCamelCase('align', bp) as CRowAlignBreakpointKey
}

function getAlignContentPropName(bp: BreakpointLabels): CRowAlignContentBreakpointKey {
    return toCamelCase('align', 'content', bp) as CRowAlignContentBreakpointKey
}

export const CRow = defineComponent({
    name: 'CRow',

    props: {
        align: createAlignProp(),
        alignContent: createAlignContentProp(),
        justify: createJustifyProp(),

        noGutter: Boolean,

        justifyXs: createJustifyProp(),
        justifySm: createJustifyProp(),
        justifyMd: createJustifyProp(),
        justifyLg: createJustifyProp(),
        justifyXl: createJustifyProp(),
        justifyXxl: createJustifyProp(),

        alignXs: createAlignProp(),
        alignSm: createAlignProp(),
        alignMd: createAlignProp(),
        alignLg: createAlignProp(),
        alignXl: createAlignProp(),
        alignXxl: createAlignProp(),

        alignContentXs: createAlignContentProp(),
        alignContentSm: createAlignContentProp(),
        alignContentMd: createAlignContentProp(),
        alignContentLg: createAlignContentProp(),
        alignContentXl: createAlignContentProp(),
        alignContentXxl: createAlignContentProp(),
    },

    setup(rawProps, { slots }): () => VNode {
        const props = rawProps as Readonly<CRowInternalProps>

        const classes = computed<Record<string, boolean>>(() => {
            const cls: Record<string, boolean> = { 'c-row': true }

            if (props.noGutter) {
                cls['no-gutter'] = true
            }

            if (isDef(props.justify)) {
                cls[`justify-${props.justify}`] = true
            }

            if (isDef(props.align)) {
                cls[`items-${props.align}`] = true
            }

            if (isDef(props.alignContent)) {
                cls[`content-${props.alignContent}`] = true
            }

            for (const bp of BREAKPOINTS) {
                const breakpoint = bp as BreakpointLabels

                const justifyProp = getJustifyPropName(breakpoint)
                const alignProp = getAlignPropName(breakpoint)
                const alignContentProp = getAlignContentPropName(breakpoint)

                const justify = props[justifyProp]
                const align = props[alignProp]
                const alignContent = props[alignContentProp]

                if (isDef(justify)) {
                    cls[`${breakpoint}:justify-${justify}`] = true
                }

                if (isDef(align)) {
                    cls[`${breakpoint}:items-${align}`] = true
                }

                if (isDef(alignContent)) {
                    cls[`${breakpoint}:content-${alignContent}`] = true
                }
            }

            return cls
        })

        return () => h('div', { class: classes.value }, slots.default?.())
    },
})
