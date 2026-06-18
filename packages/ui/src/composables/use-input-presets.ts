import { computed, unref } from 'vue'

import type { CInputProps, InputState } from '../components/CInput/CInput'
import { getPresetOnly, getPresetValueWithFallback, type PresetCondition } from '../helpers'
import type { InputPreset } from '../types'

import { usePresets } from './use-presets'
import type { ValidateState } from './use-validate'

const EMPTY_INPUT_PRESETS = {
    root: [],
    field: undefined,
    details: [],
}

type InputPresetZone = 'root' | 'field' | 'details'

type InputPresetState = 'focused' | 'error' | 'disabled' | 'readonly'

export function useInputPresets({
    props,
    errors,
    state,
}: {
    props: CInputProps
    errors: ValidateState
    state: InputState
}) {
    const presets = usePresets<InputPreset>(props)

    return computed(() => {
        if (!props.preset) {
            return EMPTY_INPUT_PRESETS
        }

        const preset = unref(presets)

        const focused = state.focused
        const hasError = errors.hasError
        const hasErrorMessage = !!errors.errorMessage
        const disabled = !!props.disabled
        const readonly = !!props.readonly
        const isActive = !disabled && !readonly

        const interactionState: PresetCondition<InputPresetState>[] = [
            ['disabled', disabled],
            ['readonly', readonly],
            ['error', hasError],
            ['focused', focused && isActive],
        ]

        const only = (zone: InputPresetZone) => getPresetOnly(preset, zone, interactionState)

        const onlyValue = <T>(zone: InputPresetZone) =>
            getPresetValueWithFallback<T, InputPresetState>(preset, zone, interactionState)

        return {
            root: only('root'),

            field: onlyValue<string>('field'),

            details: getPresetOnly(preset, 'details', [['error', hasErrorMessage]]),
        }
    })
}
