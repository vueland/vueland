import {
    type ComponentPublicInstance,
    computed,
    type ComputedRef,
    nextTick,
    onBeforeUnmount,
    type PropType,
    ref,
    shallowRef,
    unref,
    watch,
} from 'vue'

import { isDef } from '../helpers'
import type { DimensionsProps } from '../types'
import { IN_BROWSER , propsFactory } from '../utils'

import { useApplication } from './use-application'

export interface Dimensions {
    top: number
    left: number
    width: number
    height: number
}

type AutoPositionStrategy = 'reverse' | 'bounce'

export interface AutoPositionProps {
    strategy?: AutoPositionStrategy
    positionX?: number
    positionY?: number
    offsetX?: number | string
    offsetY?: number | string
    left?: boolean
    right?: boolean
    top?: boolean
    bottom?: boolean
}

type MaybeElement = Element | ComponentPublicInstance | undefined

type ResolvedElement = HTMLElement | undefined

type AutoPositionInputProps =
    DimensionsProps &
    AutoPositionProps

export const makeAutoPositionProps = propsFactory({
    strategy: {
        type: String as PropType<AutoPositionStrategy>,
        default: 'bounce',
    },
    positionX: Number,
    positionY: Number,
    offsetX: [Number, String],
    offsetY: [Number, String],
    left: Boolean,
    right: Boolean,
    top: Boolean,
    bottom: {
        type: Boolean,
        default: true
    },
})

const SCREEN_EDGE_OFFSET = 20

function resolveElement(value: MaybeElement): ResolvedElement {
    if (!value) {
        return undefined
    }

    return ((value as ComponentPublicInstance).$el ?? value) as HTMLElement
}

function getElementRect(element: HTMLElement): Dimensions {
    const {
        top,
        left,
        width,
        height,
    } = element.getBoundingClientRect()

    return {
        top,
        left,
        width,
        height,
    }
}

function getObservedSize(entry: ResizeObserverEntry) {
    const borderBoxSize = entry.borderBoxSize?.[0]

    return {
        width: borderBoxSize?.inlineSize ?? entry.contentRect.width,
        height: borderBoxSize?.blockSize ?? entry.contentRect.height,
    }
}

function isSameSize(current: Dimensions, width: number, height: number) {
    return (
        Math.round(current.width) === Math.round(width) &&
        Math.round(current.height) === Math.round(height)
    )
}

export function useAutoPosition(
    props: AutoPositionInputProps,
    activatorEl?: ComputedRef<MaybeElement>,
) {
    const { getScrollTop, getScrollLeft } = useApplication()

    const activator = ref<Dimensions>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    })

    const content = ref<Dimensions>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    })

    const contentRef = shallowRef<MaybeElement>()

    const offsetX = computed(() => Number(props.offsetX) || 0)
    const offsetY = computed(() => Number(props.offsetY) || 0)

    const isHorizontalDirection = computed(() => props.left || props.right)
    const isReverseStrategy = computed(() => props.strategy === 'reverse')

    let frameId = 0

    const getActivatorElement = () => {
        return resolveElement(unref(activatorEl))
    }

    const getContentElement = () => {
        return resolveElement(unref(contentRef))
    }

    const setActivatorDimensions = () => {
        const element = getActivatorElement()

        if (!element) {
            activator.value = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            }

            return
        }

        const rect = getElementRect(element)

        activator.value = {
            top: rect.top + getScrollTop(),
            left: rect.left + getScrollLeft(),
            width: rect.width,
            height: rect.height,
        }
    }

    const setContentDimensions = () => {
        const element = getContentElement()

        if (!element) {
            return false
        }

        content.value.width = element.offsetWidth
        content.value.height = element.offsetHeight

        return true
    }

    const measure = () => {
        setActivatorDimensions()

        return setContentDimensions()
    }

    const getViewportXBounds = (left: number) => {
        const scrollLeft = getScrollLeft()
        const width = unref(content).width

        const leftEdge = scrollLeft + SCREEN_EDGE_OFFSET
        const rightEdge = scrollLeft + window.innerWidth - SCREEN_EDGE_OFFSET

        return {
            leftEdge,
            rightEdge,
            isBeyondLeft: left < leftEdge,
            isBeyondRight: left + width > rightEdge,
        }
    }

    const getViewportYBounds = (top: number) => {
        const scrollTop = getScrollTop()
        const height = unref(content).height

        const topEdge = scrollTop + SCREEN_EDGE_OFFSET
        const bottomEdge = scrollTop + window.innerHeight - SCREEN_EDGE_OFFSET

        return {
            topEdge,
            bottomEdge,
            isBeyondTop: top < topEdge,
            isBeyondBottom: top + height > bottomEdge,
        }
    }

    const getBaseTop = () => {
        if (isDef(props.positionY)) {
            return props.positionY! + unref(offsetY)
        }

        if (props.top) {
            return unref(activator).top - unref(content).height - unref(offsetY)
        }

        if (props.bottom) {
            return unref(activator).top + unref(activator).height + unref(offsetY)
        }

        return unref(activator).top + unref(offsetY)
    }

    const getBaseLeft = () => {
        if (isDef(props.positionX)) {
            return props.positionX! + unref(offsetX)
        }

        if (props.left) {
            return unref(activator).left - unref(content).width - unref(offsetX)
        }

        if (props.right) {
            return unref(activator).left + unref(activator).width + unref(offsetX)
        }

        return unref(activator).left + unref(offsetX)
    }

    const getReversedTop = () => {
        if (props.top) {
            return unref(activator).top + unref(activator).height + unref(offsetY)
        }

        if (props.bottom) {
            return unref(activator).top - unref(content).height - unref(offsetY)
        }

        return getBaseTop()
    }

    const getReversedLeft = () => {
        if (props.left) {
            return unref(activator).left + unref(activator).width + unref(offsetX)
        }

        if (props.right) {
            return unref(activator).left - unref(content).width - unref(offsetX)
        }

        return getBaseLeft()
    }

    const clampTopToViewport = (top: number) => {
        const { height } = unref(content)

        const {
            topEdge,
            bottomEdge,
            isBeyondTop,
            isBeyondBottom,
        } = getViewportYBounds(top)

        if (!isBeyondTop && !isBeyondBottom) {
            return top
        }

        return isBeyondBottom
            ? bottomEdge - height
            : topEdge
    }

    const clampLeftToViewport = (left: number) => {
        const { width } = unref(content)

        const {
            leftEdge,
            rightEdge,
            isBeyondLeft,
            isBeyondRight,
        } = getViewportXBounds(left)

        if (!isBeyondLeft && !isBeyondRight) {
            return left
        }

        return isBeyondRight
            ? rightEdge - width
            : leftEdge
    }

    const resolveTop = () => {
        const top = getBaseTop()

        const {
            isBeyondTop,
            isBeyondBottom,
        } = getViewportYBounds(top)

        if (!isBeyondTop && !isBeyondBottom) {
            return top
        }

        if (!unref(isReverseStrategy) || unref(isHorizontalDirection)) {
            return clampTopToViewport(top)
        }

        return getReversedTop()
    }

    const resolveLeft = () => {
        const left = getBaseLeft()

        const {
            isBeyondLeft,
            isBeyondRight,
        } = getViewportXBounds(left)

        if (!isBeyondLeft && !isBeyondRight) {
            return left
        }

        if (!unref(isReverseStrategy) || !unref(isHorizontalDirection)) {
            return clampLeftToViewport(left)
        }

        return getReversedLeft()
    }

    const applyPosition = () => {
        if (!IN_BROWSER) {
            return
        }

        content.value.top = resolveTop()
        content.value.left = resolveLeft()
    }

    const cancelScheduledUpdate = () => {
        if (!IN_BROWSER || !frameId) {
            return
        }

        cancelAnimationFrame(frameId)
        frameId = 0
    }

    const updateNow = () => {
        if (!measure()) {
            return
        }

        applyPosition()
    }

    const scheduleUpdate = () => {
        if (!IN_BROWSER || frameId) {
            return
        }

        frameId = requestAnimationFrame(() => {
            frameId = 0
            updateNow()
        })
    }

    const update = async () => {
        setActivatorDimensions()

        await nextTick()

        if (!setContentDimensions()) {
            return
        }

        await nextTick()

        applyPosition()
    }

    if (IN_BROWSER) {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0]

            if (!entry) {
                return
            }

            const { width, height } = getObservedSize(entry)
            const current = unref(content)

            if (isSameSize(current, width, height)) {
                return
            }

            current.width = width
            current.height = height

            scheduleUpdate()
        })

        watch(
            () => resolveElement(unref(activatorEl)),
            (newEl, oldEl) => {
                if (oldEl) {
                    resizeObserver.unobserve(oldEl)
                }

                if (newEl) {
                    resizeObserver.observe(newEl)
                }
            },
            { immediate: true },
        )

        watch(contentRef, (newEl, oldEl) => {
            const prevEl = resolveElement(oldEl)
            const nextEl = resolveElement(newEl)

            if (prevEl) {
                resizeObserver.unobserve(prevEl)
            }

            if (nextEl) {
                resizeObserver.observe(nextEl)
            }
        })

        watch(() => [
            props.positionX,
            props.positionY,
            props.top,
            props.bottom,
            props.left,
            props.right,
            props.offsetX,
            props.offsetY,
            props.strategy,
        ], scheduleUpdate)

        onBeforeUnmount(() => {
            cancelScheduledUpdate()
            resizeObserver.disconnect()
        })
    }

    return {
        activator,
        content,
        contentRef,
        update,
    }
}
