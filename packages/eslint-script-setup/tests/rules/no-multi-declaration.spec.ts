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
})
