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
    utilsJIT,
} from '../src'

type HookPlugin = Plugin & {
    configResolved: NonNullable<Plugin['configResolved']>
    configureServer: NonNullable<Plugin['configureServer']>
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
    return {
        watcher: {
            add: vi.fn(),
            emit: vi.fn(),
        },
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
        expect(plugin.configResolved).toBeTypeOf('function')
        expect(plugin.configureServer).toBeTypeOf('function')
        expect(plugin.transform).toBeTypeOf('function')
        expect(plugin.handleHotUpdate).toBeTypeOf('function')
        expect(plugin.watchChange).toBeTypeOf('function')
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

    it('создаёт пустой css файл после configResolved, если utilities не найдены', () => {
        const plugin = asHookPlugin(utilsJIT())

        callConfigResolved(plugin, project.root)

        expect(project.read('src/.generated/utils-jit.css')).toBe(
            '/* @vueland/utils-jit: no utilities found */\n',
        )
    })

    it('сканирует проект и создаёт css для найденных utilities', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px] hover:bg-[#fff]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('/* @vueland/utils-jit: generated utilities */')
        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
        expect(css).toContain('.hover\\:bg-\\[\\#fff\\]:hover{background-color: #fff !important;}')
    })

    it('сортирует css rules стабильно по token', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px] h-[40px] ma-[8px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')
        const hIndex = css.indexOf('.h-\\[40px\\]')
        const maIndex = css.indexOf('.ma-\\[8px\\]')
        const wIndex = css.indexOf('.w-\\[100px\\]')

        expect(hIndex).toBeGreaterThan(-1)
        expect(maIndex).toBeGreaterThan(-1)
        expect(wIndex).toBeGreaterThan(-1)
        expect(hIndex).toBeLessThan(maIndex)
        expect(maIndex).toBeLessThan(wIndex)
    })

    it('использует кастомный outFile', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ outFile: 'src/styles/generated.css' }))

        callConfigResolved(plugin, project.root)

        expect(project.read('src/styles/generated.css')).toContain(
            '.w-\\[100px\\]{width: 100px !important;}',
        )
    })

    it('использует кастомный banner', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ banner: '/* custom banner */' }))

        callConfigResolved(plugin, project.root)

        expect(project.read('src/.generated/utils-jit.css').startsWith('/* custom banner */')).toBe(
            true,
        )
    })

    it('не пишет пустой css при emitEmptyFile=false', () => {
        const plugin = asHookPlugin(utilsJIT({ emitEmptyFile: false }))

        callConfigResolved(plugin, project.root)

        expect(project.exists('src/.generated/utils-jit.css')).toBe(false)
    })

    it('учитывает custom breakpoints', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="tablet:w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT({ breakpoints: { tablet: 900 } }))

        callConfigResolved(plugin, project.root)

        expect(project.read('src/.generated/utils-jit.css')).toContain(
            '@media (min-width: 900px) { .tablet\\:w-\\[100px\\]{width: 100px !important;} }',
        )
    })

    it('учитывает custom selector variants', () => {
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

        callConfigResolved(plugin, project.root)

        expect(project.read('src/.generated/utils-jit.css')).toContain(
            '.hocus\\:w-\\[100px\\]:hover,.hocus\\:w-\\[100px\\]:focus{width: 100px !important;}',
        )
    })

    it('подключает custom rules', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="surface-[#fff] size-[40px]"></div>
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
                ],
            }),
        )

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.surface-\\[\\#fff\\]{background-color: #fff;}')
        expect(css).toContain('.size-\\[40px\\]{width: 40px !important;height: 40px !important;}')
    })

    it('игнорирует excluded files при полном сканировании', () => {
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

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[999px\\]')
    })

    it('игнорирует generated css file при полном сканировании', () => {
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

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.w-\\[999px\\]')
    })

    it('transform добавляет новые utilities инкрементально', () => {
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

        callConfigResolved(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div class="w-[100px] h-[40px]"></div>
            </template>
        `,
            file,
        )

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('transform удаляет utility, если он исчез из файла', () => {
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

        callConfigResolved(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
            file,
        )

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[40px\\]')
    })

    it('не удаляет utility, если он ещё используется в другом файле', () => {
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

        callConfigResolved(plugin, project.root)

        callTransform(
            plugin,
            `
            <template>
                <div></div>
            </template>
        `,
            project.file('src/App.vue'),
        )

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('handleHotUpdate читает файл, обновляет css и эмитит change generated css', async () => {
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

        callConfigResolved(plugin, project.root)
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

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
        expect(server.watcher.emit).toHaveBeenCalledWith(
            'change',
            project.file('src/.generated/utils-jit.css'),
        )
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

        callConfigResolved(plugin, project.root)
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

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
        expect(css).not.toContain('.h-\\[40px\\]')
        expect(server.watcher.emit).not.toHaveBeenCalled()
    })

    it('watchChange delete удаляет tokens файла', () => {
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

        callConfigResolved(plugin, project.root)
        callConfigureServer(plugin, server)

        callWatchChange(plugin, file, { event: 'delete' })

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toBe('/* @vueland/utils-jit: no utilities found */\n')
        expect(server.watcher.emit).toHaveBeenCalledWith(
            'change',
            project.file('src/.generated/utils-jit.css'),
        )
    })

    it('watchChange update перечитывает файл с диска', () => {
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

        callConfigResolved(plugin, project.root)
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

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('повторный configResolved пересканирует проект полностью', () => {
        project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        callConfigResolved(plugin, project.root)

        project.write(
            'src/App.vue',
            `
            <template>
                <div class="h-[40px]"></div>
            </template>
        `,
        )

        callConfigResolved(plugin, project.root)

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).not.toContain('.w-\\[100px\\]')
        expect(css).toContain('.h-\\[40px\\]{height: 40px !important;}')
    })

    it('не падает, если файл удалить до watchChange update', () => {
        const file = project.write(
            'src/App.vue',
            `
            <template>
                <div class="w-[100px]"></div>
            </template>
        `,
        )

        const plugin = asHookPlugin(utilsJIT())

        callConfigResolved(plugin, project.root)

        fs.rmSync(file)

        expect(() => {
            callWatchChange(plugin, file, { event: 'update' })
        }).not.toThrow()

        const css = project.read('src/.generated/utils-jit.css')

        expect(css).toContain('.w-\\[100px\\]{width: 100px !important;}')
    })

    it('не эмитит watcher change, если css не изменился', () => {
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

        callConfigResolved(plugin, project.root)
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

        expect(server.watcher.emit).not.toHaveBeenCalled()
    })
})
