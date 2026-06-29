import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import type { Plugin } from 'vite'
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import {
    defineRule,
    isColorValue,
    isSizeValue,
    RESOLVED_VIRTUAL_CSS_ID,
    utilsJIT,
    VIRTUAL_CSS_ID,
} from '../src'

type HookPlugin = Plugin & {
    buildStart: NonNullable<Plugin['buildStart']>
    configResolved: NonNullable<Plugin['configResolved']>
    configureServer: NonNullable<Plugin['configureServer']>
    resolveId: NonNullable<Plugin['resolveId']>
    load: NonNullable<Plugin['load']>
    transform: NonNullable<Plugin['transform']>
    handleHotUpdate: NonNullable<Plugin['handleHotUpdate']>
    watchChange: NonNullable<Plugin['watchChange']>
}

type WatchChangeEvent = {
    event: 'create' | 'update' | 'delete'
}

function asHookPlugin(plugin: Plugin): HookPlugin {
    return plugin as HookPlugin
}

function callHook<T extends(...args: any[]) => any>(
    hook: T | { handler: T },
    ...args: Parameters<T>
): ReturnType<T> {
    if (typeof hook === 'function') {
        return hook(...args)
    }

    return hook.handler(...args)
}

function callConfigResolved(plugin: HookPlugin, root: string): void {
    callHook(plugin.configResolved as any, createConfig(root))
}

async function callBuildStart(plugin: HookPlugin): Promise<void> {
    await callHook(plugin.buildStart as any, {} as any)
}

async function startPlugin(plugin: HookPlugin, root: string): Promise<void> {
    callConfigResolved(plugin, root)
    await callBuildStart(plugin)
}

function callConfigureServer(plugin: HookPlugin, server: ReturnType<typeof createDevServer>): void {
    callHook(plugin.configureServer as any, server)
}

function callTransform(plugin: HookPlugin, code: string, id: string): void {
    callHook(plugin.transform as any, code, id)
}

async function callHandleHotUpdate(
    plugin: HookPlugin,
    ctx: ReturnType<typeof createHotContext>,
): Promise<void> {
    await callHook(plugin.handleHotUpdate as any, ctx)
}

function callWatchChange(plugin: HookPlugin, id: string, change: WatchChangeEvent): void {
    callHook(plugin.watchChange as any, id, change)
}

// CSS отдаётся виртуальным модулем — читаем его через load(), а не с диска.
function getCss(plugin: HookPlugin): string {
    return (callHook(plugin.load as any, RESOLVED_VIRTUAL_CSS_ID) as string | null) ?? ''
}

function createTempProject() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-jit-'))
    const src = path.join(root, 'src')

    fs.mkdirSync(src, { recursive: true })

    return {
        root,
        src,

        file(relativePath: string) {
            return path.join(root, relativePath)
        },

        write(relativePath: string, content: string) {
            const file = path.join(root, relativePath)

            fs.mkdirSync(path.dirname(file), { recursive: true })
            fs.writeFileSync(file, content, 'utf8')

            return file
        },

        read(relativePath: string) {
            return fs.readFileSync(path.join(root, relativePath), 'utf8')
        },

        exists(relativePath: string) {
            return fs.existsSync(path.join(root, relativePath))
        },

        remove() {
            fs.rmSync(root, {
                recursive: true,
                force: true,
            })
        },
    }
}

function createConfig(root: string) {
    return { root } as any
}

function createDevServer() {
    const virtualModule = { id: RESOLVED_VIRTUAL_CSS_ID, url: '/@id/__x00__virtual:utils-jit.css' }

    return {
        moduleGraph: {
            getModuleById: vi.fn((id: string) =>
                (id === RESOLVED_VIRTUAL_CSS_ID ? virtualModule : null)),
            invalidateModule: vi.fn(),
        },
        reloadModule: vi.fn(async () => {}),
        ws: { send: vi.fn() },
    } as any
}

function createHotContext(file: string, code: string) {
    return {
        file,
        read: vi.fn(async () => code),
    } as any
}

describe('plugins / base shape', () => {
    it('создаёт vite plugins с ожидаемыми хуками', () => {
        const plugin = utilsJIT()

        expect(plugin.name).toBe('utils-jit')
        expect(plugin.enforce).toBe('pre')
        expect(plugin.buildStart).toBeTypeOf('function')
        expect(plugin.configResolved).toBeTypeOf('function')
        expect(plugin.configureServer).toBeTypeOf('function')
        expect(plugin.resolveId).toBeTypeOf('function')
        expect(plugin.load).toBeTypeOf('function')
        expect(plugin.transform).toBeTypeOf('function')
        expect(plugin.handleHotUpdate).toBeTypeOf('function')
        expect(plugin.watchChange).toBeTypeOf('function')
    })
})

describe('plugins / virtual module', () => {
    it('resolveId резолвит virtual:utils-jit.css', () => {
        const plugin = asHookPlugin(utilsJIT())

        expect(callHook(plugin.resolveId as any, VIRTUAL_CSS_ID)).toBe(RESOLVED_VIRTUAL_CSS_ID)
        expect(callHook(plugin.resolveId as any, 'other')).toBeNull()
    })

    it('load отдаёт CSS только для резолвнутого id', () => {
        const plugin = asHookPlugin(utilsJIT())

        expect(callHook(plugin.load as any, 'other')).toBeNull()
        expect(callHook(plugin.load as any, RESOLVED_VIRTUAL_CSS_ID)).toBeTypeOf('string')
    })
})

describe('plugins / scss breakpoints injection', () => {
    function getAdditionalData(plugin: any): ((source: string, filename: string) => string) | undefined {
        return plugin.config?.()?.css?.preprocessorOptions?.scss?.additionalData
    }

    const MARKER_START = '// ##vueland:breakpoints:start'
    const MARKER_END = '// ##vueland:breakpoints:end'
    const MARKED_FILE = '/path/to/@vueland/ui/src/styles/utils.scss'
    const MARKED_SOURCE = `${MARKER_START}\n${MARKER_END}\n@use 'utils/transitions';\n@use 'utils/spaces';`

    it('config хук не возвращается если breakpoints не переданы', () => {
        const plugin = utilsJIT() as any

        expect(plugin.config?.()).toBeUndefined()
    })

    it('additionalData подставляет смерженные с дефолтами брейкпоинты', () => {
        // Переопределяем 3 из дефолтных — остальные (xs/xl/xxl) должны остаться,
        // иначе Sass `@use with (...)` затрёт всю карту грида.
        const plugin = utilsJIT({ breakpoints: { sm: 640, md: 768, lg: 1024 } }) as any
        const fn = getAdditionalData(plugin)!
        const result = fn(MARKED_SOURCE, MARKED_FILE)

        expect(result).toContain("@use 'maps/grids' with ($grid-breakpoints: ('xs': 0, 'sm': 640px, 'md': 768px, 'lg': 1024px, 'xl': 1920px, 'xxl': 2560px))")
        expect(result).toContain(MARKER_START)
        expect(result).toContain(MARKER_END)
    })

    it('кастомный брейкпоинт не стирает дефолтные (регрессия)', () => {
        const plugin = utilsJIT({ breakpoints: { tablet: 900 } }) as any
        const fn = getAdditionalData(plugin)!
        const result = fn(MARKED_SOURCE, MARKED_FILE)

        // Все дефолты на месте + добавлен кастомный.
        for (const bp of ["'xs': 0", "'sm': 600px", "'md': 960px", "'lg': 1280px", "'xl': 1920px", "'xxl': 2560px", "'tablet': 900px"]) {
            expect(result).toContain(bp)
        }
    })

    it('__VUELAND_BREAKPOINTS__ синхронизирован с SCSS (смерженная карта)', () => {
        const plugin = utilsJIT({ breakpoints: { tablet: 900 } }) as any
        const define = plugin.config?.()?.define?.__VUELAND_BREAKPOINTS__

        expect(JSON.parse(define)).toEqual({
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
            xxl: 2560,
            tablet: 900,
        })
    })

    it('additionalData не трогает файлы без маркера (даже с импортом grids)', () => {
        const plugin = utilsJIT({ breakpoints: { sm: 640 } }) as any
        const fn = getAdditionalData(plugin)!
        const otherSource = "@use '../maps/grids' as *;\n.foo { display: flex; }"
        const result = fn(otherSource, '/path/to/utils/_flex.scss')

        expect(result).toBe(otherSource)
    })

    it('additionalData корректно обрабатывает xs: 0', () => {
        const plugin = utilsJIT({ breakpoints: { xs: 0, sm: 640 } }) as any
        const fn = getAdditionalData(plugin)!
        const result = fn(MARKED_SOURCE, MARKED_FILE)

        expect(result).toContain("'xs': 0")
        expect(result).toContain("'sm': 640px")
    })

    it('additionalData не меняет содержимое вне размеченного блока', () => {
        const plugin = utilsJIT({ breakpoints: { sm: 640 } }) as any
        const fn = getAdditionalData(plugin)!
        const result = fn(MARKED_SOURCE, MARKED_FILE)

        expect(result).toContain("@use 'utils/transitions'")
        expect(result).toContain("@use 'utils/spaces'")
    })
})

describe('plugins / filesystem integration', () => {
    let project: ReturnType<typeof createTempProject>

    beforeEach(() => {
        project = createTempProject()
    })

    afterEach(() => {
        project.remove()
        vi.restoreAllMocks()
    })

    it('виртуальный модуль отдаёт плейсхолдер, если utilities не найдены', async () => {
        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        expect(getCss(plugin)).toBe(
            '/* @vueland/utils-jit: no utilities found */\n',
        )
    })

    it('сканирует проект и создаёт css для найденных utilities', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px] hover:bg-[#fff]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).toContain('/* @vueland/utils-jit: generated utilities */')
        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
        expect(css).toContain('.hover\\:bg-\\[\\#fff\\]:hover{background-color: #fff !important;}')
    })

    it('сортирует css rules стабильно по token', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px] ma-[8px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)
        const hIndex = css.indexOf('.h-\\[40px\\]')
        const maIndex = css.indexOf('.ma-\\[8px\\]')
        const wIndex = css.indexOf('.w-\\[100px\\]')

        expect(hIndex).toBeGreaterThan(-1)
        expect(maIndex).toBeGreaterThan(-1)
        expect(wIndex).toBeGreaterThan(-1)
        expect(hIndex).toBeLessThan(maIndex)
        expect(maIndex).toBeLessThan(wIndex)
    })

    it('emitFile пишет дебаг-файл в кастомный outFile', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(
            utilsJIT({ emitFile: true, outFile: 'src/styles/generated.css' }),
        )

        await startPlugin(plugin, project.root)

        expect(project.read('src/styles/generated.css')).toContain(
            '.w-\\[100px\\]{width: 100px !important;}',
        )
    })

    it('без emitFile дебаг-файл не пишется (только виртуальный модуль)', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        expect(project.exists('src/.generated/utils-jit.css')).toBe(false)
        expect(getCss(plugin)).toContain('.w-\\[100px\\]{width: 100px !important;}')
    })

    it('использует кастомный banner', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ banner: '/* custom banner */' }))

        await startPlugin(plugin, project.root)

        expect(getCss(plugin).startsWith('/* custom banner */')).toBe(
            true,
        )
    })

    it('отдаёт пустой css при emitEmptyFile=false', async () => {
        const plugin = asHookPlugin(utilsJIT({ emitEmptyFile: false }))

        await startPlugin(plugin, project.root)

        expect(getCss(plugin)).toBe('')
    })

    it('учитывает custom breakpoints', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="tablet:w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ breakpoints: { tablet: 900 } }))

        await startPlugin(plugin, project.root)

        expect(getCss(plugin)).toContain(
            '@media (min-width: 900px) { .tablet\\:w-\\[100px\\]{width: 100px !important;} }',
        )
    })

    it('учитывает custom selector variants', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="hocus:w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(
            utilsJIT({
                variants: {
                    hocus: {
                        kind: 'selector',
                        value: '&:hover,&:focus',
                    },
                },
            }),
        )

        await startPlugin(plugin, project.root)

        expect(getCss(plugin)).toContain(
            '.hocus\\:w-\\[100px\\]:hover,.hocus\\:w-\\[100px\\]:focus{width: 100px !important;}',
        )
    })

    it('подключает custom rules', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="surface-[#fff] size-[40px] flex-center hover:flex-center grid-cols-3 md:grid-cols-4"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(
            utilsJIT({
                rules: [
                    defineRule({
                        name: 'surface',
                        matcher: /^surface-\[(.+)\]$/,
                        validate: isColorValue,
                        declaration: (value) => ({ backgroundColor: value }),
                        important: false,
                    }),
                    defineRule({
                        name: 'size',
                        matcher: /^size-\[(.+)\]$/,
                        validate: isSizeValue,
                        declaration: (value) => ({
                            width: value,
                            height: value,
                        }),
                    }),
                    defineRule({
                        name: 'flex-center',
                        matcher: /^flex-center$/,
                        declaration: () => ({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),
                    }),
                    defineRule({
                        name: 'grid-cols',
                        matcher: /^grid-cols-(\d+)$/,
                        validate: value => Number(value) > 0,
                        declaration: value => ({
                            gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
                        }),
                    }),
                ],
            }),
        )

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).toContain('.surface-\\[\\#fff\\]{background-color: #fff;}')
        expect(css).toContain('.size-\\[40px\\]{width: 40px !important;height: 40px !important;}')
        expect(css).toContain(
            '.flex-center{display: flex !important;justify-content: center !important;align-items: center !important;}',
        )
        expect(css).toContain(
            '.hover\\:flex-center:hover{display: flex !important;justify-content: center !important;align-items: center !important;}',
        )
        expect(css).toContain(
            '.grid-cols-3{grid-template-columns: repeat(3, minmax(0, 1fr)) !important;}',
        )
        expect(css).toContain(
            '@media (min-width: 960px) { .md\\:grid-cols-4{grid-template-columns: repeat(4, minmax(0, 1fr)) !important;} }',
        )
    })

    it('не генерирует false-positive css из большого файла со строковым шумом', async () => {
        const noisyStrings = Array.from({ length: 2500 }, (_, index) => {
            return [
                `const label${index} = 'copy-token-${index}'`,
                `const event${index} = 'analytics:event:${index}'`,
                `const path${index} = '/api/v1/items/${index}'`,
                `const text${index} = 'button primary card content item ${index}'`,
                `const unknownClass${index} = 'unknown-${index} hover:unknown-${index}'`,
            ].join('\n')
        }).join('\n')

        project.write(
            'src/BigFile.ts',
            `
            ${noisyStrings}

            export const validClasses = [
                'grid-cols-3',
                'md:grid-cols-4',
                'w-[100px]',
            ]
        `,
        )

        const plugin = asHookPlugin(
            utilsJIT({
                rules: [
                    defineRule({
                        name: 'grid-cols',
                        matcher: /^grid-cols-(\d+)$/,
                        validate: value => Number(value) > 0,
                        declaration: value => ({
                            gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
                        }),
                    }),
                ],
            }),
        )

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain(
            '.grid-cols-3{grid-template-columns: repeat(3, minmax(0, 1fr)) !important;}',
        )
        expect(css).toContain(
            '@media (min-width: 960px) { .md\\:grid-cols-4{grid-template-columns: repeat(4, minmax(0, 1fr)) !important;} }',
        )
        expect(css).not.toContain('unknown-')
        expect(css).not.toContain('copy-token-')
        expect(css).not.toContain('analytics')
        expect(css.split('\n').filter((line) => line.includes('{')).length).toBe(3)
    })

    it('игнорирует excluded files при полном сканировании', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        project.write(
            'src/ignored/Hidden.vue',
            `
            <template>
                <div class="h-[999px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ exclude: [/src\/ignored/] }))

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[999px\\]')
    })

    it('игнорирует generated css file при полном сканировании', async () => {
        project.write(
            'src/.generated/utils-jit.css',
            `
            .fake { content: "w-[999px]"; }
        `,
        )

        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.w-\\[999px\\]')
    })

    it('игнорирует vite config при полном сканировании', async () => {
        project.write(
            'vite.config.ts',
            `
            defineRule({
                name: 'flex-center',
                matcher: /^flex-center$/,
                declaration: () => ({ display: 'flex' }),
            })
        `,
        )

        const plugin = asHookPlugin(
            utilsJIT({
                rules: [
                    defineRule({
                        name: 'flex-center',
                        matcher: /^flex-center$/,
                        declaration: () => ({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),
                    }),
                ],
            }),
        )

        await startPlugin(plugin, project.root)

        expect(getCss(plugin)).toBe('/* @vueland/utils-jit: no utilities found */\n')
    })

    it('transform добавляет новые utilities инкрементально', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const file = project.file('src/App.vue')

        await startPlugin(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div class="w-[100px] h-[40px]"></div>
            </template>
        `,
            file,
        )

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('transform удаляет utility, если он исчез из файла', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const file = project.file('src/App.vue')

        await startPlugin(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
            file,
        )

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[40px\\]')
    })

    it('повторный update с тем же контентом не эмитит HMR (кеш контента)', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        const changed = `
            <template>
                <div class="h-[40px]"></div>
            </template>
        `

        // Первый раз — контент новый: HMR-инвалидация.
        await callHandleHotUpdate(plugin, createHotContext(project.file('src/App.vue'), changed))
        // Второй раз тот же контент — кеш короткозамыкает, без повторного HMR.
        await callHandleHotUpdate(plugin, createHotContext(project.file('src/App.vue'), changed))

        expect(server.reloadModule).toHaveBeenCalledTimes(1)
    })

    it('transform игнорирует под-запросы (?vue&type=...) и не затирает токены файла', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        // Vite прогоняет через pre-transform под-блоки .vue с фрагментом кода.
        // style-блок без utility-классов НЕ должен удалять токены файла.
        callTransform(
            plugin,
            '.foo { color: red; }',
            `${project.file('src/App.vue')}?vue&type=style&index=0&lang.css`,
        )

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
    })

    it('не удаляет utility, если он ещё используется в другом файле', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        project.write(
            'src/Card.vue',
            `
            <template>
                <div class="w-[100px] h-[40px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div></div>
            </template>
        `,
            project.file('src/App.vue'),
        )

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('handleHotUpdate читает файл, обновляет css и инвалидирует виртуальный модуль', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        await callHandleHotUpdate(
            plugin,
            createHotContext(
                project.file('src/App.vue'),
                `
                <template>
                    <div class="h-[40px]"></div>
                </template>
            `,
            ),
        )

        const css = getCss(plugin)

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
        expect(server.reloadModule).toHaveBeenCalledTimes(1)
    })

    it('handleHotUpdate игнорирует excluded file', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ exclude: [/Hidden\.vue$/] }))
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        await callHandleHotUpdate(
            plugin,
            createHotContext(
                project.file('src/Hidden.vue'),
                `
                <template>
                    <div class="h-[40px]"></div>
                </template>
            `,
            ),
        )

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[40px\\]')
        expect(server.reloadModule).not.toHaveBeenCalled()
    })

    it('watchChange delete удаляет tokens файла', async () => {
        const file = project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        callWatchChange(plugin, file, { event: 'delete' })

        const css = getCss(plugin)

        expect(css).toBe('/* @vueland/utils-jit: no utilities found */\n')
        expect(server.reloadModule).toHaveBeenCalledTimes(1)
    })

    it('watchChange update перечитывает файл с диска', async () => {
        const file = project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        fs.writeFileSync(
            file,
            `
            <template>
                <div class="h-[40px]"></div>
            </template>
        `,
            'utf8',
        )

        callWatchChange(plugin, file, { event: 'update' })

        const css = getCss(plugin)

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('повторный buildStart пересканирует проект полностью', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        project.write(
            'src/App.vue',
            `
            <template>
                <div class="h-[40px]"></div>
            </template>
        `,
        )

        await startPlugin(plugin, project.root)

        const css = getCss(plugin)

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('не падает, если файл удалить до watchChange update', async () => {
        const file = project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        await startPlugin(plugin, project.root)

        fs.rmSync(file)

        expect(() => {
            callWatchChange(plugin, file, { event: 'update' })
        }).not.toThrow()

        const css = getCss(plugin)

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
    })

    it('не инвалидирует модуль, если css не изменился', async () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())
        const server = createDevServer()

        await startPlugin(plugin, project.root)
        callConfigureServer(plugin, server)

        callTransform(
            plugin,
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
            project.file('src/App.vue'),
        )

        expect(server.reloadModule).not.toHaveBeenCalled()
    })
})
