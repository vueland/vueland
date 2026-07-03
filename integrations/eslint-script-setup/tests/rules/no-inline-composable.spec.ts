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

    it('не репортит composable внутри callback и методы-composable', () => {
        tester.run('no-inline-composable', noInlineComposable, {
            valid: [
                {
                    // вызов внутри тела callback — не прямой аргумент
                    filename: 'Component.vue',
                    code: 'watch(count, () => { const router = useRouter() })',
                },
                {
                    // callee — MemberExpression, правило смотрит только на прямые вызовы
                    filename: 'Component.vue',
                    code: 'doSomething(store.useThing())',
                },
                {
                    // сам composable с обычными аргументами
                    filename: 'Component.vue',
                    code: 'const feature = useFeature(options)',
                },
            ],
            invalid: [],
        })
    })

    it('репортит вложенные и множественные inline-вызовы', () => {
        tester.run('no-inline-composable', noInlineComposable, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'wrap(deep(useFoo()))',
                    errors: [{ messageId: 'noInline', data: { name: 'useFoo' } }],
                },
                {
                    filename: 'Component.vue',
                    code: 'setup(useA(), useB())',
                    errors: [
                        { messageId: 'noInline', data: { name: 'useA' } },
                        { messageId: 'noInline', data: { name: 'useB' } },
                    ],
                },
            ],
        })
    })
})
