<script setup lang="ts">
    import { shallowRef, unref } from 'vue'

    import { useCore } from '@/composables'

    import FormDemo from './FormDemo.vue'

    const core = useCore()
    const isDarkMode = shallowRef(false)

    const onClick = () => {
        isDarkMode.value = !isDarkMode.value
        core.applyTheme(unref(isDarkMode) ? 'dark' : 'light')
    }
</script>

<template>
    <c-app>
        <c-main>
            <c-toolbar class="bg-graphite elevation-2">
                <c-toolbar-logo>
                    <c-btn
                        color="tertiary"
                        @click="onClick"
                    >
                        MODE
                    </c-btn>
                </c-toolbar-logo>
            </c-toolbar>
            <form-demo />
        </c-main>
    </c-app>
</template>
