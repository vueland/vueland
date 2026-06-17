import {
    computed,
    nextTick,
    provide,
    shallowRef,
    toRaw,
    unref,
    useModel,
} from 'vue'

import { useKeyboard } from '../../composables'
import { $LIST_API_KEY } from '../../constants'
import { genericComponent, type GenericProps } from '../../utils'

import type { CListProps, CListSlots, ListItemControls } from './types'

export const CList = genericComponent<new <T>(
    props: CListProps<T>,
    slots: CListSlots<T>,
) => GenericProps<typeof props, typeof slots>>()({
    name: 'CList',
    inheritAttrs: false,
    emits: { 'update:modelValue': () => true },
    props: {
        modelValue: null,
        multiple: Boolean,
        mandatory: Boolean,
        readonly: Boolean,
        selectable: Boolean,
        role: String,
    } as any,
    setup<T>(props: CListProps<T>, { slots, expose, attrs }) {
        const model = useModel(props, 'modelValue')
        const focused = shallowRef(false)
        const listEl = shallowRef<HTMLElement>()

        let handlers: ListItemControls[] = []
        let index = 0

        const classes = computed(() => ({
            'c-list--readonly': props.readonly,
            [attrs.class as string]: !!attrs.class,
        }))

        const role = computed(() => {
            if (props.role) return props.role
            if (props.selectable) return 'listbox'
            return undefined
        })

        const tabindex = computed<number | undefined>(() => {
            if (attrs.tabindex != null) return attrs.tabindex as number
            if (unref(focused)) return 0
            if (props.selectable) return -1
            if (props.role === 'listbox') return -1
            if (props.role === 'menu') return -1
            return undefined
        })

        function select(listItem: T) {
            if (props.readonly) return
            if (props.multiple) {
                model.value = [...(unref(model) as any[]), listItem]
            } else {
                model.value = listItem
            }
        }

        function unselect(listItem: unknown) {
            if ((props.mandatory && !props.multiple) || props.readonly) return
            if (props.multiple) {
                model.value = (unref(model) as any[])?.filter(item => toRaw(item) !== toRaw(listItem))
            } else {
                model.value = null
            }
        }

        function isActive(listItem: T) {
            if (props.multiple) {
                return (unref(model) as T[])?.some(item => toRaw(item) === toRaw(listItem))
            }
            return toRaw(model.value) === toRaw(listItem)
        }

        function register(itemControls: ListItemControls) {
            handlers.push(itemControls)
        }

        function unregister(itemControls: ListItemControls) {
            handlers = handlers.filter(it => it !== itemControls)
        }

        async function focus() {
            focused.value = true
            await nextTick()
            unref(listEl)?.focus()
        }

        const { onKeydown } = useKeyboard({
            ArrowDown: () => {
                handlers[index].focus()
                handlers[index - 1]?.blur()
                index = Math.min(handlers.length - 1, index + 1)
            },
            ArrowUp: () => {
                handlers[index]?.blur()
                index = Math.min(handlers.length - 1, Math.max(0, index - 1))
                handlers[index].focus()
            },
        })

        expose({ focus })

        provide($LIST_API_KEY, {
 role, register, unregister, select, unselect, isActive 
})

        return () => (
            <ul
                ref={listEl}
                class={['c-list', classes.value]}
                role={unref(role)}
                tabindex={unref(tabindex)}
                aria-multiselectable={props.multiple}
                onKeydown={onKeydown}
            >
                {slots.default?.({ select, unselect, isActive })}
            </ul>
        )
    },
})
