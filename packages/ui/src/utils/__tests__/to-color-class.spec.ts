import {
    describe,
    expect,
    it,
} from 'vitest'

import { toColorClass } from '../to-color-class'

describe('toColorClass', () => {
    it('палитровый токен превращается в статическую утилиту', () => {
        expect(toColorClass('bg', 'red-lighten-2')).toBe('bg-red-lighten-2')
        expect(toColorClass('text', 'teal')).toBe('text-teal')
    })

    it('сырой цвет превращается в arbitrary-класс', () => {
        expect(toColorClass('bg', '#fa5a5a')).toBe('bg-[#fa5a5a]')
        expect(toColorClass('text', '#fa5a5a')).toBe('color-[#fa5a5a]')
        expect(toColorClass('bg', 'var(--my-color)')).toBe('bg-[var(--my-color)]')
    })

    it('пробелы внутри функций цвета схлопываются — класс должен остаться одним токеном', () => {
        expect(toColorClass('bg', 'rgb(255, 90, 90)')).toBe('bg-[rgb(255,90,90)]')
        expect(toColorClass('text', 'hsl(12, 76%, 61%)')).toBe('color-[hsl(12,76%,61%)]')
    })

    it('пустое значение даёт undefined', () => {
        expect(toColorClass('bg', undefined)).toBeUndefined()
        expect(toColorClass('bg', '')).toBeUndefined()
    })
})
