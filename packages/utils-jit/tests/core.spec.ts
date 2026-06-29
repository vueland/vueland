import {
    describe,
    expect,
    it,
} from 'vitest'

import {
    buildCssRule,
    camelToKebab,
    defaultRules,
    defineRule,
    escapeCssSelector,
    extractClassCandidates,
    isColorValue,
    isSafeCssValue,
    isSizeValue,
    normalizeValue,
    parseToken,
    resolveRule,
    shouldProcess,
    stripComments,
    tokenize,
} from '../src'

describe('core / normalizeValue', () => {
    it('нормализует пробелы внутри значения', () => {
        expect(normalizeValue('  10px   20px  ')).toBe('10px 20px')
    })
})

describe('core / stripComments', () => {
    it('удаляет html, block и line comments', () => {
        const code = `
            <!-- <div class="w-[100px]"></div> -->
            /* <div class="h-[100px]"></div> */
            // <div class="ma-[100px]"></div>
            <div class="px-[16px]"></div>
        `

        const result = stripComments(code)

        expect(result).not.toContain('w-[100px]')
        expect(result).not.toContain('h-[100px]')
        expect(result).not.toContain('ma-[100px]')
        expect(result).toContain('px-[16px]')
    })

    it('не ломает протоколы вида https:// внутри строк', () => {
        const code = `
            const url = 'https://example.com'
            const klass = 'w-[100px]'
        `

        expect(stripComments(code)).toContain('https://example.com')
        expect(stripComments(code)).toContain('w-[100px]')
    })
})

describe('core / extractClassCandidates', () => {
    it('извлекает class из обычного html attribute', () => {
        const code = '<div class="w-[100px] h-[40px]"></div>'

        expect(extractClassCandidates(code)).toEqual(['w-[100px] h-[40px]'])
    })

    it('извлекает class из одинарных кавычек', () => {
        const code = '<div class=\'w-[100px]\'></div>'

        expect(extractClassCandidates(code)).toEqual(['w-[100px]'])
    })

    it('извлекает :class как строку', () => {
        const code = '<div :class="\'w-[100px] h-[40px]\'"></div>'

        expect(extractClassCandidates(code)).toEqual(["'w-[100px] h-[40px]'"])
    })
})

describe('core / tokenize', () => {
    it('находит одиночный arbitrary utility', () => {
        expect([...tokenize('<div class="w-[100px]"></div>')]).toEqual(['w-[100px]'])
    })

    it('находит несколько utilities', () => {
        expect([...tokenize('<div class="w-[100px] h-[40px] ma-[8px]"></div>')]).toEqual([
            'w-[100px]',
            'h-[40px]',
            'ma-[8px]',
        ])
    })

    it('удаляет дубликаты', () => {
        expect([...tokenize('<div class="w-[100px] w-[100px]"></div>')]).toEqual(['w-[100px]'])
    })

    it('находит responsive и pseudo variants', () => {
        expect([
            ...tokenize('<div class="hover:w-[100px] md:h-[40px] hover:md:px-[16px]"></div>'),
        ]).toEqual(['hover:w-[100px]', 'md:h-[40px]', 'hover:md:px-[16px]'])
    })

    it('находит значения с пробелами внутри []', () => {
        expect([...tokenize('<div class="ma-[10px 20px]"></div>')]).toEqual(['ma-[10px 20px]'])
    })

    it('находит calc value', () => {
        expect([...tokenize('<div class="w-[calc(100%-16px)]"></div>')]).toEqual([
            'w-[calc(100%-16px)]',
        ])
    })

    it('игнорирует слишком короткий мусор', () => {
        expect([...tokenize('a-[]')]).toEqual([])
    })

    it('находит обычные utility classes', () => {
        expect([...tokenize('<div class="flex-center hover:flex-center"></div>')]).toEqual([
            'flex-center',
            'hover:flex-center',
        ])
    })

    it('находит arbitrary и обычные utilities вместе', () => {
        expect([...tokenize('<div class="flex-center w-[100px] hover:flex-center"></div>')]).toEqual([
            'w-[100px]',
            'flex-center',
            'hover:flex-center',
        ])
    })

    it('игнорирует комментарии', () => {
        const code = `
            <!-- <div class="w-[100px]"></div> -->
            <div class="h-[40px]"></div>
        `

        expect([...tokenize(code)]).toEqual(['h-[40px]'])
    })

    it('умеет находить utility вне class fallback-сканированием', () => {
        const code = 'const classes = [\'w-[100px]\', condition && \'h-[40px]\']'

        expect([...tokenize(code)]).toEqual(['w-[100px]', 'h-[40px]'])
    })

    it('умеет находить обычный utility вне class fallback-сканированием', () => {
        const code = 'const classes = [\'flex-center\', condition && \'hover:flex-center\']'

        expect([...tokenize(code)]).toEqual(['flex-center', 'hover:flex-center'])
    })
})

describe('core / parseToken', () => {
    it('парсит utility без variants', () => {
        expect(parseToken('w-[100px]')).toEqual({
            raw: 'w-[100px]',
            variants: [],
            utility: 'w-[100px]',
        })
    })

    it('парсит utility с одним variant', () => {
        expect(parseToken('hover:w-[100px]')).toEqual({
            raw: 'hover:w-[100px]',
            variants: ['hover'],
            utility: 'w-[100px]',
        })
    })

    it('парсит utility с несколькими variants', () => {
        expect(parseToken('hover:md:w-[100px]')).toEqual({
            raw: 'hover:md:w-[100px]',
            variants: ['hover', 'md'],
            utility: 'w-[100px]',
        })
    })

    it('парсит обычный utility class', () => {
        expect(parseToken('button-primary')).toEqual({
            raw: 'button-primary',
            variants: [],
            utility: 'button-primary',
        })
    })

    it('парсит обычный utility class с variants', () => {
        expect(parseToken('hover:button-primary')).toEqual({
            raw: 'hover:button-primary',
            variants: ['hover'],
            utility: 'button-primary',
        })
    })

    it('возвращает null для некорректного class-like token', () => {
        expect(parseToken('button-')).toBeNull()
    })
})

describe('core / escapeCssSelector', () => {
    it('экранирует служебные символы css selector', () => {
        expect(escapeCssSelector('hover:w-[100px]')).toBe('hover\\:w-\\[100px\\]')
    })

    it('оставляет буквы, цифры, underscore и dash без изменений', () => {
        expect(escapeCssSelector('foo_bar-baz123')).toBe('foo_bar-baz123')
    })
})

describe('core / camelToKebab', () => {
    it('конвертирует camelCase в kebab-case', () => {
        expect(camelToKebab('backgroundColor')).toBe('background-color')
        expect(camelToKebab('borderTopLeftRadius')).toBe('border-top-left-radius')
    })

    it('не ломает css variables', () => {
        expect(camelToKebab('--vl-color')).toBe('--vl-color')
    })

    it('не меняет уже kebab-case свойство', () => {
        expect(camelToKebab('background-color')).toBe('background-color')
    })
})

describe('core / isSafeCssValue', () => {
    it('разрешает нормальные css values', () => {
        expect(isSafeCssValue('10px')).toBe(true)
        expect(isSafeCssValue('10px 20px')).toBe(true)
        expect(isSafeCssValue('calc(100%-16px)')).toBe(true)
        expect(isSafeCssValue('var(--vl-color)')).toBe(true)
        expect(isSafeCssValue('#fff')).toBe(true)
    })

    it('запрещает пустые и мусорные значения', () => {
        expect(isSafeCssValue('')).toBe(false)
        expect(isSafeCssValue('   ')).toBe(false)
        expect(isSafeCssValue('---')).toBe(false)
    })

    it('запрещает потенциально опасные символы', () => {
        expect(isSafeCssValue('red; color: blue')).toBe(false)
        expect(isSafeCssValue('red{}')).toBe(false)
        expect(isSafeCssValue('<script>')).toBe(false)
        expect(isSafeCssValue('/* test */ red')).toBe(false)
    })
})

describe('core / shouldProcess', () => {
    it('пропускает файлы по include', () => {
        expect(shouldProcess('/project/src/App.vue', [/\.vue$/])).toBe(true)
        expect(shouldProcess('/project/src/App.css', [/\.vue$/])).toBe(false)
    })

    it('исключает файлы по exclude', () => {
        expect(shouldProcess('/project/node_modules/a/index.ts', [/\.ts$/], [/node_modules/])).toBe(
            false,
        )
    })

    it('обрезает query из id', () => {
        expect(shouldProcess('/project/src/App.vue?vue&type=template', [/\.vue$/])).toBe(true)
    })
})

describe('core / defineRule', () => {
    it('создаёт rule с object declaration и important по умолчанию', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            declaration: (value) => ({ backgroundColor: value }),
        })

        expect(rule.match('bg-[#fff]')).toEqual({ declarations: ['background-color: #fff !important;'] })
    })

    it('умеет отключать important', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            declaration: (value) => ({ backgroundColor: value }),
            important: false,
        })

        expect(rule.match('bg-[#fff]')).toEqual({ declarations: ['background-color: #fff;'] })
    })

    it('не дублирует important, если он уже есть в значении', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            declaration: () => ({ backgroundColor: 'red !important' }),
        })

        expect(rule.match('bg-[#fff]')).toEqual({ declarations: ['background-color: red !important;'] })
    })

    it('конвертирует несколько camelCase properties', () => {
        const rule = defineRule({
            name: 'size',
            matcher: /^size-\[(.+)\]$/,
            validate: isSizeValue,
            declaration: (value) => ({
                width: value,
                height: value,
                minWidth: value,
            }),
        })

        expect(rule.match('size-[40px]')).toEqual({
            declarations: [
                'width: 40px !important;',
                'height: 40px !important;',
                'min-width: 40px !important;',
            ],
        })
    })

    it('поддерживает css variables', () => {
        const rule = defineRule({
            name: 'surface',
            matcher: /^surface-\[(.+)\]$/,
            declaration: (value) => ({ '--vl-surface': value }),
            important: false,
        })

        expect(rule.match('surface-[#fff]')).toEqual({ declarations: ['--vl-surface: #fff;'] })
    })

    it('поддерживает готовые string declarations без автоматического important', () => {
        const rule = defineRule({
            name: 'raw',
            matcher: /^raw-\[(.+)\]$/,
            declaration: (value) => [`--raw-value: ${value};`],
        })

        expect(rule.match('raw-[10px]')).toEqual({ declarations: ['--raw-value: 10px;'] })
    })

    it('возвращает null, если matcher не подошёл', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            declaration: (value) => ({ backgroundColor: value }),
        })

        expect(rule.match('color-[#fff]')).toBeNull()
    })

    it('возвращает null, если значение не прошло validate', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            validate: () => false,
            declaration: (value) => ({ backgroundColor: value }),
        })

        expect(rule.match('bg-[#fff]')).toBeNull()
    })

    it('возвращает null для unsafe value', () => {
        const rule = defineRule({
            name: 'background-color',
            matcher: /^bg-\[(.+)\]$/,
            declaration: (value) => ({ backgroundColor: value }),
        })

        expect(rule.match('bg-[red;color:blue]')).toBeNull()
    })

    it('создаёт обычный utility class без value в []', () => {
        const rule = defineRule({
            name: 'flex-center',
            matcher: /^flex-center$/,
            declaration: () => ({
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }),
        })

        expect(rule.match('flex-center')).toEqual({
            declarations: [
                'display: flex !important;',
                'justify-content: center !important;',
                'align-items: center !important;',
            ],
        })
    })

    it('создаёт parameterized utility class через capture group', () => {
        const rule = defineRule({
            name: 'grid-cols',
            matcher: /^grid-cols-(\d+)$/,
            validate: value => Number(value) > 0,
            declaration: value => ({
                gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
            }),
        })

        expect(rule.match('grid-cols-3')).toEqual({
            declarations: [
                'grid-template-columns: repeat(3, minmax(0, 1fr)) !important;',
            ],
        })
        expect(rule.match('grid-cols-0')).toBeNull()
    })
})

describe('core / resolveRule', () => {
    it('находит встроенное правило', () => {
        expect(resolveRule('w-[100px]', defaultRules)).toEqual({ declarations: ['width: 100px !important;'] })
    })

    it('возвращает null для неизвестного utility', () => {
        expect(resolveRule('unknown-[100px]', defaultRules)).toBeNull()
    })

    it('работает с custom rule', () => {
        const customRule = defineRule({
            name: 'surface',
            matcher: /^surface-\[(.+)\]$/,
            validate: isColorValue,
            declaration: (value) => ({ backgroundColor: value }),
            important: false,
        })

        expect(resolveRule('surface-[#fff]', [customRule])).toEqual({ declarations: ['background-color: #fff;'] })
    })
})

describe('core / buildCssRule', () => {
    it('строит css rule без variants', () => {
        const parsed = parseToken('w-[100px]')

        expect(parsed).not.toBeNull()

        expect(buildCssRule(parsed!, { declarations: ['width: 100px !important;'] })).toBe(
            '.w-\\[100px\\]{width: 100px !important;}',
        )
    })

    it('строит css rule с pseudo variant', () => {
        const parsed = parseToken('hover:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(buildCssRule(parsed!, { declarations: ['width: 100px !important;'] })).toBe(
            '.hover\\:w-\\[100px\\]:hover{width: 100px !important;}',
        )
    })

    it('строит css rule с breakpoint variant', () => {
        const parsed = parseToken('md:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(buildCssRule(parsed!, { declarations: ['width: 100px !important;'] })).toBe(
            '@media (min-width: 960px) { .md\\:w-\\[100px\\]{width: 100px !important;} }',
        )
    })

    it('строит css rule с несколькими variants', () => {
        const parsed = parseToken('hover:md:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(buildCssRule(parsed!, { declarations: ['width: 100px !important;'] })).toBe(
            '@media (min-width: 960px) { .hover\\:md\\:w-\\[100px\\]:hover{width: 100px !important;} }',
        )
    })

    it('строит css rule с custom dark selector variant', () => {
        const parsed = parseToken('dark:w-[100px]')

        expect(parsed).not.toBeNull()
        expect(
            buildCssRule(parsed!, { declarations: ['width: 100px !important;'] }, undefined, {
                dark: {
                    kind: 'selector',
                    value: '[data-theme="dark"] &',
                },
            }),
        ).toBe('[data-theme="dark"] .dark\\:w-\\[100px\\]{width: 100px !important;}')
    })

    it('строит css rule с custom selector variant', () => {
        const parsed = parseToken('hocus:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(
            buildCssRule(parsed!, { declarations: ['width: 100px !important;'] }, undefined, {
                hocus: {
                    kind: 'selector',
                    value: '&:hover,&:focus',
                },
            }),
        ).toBe(
            '.hocus\\:w-\\[100px\\]:hover,.hocus\\:w-\\[100px\\]:focus{width: 100px !important;}',
        )
    })

    it('строит css rule с custom attribute variant', () => {
        const parsed = parseToken('selected:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(
            buildCssRule(parsed!, { declarations: ['width: 100px !important;'] }, undefined, {
                selected: {
                    kind: 'attribute',
                    value: '[aria-selected="true"]',
                },
            }),
        ).toBe('.selected\\:w-\\[100px\\][aria-selected="true"]{width: 100px !important;}')
    })

    it('строит css rule с custom numeric media variant', () => {
        const parsed = parseToken('tablet:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(
            buildCssRule(
                parsed!,
                { declarations: ['width: 100px !important;'] },
                {},
                {
                    tablet: {
                        kind: 'media',
                        value: 900,
                    },
                },
            ),
        ).toBe('@media (min-width: 900px) { .tablet\\:w-\\[100px\\]{width: 100px !important;} }')
    })

    it('возвращает null для неизвестного variant', () => {
        const parsed = parseToken('unknown:w-[100px]')

        expect(parsed).not.toBeNull()

        expect(buildCssRule(parsed!, { declarations: ['width: 100px !important;'] })).toBeNull()
    })

    it('форматирует calc внутри declaration', () => {
        const parsed = parseToken('w-[calc(100%-16px)]')

        expect(parsed).not.toBeNull()

        expect(
            buildCssRule(parsed!, { declarations: ['width: calc(100%-16px) !important;'] }),
        ).toBe('.w-\\[calc\\(100\\%-16px\\)\\]{width: calc(100% - 16px) !important;}')
    })
})
