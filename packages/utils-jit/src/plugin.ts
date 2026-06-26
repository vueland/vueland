import * as path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

import { ContentCache } from './content-cache'
import {
    DEFAULT_BREAKPOINTS,
    DEFAULT_EXCLUDE,
    DEFAULT_INCLUDE,
    DEFAULT_VARIANTS,
    shouldProcess,
    tokenize,
} from './core'
import {
    CssOutput,
    RESOLVED_VIRTUAL_CSS_ID,
    VIRTUAL_CSS_ID,
} from './css-output'
import {
    collectProjectFiles,
    isSameFile,
    readFileSafe,
} from './project-scan'
import { defaultRules } from './rules'
import { createScssBreakpointInjector } from './scss-injection'
import { TokenRegistry } from './token-registry'
import type {
    JitOptions,
    ResolvedJitOptions,
    UtilityRule,
} from './types'

function resolveOptions(options: JitOptions = {}): ResolvedJitOptions {
    return {
        include: options.include ?? DEFAULT_INCLUDE,
        exclude: [...DEFAULT_EXCLUDE, ...(options.exclude ?? [])],
        emitFile: options.emitFile ?? false,
        outFile: options.outFile ?? 'src/.generated/utils-jit.css',
        // Мерж, а НЕ replace — намеренно и обязательно. Имена брейкпоинтов
        // (xs/sm/md/lg/xl/xxl) — контракт: @vueland/ui генерит `.{name}\:*`
        // утилиты через `@each ... in $grid-breakpoints` в 6 модулях (+CGrid,
        // use-display, JIT). Эта карта инжектится в $grid-breakpoints. Replace
        // при переопределении одного значения (напр. {sm: 680}) уронил бы все
        // .md\:* / .lg\:* / ... по всей либе. Override значений и добавление
        // имён — ок; убрать дефолтные имена нельзя (и не нужно).
        breakpoints: {
            ...DEFAULT_BREAKPOINTS,
            ...(options.breakpoints ?? {}),
        },
        rules: options.rules ?? [],
        variants: {
            ...DEFAULT_VARIANTS,
            ...(options.variants ?? {}),
        },
        banner: options.banner ?? '/* @vueland/utils-jit: generated utilities */',
        emitEmptyFile: options.emitEmptyFile ?? true,
        debug: options.debug ?? false,
    }
}

export function utilsJIT(options?: JitOptions): Plugin {
    const resolvedOptions = resolveOptions(options)
    const allRules: UtilityRule[] = [...defaultRules, ...resolvedOptions.rules]
    const registry = new TokenRegistry(resolvedOptions, allRules)
    const contentCache = new ContentCache()
    const cssOutput = new CssOutput({ emitFile: resolvedOptions.emitFile })

    // Гейт по СЫРОМУ флагу: брейкпоинты инжектим в SCSS/JS только если их явно
    // задали. А значение берём из resolvedOptions (мерж с дефолтами) — Sass
    // `@use with (...)` полностью замещает карту, поэтому partial сломал бы
    // стандартные брейкпоинты. SCSS, JS и JIT должны видеть одну и ту же карту.
    const shouldInjectBreakpoints = options?.breakpoints !== undefined

    let root = process.cwd()
    let outFileAbs = ''

    function debug(message: string): void {
        if (resolvedOptions.debug) {
            console.info(`[utils-jit] ${message}`)
        }
    }

    // Отдаёт обновлённый CSS в virtual-модуль (и опц. дебаг-файл). Гейт по
    // consumeDirty: сериализация и доставка только когда набор правил менялся.
    function flushCss(notify: boolean): void {
        if (!registry.consumeDirty()) {
            return
        }

        cssOutput.update(registry.buildCss(), notify)
    }

    function rebuildAll(notify: boolean): void {
        contentCache.clear()

        const filePaths = collectProjectFiles(
            root,
            resolvedOptions.include,
            resolvedOptions.exclude,
            outFileAbs,
        )

        const files = filePaths.flatMap((filePath) => {
            const code = readFileSafe(filePath)

            if (code === null) {
                return []
            }

            // Запоминаем хэш, чтобы последующий transform по этому файлу не
            // токенизировал повторно тот же контент (двойной обход на старте).
            contentCache.changed(filePath, code)

            return [{ path: filePath, tokens: tokenize(code) }]
        })

        registry.rebuildAll(files)
        flushCss(notify)

        debug(`scanned ${filePaths.length} files, found ${registry.activeCount} utilities`)
    }

    function rebuildOne(file: string, code: string, notify: boolean): void {
        // На случай emitFile с кастомным outFile «нашего» расширения — не
        // обрабатываем собственный дебаг-вывод.
        if (isSameFile(file, outFileAbs)) {
            return
        }

        if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
            return
        }

        // Контент не менялся с прошлого раза → токены те же, работу пропускаем.
        if (!contentCache.changed(file, code)) {
            return
        }

        registry.syncFile(file, tokenize(code))
        flushCss(notify)
    }

    function removeOne(file: string, notify: boolean): void {
        if (isSameFile(file, outFileAbs)) {
            return
        }

        contentCache.delete(file)
        registry.removeFile(file)
        flushCss(notify)
    }

    return {
        name: 'utils-jit',
        enforce: 'pre',

        config() {
            // Брейкпоинты не заданы → ничего не инжектим и не определяем:
            // SCSS возьмёт дефолты из maps/grids, JS — дефолты use-display.
            if (!shouldInjectBreakpoints) return

            return {
                define: {
                    __VUELAND_BREAKPOINTS__: JSON.stringify(resolvedOptions.breakpoints),
                },
                css: {
                    preprocessorOptions: {
                        scss: {
                            additionalData: createScssBreakpointInjector(resolvedOptions.breakpoints),
                        },
                    },
                },
            }
        },

        configResolved(config: any) {
            root = config.root
            outFileAbs = path.resolve(root, resolvedOptions.outFile)
            cssOutput.setOutFile(outFileAbs)

            // Полный обход проекта — ровно один раз. configResolved срабатывает
            // до transform/импортов и в dev, и в build, поэтому CSS готов
            // заранее (его отдаст load); инкрементальные изменения дальше идут
            // через transform/handleHotUpdate/watchChange.
            rebuildAll(false)
        },

        configureServer(server: ViteDevServer) {
            cssOutput.setServer(server)
        },

        resolveId(id: string) {
            return id === VIRTUAL_CSS_ID ? RESOLVED_VIRTUAL_CSS_ID : null
        },

        load(id: string) {
            return id === RESOLVED_VIRTUAL_CSS_ID ? cssOutput.css : null
        },

        transform(code: string, id: string) {
            // Под-запросы (?vue&type=..., ?raw, ?worker) несут лишь ФРАГМЕНТ
            // модуля — токенизировать их нельзя, иначе они затрут токены полного
            // файла. Полный файл приходит по каноническому id (без query) и при
            // изменениях через handleHotUpdate/watchChange.
            if (id.includes('?')) {
                return null
            }

            rebuildOne(id, code, false)

            return null
        },

        async handleHotUpdate(ctx) {
            const { file } = ctx

            if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
                return
            }

            const code = await ctx.read()

            rebuildOne(file, code, true)
        },

        watchChange(id: string, change) {
            const file = id.split('?')[0]

            if (!file) {
                return
            }

            if (change.event === 'delete') {
                removeOne(file, true)
                return
            }

            if (!shouldProcess(file, resolvedOptions.include, resolvedOptions.exclude)) {
                return
            }

            const code = readFileSafe(file)

            if (code !== null) {
                rebuildOne(file, code, true)
            }
        },
    }
}
