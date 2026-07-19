import {
    computed,
    type ComputedRef,
    inject,
    provide,
} from 'vue'

import { $PRESET_KEY } from '@/constants'
import { resolveStatePreset } from '@/helpers'
import type { Maybe, StatePresets } from '@/types'

import { useCore } from './use-core'

export type PresetProps = {
    preset?: string
}

type AnySet = StatePresets<string, string>

/**
 * Идёт по пути через точку в реестре пресетов. Возвращает `undefined` (и пишет
 * предупреждение), если путь не разрешился — никогда не падает на отсутствующем
 * сегменте.
 */
function resolvePresetPath(
    registry: Record<string, any> | undefined,
    path: string,
): Maybe<AnySet> {
    const found = path.split('.').reduce<any>((acc, key) => acc?.[key], registry)

    if (found === undefined) {
        console.warn(`[VuelandUI] preset "${path}" not found.`)
    }

    return found as Maybe<AnySet>
}

/**
 * READ — разрешает путь пресета из глобального реестра в набор по состояниям.
 */
export function useReadPreset(props: PresetProps): ComputedRef<Maybe<AnySet>> {
    const core = useCore()

    return computed(() => {
        if (!props.preset) {
            return undefined
        }

        return resolvePresetPath(core?.presets, props.preset)
    })
}

/**
 * PROVIDE — разрешает набор и раздаёт его поддереву компонента, чтобы вложенные
 * компоненты (например, CField внутри CInput) могли применить свои зоны без
 * прокидывания пропов и без мутации глобала.
 */
export function useProvidePreset(props: PresetProps): ComputedRef<Maybe<AnySet>> {
    const raw = useReadPreset(props)

    provide($PRESET_KEY, raw)

    return raw
}

/**
 * INJECT — берёт набор из контекста. Локальный проп `preset`, если задан,
 * перекрывает контекстный — компонент продолжает работать и standalone.
 */
export function useInjectPreset(props: PresetProps): ComputedRef<Maybe<AnySet>> {
    const injected = inject($PRESET_KEY, undefined)
    const own = useReadPreset(props)

    return computed(() => own.value ?? injected?.value)
}

/**
 * APPLY — схлопывает набор по текущему состоянию в один плоский пресет и отдаёт
 * готовые списки классов для зон, которыми владеет компонент.
 */
export function usePresetZones<Zone extends string, State extends string>(
    raw: ComputedRef<Maybe<AnySet>>,
    zones: readonly Zone[],
    active: () => Partial<Record<State, boolean>>,
    order: readonly State[],
): ComputedRef<Record<Zone, string[]>> {
    return computed(() => {
        const flat = resolveStatePreset(raw.value, active(), order)

        return zones.reduce((acc, zone) => {
            acc[zone] = flat[zone] ?? []
            return acc
        }, {} as Record<Zone, string[]>)
    })
}
