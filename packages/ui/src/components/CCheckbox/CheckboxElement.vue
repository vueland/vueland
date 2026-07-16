<script setup lang="ts">
    import { computed, unref } from 'vue'

    import { CIcon } from '@/components/CIcon'
    import { CLabel } from '@/components/CLabel'
    import { useCheckboxPresets } from '@/composables/use-checkbox-presets'
    import { IconAliases } from '@/enums'

    import type { CheckboxElementProps } from './types'

    defineOptions({ inheritAttrs: false })

    const props = defineProps<CheckboxElementProps>()

    defineEmits<{
        (e: 'toggle'): void
        (e: 'focus'): void
        (e: 'blur'): void
    }>()

    const {
        CHECKBOX_ON,
        CHECKBOX_OFF,
        CHECKBOX_INDETERMINATE
    } = IconAliases

    const presets = useCheckboxPresets({ props })

    const icon = computed(() => {
        if (props.indeterminate) {
            return CHECKBOX_INDETERMINATE
        }

        return props.checked ? CHECKBOX_ON : CHECKBOX_OFF
    })

    const classes = computed(() => [
        {
            'c-checkbox--default': !props.focused
                && !props.error
                && !props.checked
                && !props.indeterminate
                && !props.readonly
                && !props.disabled,
            'c-checkbox--focused': props.focused,
            'c-checkbox--disabled': props.disabled,
            'c-checkbox--checked': props.checked,
            'c-checkbox--indeterminate': props.indeterminate,
            'c-checkbox--readonly': props.readonly,
            'c-checkbox--error': props.error,
        },
        ...unref(presets).root,
    ])

    // Нативный чекбокс не знает про readonly: отменяем сам факт переключения,
    // тогда не будет ни рассинхрона DOM, ни события change. Клик покрывает и
    // пробел — браузер шлёт его как click.
    function onClick(e: MouseEvent) {
        if (props.readonly) {
            e.preventDefault()
        }
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
            aria-hidden="true"
        >
            <slot
                name="icon"
                :checked
                :indeterminate="!!indeterminate"
            >
                <c-icon
                    :name="icon"
                    :size
                />
            </slot>
        </div>
        <input
            v-bind="$attrs"
            :id
            type="checkbox"
            :checked
            :indeterminate.prop="!!indeterminate"
            :disabled
            @click="onClick"
            @change="$emit('toggle')"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
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
