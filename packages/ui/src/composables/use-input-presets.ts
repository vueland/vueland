import { computed } from 'vue'

import type { CInputProps, InputState } from '@/components/CInput'
import { CINPUT_STATE_PRECEDENCE, isDef } from '@/helpers'
import type { CInputState } from '@/types'

import { usePresetZones, useProvidePreset } from './use-presets'
import type { ValidateState } from './use-validate'

export function useInputPresets({
    props,
    errors,
    state,
}: {
    props: CInputProps
    errors: ValidateState
    state: InputState
}) {
    // CInput — источник истины: он разрешает набор и провайдит его в поддерево
    // поля (CField его инжектит).
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
        CINPUT_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        details: zones.value.details,
        field: raw.value,
    }))
}
