<script setup lang="ts" generic="T">
    import {
        computed,
        provide,
        shallowRef,
        toRaw,
        unref,
        useAttrs,
    } from 'vue'

    import { useAriaListbox } from '@/composables/use-aria-listbox'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { useListPresets } from '@/composables/use-list-presets'
    import { useTypeahead } from '@/composables/use-typeahead'
    import { $LIST_API_KEY } from '@/constants'
    import { isDef } from '@/helpers'

    import type {
        CListProps,
        CListSlots,
        ListAPI,
        ListItem,
    } from './types'

    defineOptions({
        name: 'CList',
        inheritAttrs: false,
    })

    const props = defineProps<CListProps<T>>()

    defineSlots<CListSlots<T>>()

    const model = defineModel<T | T[] | null>({ default: null })

    const rootRef = shallowRef<HTMLElement>()

    const attrs = useAttrs()
    const aria = useAriaListbox(props)

    const { onKeydown } = useKeyboard({
        ArrowDown: navigateDown,
        ArrowUp: navigateUp,
        Home: navigateFirst,
        End: navigateLast,
        Enter: activateItem,
        Space: activateItem,
    }, { prevent: ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Space'] })

    let listItems: ListItem[] = []
    let activeItem: ListItem | null = null
    let index = -1

    const rootBindings = computed(() => ({
        ...attrs,
        ...unref(aria),
    }))

    // Свой проп `preset` (CListPreset) или вложенный пресет листа из контекста
    // комбобокса; зону `option` пункты берут через list API.
    const presetZones = useListPresets({ props })

    const rootClasses = computed(() => [
        {
            'c-list--disabled': props.disabled,
            'c-list--readonly': props.readonly,
            'c-list--default': !props.variant,
        },
        ...unref(presetZones).root,
    ])

    const isSelectable = computed(() => props.variant && !props.disabled && !props.readonly)

    const tabIndex = computed<number | undefined>(() => {
        if (isDef(attrs.tabindex)) {
            return attrs.tabindex as number
        }

        if (props.disabled) {
            return undefined
        }

        if (props.variant) {
            return 0
        }

        return undefined
    })

    function resolveItemKey(value: T): unknown {
        const key = props.itemKey

        if (!isDef(key)) {
            return toRaw(value)
        }

        if (typeof key === 'function') {
            return key(value)
        }

        return isDef(value) && typeof value === 'object'
            ? (value as Record<string, unknown>)[key as string]
            : value
    }

    function isSameValue(a: T, b: T) {
        return resolveItemKey(a) === resolveItemKey(b)
    }

    function isSelected(value: T) {
        return (unref(model) as T[])?.some(item => isSameValue(item, value))
    }

    function selectItem(value: T) {
        if (!unref(isSelectable)) {
            return
        }

        if (!props.multiple) {
            model.value = value
            return
        }

        if (isSelected(value)) {
            return
        }

        model.value = [...unref(model) as T[], value]
    }

    function unselectItem(listItem: T) {
        if (
            !unref(isSelectable)
            || !props.multiple
            && props.mandatory
        ) {
            return
        }

        if (!props.multiple) {
            model.value = null
            return
        }

        const items = model.value as T[]

        if (props.mandatory && items.length <= 1) {
            return
        }

        model.value = items.filter(item => !isSameValue(item, listItem))
    }

    function isItemSelected(listItem: T) {
        if (props.multiple) {
            return isSelected(listItem)
        }

        const value = model.value as T

        return isDef(value) && isSameValue(value, listItem)
    }

    function toggleItem(value: T) {
        if (isItemSelected(value)) {
            unselectItem(value)
        } else {
            selectItem(value)
        }
    }

    // --- Реестр элементов ------------------------------------------------------

    function registerItem(item: ListItem) {
        listItems.push(item)

        // Порядок берём из DOM: хронология монтирования при keyed-диффе
        // ему не обязана соответствовать (выживший при фильтрации пункт
        // регистрировался раньше домонтированных вокруг него).
        listItems.sort((a, b) => (
            a.getElement()!.compareDocumentPosition(b.getElement()!) & Node.DOCUMENT_POSITION_FOLLOWING
                ? -1
                : 1
        ))

        if (activeItem) {
            index = listItems.indexOf(activeItem)
        }
    }

    function unregisterItem(listItem: ListItem) {
        listItems = listItems.filter(item => item !== listItem)

        if (activeItem === listItem) {
            blur()
        }

        if (activeItem) {
            index = listItems.indexOf(activeItem)
        }
    }

    function blur() {
        activeItem?.blur()
        activeItem = null
        index = -1
    }

    function focus() {
        if (!unref(isSelectable)) {
            return
        }

        unref(rootRef)?.focus()
    }

    function focusItem() {
        activeItem?.blur()
        activeItem = listItems[index]
        activeItem?.focus()
    }

    function activateItem() {
        activeItem?.click()
    }

    function navigateDown() {
        if (!unref(isSelectable)) {
            return
        }

        let next = index + 1

        while (listItems[next]?.isDisabled()) {
            next += 1
        }

        if (!listItems[next]) {
            return
        }

        index = next
        focusItem()
    }

    function navigateUp() {
        if (!unref(isSelectable)) {
            return
        }

        let next = index < 0 ? listItems.length - 1 : index - 1

        while (listItems[next]?.isDisabled()) {
            next -= 1
        }

        if (!listItems[next]) {
            return
        }

        index = next
        focusItem()
    }

    function navigateFirst() {
        if (!unref(isSelectable)) {
            return
        }

        index = -1
        navigateDown()
    }

    function navigateLast() {
        if (!unref(isSelectable)) {
            return
        }

        index = listItems.length
        navigateUp()
    }

    const typeahead = useTypeahead({
        items: () => listItems,
        activeIndex: () => index,
        onMatch: (current: number) => {
            index = current
            focusItem()
        },
    })

    function onListKeydown(event: KeyboardEvent) {
        if (!unref(isSelectable)) {
            return
        }

        onKeydown(event)
        typeahead.onKeydown(event)
    }

    defineExpose({
        focus,
        activateItem,
        blur,
        navigateFirst,
        navigateDown,
        navigateLast,
        navigateUp,
        onKeydown: onListKeydown
    })

    const listApi: ListAPI<T> = {
        role: props.variant,
        registerItem,
        unregisterItem,
        blur,
        select: selectItem,
        unselect: unselectItem,
        toggle: toggleItem,
        isSelected: isItemSelected,
        getPreset: () => unref(presetZones),
    }

    provide($LIST_API_KEY, listApi)
</script>

<template>
    <ul
        ref="rootRef"
        class="c-list"
        :class="rootClasses"
        :tabindex="tabIndex"
        v-bind="rootBindings"
        @keydown="onListKeydown"
    >
        <slot v-bind="listApi"></slot>
    </ul>
</template>
