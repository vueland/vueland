export type Pattern = string | RegExp

export type MaybeArray<T> = T | T[]

export type VariantKind = 'pseudo' | 'media' | 'selector' | 'attribute'

export type VariantDefinition = {
    kind: VariantKind
    value: string | number
}

export type VariantMap = Record<string, VariantDefinition>

export type JitOptions = {
    /**
     * Файлы, которые нужно анализировать.
     *
     * По умолчанию:
     * - .vue
     * - .js
     * - .ts
     * - .jsx
     * - .tsx
     * - .html
     */
    include?: Pattern[]

    /**
     * Файлы и директории, которые нужно исключить.
     */
    exclude?: Pattern[]

    /**
     * Писать сгенерированный CSS в файл (для дебага / инспекции).
     *
     * По умолчанию CSS отдаётся виртуальным модулем `virtual:utils-jit.css`
     * без записи на диск. Включи, если хочешь видеть результат файлом.
     *
     * По умолчанию: false.
     */
    emitFile?: boolean

    /**
     * Путь к дебаг-файлу относительно Vite root (используется при emitFile).
     *
     * По умолчанию: src/.generated/utils-jit.css
     */
    outFile?: string

    /**
     * Breakpoints в px.
     * Используются для JIT-генерации адаптивных классов и для SCSS-утилит @vueland/ui.
     */
    breakpoints?: Record<string, number>

    /**
     * Пользовательские utility rules.
     */
    rules?: UtilityRule[]

    /**
     * Пользовательские variants.
     */
    variants?: VariantMap

    /**
     * Баннер в начале генерируемого CSS файла.
     */
    banner?: string

    /**
     * Писать файл даже если utilities не найдены.
     *
     * По умолчанию: true.
     */
    emitEmptyFile?: boolean

    /**
     * Выводить диагностические сообщения.
     *
     * По умолчанию: false.
     */
    debug?: boolean
}

export type ResolvedJitOptions = Required<
    Pick<
        JitOptions,
        | 'include'
        | 'exclude'
        | 'emitFile'
        | 'outFile'
        | 'breakpoints'
        | 'rules'
        | 'variants'
        | 'banner'
        | 'emitEmptyFile'
        | 'debug'
    >
>

export type ParsedToken = {
    raw: string
    variants: string[]
    utility: string
}

export type CssBody = {
    declarations: string[]
}

export type RuleMatch = {
    declarations: string[]
}

export type UtilityRule = {
    name: string
    match: (utility: string) => RuleMatch | null
}

export type DeclarationValue = string | number

export type DeclarationMap = Record<string, DeclarationValue>

export type RuleOptions = {
    /**
     * Название rule для отладки и читаемости.
     */
    name: string

    /**
     * Matcher utility-части без variants.
     *
     * Пример:
     * class: hover:bg-[#fff]
     * matcher получает: bg-[#fff]
     */
    matcher: RegExp

    /**
     * Проверка значения внутри [].
     */
    validate?: (value: string) => boolean

    /**
     * Генерация CSS declarations.
     *
     * Можно возвращать JS-style object:
     * {
     *   backgroundColor: value,
     *   zIndex: 10,
     * }
     *
     * Можно использовать CSS variables:
     * {
     *   '--vl-color': value,
     * }
     *
     * Можно вернуть готовые строки:
     * [
     *   `background-color: ${value};`
     * ]
     */
    declaration: (value: string) => DeclarationMap | string[]

    /**
     * Добавлять ли !important к object-based declarations.
     *
     * По умолчанию: true.
     *
     * Важно: если declaration возвращает string[], строки считаются уже готовым CSS
     * и important автоматически не добавляется.
     */
    important?: boolean
}
