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

export type ValidateResult = {
    valid: boolean;
    message: string
}

export type ValidateFn = (value: any) => ValidateResult | Promise<ValidateResult>

export type ValidateOn = 'input' | 'blur'

export type ValidateProps<T = any> = {
    rules?: ValidateFn[]
    validateOn?: ValidateOn
    validationValue?: T
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
    const {
        modelValue,
        validationValue,
        validateOn,
    } = toRefs(props)

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
        errors.errorMessage = result.message
    }

    // Монотонный id запуска: результат применяет только последний validate()
    let runId = 0

    async function validate(): Promise<boolean> {
        if (!unref(hasRules) || props.disabled || props.readonly) return true

        const myRun = ++runId
        // Состояние (errors) пишет только последний запуск: устаревший результат
        // медленного правила не должен перетирать свежий. Return-значение при этом —
        // фактический результат (нужно явным вызовам, напр. submit формы).
        const isStale = () => myRun !== runId

        errors.validating = true

        try {
            for (const rule of props.rules!) {
                const result = await rule(props.validationValue ?? props.modelValue)

                if (!result.valid) {
                    if (!isStale()) applyResult(result)
                    return false
                }
            }
        } finally {
            if (!isStale()) errors.validating = false
        }

        if (!isStale()) resetValidate()
        return true
    }

    // Watchers регистрируем всегда — правила могут появиться динамически позже;
    // отсутствие правил обрабатывается внутри validate() (ранний возврат).
    watch([modelValue, validationValue], () => {
        const value = unref(validationValue) ?? unref(modelValue)

        if (unref(validateOn) === InputEvents.BLUR && !!value) return

        validate()
    })

    watch(
        () => state.focused,
        (val) => {
            if (!val) validate()
        },
    )

    return {
        errors,
        hasRules,
        resetValidate,
        validate,
    }
}
