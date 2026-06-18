import {
    type ComputedRef,
    type ModelRef,
    type PropType,
    shallowRef,
    unref,
    useModel,
    watch,
} from 'vue'

import {
    type LoosePath,
    type NormalizedItem,
    useAutocomplete,
    useKeyboard,
} from '../../composables'
import { IconAliases } from '../../enums'
import {
    emitsFactory,
    genericComponent,
    type GenericProps,
    type InferFactoryProps,
    propsFactory,
} from '../../utils'
import { CField } from '../CField'
import { CIcon } from '../CIcon'
import { CInput, type CInputFieldSlotProps, makeCInputProps } from '../CInput'
import { CList, CListItem, CListItemTitle } from '../CList'
import { CMenu } from '../CMenu'

type CAutocompleteOptions = {
    noItemsMessage?: string
    menuPreset?: string
}

export type CAutocompleteSlots<Item = unknown> = {
    menu: {
        items: NormalizedItem<Item>[]
        onSelect(value: Item): void
    }
    field: CInputFieldSlotProps
    prepend: never
    append: never
    selects: {
        selectedItems: ComputedRef<unknown[]>
    }
    details: {
        errorMessage?: string
        details?: string
    }
    'no-items-message': never
}

export type CAutocompleteEvents = {
    'update:search': [string]
    'update:modelValue': [unknown]
}

export const makeCAutocompleteProps = propsFactory({
    items: {
        type: Array,
        default: (): unknown[] => [],
    },
    titleKey: String,
    valueKey: String,
    modelValue: {
        type: null,
        required: true,
    },
    multiple: Boolean,
    mandatory: Boolean,
    options: Object as PropType<CAutocompleteOptions>,
})

type ModelValue<Item, Multiple extends boolean | undefined> = Multiple extends true
    ? Item[]
    : Item | undefined | null

export const CAutocomplete = genericComponent<
    new <
        T extends readonly unknown[],
        Item = T[number],
        Multiple extends boolean | undefined = false,
        Value = ModelValue<Item, Multiple>,
    >(
        props: {
            items: T
            modelValue: NoInfer<Value>
            multiple?: Multiple
            mandatory?: boolean
            titleKey?: LoosePath<Item>
            valueKey?: LoosePath<Item>
            options?: CAutocompleteOptions
        },
        slots: CAutocompleteSlots<Item>,
    ) => GenericProps<typeof props, typeof slots>,
    InferFactoryProps<ReturnType<typeof makeCInputProps>>
>()({
    name: 'CAutocomplete',
    props: makeCAutocompleteProps(),
    emits: emitsFactory<CAutocompleteEvents>({
        'update:modelValue': () => true,
        'update:search': (val: string) => typeof val === 'string',
    }),
    setup(props, {
        emit,
        attrs,
        slots,
    }) {
        const model = useModel(props, 'modelValue') as ModelRef<unknown | unknown[] | undefined>

        const {
            inputValue,
            searchItems,
            selectedItems,
            hasValue,
            select,
        } = useAutocomplete(props)

        const inputRef = shallowRef()
        const fieldRef = shallowRef()
        const menuRef = shallowRef()
        const menuListRef = shallowRef()

        const { onKeydown } = useKeyboard({
            Backspace: () => {
                if (!unref(inputValue)) {
                    const data = unref(model)

                    model.value = props.multiple
                        ? Array.isArray(data)
                            ? data.slice(0, -1)
                            : []
                        : undefined
                }
            },

            Tab: () => {
                unref(inputRef)?.blur()
                unref(menuRef)?.close()
            },

            Escape: () => {
                unref(inputRef)?.blur()
                unref(fieldRef)?.$el?.blur()
            },

            ArrowDown: () => {
                menuListRef.value?.focus()
            },
        })

        function clear() {
            model.value = props.multiple ? [] : undefined
        }

        function focus() {
            unref(inputRef)?.focus()
        }

        function blur() {
            unref(inputRef)?.blur()
        }

        watch(inputValue, () => {
            emit('update:search', unref(inputValue))
        })

        return () => (
            <CInput modelValue={model.value as any} ref={inputRef} kind="listbox" {...attrs}>
                {{
                    field: (field: CInputFieldSlotProps) => (
                        <CMenu
                            id={`${field.uid}-menu`}
                            ref={menuRef}
                            bottom
                            openOnFocus
                            closeOnClickOutside
                            closeOnContentClick={!props.multiple}
                            offsetY={2}
                            strategy="reverse"
                            preset={props.options?.menuPreset}
                            onClose={blur}
                        >
                            {{
                                activator: ({ on, activator }) => (
                                    <div class={['c-autocomplete']} {...activator}>
                                        {slots.field?.(field) ?? (
                                            <CField
                                                {...field.attrs}
                                                id={field.uid}
                                                ref={fieldRef}
                                                modelValue={inputValue.value}
                                                onUpdate:modelValue={(value: string) => {
                                                    inputValue.value = value
                                                }}
                                                class={['c-autocomplete__field']}
                                                filled={hasValue.value}
                                                label={field.label}
                                                clearable={field.clearable}
                                                preset={field.preset}
                                                error={field.hasError}
                                                focused={field.focused}
                                                onClear={clear}
                                                onFocus={() => {
                                                    on.focus?.()
                                                    focus()
                                                }}
                                                onKeydown={onKeydown}
                                            >
                                                {{
                                                    ...(slots.prepend && { prepend: () => slots.prepend!({}) }),

                                                    append: () =>
                                                        slots.append?.({}) ?? (
                                                            <CIcon
                                                                name={IconAliases.DROPDOWN}
                                                                size={20}
                                                            />
                                                        ),

                                                    before: () =>
                                                        slots.selects?.({ selectedItems }) ??
                                                        unref(selectedItems).map((it, i) => (
                                                            <div
                                                                class={['c-autocomplete__item']}
                                                                key={`${it}`}
                                                            >
                                                                {`${it}${
                                                                    i + 1 !==
                                                                    unref(selectedItems).length
                                                                        ? ','
                                                                        : ''
                                                                }`}
                                                            </div>
                                                        )),
                                                }}
                                            </CField>
                                        )}
                                    </div>
                                ),

                                default: () =>
                                    slots.menu?.({
                                        onSelect: select,
                                        items: searchItems.value,
                                    }) ?? (
                                        <CList
                                            ref={menuListRef}
                                            modelValue={model.value}
                                            onUpdate:modelValue={(value) => {
                                                model.value = value
                                            }}
                                            role="listbox"
                                            selectable
                                            multiple={props.multiple}
                                            mandatory={props.mandatory}
                                        >
                                            {unref(searchItems).length ? (
                                                unref(searchItems).map((it) => (
                                                    <CListItem
                                                        key={it.key}
                                                        value={it.value ?? it.raw}
                                                    >
                                                        <CListItemTitle>{it.title}</CListItemTitle>
                                                    </CListItem>
                                                ))
                                            ) : (
                                                <CListItem>
                                                    <CListItemTitle>
                                                        {props.options?.noItemsMessage ??
                                                            'No items'}
                                                    </CListItemTitle>
                                                </CListItem>
                                            )}
                                        </CList>
                                    ),
                            }}
                        </CMenu>
                    ),

                    details: ({ errorMessage, details }) => {
                        return (
                            slots.details?.({
                                errorMessage,
                                details,
                            }) ?? (
                                <span key={errorMessage || details}>{errorMessage || details}</span>
                            )
                        )
                    },
                }}
            </CInput>
        )
    },
})
