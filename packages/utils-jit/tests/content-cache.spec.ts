import {
    describe,
    expect,
    it,
} from 'vitest'

import { ContentCache } from '../src/content-cache'

describe('ContentCache', () => {
    it('новый файл считается изменённым', () => {
        const cache = new ContentCache()

        expect(cache.changed('src/App.vue', 'code')).toBe(true)
    })

    it('тот же контент — не изменён', () => {
        const cache = new ContentCache()

        cache.changed('src/App.vue', 'code')

        expect(cache.changed('src/App.vue', 'code')).toBe(false)
    })

    it('другой контент — изменён', () => {
        const cache = new ContentCache()

        cache.changed('src/App.vue', 'code-a')

        expect(cache.changed('src/App.vue', 'code-b')).toBe(true)
    })

    it('нормализует путь (windows-разделители)', () => {
        const cache = new ContentCache()

        cache.changed('src/App.vue', 'code')

        expect(cache.changed('src\\App.vue', 'code')).toBe(false)
    })

    it('разные файлы независимы', () => {
        const cache = new ContentCache()

        cache.changed('src/A.vue', 'code')

        expect(cache.changed('src/B.vue', 'code')).toBe(true)
    })

    it('delete сбрасывает запомненный хэш', () => {
        const cache = new ContentCache()

        cache.changed('src/App.vue', 'code')
        cache.delete('src/App.vue')

        expect(cache.changed('src/App.vue', 'code')).toBe(true)
    })

    it('clear сбрасывает весь кеш', () => {
        const cache = new ContentCache()

        cache.changed('src/A.vue', 'code')
        cache.changed('src/B.vue', 'code')
        cache.clear()

        expect(cache.changed('src/A.vue', 'code')).toBe(true)
        expect(cache.changed('src/B.vue', 'code')).toBe(true)
    })
})
