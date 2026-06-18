import { computed, unref } from 'vue'

import type { CMenuProps } from '../components/CMenu/CMenu'
import type { MenuPreset } from '../types'

import { usePresets } from './use-presets'

export function useMenuPresets({ props }: { props: CMenuProps }) {
    const presets = usePresets<MenuPreset>(props)

    return computed(() => ({
        root: props.preset
            ? [
                ...(unref(presets)?.root ?? []),
                ...(props.modelValue ? (unref(presets)?.opened?.root ?? []) : []),
            ]
            : [],
    }))
}
