import {
    computed,
    type ComputedRef,
    inject,
    provide,
    unref,
} from 'vue'

import type { DatePickerView } from '@/components/CDatePicker/types'
import { $DATE_PICKER_PRESET_KEY, $PRESET_KEY } from '@/constants'
import { resolveStatePreset } from '@/helpers'
import type {
    CDatePickerState,
    CDatePickerZone,
    CInputSnapshot,
} from '@/types'

import {
    type PresetProps,
    usePresetZones,
    useReadPreset,
} from './use-presets'

/** Состояния пикера — активная вьюха; взаимоисключающие, порядок формальный. */
export const C_DATE_PICKER_STATE_PRECEDENCE: readonly CDatePickerState[] = ['dates', 'months', 'years']

export const C_DATE_PICKER_ZONES: readonly CDatePickerZone[] = ['root', 'display', 'header', 'week', 'cell']

export function useDatePickerPresets({
    props,
    view,
}: {
    props: PresetProps
    view: () => DatePickerView
}): ComputedRef<Record<CDatePickerZone, string[]>> {
    // Оба источника несут один и тот же формат — CDatePickerPreset: собственный
    // проп `preset` резолвится из реестра, а контекст (его провайдит host-CInput
    // внутри CDateInput) держит вложенный пресет пикера в base-снимке. Own
    // перекрывает контекст.
    const own = useReadPreset(props)
    const injected = inject($PRESET_KEY, undefined)

    const raw = computed(() =>
        own.value ?? (resolveStatePreset(unref(injected), {}, []) as CInputSnapshot).datePicker)

    const active = (): Partial<Record<CDatePickerState, boolean>> => ({
        dates: view() === 'dates',
        months: view() === 'months',
        years: view() === 'years',
    })

    const zones = usePresetZones<CDatePickerZone, CDatePickerState>(
        raw,
        C_DATE_PICKER_ZONES,
        active,
        C_DATE_PICKER_STATE_PRECEDENCE,
    )

    // Ячейки и строка недели рендерятся во вьюхах — раздаём готовые зоны поддереву
    provide($DATE_PICKER_PRESET_KEY, zones)

    return zones
}
