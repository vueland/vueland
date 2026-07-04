// Сырое CSS-значение цвета: #hex, rgb()/hsl()/oklch()/..., var()
const RAW_COLOR_RE = /^(?:#|(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(|var\()/

/**
 * Превращает значение color-пропа в utility-класс.
 *
 * - 'red-lighten-2' → 'bg-red-lighten-2' / 'text-red-lighten-2' (статические утилиты палитры)
 * - '#fa5a5a', rgb(...), var(...) → 'bg-[#fa5a5a]' / 'text-[#fa5a5a]' (arbitrary-классы utils-jit)
 */
export function toColorClass(prefix: 'bg' | 'text', color?: string): string | undefined {
    if (!color) {
        return undefined
    }

    const value = color.trim()

    if (RAW_COLOR_RE.test(value)) {
        // Пробелы внутри rgb(...) сломали бы class-атрибут; сканер utils-jit
        // нормализует значения color-атрибутов точно так же
        const compact = value.replace(/\s+/g, '')

        return `${prefix}-[${compact}]`
    }

    return `${prefix}-${value}`
}
