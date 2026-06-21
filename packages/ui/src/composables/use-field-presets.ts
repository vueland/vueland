import {
    computed,
    type ComputedRef,
    unref,
} from 'vue'

import type { CFieldProps, CFieldSlots } from '@/components'
import { getPresetIf } from '@/helpers'
import type { CFieldPreset, CFieldZone } from '@/types'

import { usePresets } from './use-presets'

const EMPTY_FIELD_PRESETS = {
    root: [] as string[],
    input: [] as string[],
    label: [] as string[],
}

type FieldZoneKey = keyof CFieldZone

function mergePresetClasses(...args: (string[] | undefined)[]): string[] {
    return args.flatMap((it) => it ?? [])
}

function resolveInteraction(
    preset: CFieldPreset | undefined,
    zone: FieldZoneKey,
    isDisabled: boolean,
    isReadonly: boolean,
    hasError: boolean,
    isFocused: boolean,
    isFilled: boolean,
): string[] {
    const base = preset?.[zone]

    if (isDisabled) {
        const s = preset?.disabled
        if (isFocused && s?.focused?.[zone]) return s.focused[zone]!
        if (isFilled && s?.filled?.[zone]) return s.filled[zone]!
        // passive state — no fallback to base if state zone not defined
        return s?.[zone] ?? []
    }
    if (isReadonly) {
        const s = preset?.readonly
        if (isFocused && s?.focused?.[zone]) return s.focused[zone]!
        if (isFilled && s?.filled?.[zone]) return s.filled[zone]!
        // passive state — no fallback to base if state zone not defined
        return s?.[zone] ?? []
    }
    if (hasError) {
        const s = preset?.error
        if (isFocused && s?.focused?.[zone]) return s.focused[zone]!
        if (isFilled && s?.filled?.[zone]) return s.filled[zone]!
        return s?.[zone] ?? []
    }
    if (isFocused) {
        return preset?.focused?.[zone] ?? []
    }
    if (isFilled) {
        return preset?.filled?.[zone] ?? []
    }

    return base ?? []
}

export function useFieldPresets({
    props,
    slots,
    hasValue,
}: {
    props: CFieldProps
    slots: CFieldSlots
    hasValue: ComputedRef<boolean>
}) {
    const presets = usePresets<CFieldPreset>(props)

    return computed(() => {
        if (!props.preset) {
            return EMPTY_FIELD_PRESETS
        }

        const preset = unref(presets)

        const isFilled = unref(hasValue)
        const isPrepended = !!slots.prepend
        const isAppended = !!slots.append

        const isFocused = !!props.focused
        const isReadonly = !!props.readonly
        const isDisabled = !!props.disabled
        const hasError = !!props.error

        const resolve = (zone: FieldZoneKey) =>
            resolveInteraction(preset, zone, isDisabled, isReadonly, hasError, isFocused, isFilled)

        return {
            root: mergePresetClasses(
                resolve('root'),
                getPresetIf(isPrepended, preset?.prepended?.root),
                getPresetIf(isAppended, preset?.appended?.root),
            ),
            input: mergePresetClasses(
                resolve('input'),
                getPresetIf(isPrepended, preset?.prepended?.input),
                getPresetIf(isAppended, preset?.appended?.input),
            ),
            label: mergePresetClasses(
                resolve('label'),
                getPresetIf(isPrepended, preset?.prepended?.label),
                getPresetIf(isAppended, preset?.appended?.label),
            ),
        }
    })
}
