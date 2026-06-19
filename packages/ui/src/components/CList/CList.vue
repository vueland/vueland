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

    import { useKeyboard } from '../../composables'
    import { $LIST_API_KEY } from '../../constants'

    import type { CListProps, CListSlots } from './types'

    defineOptions({
        name: 'CList',
        inheritAttrs: false,
    })

    const props = defineProps<CListProps<T>>()

    defineSlots<CListSlots<T>>()

    const model = defineModel<T | T[] | null>({ default: null })
    const attrs = useAttrs()

    const focused = shallowRef(false)
    const listEl = shallowRef()

    let handlers: any[] = []
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
            model.value = [...unref(model) as T[], listItem]
        } else {
            model.value = listItem
        }
    }

    function unselect(listItem: T) {
        if (props.readonly) return

        if (props.multiple) {
            const current = unref(model) as T[]
            if (props.mandatory && current?.length <= 1) return
            model.value = current?.filter(item => toRaw(item) !== toRaw(listItem))
        } else {
            if (props.mandatory) return
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

    function register(itemControls: { focus: () => void, blur: () => void }) {
        handlers.push(itemControls)
    }

    function unregister(itemControls: { focus: () => void, blur: () => void }) {
        handlers = handlers.filter(it => it !== itemControls)
    }

    async function focus() {
        focused.value = true
        await nextTick()
        unref(listEl).focus()

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
        }
    })

    defineExpose({ focus })

    provide($LIST_API_KEY, {
        role,
        register,
        unregister,
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
        :role
        :tabindex
        :aria-multiselectable="multiple"
        @keydown="onKeydown"
    >
        <slot
            :select
            :unselect
            :is-active="isActive"
        ></slot>
    </ul>
</template>
