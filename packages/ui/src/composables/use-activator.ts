import {
    type ComponentPublicInstance,
    computed,
    type ComputedRef,
    getCurrentInstance,
    markRaw,
    onMounted,
    shallowRef,
    unref,
} from 'vue'

export type ActivatorProps = {
    closeOnClick?: boolean
    openOnClick?: boolean
    openOnHover?: boolean
    closeOnLeave?: boolean
    openOnFocus?: boolean
    closeOnBlur?: boolean
    activator?: ComponentPublicInstance | Element | 'parent' | string
}

export type ActivatorListeners = {
    mouseenter?: (e: Event) => void
    mouseleave?: (e: Event) => void
    mouseover?: (e: Event) => void
    mouseout?: (e: Event) => void
    contextmenu?: (e: Event) => void
    focus?: (e: Event) => void
    focusout?: (e: Event) => void
    blur?: (e: Event) => void
    click?: (e: Event) => void
    input?: (e: Event) => void
    change?: (e: Event) => void
}

export function useActivator(props: Partial<ActivatorProps> & Record<string, unknown>) {
    const instance = getCurrentInstance()
    const activatorRef = shallowRef<ComponentPublicInstance | Element | undefined>()
    const activatorProps: Record<string, any> = { ref: set }
    const isParentActivator = props.activator === 'parent'

    const _element = shallowRef<Element | undefined>()

    const element = computed({
        get: () => unref(_element),
        set: (value: Element): void => {
            _element.value = value
        },
    })

    function set(val: Element | ComponentPublicInstance) {
        activatorRef.value = val
    }

    function getActivator(): Element {
        if (isParentActivator) {
            return  instance?.proxy?.$el?.parentNode
        }

        if (typeof props.activator === 'string') {
            return document.querySelector(props.activator)!
        }

        if ((props.activator as ComponentPublicInstance)?.$el) {
            return (props.activator as ComponentPublicInstance).$el
        }

        if ((unref(activatorRef) as ComponentPublicInstance)?.$el) {
            return (unref(activatorRef) as ComponentPublicInstance).$el
        }

        return unref(activatorRef) as Element
    }

    function bindListeners(listeners: ComputedRef<ActivatorListeners>) {
        Object.keys(unref(listeners)).forEach(event => {
            unref(element)?.addEventListener(event, unref(listeners)[event])
        })
    }

    function unbindListeners(listeners: ComputedRef<ActivatorListeners>) {
        Object.keys(unref(listeners)).forEach(event => {
            unref(element)?.removeEventListener(event, unref(listeners)[event])
        })
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
        return computed(() => markRaw({
            ...(props.openOnHover ? { mouseenter: () => open() } : {}),
            ...(props.closeOnLeave ? { mouseleave: () => close() } : {}),
            ...(props.openOnClick ? { click: () => open() } : {}),
            ...(props.closeOnClick ? { click: () => toggle() } : {}),
            ...(props.openOnFocus ? { focus: () => open() } : {}),
            ...(props.closeOnBlur ? {
                focusout: (e) => {
                    const next = e.relatedTarget as Node | null

                    if (next && (e.currentTarget as HTMLElement).contains(next)) {
                        return
                    }

                    close()
                },
            } : {}),
        }))
    }

    onMounted(() => {
        element.value = getActivator()
    })

    return {
        element,
        activatorProps,
        isParentActivator,
        genListeners,
        bindListeners,
        unbindListeners,
    }
}
