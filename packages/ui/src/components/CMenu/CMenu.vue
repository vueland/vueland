<script setup lang="ts">
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        provide,
        shallowRef,
        unref,
        useAttrs,
        watch
    } from 'vue'

    import { COverlay } from '@/components/COverlay'
    import { useActivator } from '@/composables/use-activator'
    import { useAutoPosition } from '@/composables/use-auto-position'
    import { useDelayedActions } from '@/composables/use-delay-actions'
    import { useId } from '@/composables/use-id'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { $MENU_API_KEY } from '@/constants'
    import { vClickOutside } from '@/directives'
    import { isDef } from '@/helpers'
    import {
        convertToUnit,
        IN_BROWSER,
        throttle
    } from '@/utils'

    import type { CMenuEvents, CMenuProps } from './types'

    defineOptions({
        name: 'CMenu',
        inheritAttrs: false
    })

    const props = defineProps<CMenuProps>()

    const emit = defineEmits<CMenuEvents>()

    const model = defineModel<boolean>({ default: false })

    const mounted = shallowRef(props.ssr || props.modelValue)

    const attrs = useAttrs()

    const {
        element,
        activatorProps,
        isParentActivator,
        genListeners,
        bindListeners,
        unbindListeners,
    } = useActivator(props)

    const {
        activator,
        content,
        contentRef,
        update,
    } = useAutoPosition(props, element)

    const { openDelay, closeDelay } = useDelayedActions(props)

    const _generatedId = useId(undefined, { prefix: 'c-menu' })

    const { onKeydown } = useKeyboard({
        Escape: () => close(),
    })

    const { transition = 'fade' } = props

    const THROTTLE_DELAY = 50

    const listeners = genListeners({
        open,
        close,
        toggle
    })

    const handler = throttle(() => {
        update()
    }, THROTTLE_DELAY)

    const menuId = computed(() => attrs.id as string ?? _generatedId)
    const detached = computed(() => isDef(props.positionX) || isDef(props.positionY))

    const sizesStyles = computed(() => ({
        ...(props.width || unref(activator).width ? { width: convertToUnit(props.width ?? unref(activator).width) } : {}),
        ...(props.height ? { height: convertToUnit(props.height ?? unref(activator).height) } : {}),
        ...((props.maxWidth || props.width) ? { maxWidth: convertToUnit(props.maxWidth || props.width!) } : {}),
        ...(props.minWidth ? { minWidth: convertToUnit(props.minWidth) } : {}),
        ...(props.minHeight ? { minHeight: convertToUnit(props.minHeight) } : {}),
        ...(props.maxHeight ? { maxHeight: convertToUnit(props.maxHeight) } : {}),
    }))

    const styles = computed(() => ({
        top: convertToUnit(unref(content).top),
        left: convertToUnit(unref(content).left),
        ...unref(sizesStyles)
    }))

    const classes = computed(() => ({ 'c-menu--visible': unref(model) }))

    function open() {
        mounted.value = true

        openDelay(() => {
            if (!unref(detached)) {
                model.value = true
            }

            update()

            emit('open')
        })
    }

    function close() {
        closeDelay(() => {
            emit('close')

            mounted.value = props.ssr ?? false
            model.value = false
        })
    }

    function toggle() { return unref(model) ? close() : open() }

    const onClickOutside = (e: Event) => {
        const { closeOnClickOutside } = props
        const { target } = e
        const activator = unref(element) as Element

        if (closeOnClickOutside && (!activator || !activator.contains(target as Node))) {
            close()
            emit('outside-click')
        }
    }

    const onContentClick = () => {
        if (props.closeOnContentClick) {
            close()
            emit('click')
        }
    }

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handler)
        window.removeEventListener('scroll', handler)
        window.removeEventListener('keydown', onKeydown)
    })

    defineExpose({
        open,
        close,
        toggle
    })

    provide($MENU_API_KEY, {
        open,
        close,
        toggle
    })

    if (IN_BROWSER) {
        watch(model, (value) => {
            if (isDef(props.modelValue)) {
                value && open()
                !value && close()
            }

            if (value) {
                window.addEventListener('resize', handler, { passive: true })
                window.addEventListener('scroll', handler, { passive: true })
                window.addEventListener('keydown', onKeydown)
            } else {
                window.removeEventListener('resize', handler)
                window.removeEventListener('scroll', handler)
                window.removeEventListener('keydown', onKeydown)
            }
        }, { immediate: true })

        onMounted(() => {
            if (isParentActivator) {
                bindListeners(listeners)
            }

            if (!isDef(props.modelValue) && unref(model)) {
                open()
            }
        })

        onBeforeUnmount(() => {
            if (isParentActivator) {
                unbindListeners(listeners)
            }
        })
    }
</script>

<template>
    <slot
        v-if="!isParentActivator"
        name="activator"
        :on="listeners"
        :activator="activatorProps"
    />
    <c-overlay
        v-slot="{zIndex}"
        v-model="model"
    >
        <transition :name="transition">
            <div
                v-if="mounted"
                v-show="model"
                v-bind="$attrs"
                :id="menuId"
                ref="contentRef"
                v-click-outside="onClickOutside"
                class="c-menu"
                :class="classes"
                :style="{...styles, zIndex}"
                tabindex="-1"
                @click="onContentClick"
            >
                <div class="c-menu__content">
                    <slot />
                </div>
            </div>
        </transition>
    </c-overlay>
</template>
