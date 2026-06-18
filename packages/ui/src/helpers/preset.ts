export type PresetRecord = Record<string, any>

export type PresetCondition<State extends string> = [state: State, active: boolean]

export function normalizePresetClasses(value?: string[] | null | false): string[] {
    if (!value) {
        return []
    }

    return value.filter(Boolean)
}

export function getPresetValueWithFallback<T, State extends string>(
    preset: PresetRecord | undefined,
    zone: string,
    conditions: PresetCondition<State>[],
): T | undefined {
    const state = conditions.find(([, active]) => active)?.[0]

    if (!state) {
        return preset?.[zone] as T | undefined
    }

    return (preset?.[state]?.[zone] ?? preset?.[zone]) as T | undefined
}

export function getPresetOnly<State extends string>(
    preset: PresetRecord | undefined,
    zone: string,
    conditions: PresetCondition<State>[],
): string[] {
    const state = conditions.find(([, active]) => active)?.[0]

    if (!state) {
        return normalizePresetClasses(preset?.[zone] as string[])
    }

    return normalizePresetClasses(preset?.[state]?.[zone] as string[])
}

export function getPresetIf(condition: boolean, classes: string[] = []): string[] {
    return condition ? normalizePresetClasses(classes) : []
}

export function getPresetValueOnly<T, State extends string>(
    preset: PresetRecord | undefined,
    zone: string,
    conditions: PresetCondition<State>[],
): T | undefined {
    const state = conditions.find(([, active]) => active)?.[0]

    if (!state) {
        return preset?.[zone] as T | undefined
    }

    return preset?.[state]?.[zone] as T | undefined
}
