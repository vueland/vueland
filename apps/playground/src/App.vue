<script setup lang="ts">
    import { useCore } from '@vueland/ui/composables'
    import { shallowRef, unref } from 'vue'

    import FormDemo from './FormDemo.vue'
    import PresetsDemo from './PresetsDemo.vue'

    const core = useCore()
    const isDarkMode = shallowRef(false)

    const onClick = () => {
        isDarkMode.value = !isDarkMode.value
        core?.applyTheme(unref(isDarkMode) ? 'dark' : 'light')
    }
</script>

<template>
    <c-app>
        <c-main>
            <c-toolbar class="bg-graphite elevation-2">
                <c-toolbar-logo>
                    <c-btn
                        color="green-accent-3"
                        @click="onClick"
                    >
                        MODE
                    </c-btn>
                </c-toolbar-logo>
            </c-toolbar>
            <form-demo />
            <presets-demo />
        </c-main>
    </c-app>
</template>
