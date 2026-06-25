<script setup lang="ts" generic="T = any">
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        shallowRef,
        unref,
    } from 'vue'

    import { useAriaListboxItem } from '@/composables/use-aria-listbox'
    import { useId } from '@/composables/use-id'
    import { useList } from '@/composables/use-list'
    import { isDef } from '@/helpers'

    import type { ListItemController } from './types'

    defineOptions({
        name: 'CListItem',
    })

    const props = defineProps<{
        disabled?: boolean
        value?: T
    }>()

    const emit = defineEmits<{
        active: [id: string]
        inactive: [id: string]
    }>()

    const isFocused = shallowRef(false)
    const rootRef = shallowRef<HTMLElement>()

    const list = useList<T>()

    const itemId = useId(undefined, { prefix: 'c-list-item' })

    const listState = computed(() => {
        const managed = unref(list?.managed)
        const listDisabled = unref(list?.disabled)
        const role = unref(list?.role)
        const interactive = managed && !listDisabled && !props.disabled

        return {
            managed,
            listDisabled,
            role,
            interactive,
            listbox: role === 'listbox',
            menu: role === 'menu',
            tabIndex: interactive ? -1 : undefined,
        }
    })

    const ariaAttrs = useAriaListboxItem(() => ({
        role: unref(listState).managed ? unref(listState).role : undefined,
        id: itemId,
        selected: unref(isSelected),
        disabled: props.disabled,
    }))

    const itemController: ListItemController<T> = {
        id: itemId,
        focus: focusItem,
        blur: blurItem,
        activate: activateCurrentItem,
        getText,
        getValue,
        isDisabled,
    }

    const itemListeners = computed(() => {
        const state = unref(listState)

        if (!state.interactive) {
            return {}
        }

        return {
            blur: onBlur,
            ...(state.listbox ? { click: toggleSelection } : {}),
        }
    })

    const isSelected = computed(() => {
        if (!unref(listState).managed || !isDef(props.value)) {
            return false
        }

        return list?.isActive(props.value as T) ?? false
    })

    const itemClasses = computed(() => ({
        'c-list-item--disabled': props.disabled,
        'c-list-item--selected': unref(isSelected),
        'c-list-item--focused': unref(isFocused) && unref(listState).interactive,
    }))

    function toggleSelection() {
        const state = unref(listState)

        if (!state.interactive || !state.listbox || !list || !isDef(props.value)) {
            return
        }

        const itemValue = props.value as T

        if (unref(isSelected)) {
            list.unselect(itemValue)
        } else {
            list.select(itemValue)
        }
    }

    function activateCurrentItem() {
        const state = unref(listState)

        if (!state.interactive) {
            return
        }

        if (state.listbox) {
            toggleSelection()
            return
        }

        if (state.menu) {
            unref(rootRef)?.click()
        }
    }

    function focusItem() {
        if (!unref(listState).interactive) {
            return
        }

        activateItem()
        isFocused.value = true
        unref(rootRef)?.focus()
    }

    function blurItem() {
        deactivateItem()
        isFocused.value = false
        unref(rootRef)?.blur()
    }

    // Нативный blur: фокус ушёл с элемента не через навигацию (клик мимо, Tab,
    // закрытие меню) — сбрасываем подсветку. Программная навигация уже обнулила
    // isFocused через blurItem, поэтому guard исключает двойную обработку.
    function onBlur() {
        if (!unref(isFocused)) {
            return
        }

        isFocused.value = false
        deactivateItem()
    }

    function activateItem() {
        if (!unref(listState).interactive) {
            return
        }

        list!.setCurrentItem(itemController)
        emit('active', itemId)
    }

    function deactivateItem() {
        if (!unref(listState).interactive) {
            return
        }

        list!.unsetCurrentItem(itemController)
        emit('inactive', itemId)
    }

    function getText() {
        return unref(rootRef)?.textContent?.trim() ?? ''
    }

    function getValue() {
        return props.value
    }

    function isDisabled() {
        return props.disabled
    }

    onMounted(() => {
        if (unref(listState).managed) {
            list!.registerItem(itemController)
        }
    })

    onBeforeUnmount(() => {
        if (unref(listState).managed) {
            list!.unregisterItem(itemController)
        }
    })
</script>

<template>
    <li
        ref="rootRef"
        class="c-list-item"
        :class="itemClasses"
        :tabindex="listState.tabIndex"
        v-bind="ariaAttrs"
        v-on="itemListeners"
    >
        <slot>{{ value }}</slot>
    </li>
</template>
