<script setup lang="ts">
    import { provide, useAttrs } from 'vue'

    import { $KEYBOARD_API_KEY } from '@/constants'

    import type {
        CKeyboardProviderSlots,
        KeyboardAPI,
        KeyboardTarget,
    } from './types'

    defineOptions({
        name: 'CKeyboardProvider',
        inheritAttrs: false,
    })

    defineSlots<CKeyboardProviderSlots>()
    const attrs = useAttrs() as any

    let target: KeyboardTarget | null = null

    function register(next: KeyboardTarget) {
        if (target) {
            unregister(target)
        }

        target = next
    }

    function unregister(item: KeyboardTarget) {
        if (target !== item) {
            return
        }

        target = null
    }

    const api: KeyboardAPI = {
        register,
        unregister,
        forward: (e) => {
            target?.onKeydown(e)
            attrs.onKeydown?.(e)
        },
        blur: () => target?.blur(),
    }

    provide($KEYBOARD_API_KEY, api)

    defineExpose(api)
</script>

<template>
    <slot v-bind="api" />
</template>
