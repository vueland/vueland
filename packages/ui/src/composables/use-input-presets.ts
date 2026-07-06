import { computed } from 'vue'

import type { CInputProps, InputState } from '@/components/CInput'
import { isDef } from '@/helpers'
import type { CInputState } from '@/types'

import { usePresetZones, useProvidePreset } from './use-presets'
import type { ValidateState } from './use-validate'

/** Порядок схлопывания состояний инпута: кто выше — тот текущий статус. */
export const C_INPUT_STATE_PRECEDENCE: readonly CInputState[] = [
    'disabled',
    'readonly',
    'error',
    'focused',
    'filled',
]

export function useInputPresets({
    props,
    errors,
    state,
}: {
    props: CInputProps
    errors: ValidateState
    state: InputState
}) {
    // CInput — источник истины: он разрешает набор и провайдит его в поддерево.
    // Вложенные пресеты (field/menu/list) из base-снимка потребители берут сами.
    const raw = useProvidePreset(props)

    const active = (): Partial<Record<CInputState, boolean>> => {
        const disabled = !!props.disabled
        const readonly = !!props.readonly

        return {
            focused: state.focused && !disabled && !readonly,
            filled: isDef(props.modelValue),
            error: errors.hasError,
            disabled,
            readonly,
        }
    }

    const zones = usePresetZones<'root' | 'details', CInputState>(
        raw,
        ['root', 'details'],
        active,
        C_INPUT_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        details: zones.value.details,
        field: raw.value,
    }))
}
