import { useModel } from 'vue'

import { genericComponent, type GenericProps, type InferFactoryProps } from '../../utils'
import { CInput, makeCInputProps } from '../CInput'
import { CSelectControl } from '../CSelectControl'

import { CheckboxElement } from './CheckboxElement'
import type { CCheckboxProps, CCheckboxSlots } from './types'

export const CCheckbox = genericComponent<
    new <T>(
        props: CCheckboxProps<T>,
        slots: CCheckboxSlots,
    ) => GenericProps<typeof props, typeof slots>,
    InferFactoryProps<ReturnType<typeof makeCInputProps>>
>()({
    name: 'CCheckbox',
    emits: { 'update:modelValue': () => true },
    inheritAttrs: false,
    props: {
        modelValue: null,
        value: null,
        size: Number,
    } as any,
    setup(props, { slots, attrs }) {
        const model = useModel(props as any, 'modelValue')

        return () => (
            <CSelectControl
                modelValue={model.value}
                onUpdate:modelValue={(v: any) => { model.value = v }}
                value={(props as any).value}
                {...attrs}
            >
                {{
                    default: ({ checked, toggle }: any) => (
                        <CInput
                            modelValue={model.value}
                            {...attrs}
                            kind="checkbox"
                        >
                            {{
                                field: (field: any) => (
                                    <CheckboxElement
                                        id={field.uid}
                                        error={field.hasError}
                                        label={field.label}
                                        checked={checked}
                                        {...field.attrs}
                                        onToggle={toggle}
                                    >
                                        {slots.default?.()}
                                    </CheckboxElement>
                                ),
                                details: ({ errorMessage, details }: any) => (
                                    <span key={errorMessage || details}>
                                        {errorMessage || details}
                                    </span>
                                ),
                            }}
                        </CInput>
                    ),
                }}
            </CSelectControl>
        )
    },
})
