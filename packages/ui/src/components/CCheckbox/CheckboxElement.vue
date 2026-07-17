<script setup lang="ts">
    import {
        computed,
        shallowRef,
        unref,
        useAttrs
    } from 'vue'

    import { CIcon } from '@/components/CIcon'
    import { CLabel } from '@/components/CLabel'
    import { useCheckboxPresets } from '@/composables/use-checkbox-presets'
    import { useIcon } from '@/composables/use-icon'
    import { IconAliases } from '@/enums'
    import { convertToUnit } from '@/utils'

    import type { CheckboxElementProps } from './types'

    defineOptions({ inheritAttrs: false })

    const props = defineProps<CheckboxElementProps>()

    const emit = defineEmits<{
        (e: 'toggle'): void
        (e: 'focus'): void
        (e: 'blur'): void
    }>()

    const checkMarkIcon = useIcon({ name: IconAliases.CHECKBOX_CHECK_MARK })
    const indeterminateMarkIcon = useIcon({ name: IconAliases.CHECKBOX_INDETERMINATE_MARK })
    const attrs = useAttrs()
    const focusVisible = shallowRef(false)
    const presets = useCheckboxPresets({
        props,
        focusVisible,
    })

    const classes = computed(() => [
        {
            'c-checkbox--default': !props.error
                && !props.checked
                && !props.indeterminate
                && !props.readonly
                && !props.disabled,
            'c-checkbox--focus-visible': unref(focusVisible),
            'c-checkbox--disabled': props.disabled,
            'c-checkbox--checked': props.checked,
            'c-checkbox--indeterminate': props.indeterminate,
            'c-checkbox--readonly': props.readonly,
            'c-checkbox--error': props.error,
        },
        attrs.class,
        ...unref(presets).root,
    ])

    const iconStyle = computed(() => props.size
        ? { '--c-checkbox-size': convertToUnit(props.size) }
        : undefined)

    // class (color-утиль) остаётся на корне; на нативный инпут — только
    // aria-атрибуты и прочий passthrough от CInput.
    const inputAttrs = computed(() => {
        const {
            class: _,
            style: __,
            ...rest
        } = attrs

        return rest
    })

    function onClick(e: MouseEvent) {
        if (props.readonly) {
            e.preventDefault()
        }
    }

    function isFocusVisible(target: EventTarget | null) {
        if (!(target instanceof Element)) return false

        try {
            return target.matches(':focus-visible')
        } catch {
            return false
        }
    }

    function onFocus(e: FocusEvent) {
        focusVisible.value = isFocusVisible(e.target)
        emit('focus')
    }

    function onBlur() {
        focusVisible.value = false
        emit('blur')
    }
</script>

<template>
    <div
        class="c-checkbox"
        :class="classes"
    >
        <div
            class="c-checkbox__icon"
            :class="presets.icon"
            :style="iconStyle"
            aria-hidden="true"
        >
            <slot
                name="icon"
                :checked
                :indeterminate="!!indeterminate"
            >
                <div class="c-checkbox__box">
                    <c-icon
                        class="c-checkbox__marks"
                        :view-box="checkMarkIcon.viewBox"
                        size="100%"
                    >
                        <path
                            class="c-checkbox__check"
                            pathLength="1"
                            :d="checkMarkIcon.path"
                        />
                        <path
                            class="c-checkbox__indet"
                            :d="indeterminateMarkIcon.path"
                        />
                    </c-icon>
                </div>
            </slot>
        </div>
        <input
            v-bind="inputAttrs"
            :id
            type="checkbox"
            :checked
            :indeterminate.prop="!!indeterminate"
            :disabled
            @click="onClick"
            @change="emit('toggle')"
            @focus="onFocus"
            @blur="onBlur"
        />
        <c-label
            :id="`${id}-label`"
            class="c-checkbox__label"
            :class="presets.label"
            tag="label"
            :for="id"
        >
            <slot
                :checked
                :indeterminate="!!indeterminate"
            >
                {{ label }}
            </slot>
        </c-label>
    </div>
</template>
