import { computed, unref } from 'vue'

import type { CInputProps, InputState } from '@/components/CInput'
import type { CFieldPreset, CInputPreset } from '@/types'

import { useCore } from './use-core'
import { usePresets } from './use-presets'
import type { ValidateState } from './use-validate'

const EMPTY_INPUT_PRESETS = {
    root: [] as string[],
    field: undefined as string | undefined,
    details: [] as string[],
}

function mergeClasses(...args: (string[] | undefined)[]): string[] {
    return args.flatMap((it) => it ?? [])
}

function resolveZone(
    preset: Record<string, any> | undefined,
    zone: string,
    primaryState: string | undefined,
): string[] {
    if (!primaryState) return (preset?.[zone] ?? []) as string[]
    const stateZone = preset?.[primaryState]?.[zone]
    if (stateZone !== undefined) return stateZone as string[]
    return []
}


const FIELD_PRESET_SIMPLE_STATES = ['focused', 'filled', 'prepended', 'appended'] as const
const FIELD_PRESET_COMPOUND_STATES = ['error', 'disabled', 'readonly'] as const

function pickFieldZone(s: { label?: string[];
    input?: string[] } | undefined) {
    return s ? {
        label: s.label,
        input: s.input,
    } : undefined

}

function buildFieldPreset(preset: CInputPreset): CFieldPreset {
    const simple = Object.fromEntries(
        FIELD_PRESET_SIMPLE_STATES.map((key) => [key, pickFieldZone(preset[key])]),
    )

    const compound = Object.fromEntries(
        FIELD_PRESET_COMPOUND_STATES.map((key) => {
            const s = preset[key]
            if (!s) return [key, undefined]
            return [key, {
                ...pickFieldZone(s),
                focused: pickFieldZone(s.focused),
                filled: pickFieldZone(s.filled),
            }]
        }),
    )

    return {
        label: preset.label,
        input: preset.input,
        ...simple,
        ...compound,
    }
}

function setNestedValue(obj: Record<string, any>, dotPath: string, value: any): void {
    const parts = dotPath.split('.')
    let current = obj
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {}
        current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = value
}

export function useInputPresets({
    props,
    errors,
    state,
}: {
    props: CInputProps
    errors: ValidateState
    state: InputState
}) {
    const core = useCore()
    const presets = usePresets<CInputPreset>(props)

    if (props.preset && core) {
        const rawPreset = props.preset
            .split('.')
            .reduce<any>((acc, key) => acc?.[key], core.presets) as CInputPreset | undefined

        if (rawPreset) {
            setNestedValue(core.presets, `__field.${props.preset}`, buildFieldPreset(rawPreset))
        }
    }

    return computed(() => {
        if (!props.preset) return EMPTY_INPUT_PRESETS

        const preset = unref(presets)

        const focused = state.focused
        const hasError = errors.hasError
        const hasErrorMessage = !!errors.errorMessage
        const disabled = !!props.disabled
        const readonly = !!props.readonly
        const isActive = !disabled && !readonly
        const isFocused = focused && isActive

        const primaryState =
            disabled ? 'disabled' :
                readonly ? 'readonly' :
                    hasError ? 'error' :
                        isFocused ? 'focused' :
                            undefined

        return {
            root: mergeClasses(
                resolveZone(preset, 'root', primaryState),
                hasError && isFocused ? preset?.error?.focused?.root : undefined,
                disabled && isFocused ? preset?.disabled?.focused?.root : undefined,
                readonly && isFocused ? preset?.readonly?.focused?.root : undefined,
            ),
            field: `__field.${props.preset}`,
            details: mergeClasses(
                resolveZone(preset, 'details', hasErrorMessage ? 'error' : undefined),
            ),
        }
    })
}
