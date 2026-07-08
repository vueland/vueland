import type { VNode } from 'vue'

/**
 * Цель клавиатурного контура. Вся клавишная семантика (стрелки, Enter,
 * typeahead) живёт внутри цели — провайдер только доставляет события.
 */
export type KeyboardTarget = {
    onKeydown(e: KeyboardEvent): void
    blur(): void
    getElement(): HTMLElement | undefined
}

// Слот отдаёт тот же контракт, что провайдится потомкам (KeyboardAPI)
export type KeyboardAPI = {
    register(target: KeyboardTarget): void
    unregister(target: KeyboardTarget): void
    forward(e: KeyboardEvent): void
    blur(): void
}

export type CKeyboardProviderSlots = {
    default(props: KeyboardAPI): VNode | VNode[]
}
