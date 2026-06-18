import {
    defineComponent,
    Transition,
    unref,
    useModel,
    watch,
    withDirectives,
} from 'vue'

import { useApplication } from '../../composables'
import { vClickOutside } from '../../directives'
import { COverlay, type COverlaySlots } from '../COverlay'
import { CScrim } from '../CScrim'

export const CDialog = defineComponent({
    name: 'CDialog',
    props: {
        modelValue: Boolean,
        closeOnClickOutside: Boolean,
    },
    emits: { 'update:modelValue': () => true },
    setup(props, { slots }) {
        const model = useModel(props, 'modelValue')
        const { blockScroll, unblockScroll } = useApplication()

        watch(model, (value) => {
            if (value) blockScroll()
            else unblockScroll()
        })

        function onOutsideClick() {
            if (props.closeOnClickOutside) {
                model.value = false
            }
        }

        return () => (
            <COverlay v-model={model.value}>
                {{
                    default: ({ zIndex }: Parameters<COverlaySlots['default']>[0]) => (
                        <>
                            <Transition name="fade">
                                {unref(model) && <CScrim blur style={{ zIndex }} />}
                            </Transition>
                            <Transition name="scale-in">
                                {unref(model) && (
                                    <div class="c-dialog" style={{ zIndex }}>
                                        {withDirectives(
                                            <div class="c-dialog__content">
                                                {slots.default?.()}
                                            </div>,
                                            [[vClickOutside, onOutsideClick]],
                                        )}
                                    </div>
                                )}
                            </Transition>
                        </>
                    ),
                }}
            </COverlay>
        )
    },
})

export type CDialogProps = InstanceType<typeof CDialog>['$props']
