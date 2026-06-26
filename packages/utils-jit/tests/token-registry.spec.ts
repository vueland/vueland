import {
    describe,
    expect,
    it,
} from 'vitest'

import { DEFAULT_BREAKPOINTS, DEFAULT_VARIANTS } from '../src/core'
import { defaultRules } from '../src/rules'
import { TokenRegistry } from '../src/token-registry'
import type { ResolvedJitOptions } from '../src/types'

function makeOptions(overrides: Partial<ResolvedJitOptions> = {}): ResolvedJitOptions {
    return {
        include: [],
        exclude: [],
        outFile: 'src/.generated/utils-jit.css',
        breakpoints: DEFAULT_BREAKPOINTS,
        rules: [],
        variants: DEFAULT_VARIANTS,
        banner: '/* banner */',
        emitEmptyFile: true,
        debug: false,
        ...overrides,
    }
}

function makeRegistry(overrides: Partial<ResolvedJitOptions> = {}): TokenRegistry {
    return new TokenRegistry(makeOptions(overrides), defaultRules)
}

// ─── syncFile ─────────────────────────────────────────────────────────────────

describe('TokenRegistry / syncFile', () => {
    it('добавляет токены и помечает registry как dirty', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))

        expect(registry.consumeDirty()).toBe(true)
    })

    it('генерирует css для известных токенов', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]', 'h-[40px]']))

        const css = registry.buildCss()

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('не генерирует css для неизвестных токенов', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['unknown-[100px]']))

        const css = registry.buildCss()

        expect(css).not.toContain('unknown')
    })

    it('удаляет css когда токен исчезает из файла', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]', 'h-[40px]']))
        registry.consumeDirty()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))

        expect(registry.consumeDirty()).toBe(true)
        expect(registry.buildCss()).toContain('.w-\\[100px\\]')
        expect(registry.buildCss()).not.toContain('.h-\\[40px\\]')
    })

    it('не помечает dirty, если набор токенов не изменился', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.consumeDirty()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))

        expect(registry.consumeDirty()).toBe(false)
    })

    it('удаляет fileToTokens когда nextTokens пустой', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.syncFile('src/App.vue', new Set())

        expect(registry.activeCount).toBe(0)
    })
})

// ─── ref-count: два файла ──────────────────────────────────────────────────────

describe('TokenRegistry / ref-count', () => {
    it('не удаляет css-правило если токен ещё используется другим файлом', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.syncFile('src/Card.vue', new Set(['w-[100px]', 'h-[40px]']))

        // App.vue перестаёт использовать w-[100px]
        registry.syncFile('src/App.vue', new Set())

        const css = registry.buildCss()

        expect(css).toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]')
    })

    it('удаляет css-правило когда последний файл перестал использовать токен', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.syncFile('src/Card.vue', new Set(['w-[100px]']))

        registry.syncFile('src/App.vue', new Set())
        registry.syncFile('src/Card.vue', new Set())

        expect(registry.buildCss()).not.toContain('.w-\\[100px\\]')
        expect(registry.activeCount).toBe(0)
    })
})

// ─── removeFile ───────────────────────────────────────────────────────────────

describe('TokenRegistry / removeFile', () => {
    it('удаляет все токены файла', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]', 'h-[40px]']))
        registry.consumeDirty()

        registry.removeFile('src/App.vue')

        expect(registry.consumeDirty()).toBe(true)
        expect(registry.activeCount).toBe(0)
    })

    it('не удаляет токены другого файла', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.syncFile('src/Card.vue', new Set(['h-[40px]']))

        registry.removeFile('src/App.vue')

        expect(registry.buildCss()).not.toContain('.w-\\[100px\\]')
        expect(registry.buildCss()).toContain('.h-\\[40px\\]')
    })

    it('не падает при удалении файла, которого не было', () => {
        const registry = makeRegistry()

        expect(() => registry.removeFile('src/Missing.vue')).not.toThrow()
        expect(registry.consumeDirty()).toBe(false)
    })

    it('не удаляет токен который используется другим файлом', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.syncFile('src/Card.vue', new Set(['w-[100px]']))

        registry.removeFile('src/App.vue')

        expect(registry.buildCss()).toContain('.w-\\[100px\\]')
    })
})

// ─── rebuildAll ───────────────────────────────────────────────────────────────

describe('TokenRegistry / rebuildAll', () => {
    it('строит css из переданных файлов', () => {
        const registry = makeRegistry()

        registry.rebuildAll([
            { path: 'src/App.vue', tokens: new Set(['w-[100px]']) },
            { path: 'src/Card.vue', tokens: new Set(['h-[40px]']) },
        ])

        const css = registry.buildCss()

        expect(css).toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]')
    })

    it('сбрасывает предыдущее состояние', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))
        registry.rebuildAll([
            { path: 'src/Card.vue', tokens: new Set(['h-[40px]']) },
        ])

        const css = registry.buildCss()

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]')
    })

    it('помечает dirty после rebuildAll', () => {
        const registry = makeRegistry()

        registry.rebuildAll([])

        expect(registry.consumeDirty()).toBe(true)
    })

    it('обрабатывает одинаковый токен из нескольких файлов без дублирования css', () => {
        const registry = makeRegistry()

        registry.rebuildAll([
            { path: 'src/App.vue', tokens: new Set(['w-[100px]']) },
            { path: 'src/Card.vue', tokens: new Set(['w-[100px]']) },
        ])

        const css = registry.buildCss()
        const count = (css.match(/\.w-\\\[100px\\\]/g) ?? []).length

        expect(count).toBe(1)
    })
})

// ─── buildCss ─────────────────────────────────────────────────────────────────

describe('TokenRegistry / buildCss', () => {
    it('возвращает заглушку при emitEmptyFile=true и нет utilities', () => {
        const registry = makeRegistry({ emitEmptyFile: true })

        expect(registry.buildCss()).toBe('/* @vueland/utils-jit: no utilities found */\n')
    })

    it('возвращает пустую строку при emitEmptyFile=false и нет utilities', () => {
        const registry = makeRegistry({ emitEmptyFile: false })

        expect(registry.buildCss()).toBe('')
    })

    it('начинается с banner', () => {
        const registry = makeRegistry({ banner: '/* my banner */' })

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))

        expect(registry.buildCss().startsWith('/* my banner */')).toBe(true)
    })

    it('сортирует правила по токену', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]', 'h-[40px]', 'ma-[8px]']))

        const css = registry.buildCss()
        const hIdx = css.indexOf('.h-\\[40px\\]')
        const maIdx = css.indexOf('.ma-\\[8px\\]')
        const wIdx = css.indexOf('.w-\\[100px\\]')

        expect(hIdx).toBeLessThan(maIdx)
        expect(maIdx).toBeLessThan(wIdx)
    })
})

// ─── consumeDirty ─────────────────────────────────────────────────────────────

describe('TokenRegistry / consumeDirty', () => {
    it('возвращает true один раз и сбрасывает флаг', () => {
        const registry = makeRegistry()

        registry.syncFile('src/App.vue', new Set(['w-[100px]']))

        expect(registry.consumeDirty()).toBe(true)
        expect(registry.consumeDirty()).toBe(false)
    })

    it('возвращает false без изменений', () => {
        const registry = makeRegistry()

        expect(registry.consumeDirty()).toBe(false)
    })
})
