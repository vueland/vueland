<script setup lang="ts" generic="T">
    import { shallowRef } from 'vue'

    import { CField, CInput } from '@/components'

    import type { CTextFieldEmits, CTextFieldSlots } from './types'

    type CInputExpose = {
        validate(): Promise<boolean> | boolean | undefined
        reset(): void
    }

    defineOptions({ name: 'CTextField' })

    defineEmits<CTextFieldEmits<T>>()

    defineSlots<CTextFieldSlots>()

    const model = defineModel<string | number | undefined | null>()

    defineExpose({ validate, reset })

    const inputRef = shallowRef<CInputExpose>()

    function validate() {
        return inputRef.value?.validate()
    }

    function reset() {
        inputRef.value?.reset()
    }

    function onClear() {
        model.value = undefined
    }
</script>

<template>
    <c-input
        ref="inputRef"
        :model-value="model"
        v-bind="$attrs"
    >
        <template #field="{focus, blur, focused, attrs, uid, label, clearable, readonly, disabled, hasError}">
            <div class="c-text-field">
                <c-field
                    :id="uid"
                    v-model="model"
                    :focused
                    :label
                    :readonly
                    :disabled
                    :clearable
                    :error="hasError"
                    v-bind="attrs"
                    @focus="focus"
                    @blur="blur"
                    @clear="onClear"
                >
                    <template #before>
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
            </div>
        </template>
        <template #details="{errorMessage, details, hasError}">
            <slot
                name="details"
                :error-message
                :details
                :has-error
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
