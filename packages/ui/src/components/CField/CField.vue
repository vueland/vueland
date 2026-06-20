<script setup lang="ts">
    import {
        computed,
        onMounted,
        shallowRef,
        unref,
        useSlots
    } from 'vue'

    import { useFieldPresets } from '../../composables/use-field-presets'
    import { IconAliases } from '../../enums'
    import { CIcon } from '../CIcon'
    import { CLabel } from '../CLabel'

    import type { CFieldProps } from './types'

    defineOptions({
        name: 'CField',
        inheritAttrs: false,
    })

    const props = defineProps<CFieldProps>()

    const emit = defineEmits<{
        (e: 'clear'): void
    }>()

    const value = defineModel<string | number | undefined | null>()
    const inputRef = shallowRef<HTMLElement>()
    const slots = useSlots()

    const hasValue = computed(() => props.filled || !!unref(value))
    const presets = useFieldPresets({
        slots,
        props,
        hasValue
    })

    const clearable = computed(() => props.clearable && props.focused && unref(hasValue))

    const classes = computed(() => [
        {
            'c-field--focused': props.focused,
            'c-field--filled': unref(hasValue),
            'c-field--has-prepend': !!slots.prepend,
            'c-field--disabled': props.disabled,
            'c-field--readonly': props.readonly,
            'c-field--error': props.error,
            'c-field--default': !props.focused && !props.error && !props.disabled,
        },
        ...unref(presets).root,
    ])

    function clear() {
        emit('clear')
    }

    function onInput(e: Event) {
        value.value = (e.target as HTMLInputElement).value
    }

    function onMousedown(e: MouseEvent) {
        e.preventDefault()
        if (document.activeElement !== unref(inputRef)) {
            unref(inputRef)?.focus()
        }
    }

    onMounted(() => {
        if (props.focused) unref(inputRef)?.focus()
    })
</script>

<template>
    <div
        class="c-field"
        :class="classes"
        @mousedown="onMousedown"
    >
        <div
            aria-hidden="true"
            class="c-field__outline"
        >
            <div class="c-field__outline-start"></div>
            <div class="c-field__outline-notch">
                <span :class="presets.label">{{ label }}</span>
            </div>
            <div class="c-field__outline-end"></div>
        </div>

        <div
            v-if="$slots.prepend"
            class="c-field__prepend"
        >
            <slot name="prepend"></slot>
        </div>

        <div class="c-field__core">
            <c-label
                :id="`${$attrs.id}-label`"
                :for="($attrs.id as string)"
                tag="label"
                class="c-field-label"
                :class="presets.label"
            >
                {{ label }}
            </c-label>

            <slot name="before"></slot>

            <component
                :is="tag ?? 'input'"
                v-bind="$attrs"
                ref="inputRef"
                :value="value"
                :disabled="disabled"
                :readonly="readonly || noInput"
                class="c-field-input"
                :class="presets.input"
                @input="onInput"
            />

            <slot name="after"></slot>
        </div>

        <transition name="fade">
            <div
                v-if="clearable"
                class="c-field__clear"
                @click="clear"
            >
                <slot name="clear">
                    <c-icon
                        :name="IconAliases.CLOSE"
                        :size="24"
                    />
                </slot>
            </div>
        </transition>

        <div
            v-if="$slots.append"
            class="c-field__append"
        >
            <slot name="append" />
        </div>
    </div>
</template>
