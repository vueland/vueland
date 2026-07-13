<script setup lang="ts">
    import {
        computed,
        h,
        nextTick,
        onMounted,
        shallowRef,
        unref,
        useAttrs,
        useSlots,
        watch
    } from 'vue'

    import { CIcon } from '@/components/CIcon'
    import { CLabel } from '@/components/CLabel'
    import { useFieldPresets } from '@/composables/use-field-presets'
    import { IconAliases } from '@/enums'
    import { isNotEmpty } from '@/helpers'

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
    const focused = defineModel<boolean>('focused', { default: false })

    const inputRef = shallowRef<HTMLElement>()

    const slots = useSlots()
    const attrs = useAttrs()

    const presets = useFieldPresets({ props })

    const clearable = computed(() => props.clearable
        && unref(focused)
        && (!!unref(value) || props.dirty)
    )

    const classes = computed(() => [
        {
            'c-field--focused': unref(focused),
            'c-field--filled': isNotEmpty(unref(value)) || props.dirty,
            'c-field--has-prepend': !!slots.prepend,
            'c-field--disabled': props.disabled,
            'c-field--readonly': props.readonly,
            'c-field--error': props.error,
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

        if (props.readonly || props.disabled) {
            return
        }

        if (document.activeElement !== unref(inputRef)) {
            unref(inputRef)?.focus()
        }
    }

    const element = () => h(props.tag ?? 'input', {
        ...attrs,
        ref: inputRef,
        disabled: props.disabled,
        readonly: props.readonly,
        value: unref(value),
        class: ["c-field-input", ...unref(presets).input, attrs.class],
        onInput,
    })

    defineExpose({
        blur: () => focused.value = false,
        focus: () => focused.value = true
    })

    watch(focused, (value) => {
        if (value) nextTick(() => unref(inputRef)?.focus())
        else nextTick(() => unref(inputRef)?.blur())
    })

    onMounted(() => {
        if (unref(focused)) unref(inputRef)?.focus()
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
            <span :class="presets.label">
                {{ label }}
            </span>
        </div>

        <div
            v-if="$slots.prepend"
            class="c-field__prepend"
            :class="presets.prepend"
        >
            <slot name="prepend"></slot>
        </div>

        <c-label
            :id="`${$attrs.id}-label`"
            :for="($attrs.id as string)"
            tag="label"
            class="c-field__label"
            :class="presets.label"
        >
            {{ label }}
        </c-label>
        <div class="c-field__core">
            <slot name="before" />

            <element />

            <slot name="after" />
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
            :class="presets.append"
        >
            <slot name="append" />
        </div>
    </div>
</template>
