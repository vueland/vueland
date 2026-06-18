import {
    computed,
    type Reactive,
    shallowReactive,
    toRefs,
    unref,
    watch,
} from 'vue'

import type { InputState } from '../components/CInput/CInput'
import type { Maybe } from '../types'

export type ValidateFn = (value: any) => {
    valid: boolean
    message: string
}

export type ValidateOn = 'input' | 'blur'

export type ValidateProps = {
    rules?: ValidateFn[]
    validateOn?: ValidateOn
}

export type ValidateState = {
    errorMessage: Maybe<string>
    hasError: boolean
}

export enum InputEvents {
    INPUT = 'input',
    BLUR = 'blur',
}

export function useValidate(
    props: ValidateProps & { modelValue: any },
    state: Reactive<InputState>,
) {
    const { modelValue, validateOn } = toRefs(props)

    const errors = shallowReactive<ValidateState>({
        errorMessage: undefined,
        hasError: false,
    })

    const hasRules = computed(() => (props.rules?.length ?? 0) > 0)

    function resetValidate() {
        errors.errorMessage = ''
        errors.hasError = false
    }

    function update(result: ReturnType<ValidateFn>) {
        errors.hasError = !result.valid
        errors.errorMessage = !result.valid ? result.message : undefined
    }

    function validate() {
        if (unref(hasRules)) {
            for (const rule of props.rules!) {
                const result = rule(props.modelValue)

                update(result)

                if (!result.valid) {
                    return false
                }
            }
        }

        return true
    }

    if (unref(hasRules)) {
        watch(modelValue, (val) => {
            // при validateOn=blur пропускаем только если значение непустое
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
