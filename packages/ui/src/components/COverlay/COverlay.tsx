import {
    onBeforeUnmount,
    type ShallowRef,
    shallowRef,
    Teleport,
    unref,
    useModel,
    watchEffect
} from 'vue'

import { useOverlayStack } from '../../composables'
import { createComponent, propsFactory } from '../../utils'

export type COverlayProps = {
    modelValue: boolean,
    to?: string
}

export type COverlaySlots = {
    default: { zIndex: ShallowRef<number> }
}

const makeOverlayProps = propsFactory({
    modelValue: Boolean,
    to: {
        type: String,
        default: 'body',
    },
})

export const COverlay = createComponent<COverlayProps, COverlaySlots>()({
    name: 'COverlay',
    inheritAttrs: false,
    props: makeOverlayProps(),
    setup(props, { slots }) {
        const model = useModel(props, 'modelValue')
        const zIndex = shallowRef<number>(0)

        const { register, unregister } = useOverlayStack()

        watchEffect(() => {
            if (unref(model)) {
                zIndex.value = register()
            } else {
                unregister()
            }
        })

        onBeforeUnmount(() => {
            if (unref(model)) {
                unregister()
            }
        })

        return () => (
            <Teleport to={props.to}>
                {slots.default?.({ zIndex })}
            </Teleport>
        )
    }
})
