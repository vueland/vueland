import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { noInlineComposable } from '../../src/rules/no-inline-composable'

const tester = new RuleTester({
    languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
})

describe('no-inline-composable', () => {

    it('passes and fails correctly', () => {
        tester.run('no-inline-composable', noInlineComposable, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const router = useRouter()\nconst route = useRoute()',
                },
                {
                    filename: 'Component.vue',
                    code: 'doSomething(someValue)',
                },
                {
                    filename: 'Component.ts',
                    code: 'doSomething(useRouter())', // не .vue — игнорируется
                },
            ],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'doSomething(useRouter())',
                    errors: [{ messageId: 'noInline', data: { name: 'useRouter' } }],
                },
                {
                    filename: 'Component.vue',
                    code: 'watch(useMyStore(), () => {})',
                    errors: [{ messageId: 'noInline', data: { name: 'useMyStore' } }],
                },
            ],
        })
    })
})
