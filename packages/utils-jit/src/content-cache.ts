import { createHash } from 'node:crypto'

import { normalizePath } from './core'

// Кеш контента файлов по хэшу. Позволяет пропустить повторную токенизацию,
// когда transform приходит с тем же содержимым: на старте каждый файл обходится
// дважды (полный скан в configResolved + transform при импорте), а в Vite 6+
// transform ещё и дублируется по окружениям (client/ssr). Храним хэш, а не сам
// контент, — десятки байт на файл вместо мегабайтов исходников в памяти.
export class ContentCache {
    private readonly hashes = new Map<string, string>()

    // Запоминает хэш контента и возвращает true, если он отличается от ранее
    // виденного (или файл новый). false → контент тот же, работу можно пропустить.
    changed(file: string, code: string): boolean {
        const key = normalizePath(file)
        const hash = createHash('sha1').update(code).digest('base64')

        if (this.hashes.get(key) === hash) {
            return false
        }

        this.hashes.set(key, hash)

        return true
    }

    delete(file: string): void {
        this.hashes.delete(normalizePath(file))
    }

    clear(): void {
        this.hashes.clear()
    }
}
