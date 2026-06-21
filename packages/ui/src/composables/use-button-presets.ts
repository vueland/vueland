import { computed, unref } from 'vue'

import type { CBtnProps } from '@/components/CBtn'
import type { CInputPreset } from '@/types'

import { usePresets } from './use-presets'

export function useButtonPresets({ props }: { props: CBtnProps }) {
    const presets = usePresets<CInputPreset>(props)

    return computed(() => ({
        root: props.preset ? [...(unref(presets)?.root ?? [])] : [],
        label: props.preset ? [] : [],
    }))
}
