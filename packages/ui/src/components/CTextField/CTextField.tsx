import { useModel, type VNode } from 'vue'

import {
    emitsFactory,
    genericComponent,
    type GenericProps,
    type InferFactoryProps,
} from '../../utils'
import { CField } from '../CField'
import { CInput, type CInputFieldSlotProps, makeCInputProps } from '../CInput'

export type CTextFieldSlots = {
    prepend(): VNode
    append(): VNode
    details(props: { errorMessage?: string;
        details?: string }): VNode
}

export const CTextField = genericComponent<
    new <T>(
        props: { modelValue?: T },
        slots: CTextFieldSlots,
    ) => GenericProps<typeof props, typeof slots>,
    InferFactoryProps<ReturnType<typeof makeCInputProps>>
>()({
    name: 'CTextField',
    emits: emitsFactory<{ 'update:modelValue': [unknown] }>({ 'update:modelValue': () => true }),
    props: { modelValue: [String, Number] },
    setup(props, { slots, attrs }) {
        const model = useModel(props, 'modelValue')

        function onClear() {
            model.value = undefined
        }

        return () => (
            <CInput modelValue={model.value} {...attrs} kind="input">
                {{
                    field: (field: CInputFieldSlotProps) => (
                        <div class="c-text-field">
                            <CField
                                id={field.uid}
                                modelValue={model.value as string | number}
                                onUpdate:modelValue={(v: any) => {
                                    model.value = v
                                }}
                                focused={field.focused}
                                label={field.label}
                                preset={field.preset}
                                clearable={field.clearable}
                                {...field.attrs}
                                onFocus={field.focus}
                                onBlur={field.blur}
                                onClear={onClear}
                            >
                                {{
                                    ...(slots.prepend && { prepend: () => slots.prepend!() }),
                                    ...(slots.append && { append: () => slots.append!() }),
                                }}
                            </CField>
                        </div>
                    ),
                    details: ({ errorMessage, details }) =>
                        slots.details?.({
                            errorMessage,
                            details, 
                        }) ?? (
                            <span key={errorMessage || details} class="c-text-field__details">
                                {errorMessage || details}
                            </span>
                        ),
                }}
            </CInput>
        )
    },
})
