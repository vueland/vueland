import {
    describe,
    expect,
    it,
} from 'vitest'

import { createScssBreakpointInjector } from '../src/scss-injection'

const MARKER_START = '// ##vueland:breakpoints:start'
const MARKER_END = '// ##vueland:breakpoints:end'

function marked(inner = ''): string {
    return `${MARKER_START}\n${inner}${MARKER_END}`
}

describe('createScssBreakpointInjector', () => {
    it('возвращает функцию-инжектор', () => {
        const inject = createScssBreakpointInjector({ sm: 600 })

        expect(inject).toBeTypeOf('function')
    })

    it('не трогает файл без маркера', () => {
        const inject = createScssBreakpointInjector({ sm: 600 })
        const source = "@use '../maps/grids' as *;\n.foo { display: flex; }"

        expect(inject(source)).toBe(source)
    })

    it('подставляет breakpoints в размеченный блок', () => {
        const inject = createScssBreakpointInjector({ sm: 600, md: 960 })
        const result = inject(marked())

        expect(result).toContain("@use 'maps/grids' with ($grid-breakpoints: ('sm': 600px, 'md': 960px))")
        expect(result).toContain(MARKER_START)
        expect(result).toContain(MARKER_END)
    })

    it('xs: 0 сериализуется как 0 без px', () => {
        const inject = createScssBreakpointInjector({ xs: 0, sm: 600 })
        const result = inject(marked())

        expect(result).toContain("'xs': 0")
        expect(result).toContain("'sm': 600px")
    })

    it('идемпотентен: повторный вызов даёт тот же результат', () => {
        const inject = createScssBreakpointInjector({ sm: 600 })
        const source = marked()
        const first = inject(source)
        const second = inject(first)

        expect(second).toBe(first)
    })

    it('не трогает содержимое вне маркерного блока', () => {
        const inject = createScssBreakpointInjector({ sm: 600 })
        const source = `${marked()}\n@use 'utils/transitions';\n@use 'utils/spaces';`
        const result = inject(source)

        expect(result).toContain("@use 'utils/transitions'")
        expect(result).toContain("@use 'utils/spaces'")
    })

    it('заменяет старое содержимое маркерного блока', () => {
        const inject = createScssBreakpointInjector({ sm: 600 })
        const source = marked("@use 'maps/grids' with ($grid-breakpoints: ('old': 400px));\n")
        const result = inject(source)

        expect(result).not.toContain("'old': 400px")
        expect(result).toContain("'sm': 600px")
    })

    it('разные инжекторы независимы', () => {
        const injectA = createScssBreakpointInjector({ sm: 600 })
        const injectB = createScssBreakpointInjector({ lg: 1280 })
        const source = marked()

        expect(injectA(source)).toContain("'sm': 600px")
        expect(injectB(source)).toContain("'lg': 1280px")
        expect(injectA(source)).not.toContain("'lg'")
        expect(injectB(source)).not.toContain("'sm'")
    })
})
