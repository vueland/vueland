import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { noMultiDeclaration } from '../../src/rules/no-multi-declaration'

const tester = new RuleTester({
    languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
})

describe('no-multi-declaration', () => {
    it('passes and fails correctly', () => {

        tester.run('no-multi-declaration', noMultiDeclaration, {
            valid: [
                { filename: 'Component.vue', code: 'const a = ref(1)' },
                { filename: 'Component.vue', code: 'const a = 1\nconst b = 2' },
                { filename: 'Component.ts', code: 'const a = ref(1), b = ref(2)' }, // не .vue — игнорируется
            ],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const a = ref(1), b = ref(2)',
                    errors: [{ messageId: 'noMulti' }],
                },
                {
                    filename: 'Component.vue',
                    code: 'let x = 1, y = 2, z = 3',
                    errors: [{ messageId: 'noMulti' }],
                },
            ],
        })
    })

    it('не репортит объявления в заголовке цикла', () => {
        tester.run('no-multi-declaration', noMultiDeclaration, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'for (let i = 0, len = items.length; i < len; i++) { work(i) }',
                },
            ],
            invalid: [],
        })
    })

    it('деструктуринг — одно объявление, не репортит', () => {
        tester.run('no-multi-declaration', noMultiDeclaration, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const { chips, hasValue } = useSelectedChips(props)',
                },
                {
                    filename: 'Component.vue',
                    code: 'const [first, second] = usePair()',
                },
            ],
            invalid: [],
        })
    })

    it('репортит несколько декларантов внутри функции и без инициализаторов', () => {
        tester.run('no-multi-declaration', noMultiDeclaration, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'function setup() { const a = 1, b = 2 }',
                    errors: [{ messageId: 'noMulti' }],
                },
                {
                    filename: 'Component.vue',
                    code: 'let x, y',
                    errors: [{ messageId: 'noMulti' }],
                },
            ],
        })
    })
})
