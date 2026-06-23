import type { StatePresets, ZonePreset } from '@/types'

/**
 * Схлопывает набор пресетов по состояниям в один плоский пресет.
 *
 * Берётся первое активное состояние по порядку приоритета; его зоны подменяют
 * зоны `base`. Зона, которую состояние не описывает, остаётся из `base`. На
 * выходе у каждой зоны ровно один комплект классов — без склеек.
 */
export function resolveStatePreset<State extends string>(
    set: StatePresets<string, string> | undefined,
    active: Partial<Record<State, boolean>>,
    order: readonly State[],
): ZonePreset<string> {
    if (!set) {
        return {}
    }

    const current = order.find((state) => active[state])

    const statePreset = current
        ? (set as Record<string, ZonePreset<string>>)[current]
        : undefined

    return { ...set.base, ...statePreset }
}
