<script setup lang="ts">
    import { computed, shallowRef, unref, watch } from 'vue'
    import FormCard from './components/FormCard/FormCard.vue'
    import ContentCard from './components/ContentCard/ContentCard.vue'
    import { useDialogsStack, useEffect } from '@vueland/ui/composables'

    const isLightMode = shallowRef(true)

    const bgColor = computed(() => unref(isLightMode) ? '#ffffff' : '#343434')
    const textColor = computed(() => unref(isLightMode) ? '#343434' : '#ffffff')

    const toggleMode = () => {
        isLightMode.value = !isLightMode.value
    }

    const { openDialog, closeDialog } = useDialogsStack()
    let isOpen = false

    const toggle = () => {
        if (isOpen) {
            isOpen = false
            return closeDialog()
        }
        isOpen = true
        openDialog({
            component: () => import('./components/DialogTest/DialogTest.vue'),
            props: {}
        })
    }

    const show = shallowRef(false)

    const effect = useEffect<boolean>(() => show.value)

    effect.run()

    watch(effect, (val) => {
        console.log('from watch', val)
        if (val) {
            // effect.stop()
        }
    })

    const showMenu = shallowRef(false)
    const xPos = shallowRef(0)
    const yPos = shallowRef(0)

    const onContextMenu = (e: MouseEvent) => {
        showMenu.value = true

        xPos.value = e.clientX
        yPos.value = e.clientY
    }

</script>
<template>
    <c-app :style="{'--c-app-surface-color': bgColor, '--c-app-text-color': textColor}">
        <c-menu
            close-on-click-outside
            :position-x="xPos"
            :position-y="yPos"
            v-model="showMenu"
            class="elevation-2"
            ssr
        >
            <div class="bg-white pa-4">
                <h1>Красивое меню</h1>
            </div>
        </c-menu>
        <c-dialog
            v-model="show"
            close-on-click-outside
        >
            <c-card class="elevation-5">
                <c-card-header>
                    <h2>MY MODAL</h2>
                </c-card-header>
            </c-card>
        </c-dialog>
        <c-toolbar
            fixed
            class="elevation-2"
            @click="toggleMode"
            @contextmenu.prevent="onContextMenu"
        >
            <c-toolbar-logo class="text-blue-darken-3">
                <h2 @click="show = !show">
                    Vueland UI {{ effect }}
                </h2>
                <c-icon name="user" source="fa" />
                <c-chip value="text"/>
            </c-toolbar-logo>
        </c-toolbar>
        <c-main class="pl-5 pr-5 pb-5 pt-[80px] min-h-100 color-[#fa5a5a]">
            <c-row>
                <c-col
                    xxl="3"
                    xl="3"
                    lg="3"
                    md="6"
                    class="d-flex pb-1"
                >
                    <content-card />
                </c-col>
                <c-col
                    xl="3"
                    lg="3"
                    md="6"
                    class="d-flex pb-1"
                >
                    <content-card class="translate-[10px, 20px] md:translate-[10px, 20px]" />
                </c-col>
                <c-col
                    xl="3"
                    lg="3"
                    md="6"
                    class="d-flex pb-1 z-[10]"
                >
                    <content-card />
                </c-col>
                <c-col
                    xl="3"
                    lg="3"
                    md="6"
                    class="d-flex pb-1"
                >
                    <form-card />
                </c-col>
            </c-row>
            <c-row>
                <c-col
                    xl="3"
                    lg="6"
                    md="6"
                    sm="12"
                    class="hover:op-6"
                    @click="toggle"
                >
                    <content-card />
                </c-col>
            </c-row>
        </c-main>
        <c-dialogs-stack />
    </c-app>
</template>
<style lang="scss" scoped>
</style>
