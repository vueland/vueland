<script setup lang="ts" generic="T">
    import {
        computed,
        onBeforeMount,
        onBeforeUnmount,
        shallowReactive,
        unref,
        useAttrs,
    } from 'vue'

    import {
        useForm,
        useId,
        useInputPresets,
        useValidate
    } from '../../composables'
    import { FIELD_ATTRS } from '../../constants'

    import type { CInputEmits, CInputProps, CInputSlots, InputState } from './types'

    defineOptions({
        name: 'CInput',
        inheritAttrs: false
    })

    const props = defineProps<CInputProps<T>>()
    const emit = defineEmits<CInputEmits<T>>()
    const slots = defineSlots<CInputSlots<T>>()
    const state = shallowReactive<InputState>({
        focused: props.focused ?? false,
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

    const fieldId = useId(props.id, { prefix: props.kind })
    const isLisBox = props.kind === 'listbox'
    const isCheckBox = props.kind === 'checkbox'
    const isRadio = props.kind === 'radio'

    const hasDetails = computed(() => !props.noDetails && (
        !!props.details ||
        !!slots?.details ||
        errors.hasError)
    )

    const normalizedAttrsMap = computed(() => Object.entries(attrs).reduce((acc, [k, v]) => {
        if (
            (FIELD_ATTRS.has(k))
            || k.startsWith('aria-')
            || k.startsWith('data-')
        ) {
            acc[k] = v
        }

        return acc
    }, {}))

    const fieldAttrs = computed(() => ({
        ...(props.label || isCheckBox || isRadio ? { 'aria-labelledby': `${fieldId}-label` } : {}),
        ...(props.label ? { 'aria-label': props.label } : {}),
        ...(unref(hasDetails) ? { 'aria-describedby': `${fieldId}-details` } : {}),
        ...(errors.hasError ? { 'aria-invalid': 'true' } : {}),
        ...(errors.errorMessage && unref(hasDetails) ? { 'aria-errormessage': `${fieldId}-details` } : {}),
        ...(props.readonly ? { 'aria-readonly': 'true' } : {}),
        ...(props.disabled ? { 'aria-disabled': 'true' } : {}),
        ...(isLisBox ? { 'aria-haspopup': 'listbox' } : {}),
        ...(isLisBox ? { 'aria-controls': `${fieldId}-menu` } : {}),
        ...(isLisBox ? { 'aria-expanded': `${state.focused}` } : {}),
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
            [attrs.class as string]: !!attrs.class,
        },
        ...unref(preset).root
    ])

    function focus() {
        if (props.disabled || props.readonly) {
            return
        }
        state.focused = true
        emit('focus', state.focused)
    }

    function blur() {
        state.focused = false

        if (!state.isDirty) {
            state.isDirty = true
        }

        emit('blur', state.focused)
    }

    function input(val: T) {
        emit('input', val)
    }

    function reset() {
        resetValidate()
    }

    onBeforeMount(() => {
        formApi?.add(validate)
    })

    onBeforeUnmount(() => {
        formApi?.remove(validate)
    })

    defineExpose({
        validate,
        focus,
        blur,
        input,
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
                :input
                :clearable
                :reset
                :attrs="fieldAttrs"
            />
        </div>
        <div
            v-if="hasDetails"
            :id="`${fieldId}-details`"
            class="c-input__details"
            :class="preset.details"
        >
            <transition
                name="fade-in-down"
                mode="out-in"
            >
                <slot
                    name="details"
                    v-bind="errors"
                    :details
                    :uid="fieldId"
                />
            </transition>
        </div>
    </div>
</template>
