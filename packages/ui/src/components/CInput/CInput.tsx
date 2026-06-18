import {
    computed,
    onBeforeMount,
    onBeforeUnmount,
    type PropType,
    shallowReactive,
    Transition,
    unref,
    useAttrs,
    type VNodeChild,
} from 'vue'

import {
    type PresetProps,
    useForm,
    useId,
    useInputPresets,
    useValidate,
    type ValidateFn,
    type ValidateOn,
    type ValidateProps,
    type ValidateState,
} from '../../composables'
import { FIELD_ATTRS } from '../../constants'
import {
    genericComponent,
    type GenericProps,
    propsFactory,
} from '../../utils'

export interface InputState {
    focused: boolean
    isDirty: boolean
}

export type CInputKind =
    | 'checkbox'
    | 'radio'
    | 'input'
    | 'area'
    | 'listbox'

export type CInputProps<T = any> =
    ValidateProps &
    PresetProps & {
    id?: string
    modelValue: T | T[] | undefined | null
    label?: string
    details?: string
    noDetails?: boolean
    clearable?: boolean
    disabled?: boolean
    focused?: boolean
    readonly?: boolean
    kind?: CInputKind
}

export type CInputEmits<T = any> = {
    focus: [boolean]
    blur: [boolean]
    input: [T]
}

export type CInputLabelSlotProps = {
    uid: string
}

export type CInputDetailsSlotProps = {
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    uid: string
    details?: string
}

export type CInputFieldSlotProps<T = any> = {
    input(val: T): void
    focus(): void
    blur(): void
    reset(): void
    label?: string
    focused: boolean
    clearable?: boolean
    preset?: string
    errorMessage: ValidateState['errorMessage']
    hasError: ValidateState['hasError']
    attrs: Record<string, any>
    uid: string
    validate(): boolean
}

export type CInputSlots<T = any> = {
    label?(props: CInputLabelSlotProps): VNodeChild

    details?(props: CInputDetailsSlotProps): VNodeChild

    field(props: CInputFieldSlotProps<T>): VNodeChild
}

export const makeCInputProps = propsFactory({
    id: String,
    label: String,
    details: String,
    noDetails: Boolean,
    modelValue: {type: null,},
    clearable: Boolean,
    focused: Boolean,
    kind: String as PropType<CInputKind>,
    rules: Array as PropType<ValidateFn[]>,
    validateOn: String as PropType<ValidateOn>,
    preset: String,
})

export const CInput = genericComponent<new <T>(
    props: CInputProps<T>,
    slots: CInputSlots<T>,
) => GenericProps<typeof props, typeof slots>>()({
    name: 'CInput',
    inheritAttrs: false,
    props: makeCInputProps({validateOn: 'input' as ValidateOn,}),
    emits: {
        focus: () => true,
        blur: () => true,
        input: () => true,
    },
    setup(props, { emit, expose, slots }) {
        const state = shallowReactive<InputState>({
            focused: (props as any).focused ?? false,
            isDirty: false,
        })

        const {
            errors,
            resetValidate,
            validate,
        } = useValidate(props, state)

        const formApi = useForm()
        const attrs = useAttrs()

        const preset = useInputPresets({
            props: props as any,
            state,
            errors,
        })

        const fieldId = useId((props as any).id, { prefix: (props as any).kind })
        const isListBox = (props as any).kind === 'listbox'
        const isCheckBox = (props as any).kind === 'checkbox'
        const isRadio = (props as any).kind === 'radio'

        const hasDetails = computed(() => !props.noDetails && (
            !!props.details ||
            !!slots?.details ||
            errors.hasError
        ))

        const normalizedAttrsMap = computed(() => Object.entries(attrs).reduce<Record<string, unknown>>((acc, [k, v]) => {
            if (FIELD_ATTRS.has(k) || k.startsWith('aria-') || k.startsWith('data-')) {
                acc[k] = v
            }
            return acc
        }, {}))

        const fieldAttrs = computed(() => ({
            ...(attrs.disabled ? { disabled: true, 'aria-disabled': 'true' } : {}),
            ...(attrs.readonly ? { readonly: true, 'aria-readonly': 'true' } : {}),
            ...(props.label || isCheckBox || isRadio ? { 'aria-labelledby': `${fieldId}-label` } : {}),
            ...(props.label ? { 'aria-label': props.label } : {}),
            ...(unref(hasDetails) ? { 'aria-describedby': `${fieldId}-details` } : {}),
            ...(errors.hasError ? { 'aria-invalid': 'true' } : {}),
            ...(errors.errorMessage && unref(hasDetails) ? { 'aria-errormessage': `${fieldId}-details` } : {}),
            ...(isListBox ? { 'aria-haspopup': 'listbox' } : {}),
            ...(isListBox ? { 'aria-controls': `${fieldId}-menu` } : {}),
            ...(isListBox ? { 'aria-expanded': `${state.focused}` } : {}),
            ...unref(normalizedAttrsMap),
        }))

        const classes = computed(() => [
            {
                'c-input--has-error': errors.hasError,
                'c-input--default': !errors.hasError && !attrs.disabled && !attrs.readonly,
                'c-input--focused': state.focused,
                'c-input--disabled': !!attrs.disabled,
                'c-input--readonly': !!attrs.readonly,
                'c-input--clearable': props.clearable,
                [attrs.class as string]: !!attrs.class,
            },
            ...unref(preset).root,
        ])

        function focus() {
            if (attrs.disabled || attrs.readonly) return
            state.focused = true
            emit('focus', state.focused)
        }

        function blur() {
            state.focused = false
            if (!state.isDirty) state.isDirty = true
            emit('blur', state.focused)
        }

        function input(val: any) {
            emit('input', val)
        }

        function reset() {
            resetValidate()
        }

        onBeforeMount(() => formApi?.add(validate))
        onBeforeUnmount(() => formApi?.remove(validate))

        expose({
 validate, focus, blur, input, reset 
})

        return () => {
            const fieldSlotProps: CInputFieldSlotProps = {
                errorMessage: errors.errorMessage,
                hasError: errors.hasError,
                validate,
                label: props.label,
                focused: state.focused,
                uid: fieldId,
                preset: unref(preset).field,
                focus,
                blur,
                input,
                clearable: props.clearable,
                reset,
                attrs: unref(fieldAttrs),
            }

            return (
                <div class={['c-input', unref(classes)]}>
                    <div class="c-input__field">
                        {slots.field?.(fieldSlotProps)}
                    </div>
                    {unref(hasDetails) && (
                        <div
                            id={`${fieldId}-details`}
                            class={['c-input__details', unref(preset).details]}
                        >
                            <Transition name="fade-in-down" mode="out-in">
                                {slots.details?.({
                                    errorMessage: errors.errorMessage,
                                    hasError: errors.hasError,
                                    details: props.details,
                                    uid: fieldId,
                                })}
                            </Transition>
                        </div>
                    )}
                </div>
            )
        }
    },
})
