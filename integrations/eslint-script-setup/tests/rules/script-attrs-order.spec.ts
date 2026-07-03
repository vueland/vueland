import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import * as vueParser from 'vue-eslint-parser'

import { scriptAttrsOrder } from '../../src/rules/script-attrs-order'

const tester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: vueParser,
    },
})

function sfc(scriptTag: string) {
    return `${scriptTag}\nconst a = 1\n</script>\n`
}

describe('script-attrs-order', () => {
    // ─── valid ────────────────────────────────────────────────────────────────

    it('valid: setup перед lang', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script setup lang="ts">'),
                },
            ],
            invalid: [],
        })
    })

    it('valid: единственный атрибут', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script setup>'),
                },
            ],
            invalid: [],
        })
    })

    it('valid: setup, lang, generic — полный порядок', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script setup lang="ts" generic="T">'),
                },
            ],
            invalid: [],
        })
    })

    it('valid: не .vue файл — правило игнорируется', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [
                {
                    filename: 'utils.ts',
                    code: 'const a = 1',
                },
            ],
            invalid: [],
        })
    })

    // ─── invalid ──────────────────────────────────────────────────────────────

    it('invalid: lang перед setup — autofix переставляет', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script lang="ts" setup>'),
                    output: sfc('<script setup lang="ts">'),
                    errors: [{ messageId: 'wrongAttrsOrder' }],
                },
            ],
        })
    })

    it('invalid: generic, lang, setup — autofix выстраивает полный порядок', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script generic="T" lang="ts" setup>'),
                    output: sfc('<script setup lang="ts" generic="T">'),
                    errors: [{ messageId: 'wrongAttrsOrder' }],
                },
            ],
        })
    })

    it('invalid: неизвестные атрибуты уходят после перечисленных, сохраняя порядок', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: sfc('<script data-b="1" lang="ts" data-a="2" setup>'),
                    output: sfc('<script setup lang="ts" data-b="1" data-a="2">'),
                    errors: [{ messageId: 'wrongAttrsOrder' }],
                },
            ],
        })
    })

    it('invalid: кастомный order — lang перед setup', () => {
        tester.run('script-attrs-order', scriptAttrsOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ order: ['lang', 'setup'] }],
                    code: sfc('<script setup lang="ts">'),
                    output: sfc('<script lang="ts" setup>'),
                    errors: [{ messageId: 'wrongAttrsOrder' }],
                },
            ],
        })
    })
})
