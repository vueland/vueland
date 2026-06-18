import type { VNodeChild } from 'vue'

export type SlotFn<T> = {
    (...args: T[]): VNodeChild | VNodeChild[]
}

export type SlotsOptions<T = unknown> = Record<string, SlotFn<T>>

export function slotsFactory<T extends Record<string, any>>(
    slots: SlotsOptions<T>,
) {
    return slots
}
