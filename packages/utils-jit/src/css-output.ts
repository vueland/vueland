import * as fs from 'node:fs'
import * as path from 'node:path'
import type { ViteDevServer } from 'vite'

// Виртуальный модуль, который импортирует потребитель: `import 'virtual:utils-jit.css'`.
// Резолвится в `\0`-префиксный id (rollup-конвенция «виртуального» модуля), но
// оканчивается на `.css`, чтобы Vite прогнал его через свой CSS-пайплайн.
export const VIRTUAL_CSS_ID = 'virtual:utils-jit.css'
export const RESOLVED_VIRTUAL_CSS_ID = '\0virtual:utils-jit.css'

export type CssOutputOptions = {
    // Дополнительно писать CSS в файл (для дебага). Доставку это не меняет —
    // потребитель всё равно импортирует виртуальный модуль.
    emitFile: boolean
}

// Единая точка доставки CSS: держит текущий результат (его отдаёт `load`
// виртуального модуля), опционально пишет дебаг-файл и дёргает HMR.
export class CssOutput {
    private currentCss = ''
    private outFile = ''
    private server: ViteDevServer | null = null

    constructor(private readonly options: CssOutputOptions) {}

    get css(): string {
        return this.currentCss
    }

    // Абсолютный путь дебаг-файла известен только после configResolved (нужен root).
    setOutFile(absPath: string): void {
        this.outFile = absPath
    }

    setServer(server: ViteDevServer): void {
        this.server = server
    }

    // Обновляет CSS. Возвращает true, если контент реально изменился (иначе —
    // ни записи, ни HMR). notify=true → инвалидирует виртуальный модуль.
    update(nextCss: string, notify: boolean): boolean {
        if (nextCss === this.currentCss) {
            return false
        }

        this.currentCss = nextCss

        if (this.options.emitFile && this.outFile) {
            fs.mkdirSync(path.dirname(this.outFile), { recursive: true })
            fs.writeFileSync(this.outFile, this.currentCss, 'utf8')
        }

        if (notify) {
            this.invalidate()
        }

        return true
    }

    // HMR без fs-хаков: инвалидируем виртуальный модуль и просим Vite его
    // перезагрузить — для CSS-модуля это самопринимающийся css-update, без
    // полной перезагрузки страницы. До импорта модуля в графе его нет — тогда
    // нечего инвалидировать (load отдаст свежий CSS при первом импорте).
    private invalidate(): void {
        if (!this.server) {
            return
        }

        const mod = this.server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_CSS_ID)

        if (mod) {
            void this.server.reloadModule(mod)
        }
    }
}
