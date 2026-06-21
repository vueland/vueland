<script setup lang="ts" generic="T">
    import { shallowRef } from 'vue'

    import { CField } from '../CField'
    import { CInput } from '../CInput'

    import type { CTextFieldEmits, CTextFieldSlots } from './types'

    type CInputExpose = {
        validate(): Promise<boolean> | boolean | undefined
        reset(): void
    }

    defineOptions({ name: 'CTextField' })

    defineEmits<CTextFieldEmits<T>>()

    defineSlots<CTextFieldSlots>()

    const model = defineModel<string | number | undefined | null>()
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

    defineExpose({ validate, reset })
</script>

<template>
    <c-input
        ref="inputRef"
        :model-value="model"
        v-bind="$attrs"
    >
        <template #field="{focus, blur, focused, preset, attrs, uid, label, clearable, readonly, disabled, hasError}">
            <div class="c-text-field">
                <c-field
                    :id="uid"
                    v-model="model"
                    :focused
                    :label
                    :preset
                    :readonly
                    :disabled
                    :clearable
                    :error="hasError"
                    v-bind="attrs"
                    @focus="focus"
                    @blur="blur"
                    @clear="onClear"
                >
                    <template
                        v-if="$slots.prepend"
                        #prepend
                    >
                        <slot name="prepend"></slot>
                    </template>
                    <template
                        v-if="$slots.append"
                        #append
                    >
                        <slot name="append"></slot>
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
                    :key="errorMessage || details"
                    class="c-text-field__details"
                >
                    {{ errorMessage || details }}
                </span>
            </slot>
        </template>
    </c-input>
</template>
