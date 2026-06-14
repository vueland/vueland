import { type ComponentPublicInstance, computed, markRaw, shallowRef, unref } from 'vue'

import { propsFactory } from '../utils'

export type ActivatorProps = {
    closeOnClick?: boolean
    openOnClick?: boolean
    openOnHover?: boolean
    closeOnLeave?: boolean
    openOnFocus?: boolean
    activator?: ComponentPublicInstance | Element
}

export type ActivatorListeners = {
    mouseenter?: (e: Event) => void
    mouseleave?: (e: Event) => void
    mouseover?: (e: Event) => void
    mouseout?: (e: Event) => void
    contextmenu?: (e: Event) => void
    focus?: (e: Event) => void
    blur?: (e: Event) => void
    click?: (e: Event) => void
    input?: (e: Event) => void
    change?: (e: Event) => void
}

export const makeActivatorProps = propsFactory({
    closeOnClick: Boolean,
    openOnClick: Boolean,
    openOnHover: Boolean,
    closeOnLeave: Boolean,
    openOnFocus: Boolean,
    activator: {
        type: null,
        default: undefined,
    }
})

export function useActivator(props: Partial<ActivatorProps> & Record<string, unknown>) {
    const activatorEl = shallowRef<ComponentPublicInstance | Element | undefined>(props.activator)

    const element = computed(() => getActivator())
    const activatorProps: Record<string, any> = { ref: set }

    function set(val: Element | ComponentPublicInstance) {
        activatorEl.value = val
    }

    function getActivator(): Element {
        return props.activator ?? (unref(activatorEl) as ComponentPublicInstance)?.$el ?? unref(activatorEl)
    }

    function genListeners({
        open,
        close,
        toggle,
    }: {
        open: () => void
        close: () => void
        toggle: () => void
    }) {
        return computed(() => (markRaw({
            ...(props.openOnHover ? {
                mouseenter: () => open(),
            } : {}),
            ...(props.closeOnLeave ? {
                mouseleave: () => close(),
            } : {}),
            ...(props.openOnClick ? {
                click: () => open(),
            } : {}),
            ...(props.closeOnClick ? {
                click: () => toggle(),
            } : {}),
            ...(props.openOnFocus ? {
                focus: () => open(),
            } : {}),
        })))
    }

    return {
        element,
        activatorProps,
        genListeners,
        getActivator,
    }
}
