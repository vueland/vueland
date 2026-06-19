<script setup lang="ts">
    import { provide } from 'vue'

    import { $FORM_API_KEY } from '../../constants'

    import type { ValidatorFn } from './types'

    defineOptions({
        name: 'CForm',
    })

    let validators: ValidatorFn[] = []

    function add(fn: ValidatorFn) {
        validators.push(fn)
    }

    function remove(fn: ValidatorFn) {
        validators = validators.filter((v) => v !== fn)
    }

    async function validate(): Promise<boolean> {
        return validators.map(fn => fn()).every(v => v)
    }

    defineExpose({
        validate
    })

    provide($FORM_API_KEY, {
        add,
        remove
    })

</script>

<template>
    <form
        class="c-form"
        @submit.prevent
    >
        <slot :validate />
    </form>
</template>
