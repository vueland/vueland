import { computed } from 'vue'

import type { CBtnProps } from '@/components/CBtn'
import type { CButtonState } from '@/types'

import { usePresetZones, useReadPreset } from './use-presets'

const BUTTON_STATE_PRECEDENCE: readonly CButtonState[] = ['disabled']

export function useButtonPresets({ props }: { props: CBtnProps }) {
    const raw = useReadPreset(props)

    const active = (): Partial<Record<CButtonState, boolean>> => ({
        disabled: !!props.disabled,
    })

    const zones = usePresetZones<'root' | 'label', CButtonState>(
        raw,
        ['root', 'label'],
        active,
        BUTTON_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        label: zones.value.label,
    }))
}
