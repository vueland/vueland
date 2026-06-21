<script setup lang="ts">
    import { watch } from 'vue'

    import { COverlay } from '@/components/COverlay'
    import { useApplication } from '@/composables'
    import { vClickOutside } from '@/directives'

    import type { CDialogProps, CDialogSlots } from './types'

    defineOptions({name: 'CDialog',})

    const props = defineProps<CDialogProps>()

    defineSlots<CDialogSlots>()

    const model = defineModel<boolean>({ default: false })

    const { blockScroll, unblockScroll } = useApplication()

    const onOutsideClick = (): void => {
        if (props.closeOnClickOutside) {
            model.value = false
        }
    }

    watch(model, (value) => {
        if (value) blockScroll()
        else unblockScroll()
    })

</script>

<template>
    <c-overlay
        v-slot="{zIndex}"
        v-model="model"
    >
        <transition name="fade">
            <c-scrim
                v-if="model"
                blur
                :style="{zIndex}"
            />
        </transition>
        <transition name="scale-in">
            <div
                v-if="model"
                class="c-dialog"
                :style="{zIndex}"
            >
                <div
                    v-click-outside="onOutsideClick"
                    class="c-dialog__content"
                >
                    <slot></slot>
                </div>
            </div>
        </transition>
    </c-overlay>
</template>
