import { computed, unref } from 'vue'

import type { CBtnProps } from '../components/CBtn/CBtn'
import type { InputPreset } from '../types'

import { usePresets } from './use-presets'

export function useButtonPresets({ props }: { props: CBtnProps }) {
    const presets = usePresets<InputPreset>(props)

    return computed(() => ({
        root: props.preset ? [...(unref(presets)?.root ?? [])] : [],
        label: props.preset ? [] : [],
    }))
}
