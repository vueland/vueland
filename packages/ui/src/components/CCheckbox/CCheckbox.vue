<script setup lang="ts" generic="T">
    import { CSelectControl } from '@/components/CSelectControl'

    import CheckboxElement from './CheckboxElement.vue'
    import type { CCheckboxProps, CCheckboxSlots } from './types'

    defineOptions({
        name: 'CCheckbox',
        inheritAttrs: false,
    })
    defineProps<CCheckboxProps<T>>()
    defineSlots<CCheckboxSlots>()
    const model = defineModel<T>()

</script>

<template>
    <c-select-control
        v-slot="{checked, toggle}"
        v-model="model"
        v-bind="$attrs"
    >
        <c-input
            :model-value="model"
            v-bind="$attrs"
            role="checkbox"
        >
            <template #field="{uid, label, attrs, hasError, readonly, disabled}">
                <checkbox-element
                    :id="uid"
                    :error="hasError"
                    :label
                    :checked
                    :readonly
                    :disabled
                    v-bind="attrs"
                    @toggle="toggle"
                >
                    <slot></slot>
                </checkbox-element>
            </template>
            <template #details="{errorMessage, details}">
                <span :key="errorMessage || details">
                    {{ errorMessage || details }}
                </span>
            </template>
        </c-input>
    </c-select-control>
</template>
