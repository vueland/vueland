<script setup lang="ts">
    import { computed, onBeforeUnmount, shallowRef, unref,watchEffect } from 'vue'

    import { useOverlayStack } from '../../composables'

    import type { COverlayProps, COverlaySlots } from './tyoes'

    defineOptions({
        name: 'COverlay',
        inheritAttrs: false,
    })

    const props = defineProps<COverlayProps>()
    defineSlots<COverlaySlots>()

    const model = defineModel<boolean>({ default: false })

    const { register, unregister } = useOverlayStack()

    const zIndex = shallowRef()

    const target = computed(() => props.to ?? 'body')

    watchEffect(() => {
        if (unref(model)) {
            zIndex.value = register()
        } else {
            unregister()
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
        <slot :z-index />
    </teleport>
</template>
