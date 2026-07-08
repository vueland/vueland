<script setup lang="ts">
    import { provide } from 'vue'

    import { type KeyboardHandlers, useKeyboard } from '@/composables/use-keyboard'
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

    const props = defineProps<{
        handlers?: KeyboardHandlers
    }>()

    defineSlots<CKeyboardProviderSlots>()

    const { onKeydown } = useKeyboard(props.handlers ?? {})

    let target: KeyboardTarget | null = null

    // Регистрируется тот список, который фактически отрендерен — дефолтный
    // или кастомный из слота. Обработчики владельца вешаются на его элемент,
    // чтобы Enter/Space вели себя одинаково в обоих случаях.
    function register(next: KeyboardTarget) {
        if (target) {
            unregister(target)
        }

        target = next

        if (props.handlers) {
            next.getElement()?.addEventListener('keydown', onKeydown)
        }
    }

    function unregister(item: KeyboardTarget) {
        if (target !== item) {
            return
        }

        if (props.handlers) {
            item.getElement()?.removeEventListener('keydown', onKeydown)
        }

        target = null
    }

    const api: KeyboardAPI = {
        register,
        unregister,
        forward: (e) => target?.onKeydown(e),
        blur: () => target?.blur(),
    }

    provide($KEYBOARD_API_KEY, api)

    defineExpose(api)
</script>

<template>
    <slot v-bind="api" />
</template>
