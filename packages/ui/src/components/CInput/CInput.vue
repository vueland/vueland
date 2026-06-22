<script setup lang="ts" generic="T">
    import {
        computed,
        h,
        onBeforeMount,
        onBeforeUnmount,
        shallowReactive,
        shallowRef,
        Transition,
        unref,
        useAttrs,
        watch
    } from 'vue'

    import {
        useAriaActivator,
        useAriaField,
        useForm,
        useId,
        useInputPresets,
        useValidate,
    } from '@/composables'
    import { FIELD_ATTRS } from '@/constants'

    import type {
        CInputEmits,
        CInputProps,
        CInputSlots,
        InputState
    } from './types'

    defineOptions({
        name: 'CInput',
        inheritAttrs: false
    })

    const props = defineProps<CInputProps<T>>()

    defineEmits<CInputEmits<T>>()

    const slots = defineSlots<CInputSlots>()

    const focusedModel = defineModel<boolean>('focused', { default: false })

    const INTERNAL_HANDLERS = new Set(['onUpdate:modelValue', 'onUpdate:focused'])

    const state = shallowReactive<InputState>({
        get focused() {
            return focusedModel.value
        },
        set focused(v: boolean) {
            focusedModel.value = v
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
        errors
    })

    const messageNode = shallowRef()
    const fieldId = useId(props.id, { prefix: props.role })
    const isCombobox = props.role === 'combobox'
    const isCheckBox = props.role === 'checkbox'
    const isRadio = props.role === 'radio'

    const hasDetails = computed(() => !props.noDetails && (
        !!props.details ||
        !!slots?.details ||
        errors.hasError)
    )

    const normalizedAttrsMap = computed(() => Object.entries(attrs).reduce((acc, [k, v]) => {
        if (
            FIELD_ATTRS.has(k)
            || k.startsWith('aria-')
            || k.startsWith('data-')
            || (k.startsWith('on') && !INTERNAL_HANDLERS.has(k))
        ) {
            acc[k] = v
        }

        return acc
    }, {}))

    const ariaField = useAriaField(() => ({
        fieldId,
        label: props.label || isCheckBox || isRadio,
        hasDetails: unref(hasDetails),
        hasError: errors.hasError,
        errorMessage: errors.errorMessage,
        readonly: props.readonly,
        disabled: props.disabled,
    }))

    const ariaActivator = useAriaActivator(() => ({
        expanded: state.focused,
        haspopup: 'listbox',
        controls: `${fieldId}-menu`,
    }))

    const fieldAttrs = computed(() => ({
        ...unref(ariaField),
        ...(isCombobox ? { role: 'combobox', ...unref(ariaActivator) } : {}),
        ...unref(normalizedAttrsMap),
    }))

    const classes = computed(() => [
        {
            'c-input--has-error': errors.hasError,
            'c-input--default': !errors.hasError && !props.disabled && !props.readonly,
            'c-input--focused': state.focused,
            'c-input--disabled': props.disabled,
            'c-input--readonly': props.readonly,
            'c-input--clearable': props.clearable,
        },
        attrs.class,
        ...unref(preset).root
    ])

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

    onBeforeMount(() => {
        formApi?.add(validate)
        formApi?.addReset(reset)
    })

    onBeforeUnmount(() => {
        formApi?.remove(validate)
        formApi?.removeReset(reset)
    })

    const DetailsMessage = () => h(Transition, {
        name: "fade-in-down",
        mode: "out-in",
    }, {
        default: () => unref(messageNode),
    })

    watch(() => [errors.errorMessage, props.details] , () => {
        messageNode.value = null

        setTimeout(() => messageNode.value = slots.details?.({
            details: props.details,
            ...errors,
            uid: fieldId
        }))
    }, {immediate: true})

    defineExpose({
        validate,
        focus,
        blur,
        reset
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
                :clearable
                :reset
                :attrs="fieldAttrs"
            ></slot>
        </div>
        <div
            v-if="hasDetails"
            :id="`${fieldId}-details`"
            class="c-input__details"
            :class="preset.details"
        >
            <details-message />
        </div>
    </div>
</template>
