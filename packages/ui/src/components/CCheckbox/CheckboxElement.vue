<script setup lang="ts" generic="T">
    import { computed, unref } from 'vue'

    import { CIcon } from '@/components/CIcon'
    import { CLabel } from '@/components/CLabel'
    import { IconAliases } from '@/enums'

    defineOptions({inheritAttrs: false})

    const props = defineProps<{
        error: boolean
        checked: boolean
        label?: string
        id: string
        disabled?: boolean
        readonly?: boolean
    }>()

    defineEmits<{
        (e: 'toggle'): void
    }>()

    const focused = defineModel<boolean>('focused', { default: false })
    const isCheckable = computed(() => !props.readonly && !props.disabled)

    const { CHECKBOX_ON, CHECKBOX_OFF } = IconAliases

    const classes = computed(() => ({
        'c-checkbox--default': !unref(focused) && !props.error && unref(isCheckable) && !props.checked,
        'c-checkbox--focused': unref(focused),
        'c-checkbox--disabled': props.disabled,
        'c-checkbox--checked': props.checked,
        'c-checkbox--readonly': props.readonly,
        'c-checkbox--error': props.error,
    }))

    function focus() {
        focused.value = true
    }

    function blur() {
        focused.value = false
    }
</script>

<template>
    <div
        class="c-checkbox"
        :class="classes"
    >
        <div
            class="c-checkbox__icon"
            aria-hidden="true"
        >
            <slot
                name="icon"
                :checked
            >
                <c-icon :name="checked ? CHECKBOX_ON : CHECKBOX_OFF" />
            </slot>
        </div>
        <input
            :id
            type="checkbox"
            :checked
            v-bind="$attrs"
            :disabled
            :readonly
            @focus="focus"
            @blur="blur"
            @change="$emit('toggle')"
        />
        <c-label
            :id="`${id}-label`"
            v-memo="[label]"
            class="c-checkbox__label"
            tag="label"
            :for="id"
        >
            <slot>{{ label }}</slot>
        </c-label>
    </div>
</template>
