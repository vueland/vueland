import { computed, unref } from 'vue'

import type { CMenuProps } from '../components/CMenu'
import type { CMenuPreset } from '../types'

import { usePresets } from './use-presets'

export function useMenuPresets({ props }: { props: CMenuProps }) {
    const presets = usePresets<CMenuPreset>(props)

    return computed(() => ({
        root: props.preset
            ? [
                ...(unref(presets)?.root ?? []),
                ...(props.modelValue ? (unref(presets)?.opened?.root ?? []) : []),
            ]
            : [],
    }))
}
