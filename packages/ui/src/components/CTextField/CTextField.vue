<script setup lang="ts">
    import { CField } from '../CField'
    import { CInput } from '../CInput'

    import type { CTextFieldSlots } from './types'

    defineOptions({
        name: 'CTextField',
    })

    defineSlots<CTextFieldSlots>()

    const model = defineModel<string | number | undefined | null>()

    function onClear() {
        model.value = undefined
    }
</script>

<template>
    <c-input
        :model-value="model"
        v-bind="$attrs"
        kind="input"
    >
        <template #field="{focus, input, blur, focused, preset, attrs, uid, label, clearable, readonly, disabled, hasError}">
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
                    @input="input"
                    @blur="blur"
                    @clear="onClear"
                >
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
        <template #details="{errorMessage, details}">
            <slot
                name="details"
                :error-message
                :details
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
