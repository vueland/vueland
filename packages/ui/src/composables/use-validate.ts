import {
    computed,
    type Reactive,
    shallowReactive,
    toRefs,
    unref,
    watch,
} from 'vue'

import type { InputState } from '@/components/CInput'
import type { Maybe } from '@/types'

export type ValidateResult = { valid: boolean;
    message: string }

export type ValidateFn = (value: any) => ValidateResult | Promise<ValidateResult>

export type ValidateOn = 'input' | 'blur'

export type ValidateProps = {
    rules?: ValidateFn[]
    validateOn?: ValidateOn
}

export type ValidateState = {
    errorMessage: Maybe<string>
    hasError: boolean
    validating: boolean
}

export enum InputEvents {
    INPUT = 'input',
    BLUR = 'blur',
}

export function useValidate(
    props: ValidateProps & {
        modelValue: any
        readonly?: boolean
        disabled?: boolean
    },
    state: Reactive<InputState>,
) {
    const { modelValue, validateOn } = toRefs(props)

    const errors = shallowReactive<ValidateState>({
        errorMessage: undefined,
        hasError: false,
        validating: false,
    })

    const hasRules = computed(() => (props.rules?.length ?? 0) > 0)

    function resetValidate() {
        errors.errorMessage = undefined
        errors.hasError = false
        errors.validating = false
    }

    function applyResult(result: ValidateResult) {
        errors.hasError = !result.valid
        errors.errorMessage = !result.valid ? result.message : undefined
    }

    async function validate(): Promise<boolean> {
        if (!unref(hasRules) || props.readonly || props.disabled) return true

        errors.validating = true

        try {
            for (const rule of props.rules!) {
                const result = await rule(props.modelValue)

                applyResult(result)

                if (!result.valid) return false
            }
        } finally {
            errors.validating = false
        }

        return true
    }

    if (unref(hasRules)) {
        watch(modelValue, (val) => {
            if (unref(validateOn) === InputEvents.BLUR && !!val) return
            validate()
        })

        watch(
            () => state.focused,
            (val) => {
                if (!val) validate()
            },
        )
    }

    return {
        errors,
        hasRules,
        resetValidate,
        validate,
    }
}
