<script setup lang="ts" generic="T">
    import {
        computed,
        h,
        onBeforeMount,
        onBeforeUnmount,
        shallowReactive,
        Transition,
        unref,
        useAttrs,
    } from 'vue'

    import { useAriaActivator } from '@/composables/use-aria-activator'
    import { useAriaField } from '@/composables/use-aria-field'
    import { useForm } from '@/composables/use-form'
    import { useId } from '@/composables/use-id'
    import { useInputPresets } from '@/composables/use-input-presets'
    import { useValidate } from '@/composables/use-validate'
    import { allowedAttrs, excludeProps } from '@/helpers/exclude-props'

    import type {
        CInputEmits,
        CInputProps,
        CInputSlots,
        InputState
    } from './types'

    defineOptions({
        name: 'CInput',
        inheritAttrs: false,
    })

    const props = defineProps<CInputProps<T>>()

    defineEmits<CInputEmits<T>>()

    const focused = defineModel<boolean>('focused', { default: false })

    const slots = defineSlots<CInputSlots>()

    const state = shallowReactive<InputState>({
        get focused() {
            return focused.value
        },
        set focused(v: boolean) {
            focused.value = v
        },
        isDirty: false,
    })

    const {
        errors,
        resetValidate,
        validate
    } = useValidate(props, state)

    const formApi = useForm()
    const attrs = useAttrs()

    const preset = useInputPresets({
        props,
        state,
        errors,
    })

    const fieldId = useId(props.id, { prefix: props.role })

    const ariaField = useAriaField(() => ({
        fieldId,
        label: props.label || isCheckBox || isRadio,
        hasDetails: unref(hasDetails),
        hasError: errors.hasError,
        errorMessage: errors.errorMessage,
        readonly: props.readonly,
        disabled: props.disabled,
    }))

    const isCombobox = props.role === 'combobox'
    const isCheckBox = props.role === 'checkbox'
    const isRadio = props.role === 'radio'

    const hasDetails = computed(() =>
        !props.noDetails
        && (!!props.details || !!slots?.details || errors.hasError)
    )

    const normalizedAttrsMap = computed(() => excludeProps({
        ...props,
        ...allowedAttrs,
    }))

    const fieldAttrs = computed(() => ({
        ...unref(ariaField),
        ...(isCombobox ? {
            role: 'combobox',
            ...useAriaActivator(() => ({
                expanded: state.focused,
                haspopup: 'listbox',
                controls: `${fieldId}-menu`,
            })).value
        } : {}),
        ...unref(normalizedAttrsMap),
    }))

    const classes = computed(() => [
        {
            'c-input--has-error': errors.hasError && !props.disabled && !props.readonly,
            'c-input--focused': state.focused,
            'c-input--disabled': props.disabled,
            'c-input--readonly': props.readonly,
            'c-input--dirty': props.dirty,
            'c-input--clearable': props.clearable,
        },
        attrs.class,
        ...unref(preset).root,
    ])

    const internalDetailsKey = computed(() => [
        errors.errorMessage,
        props.details,
        errors.hasError
    ].join('|'))

    function focus() {
        if (props.disabled || props.readonly) {
            return
        }

        state.focused = true
    }

    function blur() {
        state.focused = false

        if (!state.isDirty) {
            state.isDirty = true
        }
    }

    function reset() {
        resetValidate()
    }

    const genDetails = () => h('div', {
        key: unref(internalDetailsKey),
        id: `${unref(fieldId)}-details`,
        class: ['c-input__details', ...unref(preset).details],
    }, {
        default: () =>
            slots.details?.({
                details: props.details,
                ...errors,
                uid: fieldId,
            }),
    })

    const DetailsMessage = () =>
        h(Transition, {
            name: 'fade-in-down',
            mode: 'out-in',
        }, {
            default: () => genDetails(),
        })

    onBeforeMount(() => {
        formApi?.add(validate)
        formApi?.addReset(reset)
    })

    onBeforeUnmount(() => {
        formApi?.remove(validate)
        formApi?.removeReset(reset)
    })

    defineExpose({
        validate,
        focus,
        blur,
        reset,
    })
</script>

<template>
    <div
        class="c-input"
        :class="classes"
    >
        <div class="c-input__field">
            <slot
                name="field"
                v-bind="errors"
                :validate
                :label
                :disabled
                :readonly
                :focused="state.focused"
                :uid="fieldId"
                :preset="preset.field"
                :focus
                :blur
                :dirty
                :clearable
                :reset
                :attrs="fieldAttrs"
            ></slot>
        </div>
        <details-message v-if="hasDetails" />
    </div>
</template>
