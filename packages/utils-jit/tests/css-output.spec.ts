import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import { CssOutput, RESOLVED_VIRTUAL_CSS_ID } from '../src/css-output'

function createServer() {
    const virtualModule = { id: RESOLVED_VIRTUAL_CSS_ID, url: '/@id/__x00__virtual:utils-jit.css' }

    return {
        moduleGraph: {
            getModuleById: vi.fn((id: string) =>
                (id === RESOLVED_VIRTUAL_CSS_ID ? virtualModule : null)),
        },
        reloadModule: vi.fn(async () => {}),
    } as any
}

describe('CssOutput / css + update', () => {
    it('по умолчанию css пустой', () => {
        const out = new CssOutput({ emitFile: false })

        expect(out.css).toBe('')
    })

    it('update меняет css и возвращает true', () => {
        const out = new CssOutput({ emitFile: false })

        expect(out.update('.a{}', false)).toBe(true)
        expect(out.css).toBe('.a{}')
    })

    it('повторный update тем же контентом возвращает false', () => {
        const out = new CssOutput({ emitFile: false })

        out.update('.a{}', false)

        expect(out.update('.a{}', false)).toBe(false)
    })
})

describe('CssOutput / HMR', () => {
    it('notify=true инвалидирует виртуальный модуль через reloadModule', () => {
        const out = new CssOutput({ emitFile: false })
        const server = createServer()

        out.setServer(server)
        out.update('.a{}', true)

        expect(server.reloadModule).toHaveBeenCalledTimes(1)
    })

    it('notify=false не дёргает HMR', () => {
        const out = new CssOutput({ emitFile: false })
        const server = createServer()

        out.setServer(server)
        out.update('.a{}', false)

        expect(server.reloadModule).not.toHaveBeenCalled()
    })

    it('без сервера notify не падает', () => {
        const out = new CssOutput({ emitFile: false })

        expect(() => out.update('.a{}', true)).not.toThrow()
    })
})

describe('CssOutput / emitFile', () => {
    let dir: string

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-jit-out-'))
    })

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true })
    })

    it('emitFile=true пишет файл (включая создание директорий)', () => {
        const out = new CssOutput({ emitFile: true })
        const outFile = path.join(dir, 'nested/deep/utils.css')

        out.setOutFile(outFile)
        out.update('.a{color:red}', false)

        expect(fs.readFileSync(outFile, 'utf8')).toBe('.a{color:red}')
    })

    it('emitFile=false не пишет файл', () => {
        const out = new CssOutput({ emitFile: false })
        const outFile = path.join(dir, 'utils.css')

        out.setOutFile(outFile)
        out.update('.a{}', false)

        expect(fs.existsSync(outFile)).toBe(false)
    })
})
