import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest'

import { DEFAULT_EXCLUDE, DEFAULT_INCLUDE } from '../src/core'
import {
    collectProjectFiles,
    isSameFile,
    readFileSafe,
} from '../src/project-scan'

function createTempProject() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-jit-scan-'))

    return {
        root,

        write(relativePath: string, content = '') {
            const file = path.join(root, relativePath)

            fs.mkdirSync(path.dirname(file), { recursive: true })
            fs.writeFileSync(file, content, 'utf8')

            return file
        },

        remove() {
            fs.rmSync(root, { recursive: true, force: true })
        },
    }
}

// ─── isSameFile ───────────────────────────────────────────────────────────────

describe('isSameFile', () => {
    it('возвращает true для одинакового пути', () => {
        expect(isSameFile('/foo/bar.vue', '/foo/bar.vue')).toBe(true)
    })

    it('возвращает true для эквивалентных путей с ./ и без', () => {
        expect(isSameFile('/foo/bar.vue', '/foo/./bar.vue')).toBe(true)
    })

    it('возвращает false для разных файлов', () => {
        expect(isSameFile('/foo/a.vue', '/foo/b.vue')).toBe(false)
    })
})

// ─── readFileSafe ─────────────────────────────────────────────────────────────

describe('readFileSafe', () => {
    let project: ReturnType<typeof createTempProject>

    beforeEach(() => { project = createTempProject() })
    afterEach(() => { project.remove() })

    it('читает существующий файл', () => {
        const file = project.write('src/App.vue', 'hello')

        expect(readFileSafe(file)).toBe('hello')
    })

    it('возвращает null для несуществующего файла', () => {
        expect(readFileSafe('/nonexistent/path/file.vue')).toBeNull()
    })
})

// ─── collectProjectFiles ──────────────────────────────────────────────────────

describe('collectProjectFiles', () => {
    let project: ReturnType<typeof createTempProject>

    beforeEach(() => { project = createTempProject() })
    afterEach(() => { project.remove() })

    function scan(root: string, outFile: string, extraExclude: RegExp[] = []) {
        return collectProjectFiles(
            root,
            DEFAULT_INCLUDE,
            [...DEFAULT_EXCLUDE, ...extraExclude],
            outFile,
        )
    }

    it('собирает файлы по include-паттернам', () => {
        project.write('src/App.vue')
        project.write('src/main.ts')
        project.write('src/Widget.svelte')
        project.write('src/Page.astro')
        project.write('src/style.css')

        const names = scan(project.root, path.join(project.root, 'src/.generated/utils-jit.css'))
            .map((f) => path.basename(f))

        expect(names).toContain('App.vue')
        expect(names).toContain('main.ts')
        expect(names).toContain('Widget.svelte')
        expect(names).toContain('Page.astro')
        expect(names).not.toContain('style.css')
    })

    it('не включает outFile', () => {
        project.write('src/App.vue')
        const outFile = project.write('src/.generated/utils-jit.css')

        const names = scan(project.root, outFile).map((f) => path.basename(f))

        expect(names).not.toContain('utils-jit.css')
    })

    it('пропускает node_modules', () => {
        project.write('node_modules/lib/index.vue')
        project.write('src/App.vue')

        const names = scan(project.root, path.join(project.root, 'src/.generated/utils-jit.css'))
            .map((f) => path.basename(f))

        expect(names).toContain('App.vue')
        expect(names).not.toContain('index.vue')
    })

    it('пропускает файлы из пользовательского exclude', () => {
        project.write('src/App.vue')
        project.write('src/ignored/Hidden.vue')

        const names = scan(
            project.root,
            path.join(project.root, 'src/.generated/utils-jit.css'),
            [/src\/ignored/],
        ).map((f) => path.basename(f))

        expect(names).toContain('App.vue')
        expect(names).not.toContain('Hidden.vue')
    })

    it('рекурсивно обходит вложенные директории', () => {
        project.write('src/components/ui/Button.vue')
        project.write('src/pages/Home.vue')

        const names = scan(project.root, path.join(project.root, 'src/.generated/utils-jit.css'))
            .map((f) => path.basename(f))

        expect(names).toContain('Button.vue')
        expect(names).toContain('Home.vue')
    })

    it('возвращает пустой массив для пустого проекта', () => {
        const files = scan(project.root, path.join(project.root, 'src/.generated/utils-jit.css'))

        expect(files).toHaveLength(0)
    })

    it('не падает если директория недоступна для чтения', () => {
        expect(() => {
            scan(
                path.join(project.root, 'nonexistent'),
                path.join(project.root, 'src/.generated/utils-jit.css'),
            )
        }).not.toThrow()
    })
})
