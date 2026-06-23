<script setup lang="ts">
    import { provide } from 'vue'

    import { useApplicationScroll } from '@/composables/use-application-scroll'
    import { $APP_API_KEY } from '@/constants'

    import type { CAppSlots } from './types'

    defineOptions({ name: 'CApp' })

    defineSlots<CAppSlots>()

    const {
        appRef,
        classes,
        getScrollTop,
        getScrollLeft,
        lockScroll,
        unlockScroll
    } = useApplicationScroll()

    provide($APP_API_KEY, {
        getScrollTop,
        getScrollLeft,
        lockScroll,
        unlockScroll,
    })
</script>

<template>
    <div
        ref="appRef"
        role="application"
        class="c-app"
        :class="classes"
    >
        <div class="c-app__wrapper">
            <slot></slot>
        </div>
    </div>
</template>
