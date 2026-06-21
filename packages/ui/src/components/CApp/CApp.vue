<script setup lang="ts">
    import { provide } from 'vue'

    import { useApplicationScroll } from '../../composables'
    import { $APP_API_KEY } from '../../constants'

    import type { CAppSlots } from './types'

    defineOptions({ name: 'CApp' })

    defineSlots<CAppSlots>()

    const {
        appRef,
        classes,
        getScrollTop,
        getScrollLeft,
        blockScroll,
        unblockScroll
    } = useApplicationScroll()

    provide($APP_API_KEY, {
        getScrollTop,
        getScrollLeft,
        blockScroll,
        unblockScroll,
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
