import { defineComponent, type FunctionalComponent, h, type SlotsType } from 'vue'

import { CList, CListItem, CListItemTitle } from '../CList'

export type CItemsProps = {
    modelValue: any
    multiple?: boolean
    mandatory?: boolean
    options?: {
        extKey?: string
        noItemsMessage?: string
        menuClass?: string
    }
    items: any[],
}

export type CItemsSlots = {
    'no-items-message'?: () => any
}

export const CItems = defineComponent<CItemsProps>({
    name: 'CItems',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: [Array, Object, String, Number],
            default: () => [] as any[]
        },
        options: {
            type: Object,
            default: () => ({})
        },
        items: {
            type: Array,
            default: () => []
        },
        multiple: {
            type: Boolean,
            default: false
        },
        mandatory: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    slots: {} as SlotsType<CItemsSlots>,
    setup(props, { emit, slots }) {
        const { extKey, noItemsMessage } = props.options ?? {}

        const genItemTitle = (value: string | number) => h(CListItemTitle as FunctionalComponent, {}, {
            default: () => value
        })

        const genItem = (item: any) => h(CListItem, {
            value: item,
        }, {
            default: () => [
                genItemTitle(extKey ? item[extKey] : item)
            ]
        })

        const genEmptyMessage = () => h(CListItem, null, {
            default: () => genItemTitle(slots['no-items-message']?.() ?? noItemsMessage as any)
        })

        return () => h(CList, {
            modelValue: props.modelValue,
            items: props.items,
            multiple: props.multiple,
            active: true,
            selectable: true,
            mandatory: props.mandatory,
            ['onUpdate:modelValue']: <T>(val: T[] | T | null) => {
                emit('update:modelValue', val)
            }
        }, {
            default: () => props.items.length ? props.items.map(genItem) : genEmptyMessage()
        })
    }
})
