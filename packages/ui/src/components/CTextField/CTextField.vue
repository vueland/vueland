<script setup lang="ts" generic="T">
    import {
        shallowRef,
        unref,
        useAttrs
    } from 'vue'

    import { CField } from '@/components/CField'
    import { CInput } from '@/components/CInput'

    import type { CTextFieldEmits, CTextFieldSlots } from './types'

    type CInputExpose = {
        validate(): Promise<boolean> | boolean | undefined
        reset(): void
        blur(): void
        focus(): void
    }

    defineOptions({ name: 'CTextField' })

    defineEmits<CTextFieldEmits<T>>()

    defineSlots<CTextFieldSlots>()

    const model = defineModel<string | number | undefined | null>()

    const cInputRef = shallowRef<CInputExpose>()

    const rootAttrs = useAttrs()

    function validate() {
        return unref(cInputRef)?.validate()
    }

    function reset() {
        unref(cInputRef)?.reset()
    }

    function onClear() {
        model.value = undefined
    }

    function onFocus() {
        unref(cInputRef)?.focus()
    }

    function onBlur() {
        if (rootAttrs.role === 'combobox') {
            return
        }

        unref(cInputRef)?.blur()
    }

    defineExpose({
        validate,
        reset,
        blur: () => unref(cInputRef)?.blur(),
        focus: () => unref(cInputRef)?.focus(),
    })

</script>

<template>
    <c-input
        ref="cInputRef"
        :model-value="model"
        v-bind="rootAttrs"
    >
        <template #field="{focused, attrs, uid, dirty, label, clearable, readonly, disabled, hasError}">
            <div class="c-text-field">
                <c-field
                    :id="uid"
                    v-model="model"
                    :focused
                    :label
                    :readonly
                    :disabled
                    :dirty
                    :clearable
                    :error="hasError"
                    v-bind="attrs"
                    @focus="onFocus"
                    @blur="onBlur"
                    @clear="onClear"
                    @click.prevent.stop
                >
                    <template
                        v-if="$slots.before"
                        #before
                    >
                        <slot name="before" />
                    </template>
                    <template
                        v-if="$slots.prepend"
                        #prepend
                    >
                        <slot name="prepend" />
                    </template>
                    <template
                        v-if="$slots.append"
                        #append
                    >
                        <slot name="append" />
                    </template>
                </c-field>
                <slot
                    v-if="$slots.menu"
                    :id="`${uid}-menu`"
                    name="menu"
                />
            </div>
        </template>
        <template #details="{errorMessage, details, validating, hasError}">
            <slot
                name="details"
                :error-message
                :details
                :has-error
                :validating
            >
                <span
                    v-if="errorMessage || details"
                    class="c-text-field__details"
                >
                    {{ errorMessage || details }}
                </span>
            </slot>
        </template>
    </c-input>
</template>
