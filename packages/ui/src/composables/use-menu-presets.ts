import {
    computed,
    type ComputedRef,
    inject,
    type Ref,
    unref,
} from 'vue'

import { $PRESET_KEY } from '@/constants'
import { resolveStatePreset } from '@/helpers'
import type { CInputSnapshot, CMenuState } from '@/types'

import { type PresetProps, useReadPreset } from './use-presets'


/** Закрытое меню не видно — opened приоритетнее. */
export const C_MENU_STATE_PRECEDENCE: readonly CMenuState[] = ['opened', 'closed']

export function useMenuPresets({
    props,
    opened,
}: {
    props: PresetProps
    opened: Ref<boolean>
}): ComputedRef<string[]> {
    // Оба источника несут один и тот же формат — CMenuPreset: собственный проп
    // `preset` резолвится из реестра, а контекст комбобокса (его провайдит
    // host-CInput) держит вложенный пресет меню в base-снимке. Own перекрывает
    // контекст.
    const own = useReadPreset(props)
    const injected = inject($PRESET_KEY, undefined)

    const raw = computed(() =>
        own.value ?? (resolveStatePreset(unref(injected), {}, []) as CInputSnapshot).menu)

    const active = (): Partial<Record<CMenuState, boolean>> => ({
        opened: unref(opened),
        closed: !unref(opened),
    })

    return computed(() => resolveStatePreset(unref(raw), active(), C_MENU_STATE_PRECEDENCE).root ?? [])
}
