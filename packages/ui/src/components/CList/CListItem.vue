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

    import type { ListItem } from './types'

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

    const list = useList<T>()

    const itemId = useId(undefined, { prefix: 'c-list-item' })

    const rootRef = shallowRef<HTMLElement>()
    const focused = shallowRef(false)

    const isInteractive = computed(() => !!list?.role && !props.disabled)

    const isSelected = computed(() => {
        if (!list?.role || !isDef(props.value)) {
            return false
        }

        return list?.isActive(props.value as T) ?? false
    })

    const tabIndex = computed(() => (unref(isInteractive) ? -1 : undefined))

    const ariaAttrs = useAriaListboxItem(() => ({
        role: list?.role,
        id: itemId,
        selected: unref(isSelected),
        disabled: props.disabled,
    }))

    const itemClasses = computed(() => ({
        'c-list-item--disabled': props.disabled,
        'c-list-item--selected': unref(isSelected),
        'c-list-item--focused': unref(focused),
    }))

    const itemListeners = computed(() => {
        if (!unref(isInteractive)) {
            return {}
        }

        return {
            blur: onNativeBlur,
            ...(list?.role
                ? { click: toggleSelection }
                : {}
            ),
        }
    })

    const controller: ListItem = {
        focus: focusItem,
        blur: blurItem,
        click: () => unref(rootRef)?.click(),
        getText: () => unref(rootRef)?.textContent?.trim() ?? '',
        isDisabled: () => props.disabled,
    }

    function toggleSelection() {
        if (props.disabled) return

        list!.toggle(props.value as T)
    }

    function focusItem() {
        focused.value = true
        emit('active', itemId)
        unref(rootRef)?.focus()
    }

    function blurItem() {
        emit('inactive', itemId)
        focused.value = false
        unref(rootRef)?.blur()
    }

    function onNativeBlur() {
        if (!unref(focused)) {
            return
        }

        focused.value = false
        emit('inactive', itemId)
    }

    onMounted(() => {
        if (list?.role) {
            list!.registerItem(controller)
        }
    })

    onBeforeUnmount(() => {
        if (list?.role) {
            list!.unregisterItem(controller)
        }
    })
</script>

<template>
    <li
        ref="rootRef"
        class="c-list-item"
        :class="itemClasses"
        :tabindex="tabIndex"
        v-bind="ariaAttrs"
        v-on="itemListeners"
    >
        <slot>{{ value }}</slot>
    </li>
</template>
