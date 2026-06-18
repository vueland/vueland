import { computed, unref } from 'vue'

import type { CFieldProps, CFieldSlots } from '../components/CField/CField'
import { getPresetIf } from '../helpers'
import type { FieldPreset } from '../types'

import { usePresets } from './use-presets'

const EMPTY_FIELD_PRESETS = {
    root: [],
    input: [],
    label: [],
    prepend: [],
    append: [],
}

function mergePresetClasses(base?: string[], ...states: (string[] | undefined)[]): string[] {
    return [...(base ?? []), ...states.flatMap((it) => it ?? [])]
}

export function useFieldPresets({
    props,
    slots,
    attrs,
}: {
    props: CFieldProps
    slots: CFieldSlots
    attrs: Record<string, any>
}) {
    const presets = usePresets<FieldPreset>(props)

    return computed(() => {
        if (!props.preset) {
            return EMPTY_FIELD_PRESETS
        }

        const preset = unref(presets)

        const isFilled = !!props.filled
        const isPrepended = !!slots.prepend
        const isAppended = !!slots.append

        const isFocused = !!props.focused
        const isReadonly = !!attrs.readonly
        const isDisabled = !!attrs.disabled
        const hasError = !!props.error

        return {
            root: mergePresetClasses(
                preset?.root,

                getPresetIf(isFilled, preset?.filled?.root),
                getPresetIf(isPrepended, preset?.prepended?.root),
                getPresetIf(isAppended, preset?.appended?.root),

                getPresetIf(isFocused, preset?.focused?.root),
                getPresetIf(isReadonly, preset?.readonly?.root),
                getPresetIf(isDisabled, preset?.disabled?.root),
                getPresetIf(hasError, preset?.error?.root),
            ),

            input: mergePresetClasses(
                preset?.input,

                getPresetIf(isFilled, preset?.filled?.input),
                getPresetIf(isPrepended, preset?.prepended?.input),
                getPresetIf(isAppended, preset?.appended?.input),

                getPresetIf(isFocused, preset?.focused?.input),
                getPresetIf(isReadonly, preset?.readonly?.input),
                getPresetIf(isDisabled, preset?.disabled?.input),
                getPresetIf(hasError, preset?.error?.input),
            ),

            label: mergePresetClasses(
                preset?.label,

                getPresetIf(isFilled, preset?.filled?.label),
                getPresetIf(isPrepended, preset?.prepended?.label),
                getPresetIf(isAppended, preset?.appended?.label),

                getPresetIf(isFocused, preset?.focused?.label),
                getPresetIf(isReadonly, preset?.readonly?.label),
                getPresetIf(isDisabled, preset?.disabled?.label),
                getPresetIf(hasError, preset?.error?.label),
            ),

            prepend: mergePresetClasses(
                preset?.prepend,

                getPresetIf(isFilled, preset?.filled?.prepend),
                getPresetIf(isPrepended, preset?.prepended?.prepend),
                getPresetIf(isAppended, preset?.appended?.prepend),

                getPresetIf(isFocused, preset?.focused?.prepend),
                getPresetIf(isReadonly, preset?.readonly?.prepend),
                getPresetIf(isDisabled, preset?.disabled?.prepend),
                getPresetIf(hasError, preset?.error?.prepend),
            ),

            append: mergePresetClasses(
                preset?.append,

                getPresetIf(isFilled, preset?.filled?.append),
                getPresetIf(isPrepended, preset?.prepended?.append),
                getPresetIf(isAppended, preset?.appended?.append),

                getPresetIf(isFocused, preset?.focused?.append),
                getPresetIf(isReadonly, preset?.readonly?.append),
                getPresetIf(isDisabled, preset?.disabled?.append),
                getPresetIf(hasError, preset?.error?.append),
            ),
        }
    })
}
