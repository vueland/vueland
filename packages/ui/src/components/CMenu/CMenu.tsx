import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    provide,
    type ShallowRef,
    shallowRef,
    Transition,
    unref,
    useModel,
    type VNodeChild,
    vShow,
    watch,
    withDirectives,
} from 'vue'

import {
    type ActivatorListeners,
    type ActivatorProps,
    type AutoPositionProps,
    type DelayProps,
    makeActivatorProps,
    makeAutoPositionProps,
    makeDelayProps,
    makePresetProps,
    type PresetProps,
    useActivator,
    useAutoPosition,
    useDelayedActions,
    useKeyboard,
    useMenuPresets,
} from '../../composables'
import { $MENU_API_KEY } from '../../constants'
import { vClickOutside } from '../../directives'
import { isDef } from '../../helpers'
import type { DimensionsProps } from '../../types'
import {
    convertToUnit,
    emitsFactory,
    IN_BROWSER,
    propsFactory,
    throttle,
} from '../../utils'
import { COverlay } from '../COverlay'

export type CMenuProps = ActivatorProps &
    DimensionsProps &
    AutoPositionProps &
    DelayProps &
    PresetProps & {
        id?: string | number
        closeOnClickOutside?: boolean
        closeOnContentClick?: boolean
        ssr?: boolean
        transition?: string
        modelValue?: boolean
        to?: string
        onClose?: () => void
        onOpen?: () => void
        'onUpdate:modelValue'?: (val: boolean) => void
    }

export type CMenuSlots = {
    activator?(props: { on: ActivatorListeners;
        activator: Record<string, any> }): VNodeChild
    default?(): VNodeChild
}

export type CMenuEmits = {
    'outside-click': []
    click: []
    open: []
    close: []
    'update:modelValue': [boolean]
}

export const makeCMenuProps = propsFactory({
    width: [String, Number],
    height: [String, Number],
    minWidth: [String, Number],
    maxWidth: [String, Number],
    minHeight: [String, Number],
    maxHeight: [String, Number],
    closeOnClickOutside: Boolean,
    closeOnContentClick: Boolean,
    modelValue: Boolean,
    to: String,
    ssr: Boolean,
    transition: {
        type: String,
        default: 'fade',
    },
    ...makeActivatorProps(),
    ...makeAutoPositionProps(),
    ...makeDelayProps(),
    ...makePresetProps(),
})

export const emits = emitsFactory<CMenuEmits>({
    'outside-click': null,
    click: null,
    open: null,
    close: null,
    'update:modelValue': (val) => typeof val === 'boolean',
})

export const CMenu = defineComponent<CMenuProps>({
    name: 'CMenu',
    inheritAttrs: false,
    props: makeCMenuProps(),
    emits,
    setup(props, {
        attrs,
        emit,
        slots,
        expose, 
    }) {
        const THROTTLE_DELAY = 50

        const {
            element,
            activatorProps,
            genListeners, 
        } = useActivator(props)

        const {
            activator,
            content,
            contentRef,
            update, 
        } = useAutoPosition(props, element)

        const presets = useMenuPresets({ props })

        const { openDelay, closeDelay } = useDelayedActions(props)

        const model = useModel(props, 'modelValue')

        const mounted = shallowRef(Boolean(props.ssr || props.modelValue))

        const detached = computed(() => isDef(props.positionX) || isDef(props.positionY))

        const sizesStyles = computed(() => ({
            ...(props.width || unref(activator).width
                ? { width: convertToUnit(props.width ?? unref(activator).width) }
                : {}),
            ...(props.height
                ? { height: convertToUnit(props.height ?? unref(activator).height) }
                : {}),
            ...(props.maxWidth || props.width
                ? { maxWidth: convertToUnit(props.maxWidth || props.width!) }
                : {}),
            ...(props.minWidth ? { minWidth: convertToUnit(props.minWidth) } : {}),
            ...(props.minHeight ? { minHeight: convertToUnit(props.minHeight) } : {}),
            ...(props.maxHeight ? { maxHeight: convertToUnit(props.maxHeight) } : {}),
        }))

        const styles = computed(() => ({
            top: convertToUnit(unref(content).top),
            left: convertToUnit(unref(content).left),
            ...unref(sizesStyles),
        }))

        const classes = computed(() => [
            { 'c-menu--visible': unref(model) },
            ...unref(presets).root,
        ])

        const open = () => {
            mounted.value = true

            openDelay(() => {
                if (!unref(detached)) {
                    model.value = true
                }

                emit('open')
            })
        }

        const close = () => {
            closeDelay(() => {
                emit('close')

                mounted.value = Boolean(props.ssr)
                model.value = false
            })
        }

        const toggle = () => {
            if (unref(model)) {
                close()
            } else {
                open()
            }
        }

        const onClickOutside = (e: Event) => {
            const { closeOnClickOutside } = props
            const { target } = e
            const activatorElement = unref(element) as Element | undefined

            if (
                closeOnClickOutside &&
                (!activatorElement || !activatorElement.contains(target as Node))
            ) {
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

        const { onKeydown } = useKeyboard({ Escape: () => close() })

        const listeners = genListeners({
            open,
            close,
            toggle,
        })

        const handler = throttle(() => {
            update()
        }, THROTTLE_DELAY)

        expose({
            open,
            close,
            toggle,
        })

        provide($MENU_API_KEY, {
            open,
            close,
            toggle,
        })

        watch(
            () => props.modelValue,
            (value) => {
                model.value = Boolean(value)

                if (value) {
                    mounted.value = true
                }
            },
            { immediate: true },
        )

        if (IN_BROWSER) {
            watch(
                model,
                (value) => {
                    if (value) {
                        window.addEventListener('resize', handler, { passive: true })
                        window.addEventListener('scroll', handler, { passive: true })
                        window.addEventListener('keydown', onKeydown)
                    } else {
                        window.removeEventListener('resize', handler)
                        window.removeEventListener('scroll', handler)
                        window.removeEventListener('keydown', onKeydown)
                    }
                },
                { immediate: true },
            )

            if (unref(detached)) {
                watch(
                    model,
                    (value) => {
                        if (value) {
                            open()
                        }
                    },
                    { immediate: true },
                )
            } else {
                onMounted(() => {
                    if (unref(model)) {
                        open()
                    }
                })
            }

            onBeforeUnmount(() => {
                window.removeEventListener('resize', handler)
                window.removeEventListener('scroll', handler)
                window.removeEventListener('keydown', onKeydown)
            })
        }

        function renderContent(zIndex: ShallowRef<number>) {
            if (!mounted.value) {
                return null
            }

            return withDirectives(
                <div
                    {...attrs}
                    ref={contentRef}
                    class={['c-menu', attrs.class as Record<string, string>, unref(classes)]}
                    style={[
                        attrs.style as Record<string, string>,
                        {
                            ...unref(styles),
                            zIndex: unref(zIndex),
                        },
                    ]}
                    onClick={onContentClick}
                >
                    <div class="c-menu__content">{slots.default?.()}</div>
                </div>,
                [
                    [vShow, unref(model)],
                    [vClickOutside, onClickOutside],
                ],
            )
        }

        return () => (
            <>
                {slots.activator?.({
                    on: unref(listeners),
                    activator: activatorProps,
                })}

                <COverlay v-model={model.value}>
                    {{
                        default: ({ zIndex }: { zIndex: ShallowRef<number> }) => (
                            <Transition name={props.transition}>{renderContent(zIndex)}</Transition>
                        ),
                    }}
                </COverlay>
            </>
        )
    },
})
