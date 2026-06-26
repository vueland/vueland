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
    import { $LIST_API_KEY } from '@/constants'
    import { isDef } from '@/helpers'

    import type {
        CListProps,
        CListSlots,
        ListItemController,
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

    const {
        aria,
        managed,
        role,
    } = useAriaListbox(props)

    const { onKeydown } = useKeyboard({
        ArrowDown: navigateDown,
        ArrowUp: navigateUp,
        Home: navigateFirst,
        End: navigateLast,
        Enter: activateCurrentItem,
        Space: activateCurrentItem,
    }, { prevent: ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Space'] })

    const TYPEAHEAD_TIMEOUT = 700

    let itemControllers: ListItemController<T>[] = []
    let activeItemIndex = -1
    let selectionAnchorIndex = -1
    let typeaheadQuery = ''
    let lastTypeaheadAt = 0

    const rootBindings = computed(() => ({
        ...attrs,
        ...unref(aria),
    }))

    const rootClasses = computed(() => ({
        'c-list--disabled': props.disabled,
        'c-list--readonly': props.readonly,
    }))

    const isDisabled = computed(() => props.disabled)

    const tabIndex = computed<number | undefined>(() => {
        if (attrs.tabindex != null) return attrs.tabindex as number
        if (unref(isDisabled)) return undefined
        if (unref(managed)) return 0

        return undefined
    })

    function getSelectedItems() {
        return Array.isArray(unref(model)) ? (unref(model) as T[]) : []
    }

    function hasItemValue(value: T | undefined): value is T {
        return isDef(value)
    }

    function resolveItemKey(value: T): unknown {
        const key = props.itemKey

        if (key == null) {
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

    function hasSelectedItem(listItem: T, items = getSelectedItems()) {
        return items.some(item => isSameValue(item, listItem))
    }

    function isDisabledValue(listItem: T) {
        return itemControllers.some(controller => {
            const value = controller.getValue()

            return controller.isDisabled() && hasItemValue(value) && isSameValue(value, listItem)
        })
    }

    function selectItem(listItem: T) {
        if (props.disabled || props.readonly || isDisabledValue(listItem)) {
            return
        }

        if (props.multiple) {
            const current = getSelectedItems()

            if (hasSelectedItem(listItem, current)) {
                return
            }

            model.value = [...current, listItem]
        } else {
            model.value = listItem
        }
    }

    function unselectItem(listItem: T) {
        if (props.disabled || props.readonly || isDisabledValue(listItem) || (!props.multiple && props.mandatory)) {
            return
        }

        if (props.multiple) {
            const current = getSelectedItems()
            if (props.mandatory && current.length <= 1) {
                return
            }
            model.value = current.filter(item => !isSameValue(item, listItem))
        } else {
            model.value = null
        }
    }

    function isItemSelected(listItem: T) {
        if (props.multiple) {
            return getSelectedItems().some(item => isSameValue(item, listItem))
        } else {
            return isDef(model.value) && isSameValue(model.value as T, listItem)
        }
    }

    function registerItem(controller: ListItemController<T>) {
        if (itemControllers.includes(controller)) {
            return
        }

        itemControllers.push(controller)
    }

    function findItemIndex(controller: ListItemController<T>) {
        return itemControllers.indexOf(controller)
    }

    function unregisterItem(controller: ListItemController<T>) {
        const itemIndex = findItemIndex(controller)

        if (itemIndex < 0) {
            return
        }

        itemControllers = itemControllers.filter(item => item !== controller)

        if (activeItemIndex === itemIndex) {
            activeItemIndex = -1
        } else if (itemIndex < activeItemIndex) {
            activeItemIndex -= 1
        }

        if (selectionAnchorIndex === itemIndex) {
            selectionAnchorIndex = -1
        } else if (itemIndex < selectionAnchorIndex) {
            selectionAnchorIndex -= 1
        }
    }

    function setCurrentItem(controller: ListItemController<T>) {
        const itemIndex = findItemIndex(controller)

        if (itemIndex < 0 || controller.isDisabled()) {
            return
        }

        activeItemIndex = itemIndex
    }

    function unsetCurrentItem(controller: ListItemController<T>) {
        const itemIndex = findItemIndex(controller)

        if (activeItemIndex !== itemIndex) {
            return
        }

        activeItemIndex = -1
    }

    function focus() {
        if (!unref(managed) || unref(isDisabled)) {
            return
        }

        unref(rootRef)?.focus()
    }

    function isEnabledItemAt(index: number) {
        return !!itemControllers[index] && !itemControllers[index].isDisabled()
    }

    function findNextEnabledItemIndex(fromIndex: number) {
        for (let i = Math.max(fromIndex, 0); i < itemControllers.length; i += 1) {
            if (isEnabledItemAt(i)) {
                return i
            }
        }

        return -1
    }

    function findPreviousEnabledItemIndex(fromIndex: number) {
        for (let i = Math.min(fromIndex, itemControllers.length - 1); i >= 0; i -= 1) {
            if (isEnabledItemAt(i)) {
                return i
            }
        }

        return -1
    }

    function focusItemAt(index: number) {
        if (!isEnabledItemAt(index)) {
            return
        }

        itemControllers[activeItemIndex]?.blur()
        itemControllers[index]?.focus()
    }

    function isListboxMultiple() {
        return unref(role) === 'listbox' && props.multiple
    }

    function selectItemRange(fromIndex: number, toIndex: number) {
        if (!isListboxMultiple() || props.disabled || props.readonly) {
            return
        }

        const startIndex = Math.min(fromIndex, toIndex)
        const endIndex = Math.max(fromIndex, toIndex)
        const selectedItems = [...getSelectedItems()]

        for (let i = startIndex; i <= endIndex; i += 1) {
            const controller = itemControllers[i]
            const value = controller?.getValue()

            if (!controller || controller.isDisabled() || !hasItemValue(value) || hasSelectedItem(value, selectedItems)) {
                continue
            }

            selectedItems.push(value)
        }

        model.value = selectedItems
    }

    function extendSelectionTo(index: number) {
        if (!isListboxMultiple()) {
            return
        }

        if (selectionAnchorIndex < 0 || !isEnabledItemAt(selectionAnchorIndex)) {
            selectionAnchorIndex = activeItemIndex >= 0 && isEnabledItemAt(activeItemIndex)
                ? activeItemIndex
                : index
        }

        selectItemRange(selectionAnchorIndex, index)
    }

    function navigateToItem(index: number, event?: KeyboardEvent) {
        if (index < 0) {
            return
        }

        const shouldExtendSelection = !!event?.shiftKey && isListboxMultiple()

        if (!shouldExtendSelection) {
            selectionAnchorIndex = index
        }

        focusItemAt(index)

        if (shouldExtendSelection) {
            extendSelectionTo(index)
        }
    }

    function activateCurrentItem() {
        if (!unref(managed) || unref(isDisabled) || activeItemIndex < 0 || !isEnabledItemAt(activeItemIndex)) {
            return
        }

        selectionAnchorIndex = activeItemIndex
        itemControllers[activeItemIndex]?.activate()
    }

    function navigateDown(event?: KeyboardEvent) {
        if (!unref(managed) || unref(isDisabled) || !itemControllers.length) {
            return
        }

        const nextIndex = findNextEnabledItemIndex(activeItemIndex + 1)

        if (nextIndex < 0) {
            return
        }

        navigateToItem(nextIndex, event)
    }

    function navigateUp(event?: KeyboardEvent) {
        if (!unref(managed) || unref(isDisabled) || !itemControllers.length) {
            return
        }

        // With no active item yet (e.g. a menu opened upwards), ArrowUp should
        // enter the list from the bottom — mirroring ArrowDown entering from the top.
        const fromIndex = activeItemIndex < 0
            ? itemControllers.length - 1
            : activeItemIndex - 1

        const previousIndex = findPreviousEnabledItemIndex(fromIndex)

        if (previousIndex < 0) {
            return
        }

        navigateToItem(previousIndex, event)
    }

    function navigateFirst() {
        if (!unref(managed) || unref(isDisabled) || !itemControllers.length) {
            return
        }

        const firstEnabledItemIndex = findNextEnabledItemIndex(0)

        if (firstEnabledItemIndex === activeItemIndex) {
            return
        }

        navigateToItem(firstEnabledItemIndex)
    }

    function navigateLast() {
        if (!unref(managed) || unref(isDisabled) || !itemControllers.length) {
            return
        }

        const lastEnabledItemIndex = findPreviousEnabledItemIndex(itemControllers.length - 1)

        if (lastEnabledItemIndex === activeItemIndex) {
            return
        }

        navigateToItem(lastEnabledItemIndex)
    }

    function selectAllEnabledItems() {
        if (!isListboxMultiple() || props.disabled || props.readonly) {
            return
        }

        const selectedItems = [...getSelectedItems()]

        itemControllers.forEach(controller => {
            const value = controller.getValue()

            if (controller.isDisabled() || !hasItemValue(value) || hasSelectedItem(value, selectedItems)) {
                return
            }

            selectedItems.push(value)
        })

        model.value = selectedItems
    }

    function handleSelectAll(event: KeyboardEvent) {
        if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'a') {
            return false
        }

        if (!isListboxMultiple()) {
            return false
        }

        event.preventDefault()
        selectAllEnabledItems()

        return true
    }

    function normalizeTypeaheadText(value: string) {
        return value.trim().toLocaleLowerCase()
    }

    function findTypeaheadItemIndex(query: string) {
        if (!query) {
            return -1
        }

        const startIndex = activeItemIndex >= 0 ? activeItemIndex + 1 : 0

        for (let offset = 0; offset < itemControllers.length; offset += 1) {
            const itemIndex = (startIndex + offset) % itemControllers.length
            const controller = itemControllers[itemIndex]

            if (controller.isDisabled()) {
                continue
            }

            if (normalizeTypeaheadText(controller.getText()).startsWith(query)) {
                return itemIndex
            }
        }

        return -1
    }

    function handleTypeahead(event: KeyboardEvent) {
        if (
            event.defaultPrevented
            || event.altKey
            || event.ctrlKey
            || event.metaKey
            || event.key.length !== 1
        ) {
            return
        }

        const now = Date.now()
        const key = normalizeTypeaheadText(event.key)

        typeaheadQuery = now - lastTypeaheadAt > TYPEAHEAD_TIMEOUT
            ? key
            : `${typeaheadQuery}${key}`

        lastTypeaheadAt = now

        const query = [...typeaheadQuery].every(char => char === key) ? key : typeaheadQuery
        let itemIndex = findTypeaheadItemIndex(query)

        if (itemIndex < 0 && query !== key) {
            typeaheadQuery = key
            itemIndex = findTypeaheadItemIndex(key)
        }

        if (itemIndex < 0) {
            return
        }

        event.preventDefault()
        navigateToItem(itemIndex)
    }

    function onListKeydown(event: KeyboardEvent) {
        if (!unref(managed) || unref(isDisabled)) {
            return
        }

        if (handleSelectAll(event)) {
            return
        }

        onKeydown(event)
        handleTypeahead(event)
    }

    defineExpose({
        activateCurrentItem,
        focus,
        navigateFirst,
        navigateDown,
        navigateLast,
        navigateUp,
    })

    provide($LIST_API_KEY, {
        role,
        managed,
        disabled: isDisabled,
        registerItem,
        unregisterItem,
        setCurrentItem,
        unsetCurrentItem,
        select: selectItem,
        unselect: unselectItem,
        isActive: isItemSelected,
    })
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
        <slot
            :select="selectItem"
            :unselect="unselectItem"
            :is-active="isItemSelected"
        ></slot>
    </ul>
</template>
