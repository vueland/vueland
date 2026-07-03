import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onBeforeUnmount,
    type Ref,
    ref,
    shallowRef,
    unref,
    watch,
} from 'vue'

import { isDef } from '@/helpers'
import type { DimensionsProps } from '@/types'
import { IN_BROWSER } from '@/utils'

import { useApplication } from './use-application'

export interface Dimensions {
    top: number
    left: number
    width: number
    height: number
}

export type AlignSide = 'top' | 'bottom' | 'left' | 'right'

export type AlignValue =
    | AlignSide
    | 'top-center' | 'top-left' | 'top-right'
    | 'bottom-center' | 'bottom-left' | 'bottom-right'
    | 'left-center'
    | 'right-center'

export interface AutoPositionProps {
    strategy?: 'reverse' | 'bounce'
    positionX?: number
    positionY?: number
    offsetX?: number | string
    offsetY?: number | string
    align?: AlignValue
}

type MaybeElement = Element | ComponentPublicInstance | undefined

type ResolvedElement = HTMLElement | undefined

type AutoPositionInputProps = DimensionsProps & AutoPositionProps

const SCREEN_EDGE_OFFSET = 10

const REVERSE_SIDE: Record<AlignSide, AlignSide> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
}

function parseSide(align?: AlignValue): AlignSide | undefined {
    return align?.split('-')[0] as AlignSide | undefined
}

function parseCross(align?: AlignValue): string | undefined {
    if (!align) return undefined
    const idx = align.indexOf('-')
    return idx === -1 ? undefined : align.slice(idx + 1)
}

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
    activatorEl?: Ref<MaybeElement>,
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

    const side = computed(() => parseSide(props.align))
    const cross = computed(() => parseCross(props.align))
    const isHorizontalSide = computed(() => unref(side) === 'left' || unref(side) === 'right')
    const isReverseStrategy = computed(() => props.strategy === 'reverse')

    let frameId = 0
    let updateInFlight = false

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

    const getBaseTop = (s = unref(side), c = unref(cross)): number => {
        if (isDef(props.positionY)) {
            return props.positionY! + unref(offsetY)
        }

        const act = unref(activator)
        const cnt = unref(content)

        if (s === 'top') return act.top - cnt.height - unref(offsetY)
        if (s === 'bottom') return act.top + act.height + unref(offsetY)

        // horizontal side: vertical cross-alignment
        if (c === 'center') return act.top + act.height / 2 - cnt.height / 2

        return act.top + unref(offsetY)
    }

    const getBaseLeft = (s = unref(side), c = unref(cross)): number => {
        if (isDef(props.positionX)) {
            return props.positionX! + unref(offsetX)
        }

        const act = unref(activator)
        const cnt = unref(content)

        if (s === 'left') return act.left - cnt.width - unref(offsetX)
        if (s === 'right') return act.left + act.width + unref(offsetX)

        // vertical side: horizontal cross-alignment
        if (c === 'center') return act.left + act.width / 2 - cnt.width / 2
        if (c === 'right') return act.left + act.width - cnt.width

        return act.left + unref(offsetX)
    }

    const getReversedTop = () => {
        const s = unref(side)

        if (s && !unref(isHorizontalSide)) {
            return getBaseTop(REVERSE_SIDE[s])
        }

        return getBaseTop()
    }

    const getReversedLeft = () => {
        const s = unref(side)

        if (s && unref(isHorizontalSide)) {
            return getBaseLeft(REVERSE_SIDE[s])
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

        return isBeyondBottom ? bottomEdge - height : topEdge
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

        return isBeyondRight ? rightEdge - width : leftEdge
    }

    const resolveTop = () => {
        const top = getBaseTop()

        const { isBeyondTop, isBeyondBottom } = getViewportYBounds(top)

        if (!isBeyondTop && !isBeyondBottom) {
            return top
        }

        if (!unref(isReverseStrategy) || unref(isHorizontalSide)) {
            return clampTopToViewport(top)
        }

        // если реверснутая позиция тоже не влезает — прижимаем к краю экрана
        return clampTopToViewport(getReversedTop())
    }

    const resolveLeft = () => {
        const left = getBaseLeft()

        const { isBeyondLeft, isBeyondRight } = getViewportXBounds(left)

        if (!isBeyondLeft && !isBeyondRight) {
            return left
        }

        if (!unref(isReverseStrategy) || !unref(isHorizontalSide)) {
            return clampLeftToViewport(left)
        }

        // если реверснутая позиция тоже не влезает — прижимаем к краю экрана
        return clampLeftToViewport(getReversedLeft())
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
        updateInFlight = true
        cancelScheduledUpdate()

        setActivatorDimensions()

        await nextTick()

        if (!setContentDimensions()) {
            updateInFlight = false
            return
        }

        await nextTick()

        applyPosition()
        updateInFlight = false
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

            if (!updateInFlight) {
                scheduleUpdate()
            }
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

        watch(
            () => [
                props.positionX,
                props.positionY,
                props.align,
                props.offsetX,
                props.offsetY,
                props.strategy,
            ],
            scheduleUpdate,
        )

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
