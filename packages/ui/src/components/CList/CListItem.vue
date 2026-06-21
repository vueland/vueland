<script setup lang="ts" generic="T = any">
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        shallowRef,
        unref
    } from 'vue'

    import { useList } from '../../composables/use-list'
    import { isDef } from '../../helpers'

    defineOptions({name: 'CListItem',})

    const props = defineProps<{
        value?: T
    }>()

    const list = useList<T>()

    const myIndex = shallowRef(-1)
    const focused = shallowRef(false)

    const isInActiveList = computed(() => unref(list?.role) === 'listbox' || unref(list?.role) === 'menu')

    const myId = computed(() => isInActiveList.value && list?.listId && myIndex.value >= 0
        ? `${list.listId}-option-${myIndex.value}`
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

    const attrs = computed(() => ({
        ...(unref(myId) ? { id: unref(myId) } : {}),
        ...(isInActiveList.value ? { role: 'option' } : {}),
        'aria-selected': unref(isSelected),
    }))

    function onClick() {
        const handler = unref(isSelected) ? list.unselect : list.select
        handler?.(props.value!)
    }

    function focus() {
        list?.setDescendant?.(unref(myId))
        focused.value = true
    }

    function blur() {
        list?.setDescendant?.(undefined)
        focused.value = false
    }

    const handlers = { focus, blur }

    onMounted(() => {
        if (unref(isInActiveList)) {
            myIndex.value = list.register(handlers)
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
        class="c-list-item"
        :class="classes"
        v-bind="attrs"
        @click="onClick"
    >
        <slot>{{ value }}</slot>
    </li>
</template>
