import {
 defineComponent, Transition, unref, useModel, watch, withDirectives 
} from 'vue'

import { useApplication } from '../../composables'
import { vClickOutside } from '../../directives'
import { COverlay } from '../COverlay'
import { CScrim } from '../CScrim'

import type { CDialogProps } from './types'

export const CDialog = defineComponent<CDialogProps>({
    name: 'CDialog',
    props: {
        modelValue: Boolean,
        closeOnClickOutside: Boolean,
    } as any,
    emits: { 'update:modelValue': () => true },
    setup(props, { slots }) {
        const model = useModel(props as any, 'modelValue')
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
                    default: ({ zIndex }: any) => (
                        <>
                            <Transition name="fade">
                                {unref(model) && (
                                    <CScrim
                                        blur
                                        style={{ zIndex: zIndex.value }}
                                    />
                                )}
                            </Transition>
                            <Transition name="scale-in">
                                {unref(model) && (
                                    <div class="c-dialog" style={{ zIndex: zIndex.value }}>
                                        {withDirectives(
                                            <div class="c-dialog__content">
                                                {slots.default?.()}
                                            </div>,
                                            [[vClickOutside, onOutsideClick]]
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
