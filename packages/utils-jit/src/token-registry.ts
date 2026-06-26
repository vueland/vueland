import {
    buildCssRule,
    normalizePath,
    parseToken,
    resolveRule,
} from './core'
import type { ResolvedJitOptions, UtilityRule } from './types'

export class TokenRegistry {
    private readonly fileToTokens = new Map<string, Set<string>>()
    private readonly tokenRefCount = new Map<string, number>()
    private readonly tokenCssCache = new Map<string, string | null>()
    private readonly activeCssRules = new Map<string, string>()

    // Набор активных CSS-правил изменился с последнего consumeDirty().
    // Позволяет пропустить сериализацию и запись файла, когда ничего не менялось.
    private _dirty = false

    constructor(
        private readonly options: ResolvedJitOptions,
        private readonly rules: UtilityRule[],
    ) {}

    // Возвращает true и сбрасывает флаг, если набор правил менялся. Атомарно —
    // вызывающему не нужно отдельно читать и затем сбрасывать состояние.
    consumeDirty(): boolean {
        if (!this._dirty) {
            return false
        }

        this._dirty = false

        return true
    }

    // Один и тот же utility token может встретиться в нескольких файлах.
    // CSS-правило удаляем только когда последний файл перестал его использовать.
    private addTokenUsage(token: string): void {
        const prev = this.tokenRefCount.get(token) ?? 0

        this.tokenRefCount.set(token, prev + 1)

        if (prev === 0) {
            const cssRule = this.resolveCssRule(token)

            if (cssRule) {
                this.activeCssRules.set(token, cssRule)
                this._dirty = true
            }
        }
    }

    private removeTokenUsage(token: string): void {
        const prev = this.tokenRefCount.get(token) ?? 0

        if (prev <= 0) return

        const next = prev - 1

        if (next === 0) {
            this.tokenRefCount.delete(token)

            if (this.activeCssRules.delete(token)) {
                this._dirty = true
            }

            return
        }

        this.tokenRefCount.set(token, next)
    }

    private resolveCssRule(token: string): string | null {
        // Закешированный результат — в т.ч. null (токен заведомо без правила):
        // Map.get вернёт undefined только если ключа нет вовсе.
        const cached = this.tokenCssCache.get(token)

        if (cached !== undefined) {
            return cached
        }

        const parsed = parseToken(token)
        const cssBody = parsed && resolveRule(parsed.utility, this.rules)

        const cssRule = parsed && cssBody
            ? buildCssRule(parsed, cssBody, this.options.breakpoints, this.options.variants)
            : null

        this.tokenCssCache.set(token, cssRule)

        return cssRule
    }

    syncFile(file: string, nextTokens: Set<string>): void {
        const key = normalizePath(file)
        const prevTokens = this.fileToTokens.get(key) ?? new Set<string>()

        for (const token of prevTokens) {
            if (!nextTokens.has(token)) {
                this.removeTokenUsage(token)
            }
        }

        for (const token of nextTokens) {
            if (!prevTokens.has(token)) {
                this.addTokenUsage(token)
            }
        }

        if (nextTokens.size > 0) {
            this.fileToTokens.set(key, nextTokens)
        } else {
            this.fileToTokens.delete(key)
        }
    }

    removeFile(file: string): void {
        this.syncFile(file, new Set())
    }

    rebuildAll(files: { path: string; tokens: Set<string> }[]): void {
        this.reset()

        for (const { path, tokens } of files) {
            this.syncFile(path, tokens)
        }
    }

    buildCss(): string {
        if (!this.activeCssRules.size) {
            return this.options.emitEmptyFile
                ? '/* @vueland/utils-jit: no utilities found */\n'
                : ''
        }

        const sortedRules = Array.from(this.activeCssRules.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, cssRule]) => cssRule)

        return [this.options.banner, ...sortedRules, ''].join('\n')
    }

    get activeCount(): number {
        return this.activeCssRules.size
    }

    private reset(): void {
        this.fileToTokens.clear()
        this.tokenRefCount.clear()
        this.activeCssRules.clear()

        // Полный ребилд всегда должен привести к попытке записи (хотя бы пустого
        // плейсхолдера при первом запуске), поэтому помечаем грязным безусловно.
        this._dirty = true
    }
}
