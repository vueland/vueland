import { computed } from 'vue'

import type { CProgressCircularProps } from '@/components/CProgressCircular'
import type { CProgressLinearProps } from '@/components/CProgressLinear'
import type { CProgressState } from '@/types'

import { usePresetZones, useReadPreset } from './use-presets'

/** indeterminate приоритетнее complete: у бесконечного прогресса нет конца. */
const PROGRESS_STATE_PRECEDENCE: readonly CProgressState[] = ['indeterminate', 'complete']

function activeStates(
    props: CProgressCircularProps | CProgressLinearProps,
): Partial<Record<CProgressState, boolean>> {
    return {
        indeterminate: !!props.indeterminate,
        complete: Number(props.value ?? 0) >= 100,
    }
}

export function useProgressCircularPresets({ props }: { props: CProgressCircularProps }) {
    const raw = useReadPreset(props)

    const zones = usePresetZones<'root' | 'underlay' | 'overlay' | 'info', CProgressState>(
        raw,
        ['root', 'underlay', 'overlay', 'info'],
        () => activeStates(props),
        PROGRESS_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        underlay: zones.value.underlay,
        overlay: zones.value.overlay,
        info: zones.value.info,
    }))
}

export function useProgressLinearPresets({ props }: { props: CProgressLinearProps }) {
    const raw = useReadPreset(props)

    const zones = usePresetZones<'root' | 'background' | 'buffer' | 'bar', CProgressState>(
        raw,
        ['root', 'background', 'buffer', 'bar'],
        () => activeStates(props),
        PROGRESS_STATE_PRECEDENCE,
    )

    return computed(() => ({
        root: zones.value.root,
        background: zones.value.background,
        buffer: zones.value.buffer,
        bar: zones.value.bar,
    }))
}
