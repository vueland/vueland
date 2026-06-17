import {
    computed, provide, unref, useModel,
} from 'vue'

import { $SELECT_CONTROL_API_KEY } from '../../constants'
import { isDef } from '../../helpers'
import { genericComponent, type GenericProps } from '../../utils'

import type { CSelectControlProps, CSelectControlSlots } from './types'

export const CSelectControl = genericComponent<new <T>(
    props: CSelectControlProps<T>,
    slots: CSelectControlSlots,
) => GenericProps<typeof props, typeof slots>>()({
    name: 'CSelectControl',
    emits: { 'update:modelValue': () => true },
    props: {
        modelValue: null,
        value: null,
        multiple: Boolean,
        focused: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        name: String,
    } as any,
    setup(props, { slots, expose }) {
        const model = useModel(props as any, 'modelValue')
        const { isArray } = Array

        const isInArray = computed(() =>
            isArray((props as any).modelValue) && (props as any).modelValue.includes((props as any).value)
        )
        const isEqual = computed(() => (props as any).value === unref(model))

        const checked = computed(() =>
            isDef((props as any).value)
                ? (unref(isInArray) || unref(isEqual))
                : !!unref(model)
        )

        function checkOn() {
            const { modelValue, value } = props as any
            if (isArray(modelValue)) {
                model.value = [...modelValue, value]
            } else {
                model.value = isDef(value) ? value : !modelValue
            }
        }

        function checkOff() {
            const { modelValue, value } = props as any
            if (isArray(modelValue)) {
                model.value = modelValue.filter((it: any) => it !== value)
            } else {
                model.value = isDef(value) ? null : !modelValue
            }
        }

        function toggle() {
            const { disabled, readonly } = props as any
            if (disabled || readonly) return
            if (unref(checked)) return checkOff()
            checkOn()
        }

        expose({ checkOn, checkOff, toggle })

        provide($SELECT_CONTROL_API_KEY, {
 checked, toggle, checkOn, checkOff 
})

        return () => slots.default?.({
            checked: unref(checked),
            disabled: (props as any).disabled,
            readonly: (props as any).readonly,
            toggle,
        })
    },
})
