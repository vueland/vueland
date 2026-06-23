<script setup lang="ts" generic="T">
    import {
        computed,
        nextTick,
        provide,
        shallowRef,
        toRaw,
        unref,
        useAttrs
    } from 'vue'

    import { useAriaListbox } from '@/composables/use-aria-listbox'
    import { useId } from '@/composables/use-id'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $LIST_API_KEY } from '@/constants'

    import type {
        CListProps,
        CListSlots,
        ListItemControls
    } from './types'

    defineOptions({
        name: 'CList',
        inheritAttrs: false,
    })

    const props = defineProps<CListProps<T>>()

    defineSlots<CListSlots<T>>()

    const model = defineModel<T | T[] | null>({ default: null })

    const focused = shallowRef(false)

    const listEl = shallowRef()

    const descendant = shallowRef<string | undefined>()

    const attrs = useAttrs()

    const listId = useId(undefined, { prefix: 'c-list' })

    const rootAttrs = useAriaListbox(() => ({
        role: unref(role),
        multiple: props.multiple,
        descendant: unref(descendant),
    }))

    const { onKeydown } = useKeyboard({
        ArrowDown: navigateDown,
        ArrowUp: navigateUp,
    })

    let handlers: any[] = []

    let currentIndex = -1

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
        if (props.readonly) {
            return
        }

        if (props.multiple) {
            model.value = [...unref(model) as T[], listItem]
        } else {
            model.value = listItem
        }
    }

    function unselect(listItem: T) {
        if(props.readonly || !props.multiple && props.mandatory) {
            return
        }

        const current = unref(model) as T[]

        if (props.multiple && current.length <= 1) {
            return
        } else if (props.multiple) {
            model.value = current?.filter(item => toRaw(item) !== toRaw(listItem))
        } else {
            model.value = null
        }
    }

    function isActive(listItem: T) {
        if (props.multiple) {
            return (unref(model) as T[])?.some(item => toRaw(item) === toRaw(listItem))
        } else {
            return toRaw(model.value) === toRaw(listItem)
        }
    }

    function register(itemControls: ListItemControls): number {
        const idx = handlers.length
        handlers.push(itemControls)

        return idx
    }

    function unregister(itemControls: ListItemControls) {
        handlers = handlers.filter(it => it !== itemControls)
    }

    function getItemId(index: number) {
        return `${listId}-option-${index}`
    }

    function setActiveItem(index: number | undefined) {
        descendant.value = index === undefined ? undefined : getItemId(index)
    }

    async function focus() {
        focused.value = true
        await nextTick()
        unref(listEl).focus()
    }

    function navigateDown() {
        if (!handlers.length) {
            return
        }
        const next = Math.min(handlers.length - 1, currentIndex + 1)
        handlers[currentIndex]?.blur()
        handlers[next].focus()
        currentIndex = next
    }

    function navigateUp() {
        if (!handlers.length || currentIndex <= 0) {
            return
        }
        const prev = currentIndex - 1
        handlers[currentIndex]?.blur()
        handlers[prev].focus()
        currentIndex = prev
    }

    defineExpose({
        focus,
        listId,
        descendant,
        navigateDown,
        navigateUp
    })

    provide($LIST_API_KEY, {
        role,
        register,
        unregister,
        getItemId,
        setActiveItem,
        select,
        unselect,
        isActive,
    })
</script>

<template>
    <ul
        ref="listEl"
        class="c-list"
        :class="classes"
        :tabindex
        v-bind="rootAttrs"
        @keydown="onKeydown"
    >
        <slot
            :select
            :unselect
            :is-active="isActive"
        ></slot>
    </ul>
</template>
