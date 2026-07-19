import {
    computed,
    inject,
    type Ref,
    unref,
} from 'vue'

import type { CheckboxElementProps } from '@/components/CCheckbox/types'
import { $PRESET_KEY } from '@/constants'
import { resolveStatePreset } from '@/helpers'
import type {
    CCheckboxState,
    CCheckboxZone,
    CInputSnapshot,
} from '@/types'

import { usePresetZones, useReadPreset } from './use-presets'

/** Порядок схлопывания состояний чекбокса: кто выше — тот текущий статус. */
export const C_CHECKBOX_STATE_PRECEDENCE: readonly CCheckboxState[] = [
    'disabled',
    'readonly',
    'error',
    'focused',
    'indeterminate',
    'checked',
]

export function useCheckboxPresets({
    props,
    focusVisible,
}: {
    props: CheckboxElementProps
    focusVisible: Ref<boolean>
}) {
    // Как и у CField: собственный проп `preset` резолвится из реестра, а
    // контекст (его провайдит host-CInput) держит вложенный пресет чекбокса
    // в base-снимке. Own перекрывает контекст.
    const own = useReadPreset(props)
    const injected = inject($PRESET_KEY, undefined)

    const raw = computed(() =>
        own.value ?? (resolveStatePreset(unref(injected), {}, []) as CInputSnapshot).checkbox)

    const active = (): Partial<Record<CCheckboxState, boolean>> => ({
        checked: !!props.checked,
        indeterminate: !!props.indeterminate,
        focused: !!unref(focusVisible),
        error: !!props.error,
        disabled: !!props.disabled,
        readonly: !!props.readonly,
    })

    return usePresetZones<CCheckboxZone, CCheckboxState>(
        raw,
        ['root', 'icon', 'label'],
        active,
        C_CHECKBOX_STATE_PRECEDENCE,
    )
}
