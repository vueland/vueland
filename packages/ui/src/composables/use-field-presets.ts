import {
    computed,
    inject,
    unref,
} from 'vue'

import type { CFieldProps } from '@/components/CField/types'
import { $PRESET_KEY } from '@/constants'
import { isDef, resolveStatePreset } from '@/helpers'
import type {
    CFieldState,
    CFieldZone,
    CInputSnapshot,
} from '@/types'

import { usePresetZones, useReadPreset } from './use-presets'

/** Порядок схлопывания состояний поля: кто выше — тот текущий статус. */
export const C_FIELD_STATE_PRECEDENCE: readonly CFieldState[] = [
    'disabled',
    'readonly',
    'error',
    'focused',
    'filled',
]

export function useFieldPresets({ props }: { props: CFieldProps }) {
    // Оба источника несут один и тот же формат — CFieldPreset: собственный
    // проп `preset` резолвится из реестра, а контекст (его провайдит
    // host-CInput) держит вложенный пресет поля в base-снимке. Own перекрывает
    // контекст.
    const own = useReadPreset(props)
    const injected = inject($PRESET_KEY, undefined)

    const raw = computed(() =>
        own.value ?? (resolveStatePreset(unref(injected), {}, []) as CInputSnapshot).field)

    const active = (): Partial<Record<CFieldState, boolean>> => ({
        focused: !!props.focused,
        filled: !!props.dirty || isDef(props.modelValue),
        error: !!props.error,
        disabled: !!props.disabled,
        readonly: !!props.readonly,
    })

    const zones = usePresetZones<CFieldZone, CFieldState>(
        raw,
        ['root', 'input', 'label', 'prepend', 'append'],
        active,
        C_FIELD_STATE_PRECEDENCE,
    )

    return zones
}
