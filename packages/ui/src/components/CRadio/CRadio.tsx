import {
 computed, defineComponent, unref, useModel 
} from 'vue'

import { IconAliases } from '../../enums'
import { CIcon } from '../CIcon'
import { CLabel } from '../CLabel'
import { CSelectControl } from '../CSelectControl'

export const CRadio = defineComponent({
    name: 'CRadio',
    props: {
        label: String,
        modelValue: null,
    },
    emits: { 'update:modelValue': () => true },
    setup(props, { slots, attrs }) {
        const model = useModel(props as any, 'modelValue')
        const { RADIO_ON, RADIO_OFF } = IconAliases
        const icon = computed(() => unref(model) ? RADIO_ON : RADIO_OFF)

        return () => (
            <CSelectControl
                modelValue={model.value}
                onUpdate:modelValue={(v: any) => { model.value = v }}
                {...attrs}
            >
                {{
                    default: ({
 disabled, checked, toggle, readonly 
}: any) => (
                        <div
                            class={[
                                'c-radio',
                                {
                                    'c-radio--disabled': disabled,
                                    'c-radio--checked': checked,
                                    'c-radio--readonly': readonly,
                                },
                            ]}
                            onClick={toggle}
                        >
                            <div class="c-radio__icon">
                                <CIcon name={unref(icon)} />
                            </div>
                            <div class="c-radio__label">
                                {slots.default?.() ?? (
                                    <CLabel>{props.label}</CLabel>
                                )}
                            </div>
                        </div>
                    ),
                }}
            </CSelectControl>
        )
    },
})
