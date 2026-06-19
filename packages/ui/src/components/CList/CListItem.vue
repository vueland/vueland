<script setup lang="ts" generic="T = any">
    import { computed, onBeforeUnmount, onMounted, shallowRef, unref } from 'vue'

    import { useList } from '../../composables/use-list'
    import { isDef } from '../../helpers'

    defineOptions({
        name: 'CListItem',
    })

    const props = defineProps<{
        value?: T
    }>()

    const list = useList<T>()

    const tabindex = shallowRef(-1)

    const isInActiveList = computed(() => unref(list?.role) === 'listbox' || unref(list?.role) === 'menu')

    const isSelected = computed(() => isDef(props.value)
        ? list?.isActive?.(props.value!)
        : false
    )

    const classes = computed(() => ({
        'c-list-item--active': unref(isSelected),
        'c-list-item--focused': unref(tabindex) > -1,
    }))

    const attrs = computed(() => ({
        ...(unref(tabindex) > -1 ? { tabindex: 0 } : {}),
        ...(isInActiveList.value ? { role: 'option' } : {}),
        'aria-selected': unref(isSelected),
    }))

    function onClick() {
        const handler = unref(isSelected) ? list.unselect : list.select
        handler?.(props.value!)
    }

    function focus() {
        tabindex.value = 0
    }

    function blur() {
        tabindex.value = -1
    }

    const handlers = { focus, blur }

    onMounted(() => {
        if (unref(isInActiveList)) {
            list.register(handlers)
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
