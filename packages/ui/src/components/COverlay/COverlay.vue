<script setup lang="ts">
    import {
        computed,
        onBeforeUnmount,
        shallowRef,
        unref,
        watchEffect
    } from 'vue'

    import { useOverlayStack } from '@/composables/use-overlay-stack'

    import type { COverlayProps, COverlaySlots } from './types'

    defineOptions({
        name: 'COverlay',
        inheritAttrs: false,
    })

    const props = defineProps<COverlayProps>()

    defineSlots<COverlaySlots>()

    const model = defineModel<boolean>({ default: false })

    const zIndex = shallowRef()

    const { register, unregister } = useOverlayStack()

    const target = computed(() => props.to ?? 'body')

    watchEffect(() => {
        if (unref(model)) {
            zIndex.value = register()
        } else {
            unregister()
            zIndex.value = undefined
        }
    })

    onBeforeUnmount(() => {
        if (unref(model)) {
            unregister()
        }
    })

</script>

<template>
    <teleport :to="target">
        <slot :z-index></slot>
    </teleport>
</template>
