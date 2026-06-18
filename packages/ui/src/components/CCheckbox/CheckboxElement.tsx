import {
 computed, defineComponent, unref,useModel 
} from 'vue'

import { IconAliases } from '../../enums'
import { CIcon } from '../CIcon'
import { CLabel } from '../CLabel'

export const CheckboxElement = defineComponent({
    name: 'CheckboxElement',
    inheritAttrs: false,
    props: {
        error: Boolean,
        checked: Boolean,
        label: String,
        id: { type: String, required: true },
        disabled: Boolean,
        readonly: Boolean,
        focused: Boolean,
    },
    emits: ['toggle', 'update:focused'],
    setup(props, { emit, slots, attrs }) {
        const focused = useModel(props as any, 'focused')
        const isCheckable = computed(() => !props.readonly && !props.disabled)

        const { CHECKBOX_ON, CHECKBOX_OFF } = IconAliases

        const classes = computed(() => ({
            'c-checkbox--default': !unref(focused) && !props.error && unref(isCheckable),
            'c-checkbox--focused': unref(focused),
            'c-checkbox--disabled': props.disabled,
            'c-checkbox--readonly': props.readonly,
            'c-checkbox--error': props.error,
        }))

        return () => (
            <div class={['c-checkbox', classes.value]}>
                <div class="c-checkbox__icon" aria-hidden="true">
                    {slots.icon
                        ? slots.icon({ checked: props.checked })
                        : <CIcon name={props.checked ? CHECKBOX_ON : CHECKBOX_OFF} />
                    }
                </div>

                <input
                    id={props.id}
                    type="checkbox"
                    checked={props.checked}
                    {...attrs}
                    disabled={props.disabled}
                    readonly={props.readonly}
                    onFocus={() => { focused.value = true }}
                    onBlur={() => { focused.value = false }}
                    onChange={() => emit('toggle')}
                />

                <CLabel
                    id={`${props.id}-label`}
                    class="c-checkbox__label"
                    tag="label"
                    for={props.id}
                >
                    {slots.default?.() ?? props.label}
                </CLabel>
            </div>
        )
    },
})
