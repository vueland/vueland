import { computed, type ComputedRef } from 'vue'

import type { Maybe } from '../types'

import { useCore } from './use-core'

export type PresetProps = {
    preset?: string
}

export function usePresets<T>(props: PresetProps): ComputedRef<Maybe<T>> {
    const core = useCore()

    return computed<Maybe<T>>(() => {
        if (!props.preset) return undefined

        return props.preset.split('.').reduce((acc, it) => acc[it], core.presets) as T
    })
}
