export type KeyboardKey =
    | 'Enter'
    | 'Escape'
    | 'Backspace'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'Tab'
    | 'Home'
    | 'End'
    | 'Space'

export type KeyboardHandler = (event: KeyboardEvent) => void

export type KeyboardHandlers = Partial<Record<KeyboardKey, KeyboardHandler>>

export type UseKeyboardOptions = {
    prevent?: boolean | KeyboardKey[]
    stop?: boolean | KeyboardKey[]
}

const KEY_ALIASES: Record<string, KeyboardKey> = {
    Enter: 'Enter',
    Escape: 'Escape',
    Esc: 'Escape',
    Backspace: 'Backspace',
    ArrowUp: 'ArrowUp',
    Up: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    Down: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    Left: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Right: 'ArrowRight',
    Tab: 'Tab',
    Home: 'Home',
    End: 'End',
    ' ': 'Space',
    Space: 'Space',
    Spacebar: 'Space',
}

function normalizeKey(event: KeyboardEvent): KeyboardKey | undefined {
    return KEY_ALIASES[event.key] ?? KEY_ALIASES[event.code]
}

function shouldApply(value: boolean | KeyboardKey[] | undefined, key: KeyboardKey) {
    if (value === true) {
        return true
    }

    if (Array.isArray(value)) {
        return value.includes(key)
    }

    return false
}

export function useKeyboard(
    handlers: KeyboardHandlers,
    options: UseKeyboardOptions = {},
) {
    const onKeydown = (event: KeyboardEvent) => {
        const key = normalizeKey(event)

        if (!key || !handlers[key]) {
            return
        }

        const handler = handlers[key]!

        if (shouldApply(options.prevent, key)) {
            event.preventDefault()
        }

        if (shouldApply(options.stop, key)) {
            event.stopPropagation()
        }

        handler(event)
    }

    return {onKeydown,}
}
