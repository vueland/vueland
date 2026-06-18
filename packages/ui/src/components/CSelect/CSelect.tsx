import {
 shallowRef, unref, useModel, type VNode 
} from 'vue'

import {
    type IterableItemsProps, type NormalizedItem,
    type SelectableProps,
    useKeyboard,
    useNormalizedItems,
    useSelects
} from '../../composables'
import { IconAliases } from '../../enums'
import {
 emitsFactory, genericComponent, type GenericProps, type InferFactoryProps 
} from '../../utils'
import { CField } from '../CField'
import { CIcon } from '../CIcon'
import {
 CInput, type CInputFieldSlotProps, type CInputSlots, makeCInputProps 
} from '../CInput'
import { CList, CListItem, CListItemTitle } from '../CList'
import { CMenu } from '../CMenu'

export type CSelectProps<T> = SelectableProps<T>
    & IterableItemsProps<T>
    & {
    options?: {
        extKey?: string
        noItemsMessage?: string
    },
}

export type CSelectSlots<T> = {
    menu(props: { items: NormalizedItem<T>[], onSelect(val: T): void }): void
    field: CInputSlots['field']
    prepend(): VNode
    append(): VNode
    selects(props: { items: T[] }): VNode[]
    details(props: {
        errorMessage?: string
        details?: string
    }): VNode
    ['no-items-message'](): string
}

export const CSelect = genericComponent<
    new <T>(
        props: CSelectProps<T>,
        slots: CSelectSlots<T>,
    ) => GenericProps<typeof props, typeof slots>,
    InferFactoryProps<ReturnType<typeof makeCInputProps>>
>()({
    name: 'CSelect',
    emits: emitsFactory<{ 'update:modelValue': [unknown] }>({'update:modelValue': () => true}),
    props: {
        modelValue: null,
        items: { type: Array, default: () => [] },
        titleKey: String,
        valueKey: String,
        multiple: Boolean,
        mandatory: Boolean,
        options: Object,
    },
    setup(props, { slots, attrs }) {
        const model = useModel(props as any, 'modelValue')
        const inputRef = shallowRef()
        const menuRef = shallowRef()
        const menuListRef = shallowRef()

        const normalizedItems = useNormalizedItems(props as any)
        const { selectedItems, hasValue, select } = useSelects(props as any)

        const { onKeydown } = useKeyboard({
            Tab: () => {
                unref(inputRef)?.blur()
                unref(menuRef)?.close()
            },
        })

        function onBlur() {
            unref(inputRef)?.blur()
        }

        function onClear() {
            model.value = (props as any).multiple ? [] : undefined
        }

        function onFocus() {
            unref(inputRef)?.focus()
        }

        return () => (
            <CInput
                {...attrs}
                ref={inputRef}
                modelValue={model.value}
                validateOn="blur"
                kind="listbox"
            >
                {{
                    field: (field: CInputFieldSlotProps) => (
                        <CMenu
                            id={`${field.uid}-menu`}
                            ref={menuRef}
                            bottom
                            openOnFocus
                            closeOnClickOutside
                            closeOnContentClick={!(props as any).multiple}
                            offsetY={2}
                            strategy="reverse"
                            onClose={onBlur}
                        >
                            {{
                                activator: ({ on, activator }: any) => (
                                    <div class="c-select" {...activator}>
                                        {slots.field?.(field) ?? (
                                            <CField
                                                {...field.attrs}
                                                {...{ readonly: true }}
                                                id={field.uid}
                                                focused={field.focused}
                                                modelValue=""
                                                class="c-select__field"
                                                label={field.label}
                                                clearable={field.clearable}
                                                preset={field.preset}
                                                filled={hasValue.value}
                                                onFocus={() => {
                                                    on.focus?.()
                                                    onFocus()
                                                }}
                                                onClear={onClear}
                                                onKeydown={onKeydown}
                                            >
                                                {{
                                                    before: () => slots.selects?.({ items: unref(selectedItems) as any }) ?? (
                                                        unref(selectedItems).map((it: any, i: number) => (
                                                            <div key={`${it}`} class="c-selected__item">
                                                                {`${it}${i + 1 !== unref(selectedItems).length ? ',' : ''}`}
                                                            </div>
                                                        ))
                                                    ),
                                                    append: () => (
                                                        <CIcon name={IconAliases.DROPDOWN} size={20}/>
                                                    ),
                                                }}
                                            </CField>
                                        )}
                                    </div>
                                ),
                                default: () => slots.menu?.({
                                    onSelect: select,
                                    items: unref(normalizedItems) as any,
                                }) ?? (
                                    <CList
                                        ref={menuListRef}
                                        modelValue={model.value}
                                        onUpdate:modelValue={(v: any) => {
                                            model.value = v
                                        }}
                                        role="listbox"
                                        selectable
                                        multiple={(props as any).multiple}
                                        mandatory={(props as any).mandatory}
                                    >
                                        {unref(normalizedItems).map((item: any) => (
                                            <CListItem key={item.key} value={item.value ?? item.raw}>
                                                <CListItemTitle>{item.title}</CListItemTitle>
                                            </CListItem>
                                        ))}
                                    </CList>
                                ),
                            }}
                        </CMenu>
                    ),
                    details: ({ errorMessage, details }: any) =>
                        slots.details?.({ errorMessage, details }) ?? (
                            <span key={errorMessage || details}>
                                {errorMessage || details}
                            </span>
                        ),
                }}
            </CInput>
        )
    },
})
