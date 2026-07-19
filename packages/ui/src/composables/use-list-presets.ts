import {
    computed,
    type ComputedRef,
    inject,
    unref,
} from 'vue'

import { $PRESET_KEY } from '@/constants'
import { resolveStatePreset } from '@/helpers'
import type {
    CInputSnapshot,
    CListState,
    CListZone,
} from '@/types'

import { type PresetProps, useReadPreset } from './use-presets'

/** Порядок схлопывания состояний листа: disabled приоритетнее readonly. */
export const C_LIST_STATE_PRECEDENCE: readonly CListState[] = ['disabled', 'readonly']

export function useListPresets({
    props,
}: {
    props: PresetProps & { disabled?: boolean, readonly?: boolean }
}): ComputedRef<Record<CListZone, string[]>> {
    // Оба источника несут один и тот же формат — CListPreset: собственный проп
    // `preset` резолвится из реестра, а контекст комбобокса (его провайдит
    // host-CInput) держит вложенный пресет листа в base-снимке. Own перекрывает
    // контекст.
    const own = useReadPreset(props)
    const injected = inject($PRESET_KEY, undefined)

    const raw = computed(() =>
        own.value ?? (resolveStatePreset(unref(injected), {}, []) as CInputSnapshot).list)

    const active = (): Partial<Record<CListState, boolean>> => ({
        disabled: !!props.disabled,
        readonly: !!props.readonly,
    })

    return computed(() => {
        const flat = resolveStatePreset(unref(raw), active(), C_LIST_STATE_PRECEDENCE)

        return {
            root: flat.root ?? [],
            option: flat.option ?? [],
        }
    })
}
