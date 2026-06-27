import { computed } from 'vue'

import type { CFieldProps, CFieldSlots } from '@/components/CField/types'
import { isDef } from '@/helpers'
import type { CInputState } from '@/types'

import { C_INPUT_STATE_PRECEDENCE } from './use-input-presets'
import { useInjectPreset, usePresetZones } from './use-presets'

export function useFieldPresets({
    props,
    slots: _slots,
}: {
    props: CFieldProps
    slots: CFieldSlots
}) {
    // CField — потребитель: берёт набор из контекста (его провайдит host-CInput),
    // а в standalone-режиме откатывается на собственный проп `preset`.
    const raw = useInjectPreset(props)

    const active = (): Partial<Record<CInputState, boolean>> => ({
        focused: !!props.focused,
        filled: !!props.dirty || isDef(props.modelValue),
        error: !!props.error,
        disabled: !!props.disabled,
        readonly: !!props.readonly,
    })

    const zones = usePresetZones<'field' | 'input' | 'label' | 'prepend' | 'append', CInputState>(
        raw,
        ['field', 'input', 'label', 'prepend', 'append'],
        active,
        C_INPUT_STATE_PRECEDENCE,
    )

    return computed(() => ({
        // Обёртка `.c-field` читает зону `field`.
        root: zones.value.field,
        input: zones.value.input,
        label: zones.value.label,
        prepend: zones.value.prepend,
        append: zones.value.append,
    }))
}
