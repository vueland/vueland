interface TypeaheadItem {
    getText(): string
    isDisabled(): boolean
}

interface UseTypeaheadOptions {
    /** Текущий список элементов (в порядке навигации). */
    items: () => TypeaheadItem[]
    /** Индекс активного элемента или -1. */
    activeIndex: () => number
    /** Вызывается с индексом найденного элемента. */
    onMatch: (index: number) => void
    /** Сколько мс копится строка запроса между нажатиями. */
    timeout?: number
}

/**
 * Incremental search по началу текста элементов: печать символов фокусирует
 * первый подходящий enabled-элемент. Состояние запроса инкапсулировано здесь —
 * наружу торчит только обработчик клавиатуры.
 */
export function useTypeahead(options: UseTypeaheadOptions) {
    const timeout = options.timeout ?? 700

    let query = ''
    let lastAt = 0

    function normalize(value: string) {
        return value.trim().toLocaleLowerCase()
    }

    function findIndex(text: string) {
        if (!text) {
            return -1
        }

        const items = options.items()
        const start = options.activeIndex() >= 0 ? options.activeIndex() + 1 : 0

        for (let offset = 0; offset < items.length; offset += 1) {
            const index = (start + offset) % items.length

            if (items[index].isDisabled()) {
                continue
            }

            if (normalize(items[index].getText()).startsWith(text)) {
                return index
            }
        }

        return -1
    }

    function onKeydown(event: KeyboardEvent) {
        if (
            event.defaultPrevented
            || event.altKey
            || event.ctrlKey
            || event.metaKey
            || event.key.length !== 1
        ) {
            return
        }

        const now = Date.now()
        const key = normalize(event.key)

        query = now - lastAt > timeout ? key : `${query}${key}`
        lastAt = now

        // Повтор одной буквы (a, a, a) циклически перебирает элементы на эту
        // букву, а не ищет строку «aaa».
        const text = [...query].every(char => char === key) ? key : query
        let index = findIndex(text)

        if (index < 0 && text !== key) {
            query = key
            index = findIndex(key)
        }

        if (index < 0) {
            return
        }

        event.preventDefault()
        options.onMatch(index)
    }

    return { onKeydown }
}
