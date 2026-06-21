<script setup lang="ts">
    import { provide } from 'vue'

    import { $FORM_API_KEY } from '@/constants'

    import type {
        CFormEmits,
        CFormProps,
        CFormSlots,
        ResetFn,
        ValidatorFn,
    } from './types'

    defineOptions({ name: 'CForm' })

    defineProps<CFormProps>()

    const emit = defineEmits<CFormEmits>()

    defineSlots<CFormSlots>()

    let validators: ValidatorFn[] = []
    let resetFns: ResetFn[] = []

    function add(fn: ValidatorFn) {
        validators.push(fn)
    }

    function remove(fn: ValidatorFn) {
        validators = validators.filter((v) => v !== fn)
    }

    function addReset(fn: ResetFn) {
        resetFns.push(fn)
    }

    function removeReset(fn: ResetFn) {
        resetFns = resetFns.filter((v) => v !== fn)
    }

    async function validate(): Promise<boolean> {
        const results = await Promise.all(validators.map((fn) => fn()))
        return results.every(Boolean)
    }

    function reset() {
        resetFns.forEach((fn) => fn())
    }

    function onSubmit(event: Event) {
        emit('submit', event)
    }

    defineExpose({ validate, reset })

    provide($FORM_API_KEY, {
        add,
        remove,
        addReset,
        removeReset,
    })

</script>

<template>
    <form
        class="c-form"
        novalidate
        :aria-label="label"
        @submit.prevent="onSubmit"
    >
        <slot
            :validate
            :reset
        />
    </form>
</template>
