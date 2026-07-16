<script setup lang="ts" generic="T">
    import { CInput } from '@/components/CInput'
    import { CSelectControl } from '@/components/CSelectControl'

    import CheckboxElement from './CheckboxElement.vue'
    import type {
        CCheckboxModel,
        CCheckboxProps,
        CCheckboxSlots
    } from './types'

    defineOptions({
        name: 'CCheckbox',
        inheritAttrs: false,
    })

    defineProps<CCheckboxProps<T>>()
    defineSlots<CCheckboxSlots>()

    const model = defineModel<CCheckboxModel<T>>({ default: false })
    const indeterminate = defineModel<boolean>('indeterminate', { default: false })
</script>

<template>
    <c-select-control
        v-slot="{checked, toggle}"
        v-model="model"
        :value
        :disabled
        :readonly
    >
        <c-input
            :model-value="model"
            :disabled
            :readonly
            v-bind="$attrs"
            role="checkbox"
        >
            <template #field="{uid, label, attrs, hasError, focus, blur, focused}">
                <checkbox-element
                    :id="uid"
                    :error="hasError"
                    :label
                    :checked
                    :focused
                    :indeterminate
                    :readonly
                    :disabled
                    :size
                    v-bind="attrs"
                    @toggle="indeterminate = false; toggle()"
                    @focus="focus"
                    @blur="blur"
                >
                    <template
                        v-if="$slots.icon"
                        #icon="iconProps"
                    >
                        <slot
                            name="icon"
                            v-bind="iconProps"
                        />
                    </template>
                    <template
                        v-if="$slots.default"
                        #default="labelProps"
                    >
                        <slot v-bind="labelProps" />
                    </template>
                </checkbox-element>
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
                        class="c-checkbox__details"
                    >
                        {{ errorMessage || details }}
                    </span>
                </slot>
            </template>
        </c-input>
    </c-select-control>
</template>
