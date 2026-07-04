import { computed } from 'vue'

import type { CBtnProps, CBtnState } from '@/components/CBtn'
import type { CButtonState } from '@/types'

import { usePresetZones, useReadPreset } from './use-presets'

/** disabled глушит всё; у занятой кнопки loading важнее взаимодействий. */
const BUTTON_STATE_PRECEDENCE: readonly CButtonState[] = [
    'disabled',
    'loading',
    'active',
    'focused',
]

export function useButtonPresets({ props, state }: { props: CBtnProps; state: CBtnState }) {
    const raw = useReadPreset(props)

    const active = (): Partial<Record<CButtonState, boolean>> => {
        const disabled = props.disabled
        const loading = props.loading

        return {
            disabled,
            loading,
            active: state.active && !disabled && !loading,
            focused: state.focused && !disabled && !loading,
        }
    }

    const zones = usePresetZones<'root' | 'label' | 'loader', CButtonState>(
        raw,
        ['root', 'label', 'loader'],
        active,
        BUTTON_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        label: zones.value.label,
        loader: zones.value.loader,
    }))
}
