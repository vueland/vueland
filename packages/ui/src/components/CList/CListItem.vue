<script setup lang="ts" generic="T = any">
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        shallowRef,
        unref
    } from 'vue'

    import { isAriaListRole, useAriaListboxItem } from '@/composables/use-aria-listbox'
    import { useList } from '@/composables/use-list'
    import { isDef } from '@/helpers'

    defineOptions({name: 'CListItem' })

    const props = defineProps<{
        value?: T
    }>()

    const index = shallowRef(-1)

    const focused = shallowRef(false)

    const itemRef = shallowRef()

    const list = useList<T>()

    const attrs = useAriaListboxItem(() => ({
        role: unref(list?.role),
        id: unref(itemId),
        selected: unref(isSelected),
    }))

    const handlers = { focus, blur }

    const isInActiveList = computed(() => isAriaListRole(unref(list?.role)))

    const itemId = computed(() => unref(isInActiveList) && index.value >= 0
        ? list?.getItemId(index.value)
        : undefined
    )

    const isSelected = computed(() => isDef(props.value)
        ? list?.isActive?.(props.value!)
        : false
    )

    const classes = computed(() => ({
        'c-list-item--active': unref(isSelected),
        'c-list-item--focused': unref(focused),
    }))

    function toggle() {
        const handler = unref(isSelected) ? list.unselect : list.select
        handler?.(props.value!)
    }

    function focus() {
        list?.setActiveItem?.(index.value)
        focused.value = true
        itemRef.value.focus()
    }

    function blur() {
        list?.setActiveItem?.(undefined)
        focused.value = false
        itemRef.value.blur()
    }

    onMounted(() => {
        if (unref(isInActiveList)) {
            index.value = list.register(handlers)
        }
    })

    onBeforeUnmount(() => {
        if (unref(isInActiveList)) {
            list.unregister(handlers)
        }
    })
</script>

<template>
    <li
        ref="itemRef"
        class="c-list-item"
        :class="classes"
        v-bind="attrs"
        @click="toggle"
    >
        <slot>{{ value }}</slot>
    </li>
</template>
